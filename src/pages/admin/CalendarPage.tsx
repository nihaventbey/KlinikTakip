import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { tr } from 'date-fns/locale/tr';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/ui/Modal';
import AppointmentForm from './calendar/AppointmentForm';
import { Plus, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'tr': tr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

const transformAppointmentsToEvents = (appointments: any[] | undefined) => {
  if (!appointments) return [];
  return appointments.map(app => ({
    id: app.id,
    title: `${app.patient?.full_name || 'Bilinmeyen Hasta'}`,
    start: new Date(app.start_time),
    end: new Date(app.end_time),
    resource: app,
  }));
};

export default function CalendarPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    eventInfo?: { start?: Date; end?: Date; id?: string; patientId?: string };
  }>({ isOpen: false });

  const { data: appointments, isLoading, isError } = useQuery({
    queryKey: ['appointments', user?.clinic_id],
    queryFn: () => db.appointments.getAll(user!.clinic_id!),
    enabled: !!user?.clinic_id,
  });

  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    setModalState({ isOpen: true, eventInfo: { start, end } });
  }, []);

  const handleSelectEvent = useCallback((event: any) => {
    setModalState({ 
      isOpen: true, 
      eventInfo: { 
        id: event.id, 
        start: event.start, 
        end: event.end, 
        patientId: event.resource?.patient_id 
      } 
    });
  }, []);

  const closeModal = () => setModalState({ isOpen: false });

  const events = transformAppointmentsToEvents(appointments);

  if (isLoading) return <div className="text-center p-8">Randevular yükleniyor...</div>;
  if (isError) return <div className="text-center p-8 text-red-500">Hata oluştu.</div>;

  return (
    <div className="space-y-4">
      {/* Üst Bar - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <CalendarIcon size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Randevu Takvimi</h1>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Filter size={16} className="mr-2" /> Filtrele
          </Button>
          <Button 
            size="sm" 
            className="flex-1 sm:flex-none"
            onClick={() => setModalState({ isOpen: true })}
          >
            <Plus size={16} className="mr-2" /> Yeni Randevu
          </Button>
        </div>
      </div>

      {/* Takvim Alanı - Mobilde kaydırılabilir */}
      <div className="bg-white p-2 sm:p-4 rounded-xl shadow-sm border h-[75vh] overflow-x-auto">
        <div className="min-w-[700px] h-full">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            culture="tr"
            messages={{
              next: "Sonraki",
              previous: "Önceki",
              today: "Bugün",
              month: "Ay",
              week: "Hafta",
              day: "Gün",
              agenda: "Ajanda",
              date: "Tarih",
              time: "Saat",
              event: "Randevu",
              noEventsInRange: "Randevu bulunamadı.",
            }}
            defaultView={Views.WEEK}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      </div>

      <Modal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        size="xl"
        title={modalState.eventInfo?.id ? "Randevu Detayı" : "Yeni Randevu"}
      >
        <AppointmentForm 
          initialData={modalState.eventInfo}
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}