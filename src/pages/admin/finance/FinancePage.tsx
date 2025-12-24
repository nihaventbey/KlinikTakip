import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { useAuth } from '../../../contexts/AuthContext';
import { Transaction } from '../../../types';
import { Button } from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import TransactionForm from './TransactionForm';
import { Pencil, Trash2 } from 'lucide-react';

export default function FinancePage() {
  const { user: profile } = useAuth();
  const queryClient = useQueryClient();
  const [modalState, setModalState] = useState<{ isOpen: boolean; initialData?: Transaction | null }>({ isOpen: false });

  const { data: transactions, isLoading, isError } = useQuery({
    queryKey: ['transactions', profile?.clinic_id],
    queryFn: () => db.transactions.getAll(profile!.clinic_id!),
    enabled: !!profile?.clinic_id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => db.transactions.remove(id),
    onSuccess: () => {
      toast.success('İşlem başarıyla silindi.');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      // We should also invalidate the specific patient's query, but we don't have the patientId here.
      // A broader invalidation is acceptable for now.
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Bu işlemi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve hasta bakiyesini etkileyebilir.')) {
      deleteMutation.mutate(id);
    }
  };

  const openModal = (initialData: Transaction | null = null) => {
    setModalState({ isOpen: true, initialData });
  };

  const closeModal = () => {
    setModalState({ isOpen: false });
  };

  const formatCurrency = (value: number) => {
    const color = value > 0 ? 'text-red-600' : 'text-green-600';
    return <span className={color}>{value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Finansal İşlemler</h1>
        <Button onClick={() => openModal()}>+ Yeni İşlem Ekle</Button>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hasta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tip</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tutar</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && <tr><td colSpan={5} className="p-8 text-center text-gray-500">Yükleniyor...</td></tr>}
            {isError && <tr><td colSpan={5} className="p-8 text-center text-red-500">İşlemler yüklenirken bir hata oluştu.</td></tr>}
            {!isLoading && !isError && transactions?.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Henüz finansal işlem eklenmemiş.</td></tr>
            )}
            {transactions?.map((trx) => (
              <tr key={trx.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{trx.patient?.full_name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(trx.transaction_date).toLocaleDateString('tr-TR')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{trx.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">{formatCurrency(trx.amount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button onClick={() => openModal(trx)} className="text-blue-600 hover:text-blue-900 p-2" disabled={true}>
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(trx.id)} className="text-red-600 hover:text-red-900 p-2" disabled={deleteMutation.isPending}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalState.isOpen} onClose={closeModal} title={modalState.initialData ? 'İşlemi Düzenle' : 'Yeni Finansal İşlem'}>
        <TransactionForm initialData={modalState.initialData} onClose={closeModal} />
      </Modal>
    </div>
  );
}
