import React, { useState, useCallback, useEffect } from 'react';
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
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'tr': tr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }), // Pazartesi
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
    resource: app, // Orijinal veriyi sakla
  }));
};

export default function CalendarPage() {
  const { user: profile } = useAuth();
  const [modalState, setModalState] = useState<{ isOpen: boolean; eventInfo?: any }>({ isOpen: false });
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: appointments, isLoading, isError } = useQuery({
    queryKey: ['appointments', profile?.clinic_id],
    queryFn: () => db.appointments.getAll(profile!.clinic_id!),
    enabled: !!profile?.clinic_id,
  });

  // Effect to open modal from URL parameter
  useEffect(() => {
    if (searchParams.get('new-appointment') === 'true') {
      setModalState({ isOpen: true, eventInfo: {} });
      // Clean up the URL parameter after opening the modal
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSelectSlot = useCallback((slotInfo: any) => {
    setModalState({ isOpen: true, eventInfo: { start: slotInfo.start, end: slotInfo.end } });
  }, []);

  const handleSelectEvent = useCallback((event: any) => {
    // Re-fetch patient name for the title, as it might be stale
    const fullEventData = appointments?.find(a => a.id === event.id);
    const title = fullEventData?.patient?.full_name 
        ? `${fullEventData.patient.full_name}`
        : event.title;

    setModalState({ isOpen: true, eventInfo: {...event, title} });
  }, [appointments]);

  const closeModal = () => {
    setModalState({ isOpen: false });
  };

  const events = transformAppointmentsToEvents(appointments);

  if (isLoading) {
    return <div className="text-center p-8">Randevular yükleniyor...</div>;
  }
  
  if (isError) {
      return <div className="text-center p-8 text-red-500">Randevular çekilirken bir hata oluştu.</div>
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border h-[85vh]">
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
            event: "Olay",
            noEventsInRange: "Bu aralıkta randevu bulunmamaktadır.",
        }}
        defaultView={Views.WEEK}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
      <Modal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        size="xl"
        title={modalState.eventInfo?.id ? 'Randevuyu Düzenle' : 'Yeni Randevu Oluştur'}
      >
          <AppointmentForm eventInfo={modalState.eventInfo} onClose={closeModal} />
      </Modal>
    </div>
  );
}
