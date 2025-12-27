import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/db';
import Modal from '../../components/ui/Modal';
import AddPatientForm from './patients/AddPatientForm';
import TransactionForm from './finance/TransactionForm';
import { UserPlus, CalendarPlus, DollarSign, Users, CalendarClock, Wallet, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

// Helper to format currency
const formatCurrency = (value: number | undefined | null) => {
  if (value === undefined || value === null) return '...';
  return value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
};

const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center gap-4">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const WidgetError = ({ message }: { message: string }) => (
    <div className="h-full bg-red-50 rounded-xl flex flex-col items-center justify-center text-red-600 p-4">
        <AlertTriangle className="w-8 h-8 mb-2" />
        <p className="text-sm font-semibold">Veri Yüklenemedi</p>
        <p className="text-xs text-center">{message}</p>
    </div>
)

const AppointmentsChart = ({ data, loading, isError, error }: { data: any, loading: boolean, isError: boolean, error: Error | null }) => {
  if (loading) return <div className="h-80 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500">Grafik yükleniyor...</div>;
  if (isError) return <WidgetError message={error?.message || 'Grafik verileri alınamadı.'} />;
  
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip 
            cursor={{ fill: 'rgba(229, 231, 235, 0.5)' }}
            contentStyle={{ borderRadius: '0.75rem', fontSize: '0.875rem' }}
          />
          <Legend wrapperStyle={{ fontSize: '0.875rem' }} />
          <Bar dataKey="count" name="Randevu Sayısı" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const UpcomingAppointments = ({ data, loading, isError, error }: { data: any, loading: boolean, isError: boolean, error: Error | null }) => {
  if (loading) return <div className="text-center text-gray-500 py-4">Randevular yükleniyor...</div>;
  if (isError) return <WidgetError message={error?.message || 'Randevular alınamadı.'} />;
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 py-4">Bugün için yaklaşan randevu bulunmuyor.</div>;
  }
  return (
    <div className="space-y-3">
      {data.map((apt: any) => (
        <Link to={`/admin/patients/${apt.patient?.id}`} key={apt.id} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-semibold">
            {format(parseISO(apt.start_time), 'HH:mm')}
          </div>
          <div className="flex-grow overflow-hidden">
            <p className="font-semibold text-gray-800 truncate">{apt.patient?.full_name || 'Bilinmeyen Hasta'}</p>
            <p className="text-sm text-gray-500">
              {format(parseISO(apt.start_time), 'HH:mm')} - {apt.end_time ? format(parseISO(apt.end_time), 'HH:mm') : ''}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user: profile } = useAuth();
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboardStats', profile?.clinic_id],
    queryFn: () => db.dashboard.getStats(profile!.clinic_id!),
    enabled: !!profile?.clinic_id,
  });

  const { data: monthlyStats, isLoading: isLoadingMonthly, isError: isErrorMonthly, error: errorMonthly } = useQuery({
    queryKey: ['dashboardMonthlyStats', profile?.clinic_id],
    queryFn: () => db.dashboard.getMonthlyStats(profile!.clinic_id!),
    enabled: !!profile?.clinic_id,
  });

  const { data: upcomingAppointments, isLoading: isLoadingAppointments, isError: isErrorAppointments, error: errorAppointments } = useQuery({
    queryKey: ['upcomingAppointments', profile?.clinic_id],
    queryFn: () => db.dashboard.getUpcomingAppointments(profile!.clinic_id!),
    enabled: !!profile?.clinic_id,
  });

  const { data: weeklyAppointmentStats, isLoading: isLoadingWeeklyStats, isError: isErrorWeekly, error: errorWeekly } = useQuery({
    queryKey: ['weeklyAppointmentStats', profile?.clinic_id],
    queryFn: () => db.dashboard.getWeeklyAppointmentStats(profile!.clinic_id!),
    enabled: !!profile?.clinic_id,
  });
  
  const colorMap = {
    blue: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    green: "bg-green-50 text-green-700 hover:bg-green-100",
    yellow: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
  };
  
  const quickActions = [
    { name: 'Yeni Randevu', icon: <CalendarPlus size={18} />, action: '/admin/calendar?new-appointment=true', type: 'link', color: 'blue' as keyof typeof colorMap },
    { name: 'Hasta Kaydı', icon: <UserPlus size={18} />, action: () => setIsPatientModalOpen(true), type: 'button', color: 'green' as keyof typeof colorMap },
    { name: 'Finansal İşlem', icon: <DollarSign size={18} />, action: () => setIsTransactionModalOpen(true), type: 'button', color: 'yellow' as keyof typeof colorMap },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Klinik Genel Bakış</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard title="Bugünkü Randevular" value={isLoadingStats ? '...' : stats?.todayAppointments.toString() ?? '0'} icon={<CalendarClock size={22} className="text-white"/>} color="bg-blue-500" />
        <StatCard title="Aktif Hastalar" value={isLoadingStats ? '...' : stats?.activePatients.toString() ?? '0'} icon={<Users size={22} className="text-white"/>} color="bg-green-500" />
        <StatCard title="Bu Ayki Ciro" value={isErrorMonthly ? 'Hata' : formatCurrency(monthlyStats?.monthlyRevenue)} icon={<DollarSign size={22} className="text-white"/>} color="bg-indigo-500" />
        <StatCard title="Bu Ayki Yeni Hastalar" value={isLoadingMonthly ? '...' : monthlyStats?.newPatients.toString() ?? '0'} icon={<UserPlus size={22} className="text-white"/>} color="bg-teal-500" />
        <StatCard title="Bekleyen Ödemeler" value={isLoadingStats ? '...' : formatCurrency(stats?.pendingPayments)} icon={<Wallet size={22} className="text-white"/>} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Haftalık Randevu Analizi</h2>
            <AppointmentsChart data={weeklyAppointmentStats} loading={isLoadingWeeklyStats} isError={isErrorWeekly} error={errorWeekly as Error | null} />
        </div>
        
        <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Hızlı İşlemler</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                    {quickActions.map(qa => {
                        const baseClasses = "flex items-center gap-3 px-4 py-3 font-semibold rounded-lg transition-colors text-sm";
                        const className = `${baseClasses} ${colorMap[qa.color]}`;
                        if (qa.type === 'link') {
                            return <Link key={qa.name} to={qa.action as string} className={className}>{qa.icon}<span>{qa.name}</span></Link>;
                        }
                        return <button key={qa.name} onClick={qa.action as () => void} className={className}>{qa.icon}<span>{qa.name}</span></button>;
                    })}
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Yaklaşan Randevular</h2>
                <UpcomingAppointments data={upcomingAppointments} loading={isLoadingAppointments} isError={isErrorAppointments} error={errorAppointments as Error | null} />
            </div>
        </div>
      </div>

      <Modal isOpen={isPatientModalOpen} onClose={() => setIsPatientModalOpen(false)} title="Yeni Hasta Kaydı">
        <AddPatientForm onSuccess={() => setIsPatientModalOpen(false)} onCancel={() => setIsPatientModalOpen(false)} />
      </Modal>
      <Modal isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)} title="Yeni Finansal İşlem">
        <TransactionForm onClose={() => setIsTransactionModalOpen(false)} />
      </Modal>
    </div>
  );
}