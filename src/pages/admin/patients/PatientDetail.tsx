import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { Patient, Appointment } from '../../../types';
import { Button } from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import AddPatientForm from './AddPatientForm';
import PatientTreatmentPlans from './PatientTreatmentPlans'; // Eklendi
import PatientFinancialHistory from './PatientFinancialHistory'; // Eklendi
import { Pencil, Archive, Calendar, DollarSign, Stethoscope, User } from 'lucide-react';

// Randevuları listeleyecek alt bileşen
const PatientAppointments = ({ patientId }: { patientId: string }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select(`*, staff:doctor_id ( full_name )`)
        .eq('patient_id', patientId)
        .order('start_time', { ascending: false });

      if (error) console.error("Hastanın randevuları alınırken hata: ", error);
      else setAppointments(data as any);
      setLoading(false);
    };
    fetchAppointments();
  }, [patientId]);

  if (loading) return <div className="text-center py-8">Randevular yükleniyor...</div>;
  if (appointments.length === 0) return <div className="text-center text-gray-500 py-8">Bu hastanın randevusu bulunmuyor.</div>;

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {appointments.map((app, index) => (
          <li key={app.id}>
            <div className="relative pb-8">
              {index !== appointments.length - 1 && (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white`}>
                    <Calendar className="h-5 w-5 text-white" />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{app.title || 'Randevu'}</span> - Dr. {app.staff.full_name}
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    <time dateTime={app.start_time}>{new Date(app.start_time).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default function PatientDetail() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchPatient = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    const { data, error } = await supabase.from('patients').select('*').eq('id', patientId).single();
    if (error) {
      console.error('Hasta detayı alınırken hata:', error);
      setPatient(null);
    } else {
      setPatient(data);
    }
    setLoading(false);
  }, [patientId]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  const handleUpdateSuccess = () => {
    setIsEditModalOpen(false);
    fetchPatient(); // Bilgileri tazelemek için tekrar çek
  };

  const handleArchivePatient = async () => {
    if (window.confirm(`${patient?.full_name} adlı hastayı arşivlemek istediğinizden emin misiniz? Arşivlenen hastalar listelerde görünmez ancak verileri saklanır.`)) {
      if (!patientId) return;
      const { error } = await supabase
        .from('patients')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', patientId);
      
      if (error) {
        alert('Hasta arşivlenirken bir hata oluştu: ' + error.message);
      } else {
        alert('Hasta başarıyla arşivlendi.');
        navigate('/admin/patients');
      }
    }
  };
  
  const renderTabContent = () => {
    if (!patient) return null; // Patient verisi henüz gelmediyse bir şey render etme

    switch(activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>TC Kimlik No:</strong> {patient.tc_number || '-'}</div>
            <div><strong>Telefon:</strong> {patient.phone}</div>
            <div><strong>Email:</strong> {patient.email || '-'}</div>
            <div><strong>Cinsiyet:</strong> {patient.gender === 'male' ? 'Erkek' : patient.gender === 'female' ? 'Kadın' : 'Diğer'}</div>
            <div><strong>Doğum Tarihi:</strong> {new Date(patient.birth_date).toLocaleDateString('tr-TR')}</div>
            <div><strong>Adres:</strong> {patient.address || '-'}</div>
          </div>
        )
      case 'appointments':
        return <PatientAppointments patientId={patientId!} />;
      case 'treatments':
        return <PatientTreatmentPlans patientId={patientId!} />;
      case 'finance':
        return <PatientFinancialHistory patient={patient} />;
      default:
        return null;
    }
  }

  if (loading) {
    return <div className="text-center p-8">Hasta bilgileri yükleniyor...</div>;
  }

  if (!patient) {
    return <div className="text-center p-8 text-red-500">Hasta bulunamadı veya veritabanı bağlantısında bir sorun var.</div>;
  }

  const tabClass = (tabName: string) => `flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabName ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`;

  return (
    <div>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{patient.full_name}</h1>
            <p className="text-gray-500 mt-1">Hasta Detayları ve Geçmişi</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Düzenle
            </Button>
            <Button variant="danger" onClick={handleArchivePatient}>
              <Archive className="h-4 w-4 mr-2" />
              Arşivle
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap space-x-2 sm:space-x-4" aria-label="Tabs">
          <button className={tabClass('overview')} onClick={() => setActiveTab('overview')}><User className="h-4 w-4" /><span>Genel Bakış</span></button>
          <button className={tabClass('appointments')} onClick={() => setActiveTab('appointments')}><Calendar className="h-4 w-4" /><span>Randevular</span></button>
          <button className={tabClass('treatments')} onClick={() => setActiveTab('treatments')}><Stethoscope className="h-4 w-4" /><span>Tedaviler</span></button>
          <button className={tabClass('finance')} onClick={() => setActiveTab('finance')}><DollarSign className="h-4 w-4" /><span>Finans</span></button>
        </nav>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border min-h-[20rem]">
        {renderTabContent()}
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Hasta Bilgilerini Düzenle">
        <AddPatientForm 
          onSuccess={handleUpdateSuccess}
          onCancel={() => setIsEditModalOpen(false)}
          initialData={patient}
        />
      </Modal>
    </div>
  );
}
