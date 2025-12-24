import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/db';
import Modal from '../../components/ui/Modal';
import AddPatientForm from './patients/AddPatientForm';
import { UserPlus, CalendarPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user: profile } = useAuth();
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats', profile?.clinic_id],
    queryFn: () => db.dashboard.getStats(profile!.clinic_id!),
    enabled: !!profile?.clinic_id,
  });

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '...';
    return value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Klinik Genel Bakış</h1>
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Bugünkü Randevular" 
          value={isLoading ? '...' : stats?.todayAppointments.toString() ?? '0'}
          color="bg-blue-500" 
        />
        <StatCard 
          title="Aktif Hastalar" 
          value={isLoading ? '...' : stats?.activePatients.toString() ?? '0'}
          color="bg-green-500" 
        />
        <StatCard 
          title="Bekleyen Ödemeler" 
          value={isLoading ? '...' : formatCurrency(stats?.pendingPayments)}
          color="bg-orange-500" 
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Hızlı İşlemler</h2>
        <div className="flex flex-wrap gap-4">
            <Link to="/admin/calendar?new-appointment=true" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors">
              <CalendarPlus size={18} />
              <span>Yeni Randevu</span>
            </Link>
            <button 
              onClick={() => setIsPatientModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 font-semibold rounded-lg hover:bg-green-100 transition-colors"
            >
              <UserPlus size={18} />
              <span>Hasta Kaydı</span>
            </button>
        </div>
      </div>

      <Modal 
        isOpen={isPatientModalOpen} 
        onClose={() => setIsPatientModalOpen(false)} 
        title="Yeni Hasta Kaydı"
      >
        <AddPatientForm 
          onSuccess={() => setIsPatientModalOpen(false)} 
          onCancel={() => setIsPatientModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}

const StatCard = ({ title, value, color }: { title: string, value: string, color: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
    <div className={`w-3 h-3 rounded-full ${color}`} />
  </div>
);