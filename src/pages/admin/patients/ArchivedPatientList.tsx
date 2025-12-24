import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { useAuth } from '../../../contexts/AuthContext';
import { useDebounce } from '../../../hooks/useDebounce';
import { Patient } from '../../../types';
import { Input } from '../../../components/ui/Input';
import { ArchiveRestore, ArrowLeft } from 'lucide-react';

export default function ArchivedPatientList() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user: profile } = useAuth();
  const queryClient = useQueryClient();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const queryKey = ['archivedPatients', profile?.clinic_id, debouncedSearchTerm];

  const { data: patients, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!profile?.clinic_id) return [];
      if (debouncedSearchTerm) {
        return db.patients.searchArchived(debouncedSearchTerm, profile.clinic_id);
      }
      return db.patients.getArchived(profile.clinic_id);
    },
    enabled: !!profile?.clinic_id,
  });

  const restoreMutation = useMutation({
    mutationFn: (patientId: string) => db.patients.update(patientId, { deleted_at: null }),
    onSuccess: (restoredPatient) => {
      toast.success(`${restoredPatient.full_name} adlı hasta başarıyla geri yüklendi.`);
      queryClient.invalidateQueries({ queryKey: ['archivedPatients'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] }); // Aktif hasta listesini de yenile
    },
    onError: (err: any) => {
      toast.error('Hasta geri yüklenirken bir hata oluştu: ' + err.message);
    }
  });

  const handleRestoreClick = (e: React.MouseEvent, patient: Patient) => {
    e.stopPropagation();
    if (window.confirm(`${patient.full_name} adlı hastayı arşivden geri yüklemek istediğinizden emin misiniz?`)) {
      restoreMutation.mutate(patient.id);
    }
  };

  const handleRowClick = (patientId: string) => {
    navigate(`/admin/patients/${patientId}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Arşivlenmiş Hastalar</h1>
        <Link to="/admin/patients" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
          <ArrowLeft size={16} className="mr-1" />
          Aktif Hastalara Geri Dön
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
        <Input 
          placeholder="Arşivde ara..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ad Soyad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Arşivlenme Tarihi</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Yükleniyor...</td></tr>
            ) : isError ? (
              <tr><td colSpan={4} className="p-8 text-center text-red-500">Hata: {error.message}</td></tr>
            ) : patients?.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Arşivde hasta bulunamadı.</td></tr>
            ) : (
              patients?.map((patient) => (
                <tr 
                  key={patient.id} 
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => handleRowClick(patient.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold mr-3 uppercase">
                        {patient.full_name.charAt(0)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{patient.full_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.deleted_at ? new Date(patient.deleted_at).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button 
                      onClick={(e) => handleRestoreClick(e, patient)}
                      className="text-gray-400 hover:text-green-600 p-2 rounded-full transition"
                      title="Hastayı Geri Yükle"
                      disabled={restoreMutation.isPending}
                    >
                      <ArchiveRestore className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
