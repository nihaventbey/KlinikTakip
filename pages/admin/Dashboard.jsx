import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FaUserInjured, FaCalendarCheck, FaMoneyBillWave, FaUserMd } from 'react-icons/fa';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const StatCard = ({ title, value, icon, color }) => (
  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center' }}>
    <div style={{ backgroundColor: color, padding: '15px', borderRadius: '50%', color: 'white', marginRight: '15px', fontSize: '1.5em' }}>
      {icon}
    </div>
    <div>
      <h3 style={{ margin: 0, fontSize: '0.9em', color: '#7f8c8d' }}>{title}</h3>
      <p style={{ margin: '5px 0 0 0', fontSize: '1.5em', fontWeight: 'bold', color: '#2c3e50' }}>{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    totalDoctors: 0
  });
  const [clinicInfo, setClinicInfo] = useState({ name: 'Yönetim Paneli', logo_url: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Toplam Hasta Sayısı
        const { count: patientCount } = await supabase
          .from('patients')
          .select('*', { count: 'exact', head: true });

        // 2. Bugünkü Randevular
        const today = new Date().toISOString().split('T')[0];
        const { count: appointmentCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('date', today); // Şemanızda 'date' sütunu var

        // 3. Aylık Ciro (Transactions tablosundan)
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        const { data: transactions } = await supabase
          .from('transactions')
          .select('amount')
          .gte('created_at', firstDayOfMonth); // created_at veya transaction_date kullanılabilir

        const revenue = transactions?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;

        // 4. Doktor Sayısı (Profiles tablosundan)
        const { count: doctorCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'DOCTOR');

        // 5. Klinik Bilgileri
        const { data: settings } = await supabase
          .from('clinic_settings')
          .select('clinic_name, logo_url')
          .limit(1)
          .maybeSingle();

        if (settings) {
          setClinicInfo({ name: settings.clinic_name || 'Yönetim Paneli', logo_url: settings.logo_url });
        } else {
          console.warn('Klinik ayarları (clinic_settings) bulunamadı, varsayılan değerler kullanılıyor.');
        }

        setStats({
          totalPatients: patientCount || 0,
          todayAppointments: appointmentCount || 0,
          monthlyRevenue: revenue,
          totalDoctors: doctorCount || 0
        });
      } catch (error) {
        console.error('Dashboard veri hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Veriler yükleniyor...</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        {clinicInfo.logo_url && <img src={clinicInfo.logo_url} alt="Logo" style={{ height: '50px', marginRight: '15px', borderRadius: '5px' }} />}
        <h1 style={{ color: '#2c3e50', margin: 0 }}>{clinicInfo.name}</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard 
          title="Toplam Hasta" 
          value={stats.totalPatients} 
          icon={<FaUserInjured />} 
          color="#3498db" 
        />
        <StatCard 
          title="Bugünkü Randevular" 
          value={stats.todayAppointments} 
          icon={<FaCalendarCheck />} 
          color="#e67e22" 
        />
        <StatCard 
          title="Aylık Ciro" 
          value={`₺${stats.monthlyRevenue.toLocaleString('tr-TR')}`} 
          icon={<FaMoneyBillWave />} 
          color="#27ae60" 
        />
        <StatCard 
          title="Aktif Doktorlar" 
          value={stats.totalDoctors} 
          icon={<FaUserMd />} 
          color="#9b59b6" 
        />
      </div>

      {/* Buraya son randevular veya grafikler eklenebilir */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3>Sistem Durumu</h3>
        <p>Veritabanı bağlantısı aktif. Tüm modüller çalışıyor.</p>
      </div>
    </div>
  );
};

export default Dashboard;
