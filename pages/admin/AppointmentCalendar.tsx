
import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../components/UI';
import { db } from '../../lib/db';
import { Appointment } from '../../types';

export const AppointmentCalendar: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const HOURS = Array.from({ length: 9 }, (_, i) => i + 9); // 09:00 - 17:00

  useEffect(() => {
    const load = () => setAppointments(db.appointments.getAll());
    load();
    window.addEventListener('storage_update', load);
    return () => window.removeEventListener('storage_update', load);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in">
      <div className="bg-white border-b p-4 flex justify-between items-center shrink-0">
        <h2 className="text-lg font-bold">Haftalık Randevu Planı</h2>
        <Button icon="add" onClick={() => {
            const name = prompt("Hasta Adı:");
            const time = prompt("Saat (09:00 - 17:00):");
            if(name && time) db.appointments.add({ patientName: name, doctorName: 'Dr. Ahmet', treatment: 'Kontrol', date: '2023-10-24', time, duration: 30, status: 'confirmed', type: 'visit' });
        }}>Hızlı Randevu</Button>
      </div>

      <div className="flex-1 overflow-auto bg-white flex flex-col relative select-none">
        <div className="flex border-b sticky top-0 z-20 bg-white">
          <div className="w-16 border-r p-2 text-xs font-bold text-gray-400">GMT+3</div>
          {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'].map(day => (
            <div key={day} className="flex-1 border-r p-3 text-center">
              <div className="text-xs font-bold uppercase text-gray-500">{day}</div>
            </div>
          ))}
        </div>

        <div className="relative">
           {HOURS.map(hour => (
             <div key={hour} className="flex h-24 border-b border-gray-100 relative">
               <div className="w-16 text-xs text-gray-400 text-right pr-3 -mt-2.5">{hour}:00</div>
               <div className="flex-1 flex gap-1 p-1">
                    {/* Render dynamic items matching this hour */}
                    {appointments.filter(a => parseInt(a.time) === hour).map(a => (
                        <div key={a.id} className="bg-primary/10 border-l-4 border-primary p-2 rounded flex-1 flex flex-col justify-center">
                             <p className="text-xs font-bold text-primary truncate">{a.patientName}</p>
                             <p className="text-[10px] text-gray-500">{a.treatment}</p>
                        </div>
                    ))}
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
