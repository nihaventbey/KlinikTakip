import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from './roles';

interface Profile {
  id: string;
  full_name: string;
  email?: string;
  role: string;
  specialty?: string;
  updated_at?: string;
}

export const SuperAdminDashboard: React.FC = () => {
  // TypeScript hatasını gidermek için 'as any' kullanıyoruz
  const { signOut, supabase } = useAuth() as any;
  const navigate = useNavigate();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalDoctors: 0, totalPatients: 0 });

  // Kullanıcıları Getir
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(profiles || []);

      // İstatistikleri Hesapla
      const { count: patientCount } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: profiles?.length || 0,
        totalDoctors: profiles?.filter(p => p.role === ROLES.DOCTOR).length || 0,
        totalPatients: patientCount || 0
      });
    } catch (error) {
      console.error('Kullanıcılar çekilemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Rol Güncelleme İşlemi
  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      // Listeyi güncelle
      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
      alert('Kullanıcı rolü güncellendi.');
    } catch (error) {
      alert('Güncelleme hatası: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/superadmin/login');
  };

  // Şifre Güncelleme (Sadece geliştirme aşamasında veya profil ayarlarında kullanılır)
  const updateMyPassword = async () => {
    const newPassword = prompt("Yeni şifrenizi girin:");
    if (!newPassword) return;
    
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) alert("Hata: " + error.message);
    else alert("Şifreniz başarıyla güncellendi/hashlendi.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sistem Yönetimi</h1>
            <p className="text-gray-500">Kullanıcı rolleri ve yetkilendirme merkezi.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={updateMyPassword}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Şifremi Değiştir
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Toplam Kullanıcı</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">group</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Toplam Doktor</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalDoctors}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">medical_services</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Toplam Hasta</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalPatients}</h3>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">accessibility_new</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Kullanıcı Listesi</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-900 font-semibold">
                  <tr>
                    <th className="p-4">Ad Soyad</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Mevcut Rol</th>
                    <th className="p-4">Uzmanlık</th>
                    <th className="p-4">Rolü Değiştir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{user.full_name || 'İsimsiz'}</td>
                      <td className="p-4 text-gray-500">{user.email || '-'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-600'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">{user.specialty || '-'}</td>
                      <td className="p-4">
                        <select 
                          className="border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 outline-none"
                          value={user.role}
                          onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                        >
                          {Object.values(ROLES).map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};