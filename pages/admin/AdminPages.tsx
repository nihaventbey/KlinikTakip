
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { db } from '../../lib/db';

export const Dashboard: React.FC = () => {
    const { profile } = useAuth();
    const [stats, setStats] = useState({ pts: 0, apts: 0, trx: 0 });

    useEffect(() => {
        const load = () => {
            setStats({
                pts: db.patients.getAll().length,
                apts: db.appointments.getAll().length,
                trx: db.transactions.getAll().length
            });
        };
        load();
        window.addEventListener('storage_update', load);
        return () => window.removeEventListener('storage_update', load);
    }, []);

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Klinik Paneli</h1>
                <Badge status="active" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Toplam Hasta', value: stats.pts, icon: 'group', color: 'bg-blue-500' },
                    { label: 'Güncel Randevular', value: stats.apts, icon: 'event', color: 'bg-primary' },
                    { label: 'Mali İşlemler', value: stats.trx, icon: 'payments', color: 'bg-green-500' }
                ].map(s => (
                    <Card key={s.label} className="p-10 flex items-center justify-between border-none shadow-xl shadow-gray-200/50 hover:scale-105 transition-transform">
                        <div>
                            <p className="text-gray-400 font-extrabold text-xs uppercase tracking-widest">{s.label}</p>
                            <h3 className="text-4xl font-extrabold mt-2 text-gray-900">{s.value}</h3>
                        </div>
                        <div className={`w-16 h-16 rounded-2xl ${s.color} text-white flex items-center justify-center shadow-lg`}>
                            <span className="material-symbols-outlined text-3xl">{s.icon}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [tab, setTab] = useState<'genel' | 'web' | 'highlight'>('genel');
  const [formData, setFormData] = useState(settings || {} as any);
  const [msg, setMsg] = useState('');

  useEffect(() => { if (settings) setFormData(settings); }, [settings]);

  const handleSave = async () => {
    await updateSettings(formData);
    setMsg('Web sitesi başarıyla güncellendi!');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Klinik & Web Yönetimi</h1>
        {msg && <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100 font-bold text-sm flex items-center gap-2 animate-bounce">
            <span className="material-symbols-outlined text-lg">check_circle</span> {msg}
        </div>}
      </div>

      <div className="flex gap-4 border-b border-gray-100 overflow-x-auto">
          {[
              { id: 'genel', label: 'Genel Bilgiler', icon: 'info' },
              { id: 'web', label: 'Ana Sayfa & Hero', icon: 'home' },
              { id: 'highlight', label: 'Öncesi/Sonrası (Slider)', icon: 'compare' }
          ].map(t => (
            <button 
                key={t.id} 
                onClick={() => setTab(t.id as any)} 
                className={`flex items-center gap-2 px-8 py-4 font-extrabold text-sm transition-all whitespace-nowrap ${tab === t.id ? 'border-b-4 border-primary text-primary' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <span className="material-symbols-outlined text-lg">{t.icon}</span>
                {t.label}
            </button>
          ))}
      </div>

      <Card className="p-10 space-y-8 border-none shadow-2xl">
        {tab === 'genel' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Klinik Adı</label>
                    <input name="clinic_name" value={formData.clinic_name} onChange={handleInputChange} className="p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-primary outline-none transition-all font-bold" />
                </div>
                <div className="flex flex-col gap-3">
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">İletişim Telefonu</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} className="p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-primary outline-none transition-all font-bold" />
                </div>
                <div className="flex flex-col gap-3 md:col-span-2">
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Klinik Adresi</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} rows={2} className="p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-primary outline-none transition-all font-bold resize-none" />
                </div>
            </div>
        )}

        {tab === 'web' && (
            <div className="grid grid-cols-1 gap-8">
                <div className="flex flex-col gap-3">
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Ana Sayfa Başlığı (Hero)</label>
                    <input name="hero_title" value={formData.hero_title} onChange={handleInputChange} className="p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-primary outline-none transition-all font-bold" />
                </div>
                <div className="flex flex-col gap-3">
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Hero Alt Yazı</label>
                    <textarea name="hero_subtitle" value={formData.hero_subtitle} onChange={handleInputChange} rows={3} className="p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-primary outline-none transition-all font-bold resize-none" />
                </div>
                <div className="flex flex-col gap-3">
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Arka Plan Görsel URL</label>
                    <input name="hero_image" value={formData.hero_image} onChange={handleInputChange} className="p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:border-primary outline-none font-mono text-sm" />
                </div>
            </div>
        )}

        {tab === 'highlight' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Slider Başlığı</label>
                        <input name="service_highlight_title" value={formData.service_highlight_title} onChange={handleInputChange} className="p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 font-bold" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Süreç (Örn: 6 Gün)</label>
                        <input name="service_duration" value={formData.service_duration} onChange={handleInputChange} className="p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 font-bold" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Adet (Örn: 20 Diş)</label>
                        <input name="service_teeth_count" value={formData.service_teeth_count} onChange={handleInputChange} className="p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 font-bold" />
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Öncesi Görsel URL</label>
                        <input name="service_before_img" value={formData.service_before_img} onChange={handleInputChange} className="p-4 border-2 border-gray-50 rounded-2xl font-mono text-sm" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Sonrası Görsel URL</label>
                        <input name="service_after_img" value={formData.service_after_img} onChange={handleInputChange} className="p-4 border-2 border-gray-50 rounded-2xl font-mono text-sm" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Vaka Açıklaması</label>
                        <textarea name="service_highlight_desc" value={formData.service_highlight_desc} onChange={handleInputChange} rows={3} className="p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 font-bold resize-none" />
                    </div>
                </div>
            </div>
        )}

        <div className="pt-8 border-t border-gray-100 flex justify-end">
            <Button onClick={handleSave} icon="publish" className="h-16 px-12 text-lg rounded-2xl shadow-2xl shadow-primary/30">Değişiklikleri Anında Yayınla</Button>
        </div>
      </Card>
    </div>
  );
};

export const PatientsPage: React.FC = () => <div className="p-10 text-center font-extrabold text-gray-400">Hasta listesi modülü aktif.</div>;
export const FinancePage: React.FC = () => <div className="p-10 text-center font-extrabold text-gray-400">Finans kayıtları modülü aktif.</div>;
export const TreatmentsAdminPage: React.FC = () => <div className="p-10 text-center font-extrabold text-gray-400">Tedavi kataloğu modülü aktif.</div>;
