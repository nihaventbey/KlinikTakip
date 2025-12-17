import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge } from '../../components/UI';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { supabase } from '../../lib/supabase';
import { Patient } from '../../types';

// --- Dashboard ---
export const Dashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Kullanıcı';
  
  const [stats, setStats] = useState({ appointments: 0, patients: 0, income: 0, tasks: 0 });
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Today's Appointments Count
      const today = new Date().toISOString().split('T')[0];
      const { count: aptCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('start_time', `${today}T00:00:00`)
        .lte('start_time', `${today}T23:59:59`);

      // 2. Fetch Recent Appointments with Relations
      const { data: apts } = await supabase
        .from('appointments')
        .select(`
          id, start_time, status,
          patients (full_name),
          profiles (full_name),
          treatments_catalog (name)
        `)
        .order('start_time', { ascending: false })
        .limit(5);

      // 3. Fetch Total Patients Count
      const { count: patientCount } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });
        
      // 4. Calculate Daily Income
      const { data: incomeData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'income')
        .eq('transaction_date', today);

      // 5. Pending Tasks
      const { count: taskCount } = await supabase
         .from('tasks')
         .select('*', { count: 'exact', head: true })
         .eq('status', 'pending');

      const totalIncome = incomeData?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;

      setStats({
        appointments: aptCount || 0,
        patients: patientCount || 0,
        income: totalIncome,
        tasks: taskCount || 0 
      });

      setAppointments(apts || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Pzt', value: 4000 },
    { name: 'Sal', value: 3000 },
    { name: 'Çar', value: 5000 },
    { name: 'Per', value: 2780 },
    { name: 'Cum', value: 1890 },
    { name: 'Cmt', value: 6390 },
    { name: 'Paz', value: 3490 },
  ];

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz, {displayName} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Bugünün klinik özeti ve bekleyen görevleriniz.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border border-gray-200">
          <span className="material-symbols-outlined text-lg">calendar_today</span>
          <span>{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Bugünkü Randevular', value: stats.appointments, trend: 'Aktif', color: 'text-primary', icon: 'calendar_month' },
          { title: 'Kayıtlı Hasta', value: stats.patients, trend: 'Toplam', color: 'text-purple-600', icon: 'group' },
          { title: 'Günlük Tahsilat', value: `₺${stats.income.toLocaleString()}`, trend: 'Bugün', color: 'text-green-600', icon: 'payments' },
          { title: 'Bekleyen Görevler', value: stats.tasks, trend: 'Yapılacak', color: 'text-orange-500', icon: 'task_alt' }
        ].map((stat, i) => (
          <Card key={i} className="p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{stat.title}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded bg-gray-50 ${stat.color}`}>{stat.trend}</span>
              </div>
            </div>
            <span className={`absolute -right-2 -top-2 material-symbols-outlined text-7xl opacity-10 group-hover:scale-110 transition-transform ${stat.color}`}>{stat.icon}</span>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Haftalık Gelir Özeti</h3>
            <button className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined">more_horiz</span></button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#135bec" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#135bec" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="value" stroke="#135bec" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 flex flex-col">
          <h3 className="font-bold text-gray-900 mb-4">Son Aktiviteler</h3>
          <div className="flex-1 overflow-y-auto pr-2 relative">
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>
            <div className="space-y-6">
              {[
                { title: 'Sistem Başlatıldı', desc: 'Veritabanı bağlantısı başarılı', time: 'Şimdi', color: 'bg-green-500' },
              ].map((act, i) => (
                <div key={i} className="relative pl-8">
                  <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-white shadow-sm box-content ${act.color}`}></div>
                  <p className="text-sm font-bold text-gray-900">{act.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{act.desc}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{act.time}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Appointments */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Son Randevular</h3>
          <Link to="/admin/appointments" className="text-sm font-medium text-primary hover:underline">Tümünü Gör</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Hasta</th>
                <th className="px-6 py-4">Saat</th>
                <th className="px-6 py-4">İşlem</th>
                <th className="px-6 py-4">Doktor</th>
                <th className="px-6 py-4">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">{apt.patients?.full_name || 'Bilinmiyor'}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(apt.start_time).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'})}</td>
                  <td className="px-6 py-4 text-gray-500">{apt.treatments_catalog?.name || '-'}</td>
                  <td className="px-6 py-4 text-gray-500">{apt.profiles?.full_name || '-'}</td>
                  <td className="px-6 py-4"><Badge status={apt.status} /></td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                   <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Henüz randevu bulunmuyor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// --- Patients Page ---
export const PatientsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase.from('patients').select('*').order('created_at', {ascending: false});
                if(error) throw error;
                if(data) setPatients(data);
            } catch (error) {
                console.error("Error fetching patients:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p => 
        p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.phone?.includes(searchTerm)
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hasta Yönetimi</h1>
                    <p className="text-gray-500 text-sm">Toplam {patients.length} kayıtlı hasta görüntüleniyor.</p>
                </div>
                <Button icon="person_add">Yeni Hasta Ekle</Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-2">
                <div className="relative flex-1 max-w-md">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input 
                        type="text" 
                        placeholder="İsim, TC No veya Telefon ile ara..." 
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Hasta</th>
                                    <th className="px-6 py-4">İletişim</th>
                                    <th className="px-6 py-4">LTV (Değer)</th>
                                    <th className="px-6 py-4">Bakiye</th>
                                    <th className="px-6 py-4">Durum</th>
                                    <th className="px-6 py-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredPatients.map(patient => (
                                    <tr key={patient.id} className="hover:bg-gray-50/50 group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={patient.avatar_url || 'https://i.pravatar.cc/150'} className="w-10 h-10 rounded-full bg-gray-200 object-cover" alt={patient.full_name} />
                                                <div>
                                                    <p className="font-bold text-gray-900">{patient.full_name}</p>
                                                    <p className="text-xs text-gray-500">Kayıt: {patient.created_at ? new Date(patient.created_at).toLocaleDateString('tr-TR') : '-'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{patient.phone}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-primary font-bold bg-primary/5 px-2 py-1 rounded">₺{patient.ltv?.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {patient.balance > 0 ? (
                                                <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded">₺{patient.balance?.toLocaleString()}</span>
                                            ) : (
                                                <span className="text-green-600 font-bold">Ödendi</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge status={patient.status || 'active'} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-primary hover:underline">Detay</button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPatients.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Kayıt bulunamadı.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

// --- Treatments & Inventory Page ---
export const TreatmentsAdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'treatments' | 'inventory'>('treatments');
    const [treatments, setTreatments] = useState<any[]>([]);
    const [inventory, setInventory] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: tData } = await supabase.from('treatments_catalog').select('*');
            if(tData) setTreatments(tData);

            const { data: iData } = await supabase.from('inventory').select('*');
            if(iData) setInventory(iData);
        }
        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tedavi ve Stok Yönetimi</h1>
                </div>
                <Button icon="add">{activeTab === 'treatments' ? 'Yeni Hizmet Ekle' : 'Malzeme Girişi'}</Button>
            </div>

            <div className="flex border-b border-gray-200 gap-6">
                <button onClick={() => setActiveTab('treatments')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'treatments' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}>Hizmet Listesi</button>
                <button onClick={() => setActiveTab('inventory')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'inventory' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}>Stok Takibi</button>
            </div>

            {activeTab === 'treatments' ? (
                <Card className="overflow-hidden animate-fade-in">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Hizmet Adı</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Süre (Ort.)</th>
                                <th className="px-6 py-4 text-right">Fiyat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {treatments.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">{item.category}</span></td>
                                    <td className="px-6 py-4 text-gray-500">{item.duration_min} dk</td>
                                    <td className="px-6 py-4 text-right font-medium">₺{item.price?.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            ) : (
                <Card className="overflow-hidden animate-fade-in">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Malzeme Adı</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4 w-48">Stok Durumu</th>
                                <th className="px-6 py-4">Miktar</th>
                                <th className="px-6 py-4">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {inventory.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{item.category}</td>
                                    <td className="px-6 py-4">
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full bg-primary`} style={{ width: `${Math.min((item.stock / (item.min_level * 3)) * 100, 100)}%` }}></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">{item.stock} {item.unit}</td>
                                    <td className="px-6 py-4"><Badge status={item.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            )}
        </div>
    );
};

// --- Finance Page ---
export const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchFinance = async () => {
       const { data } = await supabase
       .from('transactions')
       .select('*, patients(full_name)')
       .order('transaction_date', {ascending: false});
       if(data) setTransactions(data);
    };
    fetchFinance();
  }, []);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finans ve Muhasebe</h1>
          <p className="text-gray-500 text-sm">Gelir, gider ve fatura takibi</p>
        </div>
      </div>

      <div className="flex gap-6">
           <button onClick={() => setActiveTab('overview')} className={`text-sm font-bold ${activeTab === 'overview' ? 'text-primary' : 'text-gray-500'}`}>Genel Bakış</button>
           <button onClick={() => setActiveTab('transactions')} className={`text-sm font-bold ${activeTab === 'transactions' ? 'text-primary' : 'text-gray-500'}`}>İşlemler</button>
      </div>

      {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <Card className="p-6 border-l-4 border-l-green-500">
                    <p className="text-sm font-bold text-gray-500">Toplam Gelir</p>
                    <p className="text-2xl font-bold text-gray-900">₺{totalIncome.toLocaleString()}</p>
               </Card>
               <Card className="p-6 border-l-4 border-l-red-500">
                    <p className="text-sm font-bold text-gray-500">Toplam Gider</p>
                    <p className="text-2xl font-bold text-gray-900">₺{totalExpense.toLocaleString()}</p>
               </Card>
               <Card className="p-6 border-l-4 border-l-blue-500 bg-blue-50">
                    <p className="text-sm font-bold text-blue-600">Net Kâr</p>
                    <p className="text-2xl font-bold text-blue-800">₺{(totalIncome - totalExpense).toLocaleString()}</p>
               </Card>
          </div>
      )}

      {activeTab === 'transactions' && (
           <Card className="overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4">Tarih</th>
                        <th className="px-6 py-4">Hasta / Kalem</th>
                        <th className="px-6 py-4">Açıklama</th>
                        <th className="px-6 py-4 text-right">Tutar</th>
                        <th className="px-6 py-4 text-center">Durum</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {transactions.map((trx) => (
                        <tr key={trx.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-gray-500">{trx.transaction_date}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{trx.patients?.full_name || trx.category}</td>
                        <td className="px-6 py-4 text-gray-500">{trx.description}</td>
                        <td className={`px-6 py-4 text-right font-bold ${trx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {trx.type === 'income' ? '+' : '-'} ₺{Number(trx.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center"><Badge status={trx.status} /></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Card>
      )}
    </div>
  );
};

// --- Settings Page ---
export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, loading } = useSettings();
  const [formData, setFormData] = useState(settings || {});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if(settings) setFormData(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(formData);
      setMsg('Ayarlar başarıyla güncellendi.');
      setTimeout(() => setMsg(''), 3000);
    } catch (error) {
      setMsg('Hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if(loading) return <div>Yükleniyor...</div>;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Klinik Ayarları</h1>
        {msg && <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded">{msg}</span>}
      </div>

      <Card className="p-8">
        <h3 className="text-lg font-bold mb-6 border-b border-gray-100 pb-2">Genel Bilgiler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <div className="flex flex-col gap-2">
                 <label className="text-sm font-bold text-gray-700">Klinik Adı</label>
                 <input name="clinic_name" value={formData.clinic_name || ''} onChange={handleChange} className="p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white transition-colors" />
             </div>
             <div className="flex flex-col gap-2">
                 <label className="text-sm font-bold text-gray-700">Telefon</label>
                 <input name="phone" value={formData.phone || ''} onChange={handleChange} className="p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white transition-colors" />
             </div>
             <div className="flex flex-col gap-2">
                 <label className="text-sm font-bold text-gray-700">E-Posta</label>
                 <input name="email" value={formData.email || ''} onChange={handleChange} className="p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white transition-colors" />
             </div>
             <div className="flex flex-col gap-2">
                 <label className="text-sm font-bold text-gray-700">Logo URL</label>
                 <input name="logo_url" value={formData.logo_url || ''} onChange={handleChange} placeholder="https://..." className="p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white transition-colors" />
             </div>
        </div>
        <div className="flex flex-col gap-2 mb-8">
             <label className="text-sm font-bold text-gray-700">Adres</label>
             <input name="address" value={formData.address || ''} onChange={handleChange} className="p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white transition-colors" />
        </div>
        
        <div className="flex justify-end">
             <Button onClick={handleSave} disabled={saving} icon="save">
               {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
             </Button>
        </div>
      </Card>
    </div>
  );
};
