import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { useAuth } from '../../../contexts/AuthContext';
import { Staff } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import { useForm } from 'react-hook-form';

const CommissionForm = ({ staff, onSuccess }: { staff: Staff, onSuccess: () => void }) => {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            commission_rate: staff.commission_rate || 0
        }
    });
    const queryClient = useQueryClient();
    const { user: profile } = useAuth();

    const mutation = useMutation({
        mutationFn: (data: { commission_rate: number }) => db.staff.update(staff.id, { commission_rate: Number(data.commission_rate) }, profile!.clinic_id!),
        onSuccess: () => {
            toast.success('Hakediş oranı güncellendi.');
            queryClient.invalidateQueries({ queryKey: ['staff', profile?.clinic_id] });
            onSuccess();
        },
        onError: (error: any) => {
            toast.error(`Hata: ${error.message}`);
        }
    });

    const onSubmit = (data: { commission_rate: number }) => {
        mutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="font-bold text-lg">{staff.full_name}</h3>
            <div>
                <label htmlFor="commission_rate" className="block text-sm font-medium text-gray-700">Hak Ediş Oranı (%)</label>
                <Input 
                    type="number" 
                    id="commission_rate"
                    {...register('commission_rate')}
                    className="mt-1"
                />
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={onSuccess} disabled={mutation.isPending}>İptal</Button>
                <Button type="submit" isLoading={mutation.isPending}>Kaydet</Button>
            </div>
        </form>
    );
};

export default function StaffCommission() {
    const { user: profile } = useAuth();
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

    const { data: staffList, isLoading } = useQuery({
        queryKey: ['staff', profile?.clinic_id],
        queryFn: () => db.staff.getAll(profile!.clinic_id!),
        enabled: !!profile?.clinic_id,
    });

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Personel Hak Ediş Oranları</h2>
            {isLoading && <p>Personel listesi yükleniyor...</p>}
            <div className="space-y-2">
                {staffList?.map((staff: Staff) => (
                    <div key={staff.id} className="flex justify-between items-center p-3 border rounded-md bg-gray-50">
                        <div>
                            <p className="font-medium">{staff.full_name}</p>
                            <p className="text-sm text-gray-600">Mevcut Oran: %{staff.commission_rate || 0}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedStaff(staff)}>
                            Oranı Düzenle
                        </Button>
                    </div>
                ))}
            </div>

            {selectedStaff && (
                <Modal isOpen={!!selectedStaff} onClose={() => setSelectedStaff(null)} title="Hak Ediş Oranı Düzenle">
                    <CommissionForm staff={selectedStaff} onSuccess={() => setSelectedStaff(null)} />
                </Modal>
            )}
        </div>
    );
}
