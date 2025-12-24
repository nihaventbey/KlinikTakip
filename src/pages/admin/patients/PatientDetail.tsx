import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { useAuth } from '../../../contexts/AuthContext';
import { Patient, Appointment } from '../../../types';
import { Button } from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import AddPatientForm from './AddPatientForm';
import PatientTreatmentPlans from './PatientTreatmentPlans';
import PatientFinancialHistory from './PatientFinancialHistory';
import ClinicalNotes from './MedicalHistoryNotes'; // Renamed for clarity
import MedicalHistory from './MedicalHistory';
import DentalChart from './DentalChart';
import PatientImaging from './PatientImaging';
import { Pencil, Archive, DollarSign, Stethoscope, User, HeartPulse, ClipboardPen, Smile, Image } from 'lucide-react';

const ComingSoon = ({ title }: { title: string }) => (
    <div className="text-center py-10">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-gray-500 mt-1">Bu özellik yakında eklenecektir.</p>
    </div>
);

export default function PatientDetail() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { user: profile } = useAuth();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: patient, isLoading, isError, error } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
        if (!patientId || !profile?.clinic_id) throw new Error("Hasta ID veya Klinik ID eksik.");
        return db.patients.getById(patientId, profile.clinic_id)
    },
    enabled: !!patientId && !!profile?.clinic_id,
  });

  const archiveMutation = useMutation({
    mutationFn: () => {
        if (!patientId) throw new Error("Hasta ID eksik.");
        return db.patients.update(patientId, { deleted_at: new Date().toISOString() })
    },
    onSuccess: () => {
      toast.success('Hasta başarıyla arşivlendi.');
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.removeQueries({ queryKey: ['patient', patientId] });
      navigate('/admin/patients');
    },
    onError: (err: any) => {
      toast.error('Hasta arşivlenirken bir hata oluştu: ' + err.message);
    }
  });

  const handleArchivePatient = () => {
    if (window.confirm(`${patient?.full_name} adlı hastayı arşivlemek istediğinizden emin misiniz? Arşivlenen hastalar listelerde görünmez ancak verileri saklanır.`)) {
      archiveMutation.mutate();
    }
  };
  
  const renderTabContent = () => {
    if (!patient || !profile) return null;

    switch(activeTab) {
      case 'overview':
        return (
          <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hasta Kimlik Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>TC Kimlik No:</strong> {patient.tc_number || '-'}</div>
                  <div><strong>Telefon:</strong> {patient.phone}</div>
                  <div><strong>Email:</strong> {patient.email || '-'}</div>
                  <div><strong>Cinsiyet:</strong> {patient.gender === 'male' ? 'Erkek' : patient.gender === 'female' ? 'Kadın' : 'Diğer'}</div>
                  <div><strong>Doğum Tarihi:</strong> {patient.birth_date ? new Date(patient.birth_date).toLocaleDateString('tr-TR') : '-'}</div>
                  <div><strong>Adres:</strong> {patient.address || '-'}</div>
              </div>
          </div>
        );
      case 'medical_history':
        return <MedicalHistory patientId={patientId!} />;
      case 'clinical_notes':
        return <ClinicalNotes patientId={patientId!} clinicId={profile.clinic_id!} />;
      case 'dental_chart':
        return <DentalChart patientId={patientId!} />;
      case 'imaging':
        return <PatientImaging patientId={patientId!} />;
      case 'treatments':
        return <PatientTreatmentPlans patientId={patientId!} />;
      case 'finance':
        return <PatientFinancialHistory patient={patient} />;
      default:
        return null;
    }
  }

  if (isLoading) {
    return <div className="text-center p-8">Hasta bilgileri yükleniyor...</div>;
  }

  if (isError) {
    return <div className="text-center p-8 text-red-500">{(error as Error).message}</div>;
  }
  
  if (!patient) {
    return <div className="text-center p-8 text-red-500">Hasta bulunamadı veya bu kliniğe ait değil.</div>;
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
            <Button variant="danger" onClick={handleArchivePatient} disabled={archiveMutation.isPending}>
              <Archive className="h-4 w-4 mr-2" />
              Arşivle
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap space-x-2 sm:space-x-4" aria-label="Tabs">
          <button className={tabClass('overview')} onClick={() => setActiveTab('overview')}><User className="h-4 w-4" /><span>Genel Bakış</span></button>
          <button className={tabClass('medical_history')} onClick={() => setActiveTab('medical_history')}><HeartPulse className="h-4 w-4" /><span>Medikal Geçmiş</span></button>
          <button className={tabClass('clinical_notes')} onClick={() => setActiveTab('clinical_notes')}><ClipboardPen className="h-4 w-4" /><span>Klinik Notlar</span></button>
          <button className={tabClass('dental_chart')} onClick={() => setActiveTab('dental_chart')}><Smile className="h-4 w-4" /><span>Diş Şeması</span></button>
          <button className={tabClass('imaging')} onClick={() => setActiveTab('imaging')}><Image className="h-4 w-4" /><span>Görüntüler</span></button>
          <button className={tabClass('treatments')} onClick={() => setActiveTab('treatments')}><Stethoscope className="h-4 w-4" /><span>Tedaviler</span></button>
          <button className={tabClass('finance')} onClick={() => setActiveTab('finance')}><DollarSign className="h-4 w-4" /><span>Finans</span></button>
        </nav>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border min-h-[20rem]">
        {renderTabContent()}
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Hasta Bilgilerini Düzenle">
        <AddPatientForm 
          onSuccess={() => setIsEditModalOpen(false)}
          onCancel={() => setIsEditModalOpen(false)}
          initialData={patient}
        />
      </Modal>
    </div>
  );
}
