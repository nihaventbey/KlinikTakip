import React, { useState, useEffect } from 'react';
// Added Link import from react-router-dom
import { Link } from 'react-router-dom';
import { Card, Button, Badge } from '../../components/UI';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { db } from '../../lib/db';
import { Patient, Transaction, TreatmentItem, InventoryItem } from '../../types';

// --- Dashboard ---
export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [data, setData] = useState({
    appointments: 0,
    patients: 0,
    income: 0,
    tasks: 0,
    recentPatients: [] as Patient[],
    chartData: [] as any[]
  });

  useEffect(() => {
    const loadData = () => {
      const pts = db.patients.getAll();
      const apts = db.appointments.getAll();
      const trxs = db.transactions.getAll();
      const tasks = db.tasks.getAll().filter(t => t.status === 'pending');
      
      const monthIncome = trxs
        .filter(t => t.type === 'income' && t.date.startsWith('2023-10'))
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      setData({
        appointments: apts.length,
        patients: pts.length,
        income: monthIncome,
        tasks: tasks.length,
        recentPatients: pts.slice(0, 5),
        chartData: [
            { name: 'Pzt', value: 4200 }, { name: 'Sal', value: 3800 }, { name: 'Çar', value: 5100 },
            { name: 'Per', value: 2900 }, { name: 'Cum', value: 1950 }, { name: 'Cmt', value: 6500 }, { name: 'Paz', value: 3200 },
        ]
      });
    };

    loadData();
    window.addEventListener('storage_update', loadData);
    return () => window.removeEventListener('storage_update', loadData);
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Klinik Özeti</h1>
          <p className="text-gray-500 text-sm">Hoş geldiniz, {profile?.full_name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Randevular', value: data.appointments, color: 'text-primary', icon: 'calendar_month' },
          { title: 'Toplam Hasta', value: data.patients, color: 'text-purple-600', icon: 'group' },
          { title: 'Aylık Gelir', value: `₺${data.income.toLocaleString()}`, color: 'text-green-600', icon: 'payments' },
          { title: 'Bekleyen Görev', value: data.tasks, color: 'text-orange-500', icon: 'task_alt' }
        ].map((stat, i) => (
          <Card key={i} className="p-5 relative overflow-hidden group">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            <span className={`absolute -right-2 -top-2 material-symbols-outlined text-6xl opacity-10 ${stat.color}`}>{stat.icon}</span>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-bold text-gray-900 mb-6">Haftalık Performans</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#135bec" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#135bec" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#135bec" strokeWidth={3} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-gray-900 mb-4">Son Kayıtlar</h3>
          <div className="space-y-4">
            {data.recentPatients.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                 <img src={p.avatar_url || `https://ui-avatars.com/api/?name=${p.full_name}&background=random`} className="w-10 h-10 rounded-full object-cover" />
                 <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{p.full_name}</p>
                    <p className="text-xs text-gray-500">{p.phone}</p>
                 </div>
                 <Badge status={p.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- Patients Page ---
export const PatientsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<Patient[]>([]);
    
    useEffect(() => {
        const load = () => setPatients(db.patients.getAll());
        load();
        window.addEventListener('storage_update', load);
        return () => window.removeEventListener('storage_update', load);
    }, []);

    const filtered = patients.filter(p => p.full_name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Hastalar ({patients.length})</h1>
                <Button icon="person_add" onClick={() => {
                    const name = prompt("Hasta Adı:");
                    if(name) db.patients.add({ full_name: name, phone: '05...', status: 'new', balance: 0, ltv: 0, created_at: new Date().toISOString() });
                }}>Yeni Hasta</Button>
            </div>

            <div className="relative max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input 
                    type="text" placeholder="Hasta ara..." 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <Card className="overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Hasta</th>
                            <th className="px-6 py-4">İletişim</th>
                            <th className="px-6 py-4">LTV</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4 text-right">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-bold">{p.full_name}</td>
                                <td className="px-6 py-4 text-gray-500">{p.phone}</td>
                                <td className="px-6 py-4 font-bold">₺{p.ltv.toLocaleString()}</td>
                                <td className="px-6 py-4"><Badge status={p.status} /></td>
                                <td className="px-6 py-4 text-right">
                                    {/* Link is now correctly defined */}
                                    <Link to="/admin/clinical" className="text-primary hover:underline">Dosya Aç</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

// --- Finance Page ---
export const FinancePage: React.FC = () => {
    const [trxs, setTrxs] = useState<Transaction[]>([]);
    
    useEffect(() => {
        const load = () => setTrxs(db.transactions.getAll());
        load();
        window.addEventListener('storage_update', load);
        return () => window.removeEventListener('storage_update', load);
    }, []);

    const income = trxs.filter(t => t.type === 'income').reduce((a,b) => a + b.amount, 0);
    const expense = trxs.filter(t => t.type === 'expense').reduce((a,b) => a + b.amount, 0);

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Finansal Durum</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 bg-green-50 border-green-100">
                    <p className="text-green-700 font-bold text-xs uppercase">Toplam Gelir</p>
                    <h3 className="text-2xl font-bold text-green-900">₺{income.toLocaleString()}</h3>
                </Card>
                <Card className="p-6 bg-red-50 border-red-100">
                    <p className="text-red-700 font-bold text-xs uppercase">Toplam Gider</p>
                    <h3 className="text-2xl font-bold text-red-900">₺{expense.toLocaleString()}</h3>
                </Card>
                <Card className="p-6 bg-blue-50 border-blue-100">
                    <p className="text-blue-700 font-bold text-xs uppercase">Net Kasa</p>
                    <h3 className="text-2xl font-bold text-blue-900">₺{(income - expense).toLocaleString()}</h3>
                </Card>
            </div>

            <Card className="overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Tarih</th>
                            <th className="px-6 py-4">Açıklama</th>
                            <th className="px-6 py-4 text-right">Tutar</th>
                            <th className="px-6 py-4">Tür</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {trxs.map(t => (
                            <tr key={t.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 text-gray-500">{t.date}</td>
                                <td className="px-6 py-4 font-bold">{t.patient}</td>
                                <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type === 'income' ? '+' : '-'} ₺{t.amount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4"><Badge status={t.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

// --- Treatments & Inventory ---
export const TreatmentsAdminPage: React.FC = () => {
    const [treatments, setTreatments] = useState<TreatmentItem[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);

    useEffect(() => {
        const load = () => {
            setTreatments(db.treatments.getAll());
            setInventory(db.inventory.getAll());
        };
        load();
        window.addEventListener('storage_update', load);
        return () => window.removeEventListener('storage_update', load);
    }, []);

    return (
        <div className="flex flex-col gap-8">
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Tedavi Kataloğu</h2>
                    <Button icon="add" onClick={() => {
                        const name = prompt("Tedavi Adı:");
                        const price = Number(prompt("Fiyat (TL):"));
                        if(name && price) db.treatments.add({ name, price, category: 'Genel', duration: '30' });
                    }}>Yeni Tedavi</Button>
                </div>
                <Card className="overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 font-bold">
                            <tr>
                                <th className="px-6 py-4">Tedavi</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4 text-right">Fiyat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {treatments.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold">{t.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{t.category}</td>
                                    <td className="px-6 py-4 text-right font-bold text-primary">₺{t.price.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4">Stok Durumu</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {inventory.map(item => (
                        <Card key={item.id} className={`p-6 border-l-4 ${item.status === 'low' ? 'border-orange-500' : 'border-green-500'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-xs font-bold uppercase">{item.category}</p>
                                    <h4 className="font-bold text-gray-900 mt-1">{item.name}</h4>
                                </div>
                                <Badge status={item.status === 'low' ? 'pending' : 'active'} />
                            </div>
                            <div className="mt-4 flex items-end justify-between">
                                <span className="text-2xl font-bold">{item.stock} <span className="text-sm font-normal text-gray-400">{item.unit}</span></span>
                                <button className="text-primary text-xs font-bold hover:underline">Sipariş Ver</button>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
};

// --- Settings Page ---
export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState(settings || { clinic_name: '', phone: '', address: '', email: '', logo_url: '' });
  const [msg, setMsg] = useState('');

  const handleSave = async () => {
    await updateSettings(formData);
    setMsg('Ayarlar başarıyla kaydedildi!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Klinik Ayarları</h1>
        {msg && <Badge status="confirmed" />}
      </div>

      <Card className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {[
                { label: 'Klinik Adı', name: 'clinic_name' },
                { label: 'Telefon', name: 'phone' },
                { label: 'E-Posta', name: 'email' },
                { label: 'Logo URL', name: 'logo_url' }
             ].map(field => (
                <div key={field.name} className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-600">{field.label}</label>
                    <input 
                        name={field.name} 
                        value={(formData as any)[field.name]} 
                        onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                        className="p-3 border rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20" 
                    />
                </div>
             ))}
             <div className="flex flex-col gap-2 md:col-span-2">
                 <label className="text-sm font-bold text-gray-600">Adres</label>
                 <input name="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="p-3 border rounded-lg bg-gray-50" />
             </div>
        </div>
        <div className="pt-4 border-t flex justify-end">
             <Button onClick={handleSave} icon="save">Değişiklikleri Kaydet</Button>
        </div>
      </Card>
    </div>
  );
};