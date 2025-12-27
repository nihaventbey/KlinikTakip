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
import { Archive, Plus, ArchiveIcon, Phone, User, Calendar as CalendarIcon, Wallet } from 'lucide-react';

const PatientCard = ({ patient, onArchiveClick, onRowClick, isArchiving }: { patient: Patient, onArchiveClick: (e: React.MouseEvent, patient: Patient) => void, onRowClick: (id: string) => void, isArchiving: boolean }) => (
    <div 
        key={patient.id} 
        className="bg-white p-4 rounded-lg shadow border transition-shadow hover:shadow-md cursor-pointer"
        onClick={() => onRowClick(patient.id)}
    >
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg uppercase flex-shrink-0">
                    {patient.full_name.charAt(0)}
                </div>
                <div>
                    <p className="font-bold text-gray-800">{patient.full_name}</p>
                    <p className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.balance < 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {patient.balance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </p>
                </div>
            </div>
            <button 
                onClick={(e) => onArchiveClick(e, patient)}
                className="text-gray-400 hover:text-red-600 p-2 rounded-full transition"
                title="Hastayı Arşivle"
                disabled={isArchiving}
            >
                <Archive className="h-4 w-4" />
            </button>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 space-y-2">
            <div className="flex items-center">
                <Phone size={14} className="mr-2 flex-shrink-0" />
                <span>{patient.phone || 'Telefon yok'}</span>
            </div>
            <div className="flex items-center">
                <CalendarIcon size={14} className="mr-2 flex-shrink-0" />
                <span>Kayıt: {new Date(patient.created_at).toLocaleDateString('tr-TR')}</span>
            </div>
        </div>
    </div>
);


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

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {isLoading ? (
            <p className="p-8 text-center text-gray-500">Yükleniyor...</p>
        ) : isError ? (
            <p className="p-8 text-center text-red-500">Hata: {error.message}</p>
        ) : patients?.length === 0 ? (
            <p className="p-8 text-center text-gray-500">Aktif hasta bulunamadı.</p>
        ) : (
            patients?.map((patient) => (
                <PatientCard 
                    key={patient.id}
                    patient={patient}
                    onArchiveClick={handleArchiveClick}
                    onRowClick={handleRowClick}
                    isArchiving={archiveMutation.isPending && archiveMutation.variables === patient.id}
                />
            ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow border overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
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
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => handleRowClick(patient.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3 uppercase flex-shrink-0">
                        {patient.full_name.charAt(0)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{patient.full_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {new Date(patient.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.balance < 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {patient.balance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <button 
                        onClick={(e) => handleArchiveClick(e, patient)}
                        className="text-gray-400 hover:text-red-600 p-2 rounded-full transition"
                        title="Hastayı Arşivle"
                        disabled={archiveMutation.isPending && archiveMutation.variables === patient.id}
                      >
                        <Archive className="h-4 w-4" />
                      </button>
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