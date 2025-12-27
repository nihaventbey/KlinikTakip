import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/Button';
import { FormInput } from '../../../components/ui/FormInput';
import { FormTextarea } from '../../../components/ui/FormTextarea';
import { FormSelect } from '../../../components/ui/FormSelect';
import { ClinicExpense } from '../../../types';

type FormValues = {
    description: string;
    amount: number;
    category: string;
    expense_date: string;
};

const expenseCategories = [
    'Su', 'Elektrik', 'Doğalgaz', 'İnternet', 'Kira', 'Kırtasiye', 'Personel Maaş', 'Diğer'
];

interface ExpenseFormProps {
    onClose: () => void;
    initialData?: ClinicExpense | null;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose, initialData }) => {
    const { user: profile } = useAuth();
    const queryClient = useQueryClient();
    
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
        defaultValues: {
            description: initialData?.description || '',
            amount: initialData?.amount || 0,
            category: initialData?.category || '',
            expense_date: initialData?.expense_date ? new Date(initialData.expense_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        }
    });

    const mutation = useMutation({
        mutationFn: (data: Omit<ClinicExpense, 'id' | 'created_at' | 'is_deleted' | 'deleted_at' | 'clinic_id'> & { clinic_id: string }) => db.clinicExpenses.create(data),
        onSuccess: () => {
            toast.success('Gider başarıyla kaydedildi.');
            queryClient.invalidateQueries({ queryKey: ['clinicExpenses'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
            onClose();
        },
        onError: (error) => {
            toast.error(`Bir hata oluştu: ${error.message}`);
        }
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        if (!profile?.clinic_id) {
            toast.error('Klinik bilgisi bulunamadı.');
            return;
        }

        mutation.mutate({
            ...data,
            amount: Number(data.amount),
            clinic_id: profile.clinic_id,
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormTextarea
                label="Açıklama"
                id="description"
                name="description"
                register={register}
                rules={{ required: 'Açıklama gereklidir.' }}
                error={errors.description}
            />

            <FormSelect
                label="Kategori"
                id="category"
                name="category"
                register={register}
                rules={{ required: 'Kategori gereklidir.' }}
                error={errors.category}
            >
                <option value="">Kategori Seçiniz</option>
                {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </FormSelect>

            <FormInput
                label="Tutar (₺)"
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                register={register}
                rules={{ 
                    required: 'Tutar gereklidir.',
                    valueAsNumber: true,
                    validate: value => value > 0 || 'Tutar 0 dan büyük olmalıdır'
                }}
                error={errors.amount}
            />

            <FormInput
                label="Gider Tarihi"
                id="expense_date"
                name="expense_date"
                type="date"
                register={register}
                rules={{ required: 'Tarih gereklidir.' }}
                error={errors.expense_date}
            />
            
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={onClose}>İptal</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
            </div>
        </form>
    );
};

export default ExpenseForm;
