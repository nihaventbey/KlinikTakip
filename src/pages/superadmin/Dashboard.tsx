import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Tenant } from '../../types';

export default function SuperDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      // 'saas_tenants' tablosundan verileri çek
      const { data, error } = await supabase
        .from('saas_tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Tip uyumsuzluğu olmaması için cast ediyoruz veya mapliyoruz
        setTenants(data as any[]); 
      }
      setLoading(false);
    };

    fetchTenants();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">SaaS Yönetim Paneli</h1>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="text-gray-400 text-sm">Toplam Klinik</div>
          <div className="text-3xl font-bold text-white mt-2">{tenants.length}</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="text-gray-400 text-sm">Aktif Abonelikler</div>
          <div className="text-3xl font-bold text-green-400 mt-2">
            {tenants.filter(t => t.status === 'active').length}
          </div>
        </div>
      </div>

      {/* Klinik Listesi Tablosu */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Kayıtlı Klinikler</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Klinik Adı</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Paket</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Kayıt Tarihi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={4} className="p-6 text-center">Yükleniyor...</td></tr>
              ) : tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{tenant.clinic_name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tenant.status === 'active' ? 'bg-green-100 text-green-800' : 
                      tenant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {tenant.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{tenant.subscription_plan || '-'}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(tenant.created_at).toLocaleDateString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}