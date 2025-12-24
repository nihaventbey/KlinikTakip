import React, { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Patient } from '../../../types';
import { FormInput } from '../../../components/ui/FormInput';
import { FormSelect } from '../../../components/ui/FormSelect';
import { FormTextarea } from '../../../components/ui/FormTextarea';

// TCKN validation function (simple checksum)
const isValidTcNumber = (tc: string) => {
  if (!/^[1-9][0-9]{10}$/.test(tc)) return false;
  const digits = tc.split('').map(Number);
  const tenth = ((digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7 - (digits[1] + digits[3] + digits[5] + digits[7])) % 10;
  if (digits[9] !== tenth) return false;
  const eleventh = (digits.slice(0, 10).reduce((a, b) => a + b, 0)) % 10;
  return digits[10] === eleventh;
};

const patientSchema = z.object({
  full_name: z.string().min(3, "Ad soyad en az 3 karakter olmalıdır."),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz."),
  email: z.string().email("Geçersiz e-posta adresi.").optional().or(z.literal('')),
  tc_number: z.string().length(11, "TC Kimlik No 11 haneli olmalıdır.").refine(isValidTcNumber, "Geçersiz TC Kimlik No.").optional().or(z.literal('')),
  birth_date: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface AddPatientFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: Patient | null;
}

export default function AddPatientForm({ onSuccess, onCancel, initialData }: AddPatientFormProps) {
  const { user: profile } = useAuth();
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      full_name: '',
      tc_number: '',
      phone: '',
      email: '',
      birth_date: '',
      gender: 'other',
      address: '',
      notes: ''
    }
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      reset({
        full_name: initialData.full_name || '',
        tc_number: initialData.tc_number || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        birth_date: initialData.birth_date ? new Date(initialData.birth_date).toISOString().split('T')[0] : '',
        gender: initialData.gender || 'other',
        address: initialData.address || '',
        notes: initialData.notes || '',
      });
    }
  }, [initialData, isEditMode, reset]);

  const mutation = useMutation({
    mutationFn: (formData: PatientFormData) => {
        const submissionData = {
            ...formData,
            email: formData.email || null,
            birth_date: formData.birth_date || null,
            tc_number: formData.tc_number || null,
        };

      if (isEditMode && initialData) {
        return db.patients.update(initialData.id, submissionData);
      } else {
        if (!profile?.clinic_id) throw new Error("Klinik bilgisi bulunamadı.");
        return db.patients.add(submissionData, profile.clinic_id);
      }
    },
    onSuccess: () => {
      toast.success(`Hasta başarıyla ${isEditMode ? 'güncellendi' : 'kaydedildi'}.`);
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      if (isEditMode && initialData) {
        queryClient.invalidateQueries({ queryKey: ['patient', initialData.id] });
      }
      onSuccess();
    },
    onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Bir hata oluştu.');
    }
  });

  const onSubmit = (data: PatientFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput<PatientFormData> label="Ad Soyad *" name="full_name" register={register} error={errors.full_name} />
      
      <div className="grid grid-cols-2 gap-4">
        <FormInput<PatientFormData> label="TC Kimlik No" name="tc_number" maxLength={11} register={register} error={errors.tc_number} />
        <FormInput<PatientFormData> label="Telefon *" name="phone" type="tel" register={register} error={errors.phone} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormInput<PatientFormData> label="Doğum Tarihi" name="birth_date" type="date" register={register} error={errors.birth_date} />
        <FormSelect<PatientFormData> label="Cinsiyet" name="gender" register={register} error={errors.gender}>
            <option value="male">Erkek</option>
            <option value="female">Kadın</option>
            <option value="other">Diğer</option>
        </FormSelect>
      </div>

      <FormInput<PatientFormData> label="E-posta" name="email" type="email" register={register} error={errors.email} />
      
      <FormTextarea<PatientFormData> label="Adres" name="address" rows={2} register={register} error={errors.address} />

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={mutation.isPending}>İptal</Button>
        <Button type="submit" isLoading={mutation.isPending}>{isEditMode ? 'Güncelle' : 'Kaydet'}</Button>
      </div>
    </form>
  );
}