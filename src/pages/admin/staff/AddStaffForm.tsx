import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { useAuth } from '../../../contexts/AuthContext';
import { FormInput } from '../../../components/ui/FormInput';
import { FormSelect } from '../../../components/ui/FormSelect';
import { Button } from '../../../components/ui/Button';

const staffSchema = z.object({
    full_name: z.string().min(3, "Ad soyad en az 3 karakter olmalıdır."),
    email: z.string().email("Geçersiz e-posta adresi."),
    phone: z.string().optional(),
    role: z.string().min(1, "Rol seçimi zorunludur."),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface AddStaffFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function AddStaffForm({ onSuccess, onCancel }: AddStaffFormProps) {
    const { user: profile } = useAuth();
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors } } = useForm<StaffFormData>({
        resolver: zodResolver(staffSchema),
    });

    const mutation = useMutation({
        mutationFn: (data: StaffFormData) => {
            if (!profile?.clinic_id) throw new Error("Klinik bilgisi bulunamadı.");
            const staffData = {
                full_name: data.full_name,
                email: data.email,
                phone: data.phone,
                roles: [data.role],
            };
            return db.staff.add(staffData, profile.clinic_id);
        },
        onSuccess: () => {
            toast.success('Personel başarıyla eklendi.');
            queryClient.invalidateQueries({ queryKey: ['staff', profile?.clinic_id] });
            onSuccess();
        },
        onError: (error: any) => {
            toast.error(`Hata: ${error.message}`);
        },
    });

    const onSubmit = (data: StaffFormData) => {
        mutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput<StaffFormData> label="Ad Soyad" name="full_name" register={register} error={errors.full_name} />
            <FormInput<StaffFormData> label="E-posta" name="email" type="email" register={register} error={errors.email} />
            <FormInput<StaffFormData> label="Telefon" name="phone" type="tel" register={register} error={errors.phone} />
            <FormSelect<StaffFormData> label="Rol" name="role" register={register} error={errors.role}>
                <option value="">Rol Seçiniz</option>
                <option value="doctor">Doktor</option>
                <option value="assistant">Asistan</option>
                <option value="receptionist">Resepsiyonist</option>
                <option value="accountant">Muhasebeci</option>
            </FormSelect>
            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={mutation.isPending}>İptal</Button>
                <Button type="submit" isLoading={mutation.isPending}>Kaydet</Button>
            </div>
        </form>
    );
}
