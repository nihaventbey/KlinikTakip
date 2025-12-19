import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Button, Badge } from '../../components/UI';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { db } from '../../lib/db';
import { Patient, Transaction, TreatmentItem, GalleryItem } from '../../types';
import { supabase } from '../../lib/supabase';
import { Odontogram } from './ClinicalPages';

export const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({ pts: 0, apts: 0, trx: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    // Grafik verileri (Simüle edilmiş)
    const [chartData, setChartData] = useState({ revenue: [0,0,0,0,0,0,0], appointments: [0,0,0,0,0,0,0], labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'] });
    const [expiringItems, setExpiringItems] = useState<any[]>([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
    const [delayedAppointments, setDelayedAppointments] = useState<any[]>([]);
    const [totalReceivables, setTotalReceivables] = useState(0);

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

                // Stok Kontrolü
                const { data: inv } = await supabase.from('inventory').select('*');
                if (inv) {
                    const today = new Date();
                    const warningDate = new Date();
                    warningDate.setDate(today.getDate() + 30); // 30 gün içinde süresi dolacaklar
                    setExpiringItems(inv.filter((i: any) => i.expiration_date && new Date(i.expiration_date) <= warningDate));
                }

                // Bugünkü Randevular
                const today = new Date().toISOString().split('T')[0];
                const { data: apts } = await supabase.from('appointments')
                    .select('*')
                    .eq('date', today)
                    .order('time', { ascending: true });
                if (apts) {
                    setUpcomingAppointments(apts);
                    const currentHour = new Date().getHours();
                    setDelayedAppointments(apts.filter((a: any) => (a.status === 'pending' || !a.status) && parseInt(a.time) < currentHour));
                }

                // Toplam Alacak (Bekleyen Ödemeler)
                const { data: pendingTrx } = await supabase.from('transactions')
                    .select('amount')
                    .eq('status', 'pending');
                if (pendingTrx) {
                    setTotalReceivables(pendingTrx.filter((t: any) => t.category !== 'expense').reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0));
                }

                // Son İşlemler
                const { data: trxs } = await supabase.from('transactions')
                    .select('*')
                    .order('date', { ascending: false })
                    .limit(5);
                if (trxs) setRecentTransactions(trxs);

                // Grafik Verileri
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(endDate.getDate() - 6);

                const { data: trxData } = await supabase.from('transactions')
                    .select('amount, date')
                    .gte('date', startDate.toISOString())
                    .lte('date', endDate.toISOString());

                const { data: aptData } = await supabase.from('appointments')
                    .select('date')
                    .gte('date', startDate.toISOString())
                    .lte('date', endDate.toISOString());

                const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
                const revenue = new Array(7).fill(0);
                const appointments = new Array(7).fill(0);
                const labels = new Array(7).fill('');

                for (let i = 0; i < 7; i++) {
                    const d = new Date(startDate);
                    d.setDate(d.getDate() + i);
                    const dateStr = d.toISOString().split('T')[0];
                    labels[i] = days[d.getDay()];

                    if (trxData) revenue[i] = trxData.filter((t: any) => t.date.startsWith(dateStr)).reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0) / 1000; // k ₺
                    if (aptData) appointments[i] = aptData.filter((a: any) => a.date.startsWith(dateStr)).length;
                }
                setChartData({ revenue, appointments, labels });

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
            {/* Geciken Randevular Uyarısı */}
            {delayedAppointments.length > 0 && (
                <div className="bg-orange-50 border border-orange-100 p-6 rounded-[32px] flex items-start gap-4 animate-pulse shadow-lg shadow-orange-100/50">
                    <span className="material-symbols-outlined text-orange-500 text-4xl">schedule</span>
                    <div>
                        <h3 className="font-extrabold text-orange-700 text-xl mb-2">Geciken Randevular</h3>
                        <p className="text-orange-600 text-sm font-medium mb-3">Bugün saati geçen ve henüz işlem yapılmamış randevular:</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {delayedAppointments.map(a => (
                                <li key={a.id} className="flex items-center gap-2 text-orange-700 text-sm font-bold"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> {a.time}:00 - {a.patient_name || 'İsimsiz'} ({a.treatment})</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {/* Stok Uyarısı */}
            {expiringItems.length > 0 && (
                <div className="bg-red-50 border border-red-100 p-6 rounded-[32px] flex items-start gap-4 animate-pulse shadow-lg shadow-red-100/50">
                    <span className="material-symbols-outlined text-red-500 text-4xl">warning</span>
                    <div>
                        <h3 className="font-extrabold text-red-700 text-xl mb-2">Kritik Stok Uyarısı!</h3>
                        <p className="text-red-600 text-sm font-medium mb-3">Aşağıdaki ürünlerin son kullanma tarihi yaklaşıyor veya geçmiş:</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {expiringItems.map(i => (
                                <li key={i.id} className="flex items-center gap-2 text-red-700 text-sm font-bold"><span className="w-2 h-2 bg-red-500 rounded-full"></span> {i.name} ({new Date(i.expiration_date).toLocaleDateString()}) - Stok: {i.quantity} {i.unit}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Klinik Paneli</h1>
                <Badge status="active" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Toplam Hasta', value: stats.pts, icon: 'group', color: 'bg-blue-500', link: '/admin/patients' },
                    { label: 'Güncel Randevular', value: stats.apts, icon: 'event', color: 'bg-primary', link: '/admin/calendar' },
                    { label: 'Mali İşlemler', value: stats.trx, icon: 'payments', color: 'bg-green-500', link: '/admin/finance' },
                    { label: 'Toplam Alacak', value: `${totalReceivables} ₺`, icon: 'account_balance_wallet', color: 'bg-orange-500', link: '/admin/finance?status=pending' }
                ].map(s => (
                    <div key={s.label} onClick={() => navigate(s.link)} className="cursor-pointer">
                        <Card className="p-10 flex items-center justify-between border-none shadow-xl shadow-gray-200/50 hover:scale-105 transition-transform">
                            <div>
                                <p className="text-gray-400 font-extrabold text-xs uppercase tracking-widest">{s.label}</p>
                                <h3 className="text-4xl font-extrabold mt-2 text-gray-900">{loading ? '...' : s.value}</h3>
                            </div>
                            <div className={`w-16 h-16 rounded-2xl ${s.color} text-white flex items-center justify-center shadow-lg`}>
                                <span className="material-symbols-outlined text-3xl">{s.icon}</span>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Detaylı Grafikler Bölümü */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8 border-none shadow-xl rounded-[32px]">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-green-500">show_chart</span> Gelir Analizi (Son 7 Gün)</h3>
                    <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-l border-gray-100 pb-2">
                        {chartData.revenue.map((h, i) => (
                            <div key={i} className="w-full bg-green-500/20 rounded-t-xl relative group hover:bg-green-500 transition-colors" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{h}k ₺</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-bold text-gray-400 uppercase">
                        {chartData.labels.map((d, i) => <span key={i}>{d}</span>)}
                    </div>
                </Card>

                <Card className="p-8 border-none shadow-xl rounded-[32px]">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-primary">bar_chart</span> Randevu Yoğunluğu</h3>
                    <div className="h-64 flex items-end justify-between gap-4 px-4 border-b border-l border-gray-100 pb-2">
                        {chartData.appointments.map((h, i) => (
                            <div key={i} className="w-full bg-primary rounded-t-xl relative group hover:opacity-80 transition-opacity" style={{ height: `${h * 3}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{h} Hasta</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-bold text-gray-400 uppercase">
                        {chartData.labels.map((d, i) => <span key={i}>{d}</span>)}
                    </div>
                </Card>
            </div>

            {/* Özet ve Akış Bölümü */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bugünkü Randevular */}
                <Card className="lg:col-span-2 p-8 border-none shadow-xl rounded-[32px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">calendar_today</span> Bugünkü Randevular
                        </h3>
                        <Button variant="outline" size="sm" onClick={() => navigate('/admin/calendar')}>Tümünü Gör</Button>
                    </div>
                    <div className="space-y-4">
                        {upcomingAppointments.length === 0 ? (
                            <p className="text-gray-400 text-sm">Bugün için randevu bulunamadı.</p>
                        ) : (
                            upcomingAppointments.map((apt: any) => {
                                const isLate = (apt.status === 'pending' || !apt.status) && parseInt(apt.time) < new Date().getHours();
                                return (
                                    <div key={apt.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${isLate ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100 hover:border-primary/30'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shadow-sm font-bold border ${isLate ? 'bg-white text-red-500 border-red-100' : 'bg-white text-primary border-slate-100'}`}>
                                                <span className="material-symbols-outlined text-2xl">person</span>
                                            </div>
                                            <div>
                                                <h4 className={`font-bold ${isLate ? 'text-red-900' : 'text-slate-900'}`}>{apt.patient_name || 'İsimsiz Hasta'}</h4>
                                                <p className={`text-xs font-medium ${isLate ? 'text-red-500' : 'text-slate-500'}`}>{apt.treatment}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <p className={`font-extrabold ${isLate ? 'text-red-900' : 'text-slate-900'}`}>{apt.time}:00</p>
                                            <div className="flex items-center gap-2">
                                                {apt.status === 'completed' && <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">Geldi</span>}
                                                {apt.status === 'cancelled' && <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">İptal</span>}
                                                {(apt.status === 'pending' || !apt.status) && (
                                                    isLate ? 
                                                    <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded animate-pulse">Gecikti</span> :
                                                    <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">Bekliyor</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Card>

                {/* Son İşlemler / Özet */}
                <Card className="p-8 border-none shadow-xl rounded-[32px] bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                    <h3 className="text-xl font-extrabold mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-yellow-400">history</span> Son İşlemler
                    </h3>
                    <div className="space-y-6">
                        {recentTransactions.map((trx: any) => (
                            <div key={trx.id} className="flex justify-between items-center border-b border-white/10 pb-4 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-bold text-sm">{trx.patient}</p>
                                    <p className="text-xs text-slate-400">{trx.type}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-yellow-400">+{trx.amount} ₺</p>
                                    <p className="text-[10px] text-slate-500">{new Date(trx.date).toLocaleDateString('tr-TR')}</p>
                                </div>
                            </div>
                        ))}
                        {recentTransactions.length === 0 && <p className="text-slate-500 text-sm">İşlem bulunamadı.</p>}
                    </div>
                    <button onClick={() => navigate('/admin/finance')} className="w-full mt-8 py-4 bg-white/10 rounded-2xl font-bold text-sm hover:bg-white/20 transition-colors">Finans Raporuna Git</button>
                </Card>
            </div>
        </div>
    );
};

export const PatientsPage: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ full_name: '', phone: '' });
    
    // Detay Görünümü ve Arama için State'ler
    const [search, setSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [activeTab, setActiveTab] = useState('genel');
    const [patientDetails, setPatientDetails] = useState<{appointments: any[], transactions: any[]}>({ appointments: [], transactions: [] });
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({ full_name: '', phone: '' });
    const [patientFiles, setPatientFiles] = useState<any[]>([]);
    const [previewFile, setPreviewFile] = useState<any>(null);
    const [showDebtors, setShowDebtors] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                // Supabase'den verileri çek
                const { data, error } = await supabase.from('patients').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                setPatients(data || []);
            } catch (error) {
                console.error("Supabase bağlantı hatası, yerel veriler yükleniyor:", error);
                const data = await db.patients.getAll();
                setPatients(data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Detay verilerini çek
    useEffect(() => {
        if (selectedPatient) {
            const fetchDetails = async () => {
                setEditData({ full_name: selectedPatient.full_name, phone: selectedPatient.phone });
                const { data: apts } = await supabase.from('appointments').select('*').eq('patient_id', selectedPatient.id);
                const { data: trxs } = await supabase.from('transactions').select('*').eq('patient_id', selectedPatient.id);
                const { data: files } = await supabase.from('patient_files').select('*').eq('patient_id', selectedPatient.id);
                setPatientDetails({
                    appointments: apts || [],
                    transactions: trxs || []
                });
                setPatientFiles(files || []);
            };
            fetchDetails();
        }
    }, [selectedPatient]);

    const handleUpdatePatient = async () => {
        if (!selectedPatient) return;
        const { error } = await supabase.from('patients').update({
            full_name: editData.full_name,
            phone: editData.phone
        }).eq('id', selectedPatient.id);

        if (!error) {
            setPatients(patients.map(p => p.id === selectedPatient.id ? { ...p, ...editData } : p));
            setSelectedPatient({ ...selectedPatient, ...editData });
            setEditMode(false);
        } else {
            alert('Güncelleme hatası: ' + error.message);
        }
    };

    const handleSave = async () => {
        if (!formData.full_name) return;
        
        const { data, error } = await supabase.from('patients').insert([{
            full_name: formData.full_name,
            phone: formData.phone,
            status: 'active',
            avatar_url: `https://ui-avatars.com/api/?name=${formData.full_name}&background=random`
        }]).select();

        if (data) {
            setPatients([data[0] as any, ...patients]);
            setShowModal(false);
            setFormData({ full_name: '', phone: '' });
        } else if (error) {
            alert("Kayıt sırasında hata oluştu: " + error.message);
        }
    };

    const filteredPatients = patients.filter(p => 
        (p.full_name.toLowerCase().includes(search.toLowerCase()) || 
        p.phone.includes(search)) &&
        (!showDebtors || (p as any).balance > 0)
    );

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !selectedPatient) return;
        const file = e.target.files[0];
        // Dosya ismindeki özel karakterleri temizle
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const fileName = `${selectedPatient.id}/${Date.now()}_${sanitizedName}`;

        // 1. Storage'a Yükle
        const { data: uploadData, error: uploadError } = await supabase.storage.from('patient-files').upload(fileName, file);
        
        if (uploadError) {
            console.error('Upload Error:', uploadError);
            let msg = 'Dosya yüklenirken hata: ' + uploadError.message;
            if (uploadError.message.includes('Bucket not found')) {
                msg += '\n\nEKSİK AYAR: Supabase panelinde "Storage" kısmından "patient-files" adında yeni bir Public Bucket oluşturmalısınız.';
            }
            alert(msg);
            return;
        }

        // 2. Veritabanına Kaydet
        const { data: dbData, error: dbError } = await supabase.from('patient_files').insert([{
            patient_id: selectedPatient.id,
            file_name: file.name,
            file_url: uploadData.path, // veya publicUrl
            file_type: file.name.split('.').pop()
        }]).select();

        if (dbError) {
            console.error('Database Error:', dbError);
            alert('Veritabanı kayıt hatası: ' + dbError.message + '\n\nEKSİK AYAR: Supabase SQL Editöründe "patient_files" tablosu için RLS politikası oluşturmalısınız.');
            return;
        }

        if (dbData) setPatientFiles([...patientFiles, dbData[0]]);
    };

    const handleDeleteFile = async (file: any) => {
        if (!confirm('Bu dosyayı silmek istediğinize emin misiniz?')) return;

        // 1. Storage'dan sil
        const { error: storageError } = await supabase.storage.from('patient-files').remove([file.file_url]);
        
        if (storageError) {
            alert('Dosya silinirken hata: ' + storageError.message);
            return;
        }

        // 2. Veritabanından sil
        const { error: dbError } = await supabase.from('patient_files').delete().eq('id', file.id);

        if (dbError) alert('Veritabanı silme hatası: ' + dbError.message);
        else setPatientFiles(patientFiles.filter(f => f.id !== file.id));
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            {/* Dosya Önizleme Modalı */}
            {previewFile && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setPreviewFile(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] relative flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                            <h3 className="font-bold text-gray-900 truncate">{previewFile.file_name}</h3>
                            <button onClick={() => setPreviewFile(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 overflow-auto">
                            {['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(previewFile.file_type?.toLowerCase()) ? (
                                <img src={supabase.storage.from('patient-files').getPublicUrl(previewFile.file_url).data.publicUrl} className="max-w-full max-h-full object-contain shadow-lg" alt="Preview" />
                            ) : previewFile.file_type?.toLowerCase() === 'pdf' ? (
                                <iframe src={supabase.storage.from('patient-files').getPublicUrl(previewFile.file_url).data.publicUrl} className="w-full h-full rounded-lg shadow-lg" title="PDF Preview" />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <span className="material-symbols-outlined text-6xl mb-4">visibility_off</span>
                                    <p className="font-bold">Bu dosya formatı önizlenemiyor.</p>
                                    <p className="text-sm mt-2">Lütfen dosyayı indirin veya ilgili görüntüleyiciyi kullanın.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Hasta Detay Modalı (Full Screen Overlay) */}
            {selectedPatient && (
                <div className="fixed inset-0 z-[150] bg-gray-50 animate-fade-in overflow-y-auto">
                    <div className="max-w-7xl mx-auto p-6 md:p-10 flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button icon="arrow_back" variant="outline" onClick={() => setSelectedPatient(null)}>Geri Dön</Button>
                                <h1 className="text-3xl font-extrabold text-gray-900">{selectedPatient.full_name}</h1>
                            </div>
                            <div className="flex gap-2">
                                <Button icon="edit" variant={editMode ? 'primary' : 'secondary'} onClick={() => editMode ? handleUpdatePatient() : setEditMode(true)}>{editMode ? 'Kaydet' : 'Düzenle'}</Button>
                                <Button icon="delete" variant="danger">Sil</Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Sol Panel: Profil Kartı */}
                            <div className="lg:col-span-4 space-y-6">
                                <Card className="p-8 flex flex-col items-center text-center border-none shadow-xl rounded-[32px]">
                                    <img src={selectedPatient.avatar_url} className="w-32 h-32 rounded-full mb-6 shadow-lg" alt="" />
                                    {editMode ? (
                                        <div className="w-full space-y-3 mb-4">
                                            <input value={editData.full_name} onChange={e => setEditData({...editData, full_name: e.target.value})} className="w-full p-2 border rounded-lg text-center font-bold" />
                                            <input value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} className="w-full p-2 border rounded-lg text-center text-sm" />
                                        </div>
                                    ) : (
                                        <><h2 className="text-2xl font-bold text-gray-900">{selectedPatient.full_name}</h2>
                                        <p className="text-gray-500 font-medium mb-4">{selectedPatient.phone}</p></>
                                    )}
                                    <Badge status={selectedPatient.status} />
                                    <div className="w-full grid grid-cols-2 gap-3 mt-8">
                                        <Button className="w-full" icon="call" variant="secondary">Ara</Button>
                                        <Button className="w-full" icon="mail" variant="secondary">SMS</Button>
                                    </div>
                                </Card>
                                <Card className="p-6 border-none shadow-lg rounded-[24px]">
                                    <h3 className="font-bold text-gray-900 mb-4">Hızlı Notlar</h3>
                                    <textarea className="w-full bg-yellow-50/50 p-4 rounded-xl text-sm resize-none border-none focus:ring-2 focus:ring-yellow-200" rows={4} placeholder="Hasta hakkında notlar..." />
                                </Card>
                            </div>

                            {/* Sağ Panel: Sekmeler ve İçerik */}
                            <div className="lg:col-span-8">
                                <div className="bg-white rounded-[32px] shadow-xl p-8 min-h-[600px]">
                                    <div className="flex gap-2 border-b border-gray-100 mb-8 overflow-x-auto">
                                        {[
                                            { id: 'genel', label: 'Genel Bakış', icon: 'dashboard' },
                                            { id: 'muayene', label: 'Muayene & Tedavi', icon: 'medical_services' },
                                            { id: 'finans', label: 'Ödeme Geçmişi', icon: 'payments' },
                                            { id: 'dosyalar', label: 'Dosyalar & Röntgen', icon: 'folder' }
                                        ].map(tab => (
                                            <button 
                                                key={tab.id} 
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all whitespace-nowrap border-b-2 ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                            >
                                                <span className="material-symbols-outlined">{tab.icon}</span>
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    {activeTab === 'genel' && (
                                        <div className="space-y-6 animate-fade-in">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-6 bg-blue-50 rounded-2xl">
                                                    <p className="text-xs font-bold text-blue-400 uppercase">Toplam Randevu</p>
                                                    <p className="text-3xl font-extrabold text-blue-900">{patientDetails.appointments.length}</p>
                                                </div>
                                                <div className="p-6 bg-green-50 rounded-2xl">
                                                    <p className="text-xs font-bold text-green-400 uppercase">Toplam Harcama</p>
                                                    <p className="text-3xl font-extrabold text-green-900">
                                                        {patientDetails.transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0)} ₺
                                                    </p>
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-lg mt-4">Son Randevular</h4>
                                            {patientDetails.appointments.length > 0 ? (
                                                <div className="space-y-3">
                                                    {patientDetails.appointments.slice(0, 3).map((apt: any, i) => (
                                                        <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                                            <div>
                                                                <p className="font-bold text-gray-900">{apt.treatment || 'Genel Muayene'}</p>
                                                                <p className="text-xs text-gray-500">{new Date(apt.date).toLocaleDateString('tr-TR')}</p>
                                                            </div>
                                                            <Badge status={apt.status || 'pending'} />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-400 text-sm">Kayıtlı randevu bulunamadı.</p>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'muayene' && (
                                        <div className="space-y-4 animate-fade-in">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-bold text-lg">Tedavi Geçmişi</h3>
                                                <Button size="sm" icon="add">Yeni Muayene</Button>
                                            </div>
                                            <Odontogram patientId={selectedPatient.id} />
                                        </div>
                                    )}

                                    {activeTab === 'finans' && (
                                        <div className="space-y-4 animate-fade-in">
                                            <table className="w-full text-left">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase">İşlem</th>
                                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase">Tarih</th>
                                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase text-right">Tutar</th>
                                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase">Durum</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {patientDetails.transactions.map((t: any, i) => (
                                                        <tr key={i} className="border-b border-gray-50">
                                                            <td className="p-4 font-bold text-gray-900">{t.type}</td>
                                                            <td className="p-4 text-sm text-gray-500">{new Date(t.date).toLocaleDateString('tr-TR')}</td>
                                                            <td className="p-4 text-right font-bold">{t.amount} ₺</td>
                                                            <td className="p-4"><Badge status={t.status} /></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {activeTab === 'dosyalar' && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
                                            <label className="aspect-square bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 hover:border-primary hover:text-primary cursor-pointer transition-colors relative">
                                                <input type="file" accept=".dcm,.jpg,.jpeg,.png,.gif,.bmp,.webp,.pdf,image/*" className="hidden" onChange={handleFileUpload} />
                                                <span className="material-symbols-outlined text-3xl">upload_file</span>
                                                <span className="text-xs font-bold mt-2">Dosya Yükle</span>
                                                <span className="text-[10px] mt-1 text-gray-300">.dcm, .pdf, .img</span>
                                            </label>
                                            
                                            {patientFiles.map((file) => (
                                                <div key={file.id} onClick={() => setPreviewFile(file)} className="aspect-square bg-gray-900 rounded-2xl relative group overflow-hidden cursor-pointer border border-gray-200 hover:ring-2 hover:ring-primary/50 transition-all">
                                                    {file.file_type === 'dcm' ? (
                                                        <div className="w-full h-full flex items-center justify-center bg-black text-white">
                                                            <span className="material-symbols-outlined text-4xl">radiology</span>
                                                        </div>
                                                    ) : (
                                                        <img src={supabase.storage.from('patient-files').getPublicUrl(file.file_url).data.publicUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="file" />
                                                    )}
                                                    <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/90 to-transparent">
                                                        <p className="text-white text-xs font-bold truncate">{file.file_name}</p>
                                                        <p className="text-[9px] text-gray-400">{new Date(file.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteFile(file); }} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Yeni Hasta Kaydı</h3>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Ad Soyad</label>
                                <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold outline-none focus:bg-white focus:border-primary transition-all" placeholder="Ad Soyad" autoFocus />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Telefon</label>
                                <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold outline-none focus:bg-white focus:border-primary transition-all" placeholder="05XX XXX XX XX" />
                            </div>
                            <div className="flex gap-3 mt-4">
                                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>İptal</Button>
                                <Button className="flex-1" onClick={handleSave}>Kaydet</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Hastalar</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Hasta Ara..." className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-primary w-64" />
                    </div>
                    <button onClick={() => setShowDebtors(!showDebtors)} className={`px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${showDebtors ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        {showDebtors ? 'Tümü' : 'Bakiyesi Olanlar'}
                    </button>
                    <Button icon="person_add" onClick={() => setShowModal(true)}>Yeni Hasta</Button>
                </div>
            </div>
            {loading ? (
                <div className="p-20 text-center text-gray-400">Yükleniyor...</div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filteredPatients.map(p => (
                        <div key={p.id} onClick={() => setSelectedPatient(p)} className="cursor-pointer">
                            <Card className="p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary font-extrabold text-lg border border-primary/10">
                                        {p.full_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">{p.full_name}</h3>
                                            {(p as any).balance > 0 && <span className="material-symbols-outlined text-red-500 text-sm animate-pulse" title="Ödeme Bekliyor">warning</span>}
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium">{p.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                     {(p as any).balance > 0 && <p className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-lg">Bakiye: {(p as any).balance} ₺</p>}
                                     <Badge status={p.status} />
                                     <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const FinancePage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ id: '', patient: '', patient_id: '', type: '', amount: '', status: 'paid', date: '' });
    const location = useLocation();
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');
    
    // Arama State'leri
    const [patientResults, setPatientResults] = useState<Patient[]>([]);
    const [showPatientResults, setShowPatientResults] = useState(false);
    const [treatmentResults, setTreatmentResults] = useState<TreatmentItem[]>([]);
    const [showTreatmentResults, setShowTreatmentResults] = useState(false);
    
    useEffect(() => {
        const load = async () => {
            try {
                const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
                if (error) throw error;
                setTransactions(data as any || []);
            } catch (error) {
                console.error("Finans verileri yüklenemedi, yerel veri kullanılıyor:", error);
                const data = await db.transactions.getAll();
                setTransactions(data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('status') === 'pending') {
            setFilterStatus('pending');
        } else {
            setFilterStatus('all');
        }
    }, [location]);

    const handlePatientSearch = async (val: string) => {
        setFormData({ ...formData, patient: val });
        if (val.length > 1) {
            const { data } = await supabase.from('patients').select('*').ilike('full_name', `%${val}%`);
            setPatientResults(data || []);
            setShowPatientResults(true);
        } else {
            setShowPatientResults(false);
        }
    };

    const handleTreatmentSearch = async (val: string) => {
        setFormData({ ...formData, type: val });
        if (val.length > 1) {
            const { data } = await supabase.from('treatments').select('*').ilike('name', `%${val}%`);
            setTreatmentResults(data || []);
            setShowTreatmentResults(true);
        } else {
            setShowTreatmentResults(false);
        }
    };

    const handleEdit = (t: any) => {
        setFormData({
            id: t.id,
            patient: typeof t.patient === 'object' ? t.patient?.full_name : t.patient,
            patient_id: t.patient_id || '',
            type: t.type,
            amount: t.amount,
            status: t.status,
            date: t.date ? t.date.split('T')[0] : ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu işlemi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;
        
        const { error } = await supabase.from('transactions').delete().eq('id', id);
        
        if (error) alert('Silme hatası: ' + error.message);
        else setTransactions(transactions.filter(t => t.id !== id));
    };

    const handleSave = async () => {
        if (!formData.patient || !formData.amount) return;
        
        const transactionDate = formData.date ? new Date(formData.date).toISOString() : new Date().toISOString();

        if (formData.id) {
            // Güncelleme (Update)
            const { error } = await supabase.from('transactions').update({
                patient: formData.patient,
                patient_id: formData.patient_id || null,
                type: formData.type,
                amount: Number(formData.amount),
                status: formData.status,
                category: activeTab,
                date: transactionDate
            }).eq('id', formData.id);

            if (error) {
                alert('Güncelleme hatası: ' + error.message);
                return;
            }
            
            // State güncelleme
            setTransactions(transactions.map(t => t.id === formData.id ? { ...t, ...formData, amount: Number(formData.amount), date: transactionDate } : t));
        } else {
            // Yeni Kayıt (Insert)
            const newTransaction = {
                patient_id: formData.patient_id || null,
                patient: formData.patient,
                type: formData.type,
                amount: Number(formData.amount),
                status: formData.status,
                date: transactionDate,
                category: activeTab
            };
            
            const { data, error } = await supabase.from('transactions').insert([newTransaction]).select();
            
            if (error) alert('Kayıt hatası: ' + error.message);
            else if (data) setTransactions([data[0] as any, ...transactions]);
        }

        setShowModal(false);
        setFormData({ id: '', patient: '', patient_id: '', type: '', amount: '', status: 'paid', date: '' });
    };

    const filteredTransactions = transactions.filter(t => {
        const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
        if (!matchesStatus) return false;

        // Kategori Filtresi
        const tCategory = (t as any).category || 'income';
        if (tCategory !== activeTab) return false;

        const tDate = new Date(t.date);
        const now = new Date();
        if (dateFilter === 'today') return tDate.toDateString() === now.toDateString();
        if (dateFilter === 'week') return tDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (dateFilter === 'month') return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
        
        return true;
    });

    const totalAmount = filteredTransactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex gap-4 border-b border-gray-100 pb-4">
                <button onClick={() => setActiveTab('income')} className={`text-lg font-bold px-4 py-2 rounded-xl transition-all ${activeTab === 'income' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'text-gray-400 hover:bg-gray-50'}`}>Gelirler</button>
                <button onClick={() => setActiveTab('expense')} className={`text-lg font-bold px-4 py-2 rounded-xl transition-all ${activeTab === 'expense' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'text-gray-400 hover:bg-gray-50'}`}>Giderler</button>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-6">{formData.id ? 'İşlemi Düzenle' : (activeTab === 'income' ? 'Yeni Gelir Girişi' : 'Yeni Gider Girişi')}</h3>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">{activeTab === 'income' ? 'Hasta Ara' : 'Açıklama / Cari'}</label>
                                <div className="relative">
                                    <input value={formData.patient} onChange={e => activeTab === 'income' ? handlePatientSearch(e.target.value) : setFormData({...formData, patient: e.target.value})} className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold outline-none focus:bg-white focus:border-primary transition-all" placeholder={activeTab === 'income' ? "İsim yazın..." : "Örn: Kira Ödemesi"} autoFocus />
                                    {activeTab === 'income' && showPatientResults && patientResults.length > 0 && (
                                        <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-xl mt-2 max-h-40 overflow-y-auto z-10 border border-gray-100">
                                            {patientResults.map(p => (
                                                <div key={p.id} onClick={() => { setFormData({ ...formData, patient: p.full_name, patient_id: p.id }); setShowPatientResults(false); }} className="p-3 hover:bg-gray-50 cursor-pointer font-bold text-sm text-gray-700 border-b border-gray-50 last:border-0">
                                                    {p.full_name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">{activeTab === 'income' ? 'İşlem / Tedavi Seç' : 'Gider Tipi'}</label>
                                <div className="relative">
                                    <input value={formData.type} onChange={e => activeTab === 'income' ? handleTreatmentSearch(e.target.value) : setFormData({...formData, type: e.target.value})} className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold outline-none focus:bg-white focus:border-primary transition-all" placeholder={activeTab === 'income' ? "İşlem adı..." : "Örn: Sabit Gider"} />
                                    {activeTab === 'income' && showTreatmentResults && treatmentResults.length > 0 && (
                                        <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-xl mt-2 max-h-40 overflow-y-auto z-10 border border-gray-100">
                                            {treatmentResults.map(t => (
                                                <div key={t.id} onClick={() => { 
                                                    setFormData({ ...formData, type: t.name, amount: t.price.toString() }); 
                                                    setShowTreatmentResults(false); 
                                                }} className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-0">
                                                    <span className="font-bold text-sm text-gray-700">{t.name}</span>
                                                    <span className="text-xs font-extrabold text-primary">{t.price} ₺</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col gap-2 flex-1">
                                    <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Tutar (₺)</label>
                                    <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold outline-none focus:bg-white focus:border-primary transition-all" placeholder="0.00" />
                                </div>
                                <div className="flex flex-col gap-2 flex-1">
                                    <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Tarih</label>
                                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold outline-none focus:bg-white focus:border-primary transition-all h-[60px]" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Durum</label>
                                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold outline-none focus:bg-white focus:border-primary transition-all">
                                    <option value="paid">Ödendi</option>
                                    <option value="pending">Bekliyor</option>
                                    <option value="cancelled">İptal</option>
                                </select>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>İptal</Button>
                                <Button className="flex-1" onClick={handleSave}>Kaydet</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Finans Yönetimi</h1>
                <div className="flex gap-2">
                    <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-primary cursor-pointer">
                        <option value="all">Tüm Zamanlar</option>
                        <option value="today">Bugün</option>
                        <option value="week">Bu Hafta</option>
                        <option value="month">Bu Ay</option>
                    </select>
                    {filterStatus === 'pending' && (
                        <button onClick={() => { setFilterStatus('all'); navigate('/admin/finance'); }} className="px-4 py-2 bg-orange-100 text-orange-600 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-orange-200 transition-colors">
                            <span className="material-symbols-outlined text-sm">filter_list</span> Bekleyenler
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    )}
                    <Button icon="add_card" onClick={() => { setFormData({ id: '', patient: '', patient_id: '', type: '', amount: '', status: 'paid', date: new Date().toISOString().split('T')[0] }); setShowModal(true); }}>{activeTab === 'income' ? 'Gelir Ekle' : 'Gider Ekle'}</Button>
                </div>
            </div>
            <Card className="border-none shadow-xl shadow-gray-200/50 rounded-[32px] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-6 text-xs font-extrabold text-gray-400 uppercase tracking-widest">{activeTab === 'income' ? 'Hasta' : 'Açıklama'}</th>
                            <th className="p-6 text-xs font-extrabold text-gray-400 uppercase tracking-widest">{activeTab === 'income' ? 'İşlem' : 'Kategori'}</th>
                            <th className="p-6 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Tarih</th>
                            <th className="p-6 text-xs font-extrabold text-gray-400 uppercase tracking-widest text-right">Tutar</th>
                            <th className="p-6 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Durum</th>
                            <th className="p-6 text-xs font-extrabold text-gray-400 uppercase tracking-widest"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan={4} className="p-10 text-center text-gray-400">Yükleniyor...</td></tr>
                        ) : (
                            filteredTransactions.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6 font-bold text-gray-900">{(t as any).patient?.full_name || t.patient}</td>
                                    <td className="p-6 text-sm text-gray-500 font-medium">{t.type}</td>
                                    <td className="p-6 text-xs text-gray-400 font-bold">{t.date ? new Date(t.date).toLocaleDateString('tr-TR') : '-'}</td>
                                    <td className={`p-6 text-right font-extrabold ${activeTab === 'income' ? 'text-green-600' : 'text-red-600'}`}>{t.amount} ₺</td>
                                    <td className="p-6"><Badge status={t.status} /></td>
                                    <td className="p-6 text-right flex justify-end gap-2">
                                        <button onClick={() => handleEdit(t)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-primary transition-colors" title="Düzenle">
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                        <button onClick={() => handleDelete(t.id)} className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors" title="Sil">
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-100">
                        <tr>
                            <td colSpan={3} className="p-6 text-right text-xs font-extrabold text-gray-400 uppercase tracking-widest">{activeTab === 'income' ? 'Toplam Gelir' : 'Toplam Gider'}</td>
                            <td className={`p-6 text-right font-extrabold text-xl ${activeTab === 'income' ? 'text-green-600' : 'text-red-600'}`}>{totalAmount} ₺</td>
                            <td colSpan={2}></td>
                        </tr>
                    </tfoot>
                </table>
            </Card>
        </div>
    );
};

export const TreatmentsAdminPage: React.FC = () => {
    const [treatments, setTreatments] = useState<TreatmentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<Partial<TreatmentItem>>({});
    const [activeTab, setActiveTab] = useState<'treatments' | 'stock'>('treatments');
    
    // Stok State'leri
    const [stocks, setStocks] = useState<any[]>([]);
    const [stockForm, setStockForm] = useState({ name: '', category: 'Sarf Malzeme', quantity: 0, unit: 'adet', min_level: 10, expiration_date: '', barcode: '' });
    const [stockSearch, setStockSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tümü');
    
    useEffect(() => {
        const load = async () => {
            try {
                const { data: tData } = await supabase.from('treatments').select('*');
                const { data: sData } = await supabase.from('inventory').select('*'); // Stok tablosu varsayımı
                if (tData) setTreatments(tData);
                if (sData) setStocks(sData);
            } catch (error) {
                console.error("Tedaviler yüklenemedi:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleAddNew = () => {
        setFormData({ name: '', category: 'Genel Diş', duration: '30 dk', price: 0 });
        setShowModal(true);
    };

    const handleEdit = (t: TreatmentItem) => {
        setFormData(t);
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bu tedaviyi silmek istediğinize emin misiniz?')) {
            await supabase.from('treatments').delete().eq('id', id);
            setTreatments(treatments.filter(t => t.id !== id));
        }
    };

    const handleSave = async () => {
        if (!formData.name) return;
        
        if (formData.id) {
            const { error } = await supabase.from('treatments').update(formData).eq('id', formData.id);
            if (!error) {
                setTreatments(treatments.map(t => t.id === formData.id ? { ...t, ...formData } as TreatmentItem : t));
            }
        } else {
            const { data, error } = await supabase.from('treatments').insert([{
                name: formData.name,
                category: formData.category || 'Genel',
                duration: formData.duration || '30 dk',
                price: Number(formData.price) || 0
            }]).select();

            if (error) alert('Tedavi eklenirken hata: ' + error.message);

            if (data) {
                setTreatments([...treatments, data[0] as any]);
            }
            // Fallback for local dev if supabase fails/not connected properly
            const newTreatment = {
                id: Math.random().toString(36).substr(2, 9),
                name: formData.name!,
                category: formData.category || 'Genel',
                duration: formData.duration || '30 dk',
                price: Number(formData.price) || 0
            };
            if (error) {
                 // Demo amaçlı fallback, gerçekte hata gösterilmeli
                 setTreatments([...treatments, newTreatment]);
            }
        }
        setShowModal(false);
    };

    const handleStockSave = async () => {
        if (!stockForm.name) return;
        
        const payload = { ...stockForm, quantity: Number(stockForm.quantity), min_level: Number(stockForm.min_level), expiration_date: stockForm.expiration_date || null };
        const { data, error } = await supabase.from('inventory').insert([payload]).select();
        
        if (data) {
            setStocks([...stocks, data[0]]);
        } else if (error) {
            // Supabase hatası durumunda (tablo yoksa vb.) kullanıcıya bildir veya yerel state'e ekle (demo amaçlı)
            console.error("Stok kaydı hatası:", error);
            alert("Stok veritabanına kaydedilemedi: " + error.message);
            setStocks([...stocks, { ...payload, id: Math.random().toString(36).substr(2, 9) }]);
        }
        setStockForm({ name: '', category: 'Sarf Malzeme', quantity: 0, unit: 'adet', min_level: 10, expiration_date: '', barcode: '' });
    };

    const deleteStock = async (id: string) => {
        await supabase.from('inventory').delete().eq('id', id);
        setStocks(stocks.filter(s => s.id !== id));
    };

    const categories = ['Tümü', 'Sarf Malzeme', 'İlaç', 'Cihaz', 'Protez', 'Kırtasiye'];

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex gap-4 border-b border-gray-100 pb-4">
                <button onClick={() => setActiveTab('treatments')} className={`text-lg font-bold px-4 py-2 rounded-xl transition-all ${activeTab === 'treatments' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-400 hover:bg-gray-50'}`}>Tedaviler</button>
                <button onClick={() => setActiveTab('stock')} className={`text-lg font-bold px-4 py-2 rounded-xl transition-all ${activeTab === 'stock' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-400 hover:bg-gray-50'}`}>Stok Yönetimi</button>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-6">{formData.id ? 'Tedavi Düzenle' : 'Yeni Tedavi'}</h3>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Tedavi Adı</label>
                                <input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold outline-none focus:bg-white focus:border-primary transition-all" placeholder="Örn: Diş Taşı Temizliği" autoFocus />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col gap-2 flex-1">
                                    <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Kategori</label>
                                    <input value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold outline-none focus:bg-white focus:border-primary transition-all" placeholder="Kategori" />
                                </div>
                                <div className="flex flex-col gap-2 flex-1">
                                    <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Fiyat (₺)</label>
                                    <input type="number" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold outline-none focus:bg-white focus:border-primary transition-all" placeholder="0.00" />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>İptal</Button>
                                <Button className="flex-1" onClick={handleSave}>Kaydet</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'treatments' ? (
                <>
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Tedavi Listesi</h1>
                        <Button icon="add_circle" onClick={handleAddNew}>Yeni Tedavi Tanımla</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading ? (
                            <div className="col-span-2 p-10 text-center text-gray-400">Yükleniyor...</div>
                        ) : (
                            treatments.map(t => (
                                <Card key={t.id} className="p-8 border-none shadow-xl shadow-gray-200/50 rounded-[32px] group hover:bg-primary transition-all duration-300 relative">
                                    <div className="flex justify-between items-start cursor-pointer" onClick={() => handleEdit(t)}>
                                        <div>
                                            <p className="text-[10px] font-extrabold text-primary group-hover:text-white/70 uppercase tracking-widest mb-1">{t.category}</p>
                                            <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-white transition-colors">{t.name}</h3>
                                            <p className="text-sm text-gray-500 group-hover:text-white/60 font-medium mt-1">Süre: {t.duration}</p>
                                        </div>
                                        <div className="text-2xl font-extrabold text-primary group-hover:text-white">
                                            {t.price} ₺
                                        </div>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }} className="absolute top-4 right-4 p-2 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white text-white">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </Card>
                            ))
                        )}
                    </div>
                </>
            ) : (
                <div className="flex flex-col gap-6">
                    <Card className="p-6 border-none shadow-xl rounded-[32px] bg-slate-50">
                        <h3 className="font-bold text-lg mb-4">Hızlı Stok Girişi</h3>
                        <div className="flex gap-4">
                            <input value={stockForm.barcode} onChange={e => setStockForm({...stockForm, barcode: e.target.value})} placeholder="Barkod" className="flex-1 p-3 rounded-xl border-none shadow-sm font-mono text-sm" />
                            <input value={stockForm.name} onChange={e => setStockForm({...stockForm, name: e.target.value})} placeholder="Ürün Adı" className="flex-[2] p-3 rounded-xl border-none shadow-sm font-bold" />
                            <select value={stockForm.category} onChange={e => setStockForm({...stockForm, category: e.target.value})} className="flex-1 p-3 rounded-xl border-none shadow-sm text-sm font-medium bg-white">
                                {categories.filter(c => c !== 'Tümü').map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <input type="number" value={stockForm.quantity} onChange={e => setStockForm({...stockForm, quantity: Number(e.target.value)})} placeholder="Miktar" className="flex-1 p-3 rounded-xl border-none shadow-sm" />
                            <input value={stockForm.unit} onChange={e => setStockForm({...stockForm, unit: e.target.value})} placeholder="Birim (Adet/Kutu)" className="flex-1 p-3 rounded-xl border-none shadow-sm" />
                            <input type="date" value={stockForm.expiration_date} onChange={e => setStockForm({...stockForm, expiration_date: e.target.value})} className="flex-1 p-3 rounded-xl border-none shadow-sm text-xs font-bold text-gray-500" title="Son Kullanma Tarihi" />
                            <Button icon="save" onClick={handleStockSave} className="px-8">Ekle</Button>
                        </div>
                    </Card>
                    
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {categories.map(c => (
                                <button key={c} onClick={() => setSelectedCategory(c)} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === c ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                                    {c}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input value={stockSearch} onChange={e => setStockSearch(e.target.value)} placeholder="Ürün adı veya barkod ile ara..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-primary" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stocks.filter(s => (selectedCategory === 'Tümü' || s.category === selectedCategory) && (s.name.toLowerCase().includes(stockSearch.toLowerCase()) || s.barcode?.includes(stockSearch))).map(s => (
                            <Card key={s.id} className="p-6 border-none shadow-lg rounded-[24px] flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-gray-900">{s.name}</h4>
                                    <p className="text-xs text-gray-500 font-bold uppercase mt-1">{s.quantity} {s.unit}</p>
                                    <p className="text-[10px] text-primary font-bold uppercase mt-1 bg-primary/5 inline-block px-2 py-0.5 rounded">{s.category || 'Genel'}</p>
                                    {s.barcode && <p className="text-[10px] text-gray-400 font-mono mt-0.5">#{s.barcode}</p>}
                                    {s.expiration_date && <p className="text-[10px] text-red-400 font-bold mt-1">SKT: {new Date(s.expiration_date).toLocaleDateString()}</p>}
                                </div>
                                <div className="flex items-center gap-3">
                                    {s.quantity <= s.min_level && <span className="material-symbols-outlined text-red-500 animate-pulse" title="Kritik Stok">warning</span>}
                                    <button onClick={() => deleteStock(s.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
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

  const addDoctor = () => {
      const newDoc = { id: Math.random().toString(36).substr(2, 9), name: '', title: '', image: '' };
      setFormData({ ...formData, doctors: [...(formData.doctors || []), newDoc] });
  };

  const removeDoctor = (id: string) => {
      setFormData({ ...formData, doctors: formData.doctors.filter((d: any) => d.id !== id) });
  };

  const updateDoctor = (id: string, field: string, value: string) => {
      setFormData({ ...formData, doctors: formData.doctors.map((d: any) => d.id === id ? { ...d, [field]: value } : d) });
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

        {tab === 'ekip' && (
            <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-slate-900 tracking-tight">Doktor Kadrosu Yönetimi</h4>
                    <Button onClick={addDoctor} variant="outline" icon="person_add">Yeni Doktor Ekle</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.doctors?.map((doc: any) => (
                        <div key={doc.id} className="p-6 bg-slate-50 rounded-[32px] flex flex-col gap-4 border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-slate-200 overflow-hidden shrink-0">
                                    {doc.image && <img src={doc.image} alt="" className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    <input value={doc.name} onChange={(e) => updateDoctor(doc.id, 'name', e.target.value)} className="p-2 bg-white border border-slate-200 rounded-lg font-bold text-sm" placeholder="Doktor Adı" />
                                    <input value={doc.title} onChange={(e) => updateDoctor(doc.id, 'title', e.target.value)} className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-primary uppercase tracking-wide" placeholder="Ünvan / Uzmanlık" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Profil Fotoğrafı URL</label>
                                <input value={doc.image} onChange={(e) => updateDoctor(doc.id, 'image', e.target.value)} className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-mono" placeholder="https://..." />
                            </div>
                            <Button onClick={() => removeDoctor(doc.id)} variant="danger" className="mt-2" icon="delete">Kaldır</Button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {tab === 'footer' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex flex-col gap-6">
                    <h4 className="font-extrabold text-slate-900 tracking-tight">Çalışma Saatleri</h4>
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Hafta İçi</label>
                        <input name="working_hours_weekdays" value={formData.working_hours_weekdays || ''} onChange={handleInputChange} className="p-5 border-2 border-slate-50 rounded-[20px] font-bold" placeholder="Örn: 09:00 - 18:00" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Hafta Sonu</label>
                        <input name="working_hours_weekend" value={formData.working_hours_weekend || ''} onChange={handleInputChange} className="p-5 border-2 border-slate-50 rounded-[20px] font-bold" placeholder="Örn: 10:00 - 15:00" />
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <h4 className="font-extrabold text-slate-900 tracking-tight">Sosyal Medya Bağlantıları</h4>
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Instagram</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">photo_camera</span>
                            <input name="social_instagram" value={formData.social_instagram || ''} onChange={handleInputChange} className="w-full p-5 pl-14 border-2 border-slate-50 rounded-[20px] font-mono text-sm" placeholder="https://instagram.com/..." />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Facebook</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">public</span>
                            <input name="social_facebook" value={formData.social_facebook || ''} onChange={handleInputChange} className="w-full p-5 pl-14 border-2 border-slate-50 rounded-[20px] font-mono text-sm" placeholder="https://facebook.com/..." />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">LinkedIn</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">work</span>
                            <input name="social_linkedin" value={formData.social_linkedin || ''} onChange={handleInputChange} className="w-full p-5 pl-14 border-2 border-slate-50 rounded-[20px] font-mono text-sm" placeholder="https://linkedin.com/..." />
                        </div>
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