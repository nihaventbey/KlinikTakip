import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../components/UI';
import { db } from '../../lib/db';
import { Appointment } from '../../types';

export const AppointmentCalendar: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const HOURS = Array.from({ length: 9 }, (_, i) => i + 9);

  const load = async () => {
      const data = await db.appointments.getAll();
      setAppointments(data as any);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
      <div className="bg-white border-b border-slate-100 p-8 flex justify-between items-center shrink-0">
        <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Randevu Takvimi</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Klinik Doluluk Oranı: %64</p>
        </div>
        <Button icon="add_box" className="h-14 px-8 rounded-2xl font-bold shadow-xl shadow-primary/20">Hızlı Randevu Oluştur</Button>
      </div>
      <div className="flex-1 overflow-auto bg-white flex flex-col relative no-scrollbar">
        <div className="flex border-b border-slate-50 sticky top-0 z-20 bg-white/80 backdrop-blur-md">
          <div className="w-20 border-r border-slate-50 p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center">Saat</div>
          {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'].map(day => (
            <div key={day} className="flex-1 border-r border-slate-50 p-6 text-center">
              <div className="text-[11px] font-extrabold uppercase text-slate-400 tracking-[0.2em]">{day}</div>
            </div>
          ))}
        </div>
        <div className="relative">
           {HOURS.map(hour => (
             <div key={hour} className="flex h-32 border-b border-slate-50 relative group">
               <div className="w-20 text-[11px] font-extrabold text-slate-300 text-center pt-4 group-hover:text-primary transition-colors uppercase">{hour}:00</div>
               <div className="flex-1 flex gap-3 p-3 bg-slate-50/20">
                    {appointments.filter(a => parseInt((a as any).time) === hour).map((a: any) => (
                        <div key={a.id} className="bg-white border-l-4 border-primary p-5 rounded-2xl flex-1 flex flex-col justify-center shadow-lg shadow-slate-200/50 hover:scale-[1.02] transition-transform cursor-pointer">
                             <p className="text-sm font-extrabold text-slate-900 truncate">{a.patient?.full_name || a.patientName}</p>
                             <div className="flex items-center gap-2 mt-1">
                                 <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{a.treatment?.name || a.treatment}</p>
                             </div>
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