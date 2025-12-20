import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CLINIC_CONFIG } from '../../../pages/admin/clinicSettings';

// Supabase istemcisi oluşturuluyor
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ClinicCalendar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // clinicSettings.js'den gelen verileri FullCalendar formatına çeviriyoruz
  const businessHours = {
    daysOfWeek: [1, 2, 3, 4, 5, 6], // Pazar (0) hariç
    startTime: CLINIC_CONFIG.workingHours.start,
    endTime: CLINIC_CONFIG.workingHours.end,
  };

  // Öğle arası gibi engellenmiş saatleri "background event" olarak ekleyebiliriz
  const lunchBreak = {
    startTime: CLINIC_CONFIG.workingHours.lunchBreak.start,
    endTime: CLINIC_CONFIG.workingHours.lunchBreak.end,
    daysOfWeek: [1, 2, 3, 4, 5, 6],
    display: 'background',
    color: '#ff9f89' // Görsel olarak ayırt edici bir renk
  };

  // Randevuya tıklandığında çalışacak fonksiyon
  const handleEventClick = (info) => {
    // Arka plan olayları (öğle arası vb.) genellikle tıklanmaz ama kontrol edilebilir
    if (info.event.display === 'background') return;

    setSelectedEvent({
      id: info.event.id, // Silme işlemi için ID gerekli
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      extendedProps: info.event.extendedProps, // Hasta adı, notlar vb. burada olur
      apiEvent: info.event, // Takvimden görsel olarak kaldırmak için referans
    });
    setModalOpen(true);
  };

  // Randevu Silme Fonksiyonu
  const handleDelete = async () => {
    if (!selectedEvent?.id) return;

    if (window.confirm('Bu randevuyu silmek istediğinize emin misiniz?')) {
      const { error } = await supabase
        .from('appointments') // Tablo adınızın 'appointments' olduğunu varsayıyoruz
        .delete()
        .eq('id', selectedEvent.id);

      if (error) {
        alert('Hata: ' + error.message);
      } else {
        selectedEvent.apiEvent.remove(); // Başarılıysa takvimden kaldır
        setModalOpen(false);
      }
    }
  };

  return (
    <div className="calendar-container" style={{ padding: '20px' }}>
      <h2>Randevu Takvimi</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        slotDuration={`00:${CLINIC_CONFIG.slotDuration}:00`} // 15 dk
        businessHours={businessHours}
        events={[lunchBreak]} // Randevular buraya eklenecek
        eventClick={handleEventClick} // Tıklama olayını bağlıyoruz
        allDaySlot={false}
        height="auto"
        locale="tr"
      />

      {/* Detay Modalı */}
      {modalOpen && selectedEvent && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', minWidth: '350px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>{selectedEvent.title}</h3>
            
            <div style={{ margin: '15px 0', color: '#555' }}>
              <p><strong>Başlangıç:</strong> {selectedEvent.start?.toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</p>
              <p><strong>Bitiş:</strong> {selectedEvent.end?.toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</p>
              
              {selectedEvent.extendedProps?.description && (
                <p><strong>Not:</strong> {selectedEvent.extendedProps.description}</p>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setModalOpen(false)} style={{ padding: '8px 16px', cursor: 'pointer' }}>Kapat</button>
              <button 
                onClick={handleDelete} 
                style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicCalendar;