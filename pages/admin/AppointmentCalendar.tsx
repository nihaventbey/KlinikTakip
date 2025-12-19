import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../components/UI';
import { db } from '../../lib/db';
import { Appointment } from '../../types';
import { supabase } from '../../lib/supabase';
import { Patient } from '../../types';

export const AppointmentCalendar: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', patient_name: '', patient_id: '', treatment: '', date: new Date().toISOString().split('T')[0], time: '09' });
  const [patientResults, setPatientResults] = useState<Patient[]>([]);
  const [showPatientResults, setShowPatientResults] = useState(false);
  const HOURS = Array.from({ length: 9 }, (_, i) => i + 9);

  const load = async () => {
      const { data } = await supabase.from('appointments').select('*');
      if (data) setAppointments(data as any);
  };

  useEffect(() => { load(); }, []);

  const handlePatientSearch = async (val: string) => {
      setFormData({ ...formData, patient_name: val });
      if (val.length > 1) {
          const { data } = await supabase.from('patients').select('*').ilike('full_name', `%${val}%`);
          setPatientResults(data || []);
          setShowPatientResults(true);
      } else {
          setShowPatientResults(false);
      }
  };

  const handleSave = async () => {
      if (!formData.patient_name || !formData.date) return;
      
      const payload = {
          patient_id: formData.patient_id || null,
          patient_name: formData.patient_name, // Supabase tablonuzdaki kolon adlarına göre
          treatment: formData.treatment,
          date: formData.date,
          time: formData.time,
          start_time: new Date(`${formData.date}T${formData.time.toString().padStart(2, '0')}:00:00`).toISOString(),
          status: 'pending'
      };

      let error;
      if (formData.id) {
          const { error: updateError } = await supabase.from('appointments').update(payload).eq('id', formData.id);
          error = updateError;
      } else {
          const { error: insertError } = await supabase.from('appointments').insert([payload]);
          error = insertError;
      }

      if (!error) {
          load();
          setShowModal(false);
          setFormData({ id: '', patient_name: '', patient_id: '', treatment: '', date: new Date().toISOString().split('T')[0], time: '09' });
      } else {
          alert('Randevu oluşturulurken hata: ' + error.message);
      }
  };

  const handleEdit = (apt: any) => {
      setFormData({
          id: apt.id,
          patient_name: apt.patient_name || apt.patient?.full_name || '',
          patient_id: apt.patient_id || '',
          treatment: apt.treatment || '',
          date: apt.date,
          time: apt.time
      });
      setShowModal(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-6">{formData.id ? 'Randevu Düzenle' : 'Yeni Randevu'}</h3>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Hasta Ara</label>
                        <div className="relative">
                            <input value={formData.patient_name} onChange={e => handlePatientSearch(e.target.value)} className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold outline-none focus:bg-white focus:border-primary transition-all" placeholder="Ad Soyad" autoFocus />
                            {showPatientResults && patientResults.length > 0 && (
                                <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-xl mt-2 max-h-40 overflow-y-auto z-10 border border-gray-100">
                                    {patientResults.map(p => (
                                        <div key={p.id} onClick={() => { setFormData({ ...formData, patient_name: p.full_name, patient_id: p.id }); setShowPatientResults(false); }} className="p-3 hover:bg-gray-50 cursor-pointer font-bold text-sm text-gray-700 border-b border-gray-50 last:border-0">
                                            {p.full_name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Tedavi / İşlem</label>
                        <input value={formData.treatment} onChange={e => setFormData({...formData, treatment: e.target.value})} className="p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold outline-none focus:bg-white focus:border-primary transition-all" placeholder="Örn: Kontrol" />
                    </div>
                    <div className="flex gap-4">
                        <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="flex-1 p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold outline-none focus:bg-white focus:border-primary" />
                        <select value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-24 p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold outline-none focus:bg-white focus:border-primary">
                            {HOURS.map(h => <option key={h} value={h}>{h}:00</option>)}
                        </select>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>İptal</Button>
                        <Button className="flex-1" onClick={handleSave}>Oluştur</Button>
                    </div>
                </div>
            </div>
        </div>
      )}
      <div className="bg-white border-b border-slate-100 p-8 flex justify-between items-center shrink-0">
        <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Randevu Takvimi</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Klinik Doluluk Oranı: %64</p>
        </div>
        <Button icon="add_box" onClick={() => { setFormData({ id: '', patient_name: '', patient_id: '', treatment: '', date: new Date().toISOString().split('T')[0], time: '09' }); setShowModal(true); }} className="h-14 px-8 rounded-2xl font-bold shadow-xl shadow-primary/20">Hızlı Randevu Oluştur</Button>
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
                    {appointments.filter(a => parseInt((a as any).time) == hour).map((a: any) => (
                        <div key={a.id} onClick={() => handleEdit(a)} className="bg-white border-l-4 border-primary p-5 rounded-2xl flex-1 flex flex-col justify-center shadow-lg shadow-slate-200/50 hover:scale-[1.02] transition-transform cursor-pointer">
                             <p className="text-sm font-extrabold text-slate-900 truncate">{a.patient?.full_name || a.patient_name || 'İsimsiz'}</p>
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