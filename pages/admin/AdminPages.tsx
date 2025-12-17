import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge } from '../../components/UI';
import { RECENT_APPOINTMENTS, TRANSACTIONS } from '../../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// --- Dashboard ---
export const Dashboard: React.FC = () => {
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
          <h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz, Dr. Ahmet 👋</h1>
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

// --- Finance Page ---
export const FinancePage: React.FC = () => {
  const chartData = [
    { name: 'Oca', income: 4000, expense: 2400 },
    { name: 'Şub', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Nis', income: 2780, expense: 3908 },
    { name: 'May', income: 1890, expense: 4800 },
    { name: 'Haz', income: 2390, expense: 3800 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ödeme ve Fatura Yönetimi</h1>
          <p className="text-gray-500 text-sm">Finansal durum özeti ve işlem geçmişi</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon="add">Ödeme Ekle</Button>
          <Button icon="receipt_long">Fatura Oluştur</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 h-80">
          <h3 className="font-bold text-gray-900 mb-4">Gelir vs Gider</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="income" fill="#135bec" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6 flex flex-col justify-center items-center h-80">
           <h3 className="font-bold text-gray-900 w-full mb-4">Ödeme Yöntemleri</h3>
           <div className="relative w-40 h-40">
             <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
               <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
               <path className="text-primary" strokeDasharray="60, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
               <path className="text-blue-400" strokeDasharray="25, 100" strokeDashoffset="-60" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-2xl font-bold">854</span>
               <span className="text-xs text-gray-500">İşlem</span>
             </div>
           </div>
           <div className="flex w-full justify-around mt-6 text-xs text-gray-500">
             <div className="flex flex-col items-center">
               <span>Kredi Kartı</span>
               <span className="font-bold text-gray-900 text-sm">60%</span>
             </div>
             <div className="flex flex-col items-center">
               <span>Nakit</span>
               <span className="font-bold text-gray-900 text-sm">25%</span>
             </div>
             <div className="flex flex-col items-center">
               <span>Sigorta</span>
               <span className="font-bold text-gray-900 text-sm">15%</span>
             </div>
           </div>
        </Card>
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
                <th className="px-6 py-4">Durum</th>
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
                  <td className="px-6 py-4"><Badge status={trx.status} /></td>
                  <td className="px-6 py-4 text-right"><button className="text-gray-400 hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
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