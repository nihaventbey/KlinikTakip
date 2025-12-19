import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { db } from '../../lib/db';
import { Patient, Transaction, TreatmentItem, GalleryItem } from '../../types';

export const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({ pts: 0, apts: 0, trx: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [p, a, t] = await Promise.all([
                    db.patients.getAll(),
                    db.appointments.getAll(),
                    db.transactions.getAll()
                ]);
                setStats({
                    pts: p.length,
                    apts: a.length,
                    trx: t.length
                });
            } catch (error) {
                console.error("Dashboard verileri yüklenemedi:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
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
                            <h3 className="text-4xl font-extrabold mt-2 text-gray-900">{loading ? '...' : s.value}</h3>
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

export const PatientsPage: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const load = async () => {
            try {
                const data = await db.patients.getAll();
                setPatients(data);
            } catch (error) {
                console.error("Hastalar yüklenemedi:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Hastalar</h1>
                <Button icon="person_add">Yeni Hasta</Button>
            </div>
            {loading ? (
                <div className="p-20 text-center text-gray-400">Yükleniyor...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {patients.map(p => (
                        <Card key={p.id} className="p-6 border-none shadow-xl shadow-gray-200/50">
                            <div className="flex items-center gap-4">
                                <img src={p.avatar_url || 'https://i.pravatar.cc/150'} className="w-14 h-14 rounded-2xl object-cover" alt={p.full_name} />
                                <div>
                                    <h3 className="font-extrabold text-gray-900">{p.full_name}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{p.phone}</p>
                                    <div className="mt-2">
                                        <Badge status={p.status} />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export const FinancePage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const load = async () => {
            try {
                const data = await db.transactions.getAll();
                setTransactions(data);
            } catch (error) {
                console.error("Finans verileri yüklenemedi:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Finans Yönetimi</h1>
                <Button icon="add_card">İşlem Ekle</Button>
            </div>
            <Card className="border-none shadow-xl shadow-gray-200/50 rounded-[32px] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-6 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Hasta</th>
                            <th className="p-6 text-xs font-extrabold text-gray-400 uppercase tracking-widest">İşlem</th>
                            <th className="p-6 text-xs font-extrabold text-gray-400 uppercase tracking-widest text-right">Tutar</th>
                            <th className="p-6 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Durum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan={4} className="p-10 text-center text-gray-400">Yükleniyor...</td></tr>
                        ) : (
                            transactions.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6 font-bold text-gray-900">{(t as any).patient?.full_name || t.patient}</td>
                                    <td className="p-6 text-sm text-gray-500 font-medium">{t.type}</td>
                                    <td className="p-6 text-right font-extrabold text-gray-900">{t.amount} ₺</td>
                                    <td className="p-6"><Badge status={t.status} /></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export const TreatmentsAdminPage: React.FC = () => {
    const [treatments, setTreatments] = useState<TreatmentItem[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const load = async () => {
            try {
                const data = await db.treatments.getAll();
                setTreatments(data);
            } catch (error) {
                console.error("Tedaviler yüklenemedi:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Tedavi Listesi</h1>
                <Button icon="add_circle">Yeni Tedavi Tanımla</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-2 p-10 text-center text-gray-400">Yükleniyor...</div>
                ) : (
                    treatments.map(t => (
                        <Card key={t.id} className="p-8 border-none shadow-xl shadow-gray-200/50 rounded-[32px] group hover:bg-primary transition-all duration-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-extrabold text-primary group-hover:text-white/70 uppercase tracking-widest mb-1">{t.category}</p>
                                    <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-white transition-colors">{t.name}</h3>
                                    <p className="text-sm text-gray-500 group-hover:text-white/60 font-medium mt-1">Süre: {t.duration}</p>
                                </div>
                                <div className="text-2xl font-extrabold text-primary group-hover:text-white">
                                    {t.price} ₺
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, loading } = useSettings();
  const [tab, setTab] = useState<'genel' | 'web' | 'galeri' | 'highlight' | 'ekip' | 'footer'>('genel');
  const [formData, setFormData] = useState<any>(null);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (settings) setFormData(settings); }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
        await updateSettings(formData);
        setMsg('Web sitesi başarıyla güncellendi!');
        setTimeout(() => setMsg(''), 3000);
    } catch (error) {
        console.error("Ayarlar kaydedilemedi:", error);
    } finally {
        setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addGalleryItem = () => {
      const newItem: GalleryItem = { id: Math.random().toString(36).substr(2, 9), url: '', caption: '' };
      setFormData({ ...formData, gallery: [...(formData.gallery || []), newItem] });
  };

  const removeGalleryItem = (id: string) => {
      setFormData({ ...formData, gallery: formData.gallery.filter((g: any) => g.id !== id) });
  };

  const updateGalleryItem = (id: string, field: string, value: string) => {
      setFormData({ ...formData, gallery: formData.gallery.map((g: any) => g.id === id ? { ...g, [field]: value } : g) });
  };

  if (loading || !formData) return <div className="p-20 text-center">Yükleniyor...</div>;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Web Yönetim Paneli</h1>
        {msg && <div className="bg-green-50 text-green-700 px-6 py-3 rounded-2xl border border-green-100 font-bold text-sm flex items-center gap-2 animate-bounce">
            <span className="material-symbols-outlined text-lg">check_circle</span> {msg}
        </div>}
      </div>

      <div className="flex gap-2 border-b border-slate-100 overflow-x-auto no-scrollbar scroll-smooth">
          {[
              { id: 'genel', label: 'Kurumsal', icon: 'business' },
              { id: 'web', label: 'Hero & Metinler', icon: 'auto_awesome' },
              { id: 'galeri', label: 'Galeri Yönetimi', icon: 'gallery_thumbnail' },
              { id: 'highlight', label: 'Vaka Analizi', icon: 'compare' },
              { id: 'ekip', label: 'Doktorlar', icon: 'medical_information' },
              { id: 'footer', label: 'Footer & Saatler', icon: 'more_horiz' }
          ].map(t => (
            <button 
                key={t.id} 
                onClick={() => setTab(t.id as any)} 
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all whitespace-nowrap ${tab === t.id ? 'border-b-4 border-primary text-primary bg-primary/5 rounded-t-xl' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <span className="material-symbols-outlined text-lg">{t.icon}</span>
                {t.label}
            </button>
          ))}
      </div>

      <Card className="p-10 space-y-10 border-none shadow-2xl rounded-[40px]">
        {tab === 'genel' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                    <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Klinik Adı</label>
                    <input name="clinic_name" value={formData.clinic_name} onChange={handleInputChange} className="p-5 border-2 border-slate-50 rounded-[20px] bg-slate-50 focus:bg-white focus:border-primary outline-none transition-all font-bold" />
                </div>
                <div className="flex flex-col gap-3">
                    <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Klinik Telefonu</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} className="p-5 border-2 border-slate-50 rounded-[20px] bg-slate-50 focus:bg-white focus:border-primary outline-none transition-all font-bold" />
                </div>
                <div className="flex flex-col gap-3 md:col-span-2">
                    <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Adres Bilgisi</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} rows={2} className="p-5 border-2 border-slate-50 rounded-[20px] bg-slate-50 focus:bg-white focus:border-primary outline-none transition-all font-bold resize-none" />
                </div>
            </div>
        )}

        {tab === 'web' && (
            <div className="grid grid-cols-1 gap-10">
                <div className="p-8 bg-primary/5 rounded-[32px] flex flex-col gap-6">
                    <h4 className="font-extrabold text-primary flex items-center gap-2 tracking-tight">
                        <span className="material-symbols-outlined">star</span> Hero Bölümü & İlgi Çekici Metin
                    </h4>
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Ana Başlık</label>
                        <input name="hero_title" value={formData.hero_title} onChange={handleInputChange} className="p-5 border-2 border-slate-50 rounded-[20px] font-bold text-xl" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Hero İlgi Çekici Metin (Catchy Text)</label>
                        <textarea name="hero_catchy_text" value={formData.hero_catchy_text} onChange={handleInputChange} rows={3} className="p-5 border-2 border-slate-50 rounded-[20px] font-bold text-primary resize-none leading-relaxed" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Hero Alt Yazı</label>
                        <textarea name="hero_subtitle" value={formData.hero_subtitle} onChange={handleInputChange} rows={3} className="p-5 border-2 border-slate-50 rounded-[20px] font-medium resize-none leading-relaxed" />
                    </div>
                </div>
            </div>
        )}

        {tab === 'galeri' && (
            <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-slate-900 tracking-tight">Image Gallery Yönetimi</h4>
                    <Button onClick={addGalleryItem} variant="outline" icon="add">Yeni Görsel Ekle</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.gallery?.map((item: any) => (
                        <div key={item.id} className="p-6 bg-slate-50 rounded-[32px] flex flex-col gap-4 border border-slate-100">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Görsel URL</label>
                                <input value={item.url} onChange={(e) => updateGalleryItem(item.id, 'url', e.target.value)} className="p-4 bg-white border border-slate-200 rounded-xl text-xs font-mono" placeholder="https://..." />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Caption (Alt Bilgi)</label>
                                <input value={item.caption} onChange={(e) => updateGalleryItem(item.id, 'caption', e.target.value)} className="p-4 bg-white border border-slate-200 rounded-xl font-bold" placeholder="Görsel açıklaması" />
                            </div>
                            <Button onClick={() => removeGalleryItem(item.id)} variant="danger" className="mt-2" icon="delete">Kaldır</Button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {tab === 'highlight' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex flex-col gap-6">
                    <h4 className="font-extrabold text-slate-900 tracking-tight">Vaka Metinleri</h4>
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Vaka Başlığı</label>
                        <input name="service_highlight_title" value={formData.service_highlight_title} onChange={handleInputChange} className="p-5 border-2 border-slate-50 rounded-[20px] font-bold" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Vaka Detayı</label>
                        <textarea name="service_highlight_desc" value={formData.service_highlight_desc} onChange={handleInputChange} rows={3} className="p-5 border-2 border-slate-50 rounded-[20px] font-bold resize-none" />
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <h4 className="font-extrabold text-slate-900 tracking-tight">Görsel Karşılaştırma</h4>
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Öncesi (Before) URL</label>
                        <input name="service_before_img" value={formData.service_before_img} onChange={handleInputChange} className="p-5 border-2 border-slate-50 rounded-[20px] font-mono text-xs" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Sonrası (After) URL</label>
                        <input name="service_after_img" value={formData.service_after_img} onChange={handleInputChange} className="p-5 border-2 border-slate-50 rounded-[20px] font-mono text-xs" />
                    </div>
                </div>
            </div>
        )}

        <div className="pt-10 border-t border-slate-100 flex justify-end">
            <Button onClick={handleSave} disabled={saving} icon="publish" className="h-16 px-16 text-xl rounded-[24px] shadow-2xl shadow-primary/30 font-extrabold">
                {saving ? 'Yayınlanıyor...' : 'Web Sitesinde Yayınla'}
            </Button>
        </div>
      </Card>
    </div>
  );
};