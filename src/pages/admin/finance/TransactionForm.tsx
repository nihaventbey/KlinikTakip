import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { useAuth } from '../../../contexts/AuthContext';
import { FormInput } from '../../../components/ui/FormInput';
import { FormSelect } from '../../../components/ui/FormSelect';
import { FormTextarea } from '../../../components/ui/FormTextarea';
import { Button } from '../../../components/ui/Button';
import { Transaction } from '../../../types';

const transactionSchema = z.object({
  patient_id: z.string().optional(),
  amount: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().refine(n => n !== 0, "Tutar 0 olamaz.")
  ),
  transaction_date: z.string().min(1, "Tarih zorunludur."),
  type: z.enum(['Payment', 'Charge', 'Refund', 'Expense']),
  description: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type !== 'Expense' && (!data.patient_id || data.patient_id === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Hasta seçimi zorunludur.",
      path: ['patient_id'],
    });
  }
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  initialData?: Transaction | null;
  onClose: () => void;
}

export default function TransactionForm({ initialData, onClose }: TransactionFormProps) {
  const { user: profile } = useAuth();
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const { data: patients } = useQuery({
    queryKey: ['patients', profile?.clinic_id],
    queryFn: () => db.patients.getAll(profile!.clinic_id!),
    enabled: !!profile?.clinic_id,
  });

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'Payment',
      patient_id: '',
    }
  });

  const transactionType = watch('type');

  useEffect(() => {
    if (initialData) {
      const formType = initialData.type === 'income' ? 'Payment' : 'Charge';
      reset({
        ...initialData,
        // @ts-ignore
        type: formType, 
        transaction_date: new Date(initialData.transaction_date).toISOString().split('T')[0],
      });
    } else {
      reset({
        patient_id: '',
        amount: 0,
        transaction_date: new Date().toISOString().split('T')[0],
        type: 'Payment',
        description: '',
      })
    }
  }, [initialData, reset]);

  const mutation = useMutation({
    mutationFn: (data: TransactionFormData) => {
      // This logic is based on how the db.ts `add` function updates the balance.
      const amount = ['Payment', 'Refund'].includes(data.type) ? -Math.abs(data.amount) : Math.abs(data.amount);
      const dbType = data.type === 'Payment' ? 'income' : 'expense';

      const finalDataForDb = {
        patient_id: data.type === 'Expense' ? null : data.patient_id,
        amount: amount,
        transaction_date: data.transaction_date,
        type: dbType,
        description: data.description,
      };
      
      if (isEditMode) {
        // Note: Update doesn't handle balance recalculation in this simplified version.
        // The logic for edit would be more complex, we focus on fixing the add.
        return db.transactions.update(initialData!.id, finalDataForDb);
      }
      return db.transactions.add(finalDataForDb, profile!.clinic_id!);
    },
    onSuccess: (_, variables) => {
      toast.success(`İşlem başarıyla ${isEditMode ? 'güncellendi' : 'kaydedildi'}.`);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      if (variables.patient_id) {
        queryClient.invalidateQueries({ queryKey: ['patient', variables.patient_id] });
      }
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const onSubmit = (data: TransactionFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {transactionType !== 'Expense' && (
        <FormSelect<TransactionFormData>
          label="Hasta"
          name="patient_id"
          register={register}
          error={errors.patient_id}
        >
          <option value="">Hasta Seçiniz</option>
          {patients?.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
        </FormSelect>
      )}

      <FormInput<TransactionFormData> label="Tutar (₺)" name="amount" type="number" step="0.01" register={register} error={errors.amount} />
      
      <div className="grid grid-cols-2 gap-4">
        <FormInput<TransactionFormData> label="İşlem Tarihi" name="transaction_date" type="date" register={register} error={errors.transaction_date} />
        <FormSelect<TransactionFormData> label="İşlem Tipi" name="type" register={register} error={errors.type}>
            <option value="Payment">Ödeme (Alınan)</option>
            <option value="Charge">Borç (Eklenen)</option>
            <option value="Refund">İade</option>
            <option value="Expense">Gider</option>
        </FormSelect>
      </div>

      <FormTextarea<TransactionFormData> label="Açıklama" name="description" register={register} error={errors.description} rows={3} />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} disabled={mutation.isPending}>
          İptal
        </Button>
        <Button type="submit" isLoading={mutation.isPending}>
          {isEditMode ? 'Güncelle' : 'Kaydet'}
        </Button>
      </div>
    </form>
  );
}
