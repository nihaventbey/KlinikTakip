import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { useAuth } from '../../../contexts/AuthContext';
import { Input } from '../../../components/ui/Input';
import { FormSelect } from '../../../components/ui/FormSelect';
import { FormTextarea } from '../../../components/ui/FormTextarea';
import { Button } from '../../../components/ui/Button';
import { Patient, Transaction } from '../../../types';
import { useDebounce } from '../../../hooks/useDebounce';
import { X } from 'lucide-react';
import { FormInput } from '../../../components/ui/FormInput';

const transactionSchema = z.object({
  patient_id: z.string().nonempty("Hasta seçimi zorunludur."),
  amount: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().refine(n => n !== 0, "Tutar 0 olamaz.")
  ),
  transaction_date: z.string().min(1, "Tarih zorunludur."),
  type: z.enum(['payment', 'charge', 'refund']),
  description: z.string().optional(),
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

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue, clearErrors } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'payment',
    }
  });

  useEffect(() => {
    if (debouncedSearchQuery.length > 2) {
      const searchPatients = async () => {
        setIsSearching(true);
        const results = await db.patients.search(debouncedSearchQuery, profile!.clinic_id!);
        setSearchResults(results);
        setIsSearching(false);
      };
      searchPatients();
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery, profile]);
  
  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        type: initialData.amount > 0 ? 'payment' : 'charge',
        transaction_date: new Date(initialData.transaction_date).toISOString().split('T')[0],
      });
      if (initialData.patient) {
        // @ts-ignore
        setSelectedPatient(initialData.patient);
        // @ts-ignore
        setSearchQuery(initialData.patient.full_name);
      }
    } else {
      reset({
        amount: 0,
        transaction_date: new Date().toISOString().split('T')[0],
        type: 'payment',
        description: '',
      })
    }
  }, [initialData, reset]);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setValue('patient_id', patient.id, { shouldValidate: true });
    setSearchQuery(patient.full_name);
    setSearchResults([]);
    clearErrors('patient_id');
  };

  const handleClearPatient = () => {
    setSelectedPatient(null);
    // @ts-ignore
    setValue('patient_id', null, { shouldValidate: true });
    setSearchQuery('');
    setSearchResults([]);
  };

  const mutation = useMutation({
    mutationFn: (data: TransactionFormData) => {
      const amount = data.type === 'payment' ? data.amount : -Math.abs(data.amount);
      const dbType = data.type === 'payment' ? 'income' : 'expense';
      
      const finalDataForDb = {
        patient_id: data.patient_id,
        amount: amount,
        transaction_date: data.transaction_date,
        type: dbType,
        description: data.description,
      };
      
      if (isEditMode) {
        // Update logic needs careful implementation of balance recalculation,
        // so it's simplified or disabled for now.
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
        queryClient.invalidateQueries({ queryKey: ['patients'] });
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
      <div className="relative">
        <Input
          label="Hasta Ara (Ad, TCKN, GSM)"
          name="patient_search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          error={errors.patient_id?.message}
          autoComplete="off"
          disabled={!!selectedPatient}
        />
        {selectedPatient && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-7"
            onClick={handleClearPatient}
          >
            <X size={16} />
          </Button>
        )}
        
        {isSearching && <div className="p-2 text-sm text-gray-500">Aranıyor...</div>}
        
        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {searchResults.map(p => (
              <div
                key={p.id}
                className="p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectPatient(p)}
              >
                <p className="font-semibold">{p.full_name}</p>
                <p className="text-sm text-gray-500">{p.tc_number} - {p.phone}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <FormInput<TransactionFormData> label="Tutar (₺)" name="amount" type="number" step="0.01" register={register} error={errors.amount} />
      
      <div className="grid grid-cols-2 gap-4">
        <FormInput<TransactionFormData> label="İşlem Tarihi" name="transaction_date" type="date" register={register} error={errors.transaction_date} />
        <FormSelect<TransactionFormData> label="İşlem Tipi" name="type" register={register} error={errors.type}>
            <option value="payment">Ödeme (Alınan)</option>
            <option value="charge">Borç (Eklenen)</option>
            <option value="refund">İade</option>
        </FormSelect>
      </div>

      <FormTextarea<TransactionFormData> label="Açıklama" name="description" register={register} error={errors.description} rows={3} />

      {/* Hidden input to hold the patient_id for the form data */}
      <input type="hidden" {...register('patient_id')} />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onClose} disabled={mutation.isPending}>
          İptal
        </Button>
        <Button type="submit" disabled={mutation.isPending || !selectedPatient}>
          {isEditMode ? 'Güncelle' : 'Kaydet'}
        </Button>
      </div>
    </form>
  );
}
