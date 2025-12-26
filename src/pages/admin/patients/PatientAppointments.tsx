import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '../../../lib/db';
import { Calendar, User, Clock, Pencil } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import AppointmentForm from '../calendar/AppointmentForm';

interface PatientAppointmentsProps {
  patientId: string;
}

const statusColors: { [key: string]: string } = {
  planned: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  noshow: 'bg-yellow-100 text-yellow-800',
};

const AppointmentCard = ({ appointment, onEdit }: { appointment: any, onEdit: () => void }) => {
  const appointmentDate = new Date(appointment.start_time);
  const statusColor = statusColors[appointment.status] || 'bg-gray-100 text-gray-800';
  
  return (
    <div className="p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {appointmentDate.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {appointmentDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4 text-gray-400" />
                <span>{appointment.staff?.full_name || 'Doktor Atanmamış'}</span>
            </div>
            <p className={`text-xs font-medium mt-1 px-2 py-0.5 rounded-full inline-block ${statusColor}`}>{appointment.status}</p>
        </div>
      </div>
      {appointment.notes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">{appointment.notes}</p>
        </div>
      )}
      <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="h-3 w-3 mr-2" />
              Düzenle
          </Button>
      </div>
    </div>
  );
};


export default function PatientAppointments({ patientId }: PatientAppointmentsProps) {
  const { user: profile } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['patientAppointments', patientId],
    queryFn: () => db.appointments.getByPatientId(patientId, profile!.clinic_id!),
    enabled: !!patientId && !!profile?.clinic_id,
  });

  const handleEditClick = (appointment: any) => {
      setSelectedAppointment({
          id: appointment.id,
          start: new Date(appointment.start_time),
          end: new Date(appointment.end_time),
          notes: appointment.notes,
          resource: {
              patient_id: appointment.patient_id,
              doctor_id: appointment.doctor_id,
              patient: { full_name: appointment.patient.full_name }
          }
      });
      setIsEditModalOpen(true);
  }

  if (isLoading) {
    return <div className="text-center py-8">Randevular yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">Hata: Randevular yüklenemedi.</div>;
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 border-2 border-dashed rounded-lg">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Randevu Bulunmuyor</h3>
        <p className="mt-1 text-sm text-gray-500">Bu hastanın geçmiş veya gelecek randevusu bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <>
        <div className="space-y-4">
        {appointments.map(app => (
            <AppointmentCard key={app.id} appointment={app} onEdit={() => handleEditClick(app)} />
        ))}
        </div>

        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Randevuyu Düzenle">
            <AppointmentForm
                eventInfo={selectedAppointment}
                onClose={() => setIsEditModalOpen(false)}
            />
        </Modal>
    </>
  );
}
