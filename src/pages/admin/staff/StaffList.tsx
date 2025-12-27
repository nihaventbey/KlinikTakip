import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { supabase } from '../../../lib/supabase'; // Doğrudan supabase client kullanıyoruz
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
    SUPER_ADMIN: 'Süper Yönetici',
    ADMIN: 'Yönetici'
};

const translateRoles = (roles: string[]) => {
    if (!roles) return 'Personel';
    return roles.map(role => roleTranslations[role] || role).join(', ');
};

export default function StaffList() {
    const { user: profile } = useAuth();
    const queryClient = useQueryClient();
    const [modalState, setModalState] = useState<{ isOpen: boolean; initialData?: Staff | null }>({ isOpen: false });

    // 400 Hatasını önlemek için rpc çağrısını burada stabilize ettik
    const { data: staff, isLoading, error } = useQuery({
        queryKey: ['staff', profile?.clinic_id],
        queryFn: async () => {
            if (!profile?.clinic_id) return [];
            
            const { data, error } = await supabase.rpc('get_staff_with_details', {
                p_clinic_id: profile.clinic_id // Parametre ismi SQL ile aynı olmalı
            });

            if (error) {
                console.error('RPC Error:', error);
                throw error;
            }
            return data as Staff[];
        },
        enabled: !!profile?.clinic_id,
    });

    const archiveMutation = useMutation({
        mutationFn: async (staffId: string) => {
            const { error } = await supabase
                .from('profiles')
                .update({ is_active: false })
                .eq('id', staffId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff'] });
            toast.success('Personel başarıyla arşivlendi.');
        },
        onError: () => {
            toast.error('Personel arşivlenirken bir hata oluştu.');
        }
    });

    const handleArchive = (person: Staff) => {
        if (window.confirm(`${person.full_name || person.email} isimli personeli arşivlemek istediğinize emin misiniz?`)) {
            archiveMutation.mutate(person.id);
        }
    };

    const openModal = (data: Staff | null = null) => setModalState({ isOpen: true, initialData: data });
    const closeModal = () => setModalState({ isOpen: false, initialData: null });

    if (isLoading) return <div className="p-8 text-center text-gray-500">Personel listesi yükleniyor...</div>;
    
    if (error) return (
        <div className="p-8 text-center text-red-500">
            Liste yüklenirken bir hata oluştu. Lütfen SQL fonksiyonunu güncellediğinizden emin olun.
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Personel Yönetimi</h2>
                <Button onClick={() => openModal()}>
                    <Plus size={20} className="mr-2" />
                    Yeni Personel
                </Button>
            </div>

            <div className="grid gap-6">
                {!staff || staff.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center border-2 border-dashed border-gray-200">
                        <User size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Henüz aktif personel bulunmuyor.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {staff.map((person) => (
                            <div key={person.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {person.full_name || person.email?.split('@')[0]}
                                            </h3>
                                            <p className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-1">
                                                {translateRoles(person.roles)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} className="text-gray-400" />
                                        <span className="truncate">{person.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} className="text-gray-400" />
                                        <span>{person.phone || 'Telefon yok'}</span>
                                    </div>
                                </div>
                                <div className="flex justify-end items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                                    <Button variant="ghost" size="sm" onClick={() => openModal(person)} className="text-gray-600 hover:text-indigo-600">
                                        <Pencil size={14} className="mr-1" /> Düzenle
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => handleArchive(person)} 
                                        className="text-gray-400 hover:text-red-600"
                                        isLoading={archiveMutation.isPending && archiveMutation.variables === person.id}
                                    >
                                        <Archive size={14} className="mr-1" /> Arşivle
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
                    onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ['staff'] });
                        closeModal();
                    }} 
                    onCancel={closeModal} 
                />
            </Modal>
        </div>
    );
}