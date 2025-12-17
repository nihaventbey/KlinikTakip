import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge } from '../../components/UI';
import { RECENT_APPOINTMENTS, TRANSACTIONS, MOCK_PATIENTS, INVENTORY, TREATMENT_CATALOG, EXPENSES, INSTALLMENTS, DOCTOR_PERFORMANCE } from '../../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

// --- Dashboard ---
export const Dashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Kullanıcı';

  const data = [
    { name: 'Pzt', value: 4000 },
    { name: 'Sal', value: 3000 },
    { name: 'Çar', value: 5000 },
    { name: 'Per', value: 2780 },
    { name: 'Cum', value: 1890 },
    { name: 'Cmt', value: 6390 },
    { name: 'Paz', value: 3490 },
  ];

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
          { title: 'Bugünkü Randevular', value: '24', trend: '+12%', color: 'text-primary', icon: 'calendar_month' },
          { title: 'Bekleyen Hastalar', value: '5', trend: 'Bekleme Odası', color: 'text-purple-600', icon: 'group' },
          { title: 'Günlük Tahsilat', value: '₺12,500', trend: '+8%', color: 'text-green-600', icon: 'payments' },
          { title: 'Bekleyen Görevler', value: '8', trend: '2 Acil', color: 'text-orange-500', icon: 'task_alt' }
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
              <AreaChart data={data}>
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
                { title: 'Yeni Randevu', desc: 'Zeynep H. randevu oluşturdu', time: '10 dk önce', color: 'bg-green-500' },
                { title: 'Ödeme Alındı', desc: 'Ali B. faturasını ödedi: ₺1.200', time: '32 dk önce', color: 'bg-blue-500' },
                { title: 'Stok Uyarısı', desc: 'Lokal Anestezi stoğu azalıyor', time: '2 saat önce', color: 'bg-orange-500' }
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
          <Button variant="ghost" className="w-full mt-4 text-sm">Tümünü Gör</Button>
        </Card>
      </div>

      {/* Today's Appointments */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Bugünkü Randevular</h3>
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
              {RECENT_APPOINTMENTS.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">{apt.patientName}</td>
                  <td className="px-6 py-4 text-gray-500">{apt.time}</td>
                  <td className="px-6 py-4 text-gray-500">{apt.treatment}</td>
                  <td className="px-6 py-4 text-gray-500">{apt.doctorName}</td>
                  <td className="px-6 py-4"><Badge status={apt.status} /></td>
                </tr>
              ))}
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
    
    const filteredPatients = MOCK_PATIENTS.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.phone.includes(searchTerm)
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hasta Yönetimi</h1>
                    <p className="text-gray-500 text-sm">Toplam {MOCK_PATIENTS.length} kayıtlı hasta görüntüleniyor.</p>
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
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">filter_list</span> Filtrele
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">download</span> Dışa Aktar
                    </button>
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Hasta</th>
                                <th className="px-6 py-4">İletişim</th>
                                <th className="px-6 py-4">Son Ziyaret</th>
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
                                            <img src={patient.image} className="w-10 h-10 rounded-full bg-gray-200 object-cover" alt={patient.name} />
                                            <div>
                                                <p className="font-bold text-gray-900">{patient.name}</p>
                                                <p className="text-xs text-gray-500">ID: {patient.id} • {patient.age} Yaş</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{patient.phone}</td>
                                    <td className="px-6 py-4 text-gray-600">{patient.lastVisit}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-primary font-bold bg-primary/5 px-2 py-1 rounded">₺{patient.ltv.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {patient.balance > 0 ? (
                                            <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded">₺{patient.balance.toLocaleString()}</span>
                                        ) : (
                                            <span className="text-green-600 font-bold">Ödendi</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge status={patient.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg" title="SMS Gönder">
                                                <span className="material-symbols-outlined text-lg">sms</span>
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg" title="Geçmiş">
                                                <span className="material-symbols-outlined text-lg">history</span>
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg" title="Düzenle">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 flex justify-center">
                    <button className="text-sm font-medium text-gray-500 hover:text-primary">Daha Fazla Göster</button>
                </div>
            </Card>
        </div>
    );
};

