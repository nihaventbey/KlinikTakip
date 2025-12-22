import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    activePatients: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    // Burada gerçek veritabanı sorguları yapılacak
    // Örnek olarak statik veri veya basit sorgular konulabilir
    const fetchStats = async () => {
      if (!user?.clinic_id) return;

      // Örnek: Bugünün randevu sayısı (Gerçek tablona göre uyarlanabilir)
      const { count } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('clinic_id', user.clinic_id)
        .gte('start_time', new Date().toISOString().split('T')[0]);

      setStats(prev => ({ ...prev, todayAppointments: count || 0 }));
    };

    fetchStats();
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Klinik Genel Bakış</h1>
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Bugünkü Randevular" 
          value={stats.todayAppointments.toString()} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Aktif Hastalar" 
          value="142" // Demo veri
          color="bg-green-500" 
        />
        <StatCard 
          title="Bekleyen Ödemeler" 
          value="₺ 24.500" // Demo veri
          color="bg-orange-500" 
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Hızlı İşlemler</h2>
        <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
              + Yeni Randevu
            </button>
            <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition">
              + Hasta Kaydı
            </button>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, color }: { title: string, value: string, color: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
    <div className={`w-3 h-3 rounded-full ${color}`} />
  </div>
);