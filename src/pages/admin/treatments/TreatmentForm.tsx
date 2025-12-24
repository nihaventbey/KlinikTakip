import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { useAuth } from '../../../contexts/AuthContext';
import { FormInput } from '../../../components/ui/FormInput';
import { FormTextarea } from '../../../components/ui/FormTextarea';
import { Button } from '../../../components/ui/Button';
import { Treatment } from '../../../types';

const treatmentSchema = z.object({
  name: z.string().min(3, "Tedavi adı en az 3 karakter olmalıdır."),
  category: z.string().min(3, "Kategori en az 3 karakter olmalıdır."),
  price: z.preprocess(
    (val) => {
      if (typeof val === 'number') {
        return val; // Pass through if already a number
      }
      if (typeof val === 'string' && val.trim() !== '') {
        const parsed = parseFloat(val.replace(',', '.')); // Handle comma as decimal separator
        return isNaN(parsed) ? undefined : parsed;
      }
      return undefined; // Let validation fail for other types or empty strings
    },
    z.number({ required_error: "Fiyat alanı zorunludur.", invalid_type_error: "Geçerli bir fiyat giriniz." })
     .positive("Fiyat 0'dan büyük olmalıdır.")
  ),
  description: z.string().optional(),
});

type TreatmentFormData = z.infer<typeof treatmentSchema>;

interface TreatmentFormProps {
  initialData?: Treatment | null;
  onClose: () => void;
}

export default function TreatmentForm({ initialData, onClose }: TreatmentFormProps) {
  const { user: profile } = useAuth();
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TreatmentFormData>({
    resolver: zodResolver(treatmentSchema),
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const mutation = useMutation({
    mutationFn: (data: TreatmentFormData) => {
      if (isEditMode) {
        return db.treatments.update(initialData!.id, data);
      }
      return db.treatments.add(data, profile!.clinic_id!);
    },
    onSuccess: () => {
      toast.success(`Tedavi başarıyla ${isEditMode ? 'güncellendi' : 'oluşturuldu'}.`);
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const onSubmit = (data: TreatmentFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput<TreatmentFormData> label="Tedavi Adı" name="name" register={register} error={errors.name} />
      <FormInput<TreatmentFormData> label="Kategori" name="category" register={register} error={errors.category} />
      <FormInput<TreatmentFormData> label="Fiyat (₺)" name="price" type="number" step="0.01" register={register} error={errors.price} />
      <FormTextarea<TreatmentFormData> label="Açıklama" name="description" register={register} error={errors.description} rows={3} />

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