// --- Treatments & Inventory Page ---
export const TreatmentsAdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'treatments' | 'inventory'>('treatments');

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tedavi ve Stok Yönetimi</h1>
                    <p className="text-gray-500 text-sm">Hizmet kataloğu ve malzeme stoğu takibi</p>
                </div>
                <Button icon="add">{activeTab === 'treatments' ? 'Yeni Hizmet Ekle' : 'Malzeme Girişi'}</Button>
            </div>

            {/* Custom Tabs */}
            <div className="flex border-b border-gray-200 gap-6">
                <button 
                    onClick={() => setActiveTab('treatments')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'treatments' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                >
                    <span className="material-symbols-outlined">dentistry</span> Hizmet Listesi
                </button>
                <button 
                    onClick={() => setActiveTab('inventory')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'inventory' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                >
                    <span className="material-symbols-outlined">inventory_2</span> Stok Takibi
                    <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full">2</span>
                </button>
            </div>

            {activeTab === 'treatments' ? (
                <Card className="overflow-hidden animate-fade-in">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Hizmet Adı</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Süre (Ort.)</th>
                                    <th className="px-6 py-4 text-right">Fiyat</th>
                                    <th className="px-6 py-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {TREATMENT_CATALOG.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">{item.category}</span></td>
                                        <td className="px-6 py-4 text-gray-500">{item.duration}</td>
                                        <td className="px-6 py-4 text-right font-medium">₺{item.price.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-primary"><span className="material-symbols-outlined text-lg">edit</span></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ) : (
                <Card className="overflow-hidden animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-b border-gray-100 bg-orange-50/50">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-lg bg-white border border-orange-200 flex items-center justify-center text-orange-500 shadow-sm">
                                <span className="material-symbols-outlined">warning</span>
                             </div>
                             <div>
                                 <p className="text-sm font-bold text-gray-900">Kritik Stok Uyarısı</p>
                                 <p className="text-xs text-gray-500">2 ürün tükenmek üzere.</p>
                             </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Malzeme Adı</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4 w-48">Stok Durumu</th>
                                    <th className="px-6 py-4">Miktar</th>
                                    <th className="px-6 py-4">Durum</th>
                                    <th className="px-6 py-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {INVENTORY.map(item => {
                                    const percentage = Math.min((item.stock / (item.minLevel * 3)) * 100, 100);
                                    let barColor = 'bg-green-500';
                                    if(item.status === 'low') barColor = 'bg-yellow-500';
                                    if(item.status === 'critical') barColor = 'bg-red-500';

                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                                            <td className="px-6 py-4 text-gray-500">{item.category}</td>
                                            <td className="px-6 py-4">
                                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className={`h-full ${barColor}`} style={{ width: `${percentage}%` }}></div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                {item.stock} <span className="text-gray-400 text-xs">{item.unit}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.status === 'ok' && <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">Yeterli</span>}
                                                {item.status === 'low' && <span className="inline-flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs font-bold">Azalıyor</span>}
                                                {item.status === 'critical' && <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold">Kritik</span>}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="secondary" className="px-2 py-1 h-8 text-xs">Sipariş Ver</Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
};

// --- Finance Page ---
export const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'commission' | 'installments' | 'expenses' | 'invoices'>('overview');

  const chartData = [
    { name: 'Oca', income: 4000, expense: 2400 },
    { name: 'Şub', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Nis', income: 2780, expense: 3908 },
    { name: 'May', income: 1890, expense: 4800 },
    { name: 'Haz', income: 2390, expense: 3800 },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finans ve Muhasebe</h1>
          <p className="text-gray-500 text-sm">Gelir, gider, hak ediş ve e-fatura yönetimi</p>
        </div>
        <div className="flex gap-2">
            {activeTab === 'expenses' && <Button icon="add" variant="danger">Gider Ekle</Button>}
            {activeTab === 'installments' && <Button icon="credit_card">Plan Oluştur</Button>}
            {activeTab === 'invoices' && <Button icon="sync">GİB ile Eşle</Button>}
        </div>
      </div>

      {/* Financial Tabs */}
      <div className="flex border-b border-gray-200 gap-6 overflow-x-auto">
        {[
            { id: 'overview', label: 'Genel Bakış', icon: 'monitoring' },
            { id: 'commission', label: 'Doktor Hak Ediş', icon: 'diversity_3' },
            { id: 'installments', label: 'Taksit Takip', icon: 'credit_score' },
            { id: 'expenses', label: 'Gider Yönetimi', icon: 'trending_down' },
            { id: 'invoices', label: 'E-Fatura', icon: 'receipt_long' },
        ].map(tab => (
            <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.label}
            </button>
        ))}
      </div>

      {activeTab === 'overview' && (
          <div className="flex flex-col gap-6 animate-fade-in">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-4 border-l-4 border-l-green-500">
                        <p className="text-xs font-bold text-gray-500 uppercase">Toplam Ciro</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">₺245,000</p>
                    </Card>
                    <Card className="p-4 border-l-4 border-l-red-500">
                        <p className="text-xs font-bold text-gray-500 uppercase">Toplam Gider</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">₺125,700</p>
                    </Card>
                    <Card className="p-4 border-l-4 border-l-blue-500 bg-blue-50">
                        <p className="text-xs font-bold text-blue-600 uppercase">Net Kâr</p>
                        <p className="text-2xl font-bold text-blue-800 mt-1">₺119,300</p>
                    </Card>
                    <Card className="p-4 border-l-4 border-l-purple-500">
                        <p className="text-xs font-bold text-gray-500 uppercase">Ortalama LTV</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">₺12,450</p>
                        <p className="text-[10px] text-gray-400">Hasta Başına</p>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 p-6 h-80">
                    <h3 className="font-bold text-gray-900 mb-4">Finansal Akış</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="income" fill="#135bec" radius={[4, 4, 0, 0]} barSize={20} name="Gelir" />
                        <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} name="Gider" />
                        </BarChart>
                    </ResponsiveContainer>
                    </Card>
                    <Card className="p-6">
                         <h3 className="font-bold text-gray-900 mb-4">En Değerli Hastalar (LTV)</h3>
                         <div className="space-y-4">
                             {MOCK_PATIENTS.sort((a,b) => b.ltv - a.ltv).slice(0,4).map(p => (
                                 <div key={p.id} className="flex items-center justify-between">
                                     <div className="flex items-center gap-3">
                                         <img src={p.image} className="w-10 h-10 rounded-full bg-gray-100 object-cover" alt={p.name} />
                                         <div>
                                             <p className="text-sm font-bold text-gray-900">{p.name}</p>
                                             <p className="text-xs text-gray-500">Son: {p.lastVisit}</p>
                                         </div>
                                     </div>
                                     <span className="text-sm font-bold text-primary bg-primary/5 px-2 py-1 rounded">₺{p.ltv.toLocaleString()}</span>
                                 </div>
                             ))}
                         </div>
                         <Button variant="ghost" className="w-full mt-4 text-xs">Tümünü Gör</Button>
                    </Card>
                </div>
          </div>
      )}

      {activeTab === 'commission' && (
          <div className="animate-fade-in">
             <Card className="overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Doktor</th>
                            <th className="px-6 py-4 text-right">Toplam Hasta</th>
                            <th className="px-6 py-4 text-right">Toplam Ciro</th>
                            <th className="px-6 py-4 text-right">Hak Ediş Oranı</th>
                            <th className="px-6 py-4 text-right">Ödenecek Tutar</th>
                            <th className="px-6 py-4 text-center">Durum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {DOCTOR_PERFORMANCE.map(doc => (
                            <tr key={doc.doctorId} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {doc.name.charAt(4)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{doc.name}</p>
                                            <p className="text-xs text-gray-500">ID: {doc.doctorId}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right text-gray-600">{doc.patientCount}</td>
                                <td className="px-6 py-4 text-right font-medium text-gray-900">₺{doc.totalTurnover.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">%{doc.commissionRate}</span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-green-600">₺{doc.calculatedPayment.toLocaleString()}</td>
                                <td className="px-6 py-4 text-center">
                                    <button className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700">Ödeme Yap</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </Card>
          </div>
      )}

      {activeTab === 'installments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {INSTALLMENTS.map(plan => (
                  <Card key={plan.id} className="p-6 border-l-4 border-l-purple-500">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <h3 className="font-bold text-gray-900">{plan.patientName}</h3>
                              <p className="text-sm text-gray-500">{plan.treatment}</p>
                          </div>
                          <div className="text-right">
                              <p className="text-xs text-gray-400 font-bold uppercase">Kalan Borç</p>
                              <p className="text-xl font-bold text-red-600">₺{plan.remainingAmount.toLocaleString()}</p>
                          </div>
                      </div>
                      
                      <div className="space-y-3">
                          {plan.installments.map((inst, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                  <div className="flex items-center gap-3">
                                      <span className="text-xs font-bold text-gray-500 w-6">{idx+1}.</span>
                                      <span className="text-sm font-medium">{inst.date}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <span className="font-bold text-gray-900">₺{inst.amount.toLocaleString()}</span>
                                      {inst.status === 'paid' && <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>}
                                      {inst.status === 'pending' && <span className="material-symbols-outlined text-gray-300 text-lg">radio_button_unchecked</span>}
                                      {inst.status === 'overdue' && <span className="material-symbols-outlined text-red-500 text-lg">warning</span>}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </Card>
              ))}
          </div>
      )}

      {activeTab === 'expenses' && (
           <div className="animate-fade-in">
               <Card className="overflow-hidden">
                   <table className="w-full text-left text-sm">
                       <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                           <tr>
                               <th className="px-6 py-4">Gider Kalemi</th>
                               <th className="px-6 py-4">Kategori</th>
                               <th className="px-6 py-4">Tarih</th>
                               <th className="px-6 py-4 text-right">Tutar</th>
                               <th className="px-6 py-4 text-center">Durum</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                           {EXPENSES.map(exp => (
                               <tr key={exp.id} className="hover:bg-gray-50/50">
                                   <td className="px-6 py-4 font-bold text-gray-900">{exp.title}</td>
                                   <td className="px-6 py-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{exp.category}</span></td>
                                   <td className="px-6 py-4 text-gray-500">{exp.date}</td>
                                   <td className="px-6 py-4 text-right font-medium text-red-600">- ₺{exp.amount.toLocaleString()}</td>
                                   <td className="px-6 py-4 text-center">
                                       {exp.status === 'paid' ? (
                                           <span className="text-green-600 flex items-center justify-center gap-1 font-bold text-xs"><span className="material-symbols-outlined text-sm">check</span> Ödendi</span>
                                       ) : (
                                           <span className="text-orange-500 flex items-center justify-center gap-1 font-bold text-xs"><span className="material-symbols-outlined text-sm">schedule</span> Bekliyor</span>
                                       )}
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </Card>
           </div>
      )}

      {activeTab === 'invoices' && (
           <div className="animate-fade-in">
               <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                       <span className="material-symbols-outlined">dns</span>
                   </div>
                   <div>
                       <h3 className="text-sm font-bold text-blue-900">GİB Entegrasyonu Aktif</h3>
                       <p className="text-xs text-blue-700">Kesilen faturalar otomatik olarak Gelir İdaresi Başkanlığı sistemine iletilmektedir. Son senkronizasyon: 2 dk önce.</p>
                   </div>
               </div>

               <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4">İşlem ID</th>
                        <th className="px-6 py-4">Hasta Adı</th>
                        <th className="px-6 py-4">İşlem Tipi</th>
                        <th className="px-6 py-4">Tarih</th>
                        <th className="px-6 py-4 text-right">Tutar</th>
                        <th className="px-6 py-4 text-center">E-Fatura Durumu</th>
                        <th className="px-6 py-4"></th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {TRANSACTIONS.map((trx) => (
                        <tr key={trx.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-medium text-gray-900">{trx.id}</td>
                        <td className="px-6 py-4 text-gray-900">{trx.patient}</td>
                        <td className="px-6 py-4 text-gray-500">{trx.type}</td>
                        <td className="px-6 py-4 text-gray-500">{trx.date}</td>
                        <td className="px-6 py-4 text-right font-medium text-gray-900">₺{trx.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-center">
                            {trx.invoiceStatus === 'sent' && <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold border border-green-200">GİB'e İletildi</span>}
                            {trx.invoiceStatus === 'pending' && <span className="inline-flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs font-bold border border-yellow-200">Sıradan Bekliyor</span>}
                            {trx.invoiceStatus === 'error' && <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold border border-red-200">Hata Oluştu</span>}
                        </td>
                        <td className="px-6 py-4 text-right">
                             <button className="text-primary hover:underline text-xs font-bold">PDF İndir</button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </Card>
           </div>
      )}
    </div>
  );
};

// --- Settings Page ---
export const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Klinik Yapılandırması</h1>
          <p className="text-gray-500 text-sm">Genel klinik bilgileri ve personel yetkilendirmeleri</p>
        </div>
        <Button icon="save">Değişiklikleri Kaydet</Button>
      </div>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">storefront</span> Klinik Bilgileri
        </h3>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-24 h-24 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-blue-50 transition-colors">
            <span className="material-symbols-outlined text-gray-400">add_a_photo</span>
            <span className="text-[10px] text-gray-500 font-medium">Logo Yükle</span>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Klinik Adı</label>
              <input type="text" defaultValue="Diş Kliniği Merkezi" className="rounded-lg border-gray-200 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Telefon</label>
              <input type="text" defaultValue="+90 (212) 555 0123" className="rounded-lg border-gray-200 text-sm" />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Adres</label>
              <input type="text" defaultValue="Atatürk Mah. İstiklal Cad. No:142 D:4, Şişli/İstanbul" className="rounded-lg border-gray-200 text-sm" />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">shield_lock</span> Güvenlik
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">SMS Doğrulama</p>
                <p className="text-xs text-gray-500">Girişlerde SMS onayı iste.</p>
              </div>
              <input type="checkbox" className="toggle-checkbox rounded-full text-primary focus:ring-primary" />
            </div>
            <div className="h-px bg-gray-100"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">2FA Zorunluluğu</p>
                <p className="text-xs text-gray-500">Tüm personel için 2FA aç.</p>
              </div>
              <input type="checkbox" className="toggle-checkbox rounded-full text-primary focus:ring-primary" defaultChecked />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">api</span> Entegrasyon
          </h3>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm p-1">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8XZ6XQrJkHvMZOqv9C_riyoQKguMBtuyLzPcRwqg0uXa1WihD6ZGGpXa_YFp1os-GEUJ43TyNh9514uLoSkhZNzTSANoL7LSvEsufO98lsPnWL_d8OV4SU7hJfuUBj3TF_tEDXAmLK6sqOrd_G9CwQJdOrJT_0BQ_NBlB0nr0BGwbTERWrrIbCiuF48g_4my2Pqprj9gtHVCyW1FT3pQ-YIX_Y-pwMc8aurAQ4ngAsfXJYrAseysdmNKds9rmfUNkzZ6r6XTTn8Hf" alt="Google" className="w-full h-full" />
              </div>
              <div>
                <p className="text-sm font-bold">Google Takvim</p>
                <p className="text-xs text-green-600 flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">check_circle</span> Bağlandı</p>
              </div>
            </div>
            <button className="text-xs font-semibold text-red-500 hover:underline">Kes</button>
          </div>
        </Card>
      </div>
    </div>
  );
};