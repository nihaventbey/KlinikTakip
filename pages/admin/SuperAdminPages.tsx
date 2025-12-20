import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { supabase } from '../../lib/supabase';

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
}

export const SuperAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'campaigns' | 'tenants'>('overview');
  const [stats, setStats] = useState({ totalRevenue: 0, activeClinics: 0, activeCampaigns: 0 });
  
  // Veri State'leri
  const [packages, setPackages] = useState<Package[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State'leri
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'package' | 'campaign' | null>(null);
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

      if (pkgData) setPackages(pkgData);
      if (cmpData) setCampaigns(cmpData);
      if (tntData) setTenants(tntData);

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

  const handleSave = async () => {
    if (modalType === 'package') {
      const { error } = await supabase.from('saas_packages').insert([formData]);
      if (!error) {
        setPackages([...packages, { ...formData, id: Math.random().toString() } as Package]);
        setShowModal(false);
      }
    } else if (modalType === 'campaign') {
      const { error } = await supabase.from('saas_campaigns').insert([formData]);
      if (!error) {
        setCampaigns([...campaigns, { ...formData, id: Math.random().toString() } as Campaign]);
        setShowModal(false);
      }
    }
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
        {['overview', 'packages', 'campaigns', 'tenants'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-bold text-sm transition-all capitalize ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {tab === 'tenants' ? 'Klinikler' : tab === 'packages' ? 'Paketler' : tab === 'campaigns' ? 'Kampanyalar' : 'Genel Bakış'}
          </button>
        ))}
      </div>

      {/* İçerik Alanı */}
      <div className="min-h-[400px]">
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tenants.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="p-6 font-bold text-gray-900">{t.clinic_name}</td>
                    <td className="p-6 text-sm text-blue-600 font-medium">{t.domain}</td>
                    <td className="p-6 text-sm font-bold">Gold Paket</td>
                    <td className="p-6 text-sm text-gray-500">{new Date(t.subscription_end).toLocaleDateString()}</td>
                    <td className="p-6"><Badge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {/* Modal (Basit Örnek) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-extrabold mb-6">{modalType === 'package' ? 'Yeni Paket' : 'Yeni Kampanya'}</h3>
            <div className="flex flex-col gap-4">
              {modalType === 'package' ? (
                <>
                  <input placeholder="Paket Adı" className="p-4 bg-gray-50 rounded-xl font-bold" onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input type="number" placeholder="Fiyat" className="p-4 bg-gray-50 rounded-xl font-bold" onChange={e => setFormData({...formData, price: e.target.value})} />
                </>
              ) : (
                <>
                  <input placeholder="Kampanya Kodu" className="p-4 bg-gray-50 rounded-xl font-bold uppercase" onChange={e => setFormData({...formData, code: e.target.value})} />
                  <input type="number" placeholder="İndirim Oranı (%)" className="p-4 bg-gray-50 rounded-xl font-bold" onChange={e => setFormData({...formData, discount_percent: e.target.value})} />
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
    </div>
  );
};