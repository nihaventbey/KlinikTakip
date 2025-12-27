import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { useAuth } from '../../../contexts/AuthContext';
import { Treatment } from '../../../types';
import { Button } from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import TreatmentForm from './TreatmentForm';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function TreatmentListPage() {
  const { user: profile } = useAuth();
  const queryClient = useQueryClient();
  const [modalState, setModalState] = useState<{ isOpen: boolean; initialData?: Treatment | null }>({ isOpen: false });

  const { data: treatments, isLoading, isError } = useQuery({
    queryKey: ['treatments', profile?.clinic_id],
    queryFn: () => db.treatments.getAll(profile!.clinic_id!),
    enabled: !!profile?.clinic_id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => db.treatments.remove(id),
    onSuccess: () => {
      toast.success('Tedavi başarıyla silindi.');
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
    },
    onError: (error) => {
      toast.error(`Silinirken bir hata oluştu: ${error.message}`);
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Bu tedaviyi kalıcı olarak silmek istediğinizden emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const openModal = (initialData: Treatment | null = null) => {
    setModalState({ isOpen: true, initialData });
  };

  const closeModal = () => {
    setModalState({ isOpen: false });
  };

  const formatCurrency = (value: number) => {
    return (value || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Hizmet ve Tedavi Kataloğu</h1>
        <Button onClick={() => openModal()} className="w-full md:w-auto">
          <Plus size={18} className="mr-2"/>
          Yeni Tedavi Ekle
        </Button>
      </div>

      {isLoading && <div className="text-center p-8">Yükleniyor...</div>}
      {isError && <div className="text-center p-8 text-red-500">Tedaviler yüklenirken bir hata oluştu.</div>}

      {!isLoading && !isError && treatments?.length === 0 && (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow border">
            <h3 className="text-lg font-medium text-gray-800">Henüz Tedavi Eklenmemiş</h3>
            <p className="text-gray-500 mt-2 mb-4">Kliniğinizde sunduğunuz hizmetleri ve tedavileri ekleyerek başlayın.</p>
            <Button onClick={() => openModal()}>
              <Plus size={18} className="mr-2"/>
              İlk Tedaviyi Ekle
            </Button>
        </div>
      )}

      {!isLoading && !isError && treatments && treatments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatments.map((treatment) => (
            <div key={treatment.id} className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col justify-between transition-shadow hover:shadow-lg">
              <div className="p-5">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-800 tracking-tight mb-1">{treatment.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{treatment.category}</span>
                </div>
                <p className="text-gray-600 mt-2 text-sm min-h-[40px]">{treatment.description || 'Açıklama mevcut değil.'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 flex justify-between items-center rounded-b-lg border-t">
                <p className="text-xl font-bold text-gray-900">{formatCurrency(treatment.price)}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => openModal(treatment)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-200 rounded-full transition-colors">
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(treatment.id)} 
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-200 rounded-full transition-colors"
                    disabled={deleteMutation.isPending && deleteMutation.variables === treatment.id}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalState.isOpen} onClose={closeModal} title={modalState.initialData ? 'Tedaviyi Düzenle' : 'Yeni Tedavi Ekle'} size="md">
        <TreatmentForm initialData={modalState.initialData} onClose={closeModal} />
      </Modal>
    </div>
  );
}
