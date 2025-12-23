import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { Patient } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import AddPatientForm from './AddPatientForm';
import { Archive } from 'lucide-react'; // Archive ikonunu import et

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchPatients = async () => {
    setLoading(true);
    let query = supabase
      .from('patients')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('full_name', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) console.error('Hata:', error);
    else setPatients(data || []);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchPatients();
  };

  const handleRowClick = (patientId: string) => {
    navigate(`/admin/patients/${patientId}`);
  };

  const handleArchiveClick = async (e: React.MouseEvent, patient: Patient) => {
    e.stopPropagation(); // Satırın tıklama olayını engelle
    if (window.confirm(`${patient.full_name} adlı hastayı arşivlemek istediğinizden emin misiniz?`)) {
      const { error } = await supabase
        .from('patients')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', patient.id);
      
      if (error) {
        alert('Hasta arşivlenirken bir hata oluştu: ' + error.message);
      } else {
        fetchPatients(); // Listeyi yenile
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Aktif Hastalar</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Yeni Hasta Ekle</Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
        <Input 
          placeholder="İsim veya TC No ile ara..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ad Soyad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kayıt Tarihi</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bakiye</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Yükleniyor...</td></tr>
            ) : patients.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Aktif hasta bulunamadı.</td></tr>
            ) : (
              patients.map((patient) => (
                <tr 
                  key={patient.id} 
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => handleRowClick(patient.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3 uppercase">
                        {patient.full_name.charAt(0)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{patient.full_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(patient.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.balance > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {patient.balance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button 
                      onClick={(e) => handleArchiveClick(e, patient)}
                      className="text-gray-400 hover:text-red-600 p-2 rounded-full transition"
                      title="Hastayı Arşivle"
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
      >
        <AddPatientForm onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}