import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { useAuth } from '../../../contexts/AuthContext';
import { useDebounce } from '../../../hooks/useDebounce';
import { Patient } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import AddPatientForm from './AddPatientForm';
import { Archive, Plus, ArchiveIcon } from 'lucide-react';

export default function PatientList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user: profile } = useAuth();
  const queryClient = useQueryClient();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const queryKey = ['patients', profile?.clinic_id, debouncedSearchTerm];

  const { data: patients, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!profile?.clinic_id) return [];
      if (debouncedSearchTerm) {
        return db.patients.search(debouncedSearchTerm, profile.clinic_id);
      }
      return db.patients.getAll(profile.clinic_id);
    },
    enabled: !!profile?.clinic_id,
  });

  const archiveMutation = useMutation({
    mutationFn: (patientId: string) => db.patients.update(patientId, { deleted_at: new Date().toISOString() }),
    onSuccess: () => {
      toast.success('Hasta başarıyla arşivlendi.');
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (err: any) => {
      toast.error('Hasta arşivlenirken bir hata oluştu: ' + err.message);
    }
  });

  const handleArchiveClick = (e: React.MouseEvent, patient: Patient) => {
    e.stopPropagation();
    if (window.confirm(`${patient.full_name} adlı hastayı arşivlemek istediğinizden emin misiniz?`)) {
      archiveMutation.mutate(patient.id);
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
  };

  const handleRowClick = (patientId: string) => {
    navigate(`/admin/patients/${patientId}`);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Aktif Hastalar</h1>
          <Link to="/admin/patients/archived" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">
            <ArchiveIcon size={16} className="mr-1.5" />
            Arşivi Görüntüle
          </Link>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto">
          <Plus size={18} className="mr-2" />
          Yeni Hasta Ekle
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
        <Input 
          placeholder="İsim, TC No veya GSM ile ara..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:max-w-md"
        />
      </div>

      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 hidden md:table-header-group">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İletişim</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Kayıt Tarihi</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Bakiye</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Yükleniyor...</td></tr>
            ) : isError ? (
              <tr><td colSpan={5} className="p-8 text-center text-red-500">Hata: {error.message}</td></tr>
            ) : patients?.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Aktif hasta bulunamadı.</td></tr>
            ) : (
              patients?.map((patient) => (
                <tr 
                  key={patient.id} 
                  className="hover:bg-gray-50 transition cursor-pointer block md:table-row"
                  onClick={() => handleRowClick(patient.id)}
                >
                  <td className="px-6 py-2 md:py-4 whitespace-nowrap block md:table-cell" data-label="Ad Soyad">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3 uppercase flex-shrink-0">
                        {patient.full_name.charAt(0)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{patient.full_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-2 md:py-4 whitespace-nowrap text-sm text-gray-500 block md:table-cell" data-label="İletişim">
                    <span className="font-bold md:hidden">Telefon: </span>
                    {patient.phone}
                  </td>
                  <td className="px-6 py-2 md:py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell" data-label="Kayıt Tarihi">
                    {new Date(patient.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-2 md:py-4 whitespace-nowrap text-sm font-medium block md:table-cell text-right" data-label="Bakiye">
                    <span className="font-bold md:hidden">Bakiye: </span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.balance > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {patient.balance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </span>
                  </td>
                  <td className="px-6 py-2 md:py-4 whitespace-nowrap text-sm font-medium block md:table-cell text-center" data-label="İşlemler">
                    <div className="flex items-center justify-end md:justify-center">
                      <button 
                        onClick={(e) => handleArchiveClick(e, patient)}
                        className="text-gray-400 hover:text-red-600 p-2 rounded-full transition"
                        title="Hastayı Arşivle"
                        disabled={archiveMutation.isPending}
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Yeni Hasta Kaydı"
        size="xl"
      >
        <AddPatientForm onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}