import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { supabase } from '../../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Tip Tanımlamaları
interface Package {
  id: string;
  name: string;
  price: number;
  duration_months: number;
  max_users: number;
  features: string[];
}

interface Campaign {
  id: string;
  code: string;
  discount_percent: number;
  valid_until: string;
  is_active: boolean;
}

interface Tenant {
  id: string;
  clinic_name: string;
  domain: string;
  package_id: string;
  subscription_end: string;
  status: 'active' | 'expired' | 'pending';
  settings?: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
  };
}

interface UserProfile {
  id: string;
  full_name: string;
  role: string;
  clinic_id: string | null;
  saas_tenants?: {
    clinic_name: string;
  };
}

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  source: string;
}

interface Backup {
  id: string;
  clinic_name: string;
  file_name: string;
  size: string;
  created_at: string;
  status: 'completed' | 'pending' | 'failed';
}

export const SuperAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'campaigns' | 'tenants' | 'users' | 'reports' | 'financial' | 'health' | 'logs' | 'backups'>('overview');

  const [stats, setStats] = useState({ totalRevenue: 0, activeClinics: 0, activeCampaigns: 0 });
  
  // Veri State'leri
  const [packages, setPackages] = useState<Package[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [reportData, setReportData] = useState<any[]>([]);
  const [financialData, setFinancialData] = useState<any[]>([]);
  const [healthHistory, setHealthHistory] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Restore Modal State
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);

  // Form State'leri
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'package' | 'campaign' | 'user' | 'tenant' | 'tenant_settings' | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Supabase'den verileri çek (Tabloların var olduğu varsayılmıştır)
      const { data: pkgData } = await supabase.from('saas_packages').select('*');
      const { data: cmpData } = await supabase.from('saas_campaigns').select('*');
      const { data: tntData } = await supabase.from('saas_tenants').select('*');
      const { data: usrData } = await supabase.from('profiles').select('*, saas_tenants(clinic_name)');
      
      // Raporlar için veri çekme (Mock veya gerçek veri)
      // Not: Gerçek senaryoda bu veriler backend view'dan gelmelidir.
      const { data: patientsData } = await supabase.from('patients').select('id, clinic_id');
      const { data: appointmentsData } = await supabase.from('appointments').select('id, clinic_id');

      if (pkgData) setPackages(pkgData);
      if (cmpData) setCampaigns(cmpData);
      if (tntData) setTenants(tntData);
      if (usrData) setUsers(usrData as any);

      if (tntData) {
        const reports = tntData.map((t: any) => {
           const pCount = patientsData?.filter((p: any) => p.clinic_id === t.id).length || 0;
           const aCount = appointmentsData?.filter((a: any) => a.clinic_id === t.id).length || 0;
           // Doluluk oranı simülasyonu (Örn: Aylık 100 kapasite varsayımı)
           return { name: t.clinic_name, patients: pCount, appointments: aCount, occupancy: Math.min(100, Math.round((aCount / 50) * 100)) };
        });
        setReportData(reports);

        // Finansal Veri Simülasyonu (Gerçekte transactions tablosundan gelir)
        const financials = tntData.map((t: any) => ({
          name: t.clinic_name,
          revenue: Math.floor(Math.random() * 150000) + 50000,
          treatments: [
            { name: 'İmplant', value: Math.floor(Math.random() * 30) + 5 },
            { name: 'Dolgu', value: Math.floor(Math.random() * 80) + 20 },
            { name: 'Kanal Tedavisi', value: Math.floor(Math.random() * 40) + 10 },
            { name: 'Diş Taşı', value: Math.floor(Math.random() * 60) + 15 },
          ]
        }));
        setFinancialData(financials);

        // Sistem Sağlığı Geçmişi (Mock)
        const history = [
          { time: '00:00', latency: 45, connections: 120 },
          { time: '04:00', latency: 42, connections: 80 },
          { time: '08:00', latency: 55, connections: 250 },
          { time: '12:00', latency: 85, connections: 450 },
          { time: '16:00', latency: 70, connections: 380 },
          { time: '20:00', latency: 50, connections: 200 },
        ];
        setHealthHistory(history);
      }

      // İstatistikleri hesapla
      setStats({
        totalRevenue: 154000, // Örnek veri, gerçekte transactions tablosundan toplanmalı
        activeClinics: tntData?.filter((t: any) => t.status === 'active').length || 0,
        activeCampaigns: cmpData?.filter((c: any) => c.is_active).length || 0
      });

    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  // Yeni klinik için varsayılan verileri oluşturan fonksiyon
  const seedClinicData = async (clinicId: string) => {
    const defaultTreatments = [
      { name: 'Diş Taşı Temizliği', price: 750, duration: '30 dk', category: 'Genel', clinic_id: clinicId },
      { name: 'Dolgu', price: 1500, duration: '45 dk', category: 'Restoratif', clinic_id: clinicId },
      { name: 'Kanal Tedavisi', price: 3000, duration: '60 dk', category: 'Endodonti', clinic_id: clinicId },
      { name: 'Diş Çekimi', price: 1000, duration: '30 dk', category: 'Cerrahi', clinic_id: clinicId },
    ];
    
    const defaultStock = [
      { name: 'Muayene Eldiveni', quantity: 500, unit: 'Adet', category: 'Sarf', min_level: 50, clinic_id: clinicId },
      { name: 'Anestezi Ampulü', quantity: 100, unit: 'Adet', category: 'İlaç', min_level: 20, clinic_id: clinicId },
      { name: 'Hasta Önlüğü', quantity: 200, unit: 'Adet', category: 'Sarf', min_level: 30, clinic_id: clinicId },
    ];

    await supabase.from('treatments').insert(defaultTreatments);
    await supabase.from('inventory').insert(defaultStock);
  };

  // Abonelik İstatistiklerini Hesapla
  const subscriptionStats = [
    { name: 'Aktif', value: tenants.filter(t => t.status === 'active' && new Date(t.subscription_end) > new Date()).length, color: '#10b981' },
    { name: 'Süresi Dolmak Üzere', value: tenants.filter(t => {
        const end = new Date(t.subscription_end);
        const now = new Date();
        const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diff > 0 && diff <= 30;
    }).length, color: '#f59e0b' },
    { name: 'Pasif / Dolmuş', value: tenants.filter(t => t.status !== 'active' || new Date(t.subscription_end) <= new Date()).length, color: '#ef4444' }
  ];

  const handleSave = async () => {
    if (modalType === 'package') {
      // Özellikleri virgülden ayırıp array'e çeviriyoruz
      const featuresArray = typeof formData.features === 'string' 
        ? formData.features.split(',').map((f: string) => f.trim()) 
        : [];

      const packageData = { ...formData, features: featuresArray };
      const { error } = await supabase.from('saas_packages').insert([packageData]);
      if (!error) {
        fetchData(); // Veriyi sunucudan tazeleyerek gerçek ID'leri alalım
        setShowModal(false);
      }
    } else if (modalType === 'campaign') {
      const { error } = await supabase.from('saas_campaigns').insert([formData]);
      if (!error) {
        fetchData();
        setShowModal(false);
      }
    } else if (modalType === 'user') {
      const { error } = await supabase.from('profiles').update({
        role: formData.role,
        full_name: formData.full_name
      }).eq('id', formData.id);
      if (!error) {
        fetchData();
        setShowModal(false);
      }
    } else if (modalType === 'tenant') {
      const { data, error } = await supabase.from('saas_tenants').insert([{ ...formData, status: 'active', created_at: new Date().toISOString() }]).select();
      if (!error && data) {
        // Klinik oluşturulduktan sonra varsayılan verileri ekle
        await seedClinicData(data[0].id);

        fetchData();
        setShowModal(false);
      }
    } else if (modalType === 'tenant_settings') {
      // White Label Ayarlarını Kaydet
      const { error } = await supabase.from('saas_tenants').update({
        settings: {
          logo_url: formData.logo_url,
          primary_color: formData.primary_color,
          secondary_color: formData.secondary_color
        }
      }).eq('id', formData.id);

      if (!error) fetchData();
      setShowModal(false);
    }
  };

  const handleRestore = () => {
    if (!selectedBackup) return;
    setRestoreProgress(1); // Başlat
    
    // İlerleme Simülasyonu
    const interval = setInterval(() => {
      setRestoreProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
             setRestoreModalOpen(false);
             setRestoreProgress(0);
             alert('Geri yükleme işlemi başarıyla tamamlandı.');
          }, 500);
          return 100;
        }
        return prev + 5; // %5 artır
      });
    }, 200);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">SüperAdmin Portalı</h1>
          <p className="text-gray-500 font-medium">SaaS Yönetimi ve Satış Kontrolü</p>
        </div>
        <div className="flex gap-2">
           <Button icon="domain_add" onClick={() => { setModalType('tenant'); setShowModal(true); }}>Klinik Ekle</Button>
           <Button icon="add_business" onClick={() => { setModalType('package'); setShowModal(true); }}>Paket Ekle</Button>
           <Button icon="campaign" variant="secondary" onClick={() => { setModalType('campaign'); setShowModal(true); }}>Kampanya Oluştur</Button>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-none shadow-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-[24px]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-200 font-bold text-xs uppercase">Toplam Gelir</p>
              <h3 className="text-3xl font-extrabold mt-1">{stats.totalRevenue.toLocaleString()} ₺</h3>
            </div>
            <span className="material-symbols-outlined text-4xl opacity-50">payments</span>
          </div>
        </Card>
        <Card className="p-6 border-none shadow-xl bg-white rounded-[24px]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 font-bold text-xs uppercase">Aktif Klinikler</p>
              <h3 className="text-3xl font-extrabold mt-1 text-gray-900">{stats.activeClinics}</h3>
            </div>
            <span className="material-symbols-outlined text-4xl text-green-500 bg-green-50 p-2 rounded-xl">domain</span>
          </div>
        </Card>
        <Card className="p-6 border-none shadow-xl bg-white rounded-[24px]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 font-bold text-xs uppercase">Aktif Kampanyalar</p>
              <h3 className="text-3xl font-extrabold mt-1 text-gray-900">{stats.activeCampaigns}</h3>
            </div>
            <span className="material-symbols-outlined text-4xl text-purple-500 bg-purple-50 p-2 rounded-xl">local_offer</span>
          </div>
        </Card>
      </div>

      {/* Sekmeler */}
      <div className="flex gap-2 border-b border-gray-100">
        {['overview', 'packages', 'campaigns', 'tenants', 'users', 'reports', 'financial', 'health'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-bold text-sm transition-all capitalize ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {tab === 'tenants' ? 'Klinikler' : tab === 'packages' ? 'Paketler' : tab === 'campaigns' ? 'Kampanyalar' : tab === 'users' ? 'Kullanıcılar' : tab === 'reports' ? 'Raporlar' : tab === 'financial' ? 'Finansal Analiz' : tab === 'health' ? 'Sistem Sağlığı' : 'Genel Bakış'}
          </button>
        ))}
      </div>

      {/* İçerik Alanı */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Abonelik Yönetimi Widget'ı */}
                <Card className="p-8 border-none shadow-xl rounded-[32px]">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600">subscriptions</span> Abonelik Durumu
                    </h3>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="h-64 w-64 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={subscriptionStats} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {subscriptionStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                <span className="text-3xl font-extrabold text-gray-900">{tenants.length}</span>
                                <span className="text-xs text-gray-500 font-bold uppercase">Toplam</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 w-full">
                            {subscriptionStats.map((stat, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }}></div>
                                        <span className="font-bold text-gray-700 text-sm">{stat.name}</span>
                                    </div>
                                    <span className="font-extrabold text-gray-900">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Hızlı İşlemler Widget'ı */}
                <Card className="p-8 border-none shadow-xl rounded-[32px] bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                    <h3 className="text-xl font-extrabold mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-yellow-400">bolt</span> Hızlı İşlemler
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => { setModalType('tenant'); setShowModal(true); }} className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-left group">
                            <span className="material-symbols-outlined text-3xl mb-2 group-hover:scale-110 transition-transform">domain_add</span>
                            <p className="font-bold text-sm">Yeni Klinik Ekle</p>
                            <p className="text-[10px] text-gray-400 mt-1">Kurulum & E-posta</p>
                        </button>
                        <button onClick={() => { setModalType('package'); setShowModal(true); }} className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-left group">
                            <span className="material-symbols-outlined text-3xl mb-2 group-hover:scale-110 transition-transform">inventory_2</span>
                            <p className="font-bold text-sm">Paket Oluştur</p>
                            <p className="text-[10px] text-gray-400 mt-1">Fiyatlandırma</p>
                        </button>
                        <button onClick={() => setActiveTab('financial')} className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-left group">
                            <span className="material-symbols-outlined text-3xl mb-2 group-hover:scale-110 transition-transform">analytics</span>
                            <p className="font-bold text-sm">Finansal Rapor</p>
                            <p className="text-[10px] text-gray-400 mt-1">Ciro Analizi</p>
                        </button>
                        <button onClick={() => setActiveTab('users')} className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-left group">
                            <span className="material-symbols-outlined text-3xl mb-2 group-hover:scale-110 transition-transform">manage_accounts</span>
                            <p className="font-bold text-sm">Kullanıcılar</p>
                            <p className="text-[10px] text-gray-400 mt-1">Rol Yönetimi</p>
                        </button>
                    </div>
                </Card>
            </div>
        )}

        {activeTab === 'packages' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map(pkg => (
              <Card key={pkg.id} className="p-8 border-none shadow-lg hover:shadow-xl transition-all rounded-[32px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl">{pkg.price} ₺ / Ay</div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-sm text-gray-500 mb-6">{pkg.max_users} Kullanıcı • {pkg.duration_months} Ay</p>
                <ul className="space-y-2 mb-6">
                  {pkg.features?.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span> {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline">Düzenle</Button>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-4">
            {campaigns.map(cmp => (
              <div key={cmp.id} className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-bold text-xl">
                    %
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{cmp.code}</h4>
                    <p className="text-sm text-gray-500">Son Geçerlilik: {new Date(cmp.valid_until).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-2xl text-purple-600">%{cmp.discount_percent}</p>
                  <Badge status={cmp.is_active ? 'active' : 'inactive'} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tenants' && (
          <Card className="border-none shadow-xl rounded-[32px] overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-6 text-xs font-extrabold text-gray-400 uppercase">Klinik Adı</th>
                  <th className="p-6 text-xs font-extrabold text-gray-400 uppercase">Domain</th>
                  <th className="p-6 text-xs font-extrabold text-gray-400 uppercase">Paket</th>
                  <th className="p-6 text-xs font-extrabold text-gray-400 uppercase">Bitiş Tarihi</th>
                  <th className="p-6 text-xs font-extrabold text-gray-400 uppercase">Durum</th>
                  <th className="p-6 text-xs font-extrabold text-gray-400 uppercase text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tenants.map(t => {
                  // Paketin adını packages state'inden bulalım (Röntgen görünümü)
                  const packageName = packages.find(p => p.id === t.package_id)?.name || 'Paket Yok';
                  
                  // Süre dolmuş mu kontrolü
                  const isExpired = t.subscription_end ? new Date(t.subscription_end) < new Date() : false;
                  
                  return (
                    <tr key={t.id} className={`transition-colors ${isExpired ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}>
                      <td className="p-6 font-bold text-gray-900">{t.clinic_name}</td>
                      <td className="p-6 text-sm text-blue-600 font-medium">{t.domain}</td>
                      <td className="p-6 text-sm font-bold">{packageName}</td>
                      <td className={`p-6 text-sm ${isExpired ? 'text-red-600 font-bold' : 'text-gray-500'}`}>{t.subscription_end ? new Date(t.subscription_end).toLocaleDateString() : '-'}</td>
                      <td className="p-6"><Badge status={isExpired ? 'expired' : t.status} /></td>
                      <td className="p-6 text-right">
                        <button 
                          onClick={() => { setFormData({ id: t.id, ...t.settings }); setModalType('tenant_settings'); setShowModal(true); }}
                          className="text-blue-600 font-bold text-sm hover:underline flex items-center justify-end gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">tune</span> Ayarlar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}

        {activeTab === 'users' && (
          <Card className="border-none shadow-xl rounded-[32px] overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-6 text-xs font-extrabold text-gray-400 uppercase">Ad Soyad</th>
                  <th className="p-6 text-xs font-extrabold text-gray-400 uppercase">Rol</th>
                  <th className="p-6 text-xs font-extrabold text-gray-400 uppercase">Klinik</th>
                  <th className="p-6 text-xs font-extrabold text-gray-400 uppercase text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 font-bold text-gray-900">{u.full_name}</td>
                    <td className="p-6"><span className={`px-3 py-1 rounded-lg font-bold text-xs uppercase ${u.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>{u.role}</span></td>
                    <td className="p-6 text-sm text-gray-500 font-medium">{u.saas_tenants?.clinic_name || (u.role === 'superadmin' ? 'Sistem Geneli' : '-')}</td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => { setFormData(u); setModalType('user'); setShowModal(true); }}
                        className="text-blue-600 font-bold text-sm hover:underline"
                      >
                        Düzenle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8 border-none shadow-xl rounded-[32px]">
              <h3 className="text-xl font-extrabold text-gray-900 mb-6">Klinik Hasta Sayıları</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                    <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                    <Bar dataKey="patients" name="Hasta Sayısı" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-8 border-none shadow-xl rounded-[32px]">
              <h3 className="text-xl font-extrabold text-gray-900 mb-6">Randevu Doluluk Oranları (%)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                    <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                    <Bar dataKey="occupancy" name="Doluluk %" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="flex flex-col gap-8">
            <Card className="p-8 border-none shadow-xl rounded-[32px]">
              <h3 className="text-xl font-extrabold text-gray-900 mb-6">Klinik Bazlı Aylık Ciro (₺)</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                    <Tooltip cursor={{fill: '#f9fafb'}} formatter={(value) => `${value.toLocaleString()} ₺`} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                    <Bar dataKey="revenue" name="Aylık Ciro" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {financialData.map((clinic, idx) => (
                <Card key={idx} className="p-6 border-none shadow-lg rounded-[24px]">
                  <h4 className="font-bold text-gray-900 mb-4">{clinic.name} - Tedavi Dağılımı</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={clinic.treatments} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                          {clinic.treatments.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="flex flex-col gap-8">
            {/* Durum Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 border-none shadow-lg rounded-[24px] flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><span className="material-symbols-outlined">dns</span></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase">Veritabanı</p><h4 className="text-lg font-extrabold text-green-600">Bağlı (Online)</h4></div>
              </Card>
              <Card className="p-6 border-none shadow-lg rounded-[24px] flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><span className="material-symbols-outlined">speed</span></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase">Ort. Gecikme</p><h4 className="text-lg font-extrabold text-gray-900">45 ms</h4></div>
              </Card>
              <Card className="p-6 border-none shadow-lg rounded-[24px] flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><span className="material-symbols-outlined">hub</span></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase">Aktif Bağlantı</p><h4 className="text-lg font-extrabold text-gray-900">342</h4></div>
              </Card>
              <Card className="p-6 border-none shadow-lg rounded-[24px] flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><span className="material-symbols-outlined">cloud_done</span></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase">API Uptime</p><h4 className="text-lg font-extrabold text-gray-900">%99.98</h4></div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Performans Grafiği */}
              <Card className="lg:col-span-2 p-8 border-none shadow-xl rounded-[32px]">
                <h3 className="text-xl font-extrabold text-gray-900 mb-6">Sistem Performansı (Son 24 Saat)</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthHistory}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                      <Line type="monotone" dataKey="connections" name="Bağlantılar" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                      <Line type="monotone" dataKey="latency" name="Gecikme (ms)" stroke="#f59e0b" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Depolama Kullanımı */}
              <Card className="p-8 border-none shadow-xl rounded-[32px]">
                <h3 className="text-xl font-extrabold text-gray-900 mb-6">Depolama (Storage)</h3>
                <div className="h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[{name: 'Kullanılan', value: 124}, {name: 'Boş', value: 376}]} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        <Cell fill="#ef4444" />
                        <Cell fill="#e5e7eb" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-extrabold text-gray-900">124 GB</span>
                    <span className="text-xs text-gray-500 font-bold">/ 500 GB</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm font-bold text-gray-600"><span>Hasta Dosyaları</span><span>85 GB</span></div>
                  <div className="flex justify-between text-sm font-bold text-gray-600"><span>Yedekler</span><span>30 GB</span></div>
                  <div className="flex justify-between text-sm font-bold text-gray-600"><span>Loglar</span><span>9 GB</span></div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Modal (Basit Örnek) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-extrabold mb-6">
              {modalType === 'package' ? 'Yeni Paket' : modalType === 'campaign' ? 'Yeni Kampanya' : modalType === 'tenant' ? 'Yeni Klinik' : modalType === 'tenant_settings' ? 'Klinik Ayarları (White Label)' : 'Kullanıcı Düzenle'}
            </h3>
            <div className="flex flex-col gap-4">
              {modalType === 'package' ? (
                <>
                  <input placeholder="Paket Adı" className="p-4 bg-gray-50 rounded-xl font-bold" onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input type="number" placeholder="Fiyat (₺)" className="p-4 bg-gray-50 rounded-xl font-bold" onChange={e => setFormData({...formData, price: e.target.value})} />
                  <input type="number" placeholder="Süre (Ay)" className="p-4 bg-gray-50 rounded-xl font-bold" onChange={e => setFormData({...formData, duration_months: e.target.value})} />
                  <input type="number" placeholder="Maks. Kullanıcı" className="p-4 bg-gray-50 rounded-xl font-bold" onChange={e => setFormData({...formData, max_users: e.target.value})} />
                  <textarea placeholder="Özellikler (Virgülle ayırın: Randevu, Raporlama, SMS...)" className="p-4 bg-gray-50 rounded-xl font-bold h-24 resize-none" onChange={e => setFormData({...formData, features: e.target.value})} />
                </>
              ) : modalType === 'campaign' ? (
                <>
                  <input placeholder="Kampanya Kodu" className="p-4 bg-gray-50 rounded-xl font-bold uppercase" onChange={e => setFormData({...formData, code: e.target.value})} />
                  <input type="number" placeholder="İndirim Oranı (%)" className="p-4 bg-gray-50 rounded-xl font-bold" onChange={e => setFormData({...formData, discount_percent: e.target.value})} />
                </>
              ) : modalType === 'tenant' ? (
                <>
                  <input placeholder="Klinik Adı" className="p-4 bg-gray-50 rounded-xl font-bold" onChange={e => setFormData({...formData, clinic_name: e.target.value})} />
                  <input placeholder="Domain (örn: klinik.dentcare.com)" className="p-4 bg-gray-50 rounded-xl font-bold" onChange={e => setFormData({...formData, domain: e.target.value})} />
                  <input type="date" placeholder="Abonelik Bitiş" className="p-4 bg-gray-50 rounded-xl font-bold" onChange={e => setFormData({...formData, subscription_end: e.target.value})} />
                </>
              ) : modalType === 'tenant_settings' ? (
                <>
                  <label className="text-xs font-bold text-gray-400 uppercase">Logo URL</label>
                  <input value={formData.logo_url || ''} onChange={e => setFormData({...formData, logo_url: e.target.value})} className="p-4 bg-gray-50 rounded-xl font-bold" placeholder="https://..." />
                  <label className="text-xs font-bold text-gray-400 uppercase">Ana Renk (Primary)</label>
                  <input type="color" value={formData.primary_color || '#135bec'} onChange={e => setFormData({...formData, primary_color: e.target.value})} className="w-full h-12 rounded-xl cursor-pointer" />
                  <label className="text-xs font-bold text-gray-400 uppercase">İkincil Renk (Secondary)</label>
                  <input type="color" value={formData.secondary_color || '#4c669a'} onChange={e => setFormData({...formData, secondary_color: e.target.value})} className="w-full h-12 rounded-xl cursor-pointer" />
                </>
              ) : (
                <>
                  <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="p-4 bg-gray-50 rounded-xl font-bold" placeholder="Ad Soyad" />
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="p-4 bg-gray-50 rounded-xl font-bold">
                    <option value="user">Kullanıcı (User)</option>
                    <option value="admin">Yönetici (Admin)</option>
                    <option value="doctor">Doktor</option>
                    <option value="secretary">Sekreter</option>
                    <option value="superadmin">Süper Admin</option>
                  </select>
                </>
              )}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>İptal</Button>
                <Button className="flex-1" onClick={handleSave}>Kaydet</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restore (Geri Yükleme) Modalı */}
      {restoreModalOpen && selectedBackup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-extrabold mb-4 text-gray-900">Yedeği Geri Yükle</h3>
            
            {restoreProgress > 0 ? (
                <div className="flex flex-col gap-6 items-center py-6">
                    <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                    <div className="w-full space-y-2">
                        <div className="flex justify-between text-xs font-bold text-blue-600 uppercase">
                            <span>Geri Yükleniyor...</span>
                            <span>%{restoreProgress}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div className="bg-blue-600 h-full transition-all duration-300 ease-out" style={{ width: `${restoreProgress}%` }}></div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center font-medium">Lütfen pencereyi kapatmayın.<br/>İşlem tamamlandığında sistem yeniden başlatılacak.</p>
                </div>
            ) : (
                <>
                    <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-100 mb-6">
                        <div className="flex items-center gap-2 text-yellow-700 font-extrabold mb-2">
                            <span className="material-symbols-outlined">warning</span>
                            Dikkat
                        </div>
                        <p className="text-sm text-yellow-800 font-medium leading-relaxed">
                            <strong>{selectedBackup.clinic_name}</strong> kliniği için <strong>{selectedBackup.file_name}</strong> yedeğini geri yüklemek üzeresiniz.
                        </p>
                        <p className="text-xs text-yellow-700 mt-3 font-bold">
                            Bu işlem mevcut verilerin üzerine yazacaktır ve geri alınamaz. Devam etmek istiyor musunuz?
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setRestoreModalOpen(false)}>İptal</Button>
                        <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white border-transparent" onClick={handleRestore}>Onayla ve Yükle</Button>
                    </div>
                </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};