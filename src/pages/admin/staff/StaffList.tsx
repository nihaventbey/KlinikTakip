import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '../../../lib/db';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import AddStaffForm from './AddStaffForm';
import { User, Mail, Phone, Shield } from 'lucide-react';

export default function StaffList() {
    const { user: profile } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { data: staff, isLoading } = useQuery({
        queryKey: ['staff', profile?.clinic_id],
        queryFn: () => db.staff.getAll(profile!.clinic_id!),
        enabled: !!profile?.clinic_id,
    });

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button onClick={() => setIsAddModalOpen(true)}>Personel Ekle</Button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Personel Listesi</h2>
                {isLoading ? (
                    <p>Personel listesi yükleniyor...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {staff?.map(person => (
                            <div key={person.id} className="p-4 border rounded-lg">
                                <div className="flex items-center mb-2">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                                        {person.full_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{person.full_name}</p>
                                        <p className="text-sm text-gray-500">{person.roles.join(', ')}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1 mt-4">
                                    <div className="flex items-center">
                                        <Mail size={14} className="mr-2" />
                                        <span>{person.email}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone size={14} className="mr-2" />
                                        <span>{person.phone || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Yeni Personel Ekle">
                <AddStaffForm onSuccess={() => setIsAddModalOpen(false)} onCancel={() => setIsAddModalOpen(false)} />
            </Modal>
        </div>
    );
}
