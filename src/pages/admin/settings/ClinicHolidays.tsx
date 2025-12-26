import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Trash2 } from 'lucide-react';

export default function ClinicHolidays() {
    const { user: profile } = useAuth();
    const queryClient = useQueryClient();
    const [date, setDate] = useState('');
    const [name, setName] = useState('');

    const { data: holidays, isLoading } = useQuery({
        queryKey: ['holidays', profile?.clinic_id],
        queryFn: () => db.holidays.getAllByClinicId(profile!.clinic_id!),
        enabled: !!profile?.clinic_id,
    });

    const addMutation = useMutation({
        mutationFn: (newHoliday: { clinic_id: string; date: string; name: string }) => db.holidays.add(newHoliday),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['holidays', profile?.clinic_id] });
            toast.success('Tatil günü başarıyla eklendi.');
            setDate('');
            setName('');
        },
        onError: (error: any) => {
            toast.error(`Hata: ${error.message}`);
        },
    });

    const removeMutation = useMutation({
        mutationFn: (id: string) => db.holidays.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['holidays', profile?.clinic_id] });
            toast.success('Tatil günü başarıyla silindi.');
        },
        onError: (error: any) => {
            toast.error(`Hata: ${error.message}`);
        },
    });

    const handleAddHoliday = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !name) {
            toast.error('Lütfen tarih ve tatil adını girin.');
            return;
        }
        addMutation.mutate({ clinic_id: profile!.clinic_id!, date, name });
    };

    return (
        <div className="max-w-2xl">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Tatil Günleri</h2>
                <form onSubmit={handleAddHoliday} className="flex items-end gap-4 mb-6">
                    <Input
                        label="Tarih"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        
                    />
                    <Input
                        label="Tatil Adı"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Örn: Yılbaşı"
                    />
                    <Button type="submit" isLoading={addMutation.isPending}>Ekle</Button>
                </form>

                <div className="space-y-3">
                    {isLoading ? (
                        <p>Tatiller yükleniyor...</p>
                    ) : (
                        holidays?.map(holiday => (
                            <div key={holiday.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                <div>
                                    <p className="font-medium">{new Date(holiday.date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                    <p className="text-sm text-gray-600">{holiday.name}</p>
                                </div>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => removeMutation.mutate(holiday.id)}
                                    isLoading={removeMutation.isPending && removeMutation.variables === holiday.id}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        ))
                    )}
                    {holidays?.length === 0 && !isLoading && (
                        <p className="text-center text-gray-500 py-4">Henüz tatil günü eklenmemiş.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
