import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { useAuth } from '../../../contexts/AuthContext';
import { Staff } from '../../../types';
import { Button } from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import AddStaffForm from './AddStaffForm';
import { User, Mail, Phone, Plus, Archive, Pencil } from 'lucide-react';

const roleTranslations: { [key: string]: string } = {
    doctor: 'Doktor',
    assistant: 'Asistan',
    receptionist: 'Resepsiyonist',
    accountant: 'Muhasebeci',
    admin: 'Yönetici',
};

const translateRoles = (roles: string[]) => {
    return roles.map(role => roleTranslations[role] || role).join(', ');
};

export default function StaffList() {
    const { user: profile } = useAuth();
    const queryClient = useQueryClient();
    const [modalState, setModalState] = useState<{ isOpen: boolean; initialData?: Staff | null }>({ isOpen: false });

    const { data: staff, isLoading } = useQuery({
        queryKey: ['staff', profile?.clinic_id],
        queryFn: () => db.staff.getAll(profile!.clinic_id!),
        enabled: !!profile?.clinic_id,
    });
    
    const archiveMutation = useMutation({
        mutationFn: (staffId: string) => db.staff.update(staffId, { deleted_at: new Date().toISOString() }, profile!.clinic_id!),
        onSuccess: () => {
          toast.success('Personel başarıyla arşivlendi.');
          queryClient.invalidateQueries({ queryKey: ['staff', profile?.clinic_id] });
        },
        onError: (err: any) => {
          toast.error('Personel arşivlenirken bir hata oluştu: ' + err.message);
        }
    });

    const handleArchive = (staff: Staff) => {
        if (window.confirm(`${staff.full_name} adlı personeli arşivlemek istediğinizden emin misiniz?`)) {
            archiveMutation.mutate(staff.id);
        }
    };

    const openModal = (initialData: Staff | null = null) => {
        setModalState({ isOpen: true, initialData });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, initialData: null });
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button onClick={() => openModal()}>
                    <Plus size={18} className="mr-2" />
                    <span>Personel Ekle</span>
                </Button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Personel Listesi</h2>
                {isLoading ? (
                    <p>Personel listesi yükleniyor...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {staff?.map(person => (
                            <div key={person.id} className="p-4 border rounded-lg flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                                            {person.full_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">{person.full_name}</p>
                                            <p className="text-sm text-gray-500">{translateRoles(person.roles)}</p>
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
                                <div className="flex justify-end items-center gap-2 mt-4 pt-4 border-t">
                                    <Button variant="outline" size="sm" onClick={() => openModal(person)}>
                                        <Pencil size={14} className="mr-1" />
                                        Düzenle
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleArchive(person)} isLoading={archiveMutation.isPending && archiveMutation.variables === person.id}>
                                        <Archive size={14} className="mr-1" />
                                        Arşivle
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Modal isOpen={modalState.isOpen} onClose={closeModal} title={modalState.initialData ? 'Personeli Düzenle' : 'Yeni Personel Ekle'}>
                <AddStaffForm 
                    initialData={modalState.initialData}
                    onSuccess={closeModal} 
                    onCancel={closeModal} 
                />
            </Modal>
        </div>
    );
}
