import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from './components/UI';
import { supabase } from './lib/supabase';

// Tip Tanımlamaları
interface Clinic {
  id: number;
  name: string;
  address: string;
  phone_number: string;
}

interface Profile {
  id: string; // Corresponds to auth.users.id
  full_name: string;
  role: string;
  email: string;
  clinic_id: number;
  clinics: {
    name: string;
  };
}

const USER_ROLES = ['admin', 'doctor', 'assistant', 'receptionist', 'accountant'];

export const SuperAdminDashboard: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: clinicsData, error: clinicsError } = await supabase.from('clinics').select('*');
      if (clinicsError) throw clinicsError;
      if (clinicsData) setClinics(clinicsData);

      const { data: profilesData, error: profilesError } = await supabase.from('profiles').select(`
        id,
        full_name,
        role,
        email,
        clinic_id,
        clinics (
            name
        )
      `);
      if (profilesError) throw profilesError;
      if (profilesData) setProfiles(profilesData as Profile[]);

    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user: Profile | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ ...user });
      setIsNewUser(false);
    } else {
      setEditingUser(null);
      setFormData({ role: 'assistant', clinic_id: clinics[0]?.id || '' });
      setIsNewUser(true);
    }
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    if (isNewUser) {
      // Admin client to create user
      // This requires running in a secure environment (server-side) or enabling the Admin API carefully.
      // We will simulate the call here. For a real app, create an edge function.
      const { data, error } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: { full_name: formData.full_name }
      });

      if (error || !data.user) {
        console.error("Yeni kullanıcı oluşturma hatası:", error);
        return;
      }
      
      // Now update the profile with role and clinic
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: formData.role, clinic_id: formData.clinic_id, full_name: formData.full_name, email: formData.email })
        .eq('id', data.user.id);

      if (profileError) {
        console.error("Profil güncelleme hatası:", profileError);
      }

    } else if (editingUser) {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          role: formData.role,
          clinic_id: formData.clinic_id
        })
        .eq('id', editingUser.id);
      
      if (error) {
        console.error("Kullanıcı güncelleme hatası:", error);
      }
    }

    setShowUserModal(false);
    fetchData(); // Refresh data
  };

  const handleDeleteUser = async (user: Profile) => {
    if (window.confirm(`${user.full_name} adlı kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
      // This requires an admin-privileged Supabase client. 
      // It should ideally be called from a secure edge function.
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) {
        console.error('Kullanıcı silme hatası:', error);
        alert(`Hata: ${error.message}`);
      } else {
        alert('Kullanıcı başarıyla silindi.');
        fetchData();
      }
    }
  };
  
  const filteredProfiles = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Klinik ve Kullanıcı Yönetimi</h1>
          <p className="text-gray-500 font-medium">Tüm klinikleri ve kullanıcıları yönetin.</p>
        </div>
        <Button icon="person_add" onClick={() => handleOpenModal()}>Yeni Kullanıcı Ekle</Button>
      </div>

       {/* Search Bar */}
       <div className="mb-4">
          <input
            type="text"
            placeholder="Kullanıcı adı veya e-posta ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 bg-white border border-gray-200 rounded-xl font-medium outline-none focus:border-blue-600"
          />
        </div>

      {loading ? <p>Yükleniyor...</p> : (
        <div className="space-y-10">
          {clinics.map(clinic => (
            <Card key={clinic.id} className="border-none shadow-xl rounded-[32px] overflow-hidden">
              <div className="p-6 bg-gray-50 border-b border-gray-100">
                <h2 className="text-xl font-extrabold text-gray-800">{clinic.name}</h2>
                <p className="text-sm text-gray-500">{clinic.address}</p>
              </div>
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="p-6 text-xs font-extrabold text-gray-400 uppercase">Ad Soyad</th>
                    <th className="p-6 text-xs font-extrabold text-gray-400 uppercase">E-posta</th>
                    <th className="p-6 text-xs font-extrabold text-gray-400 uppercase">Rol</th>
                    <th className="p-6 text-xs font-extrabold text-gray-400 uppercase text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProfiles.filter(p => p.clinic_id === clinic.id).map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-6 font-bold text-gray-900">{user.full_name || '-'}</td>
                      <td className="p-6 text-sm text-gray-600 font-medium">{user.email || '-'}</td>
                      <td className="p-6"><Badge status={user.role as any} text={user.role} /></td>
                      <td className="p-6 text-right">
                        <Button size="sm" icon="edit" variant="ghost" onClick={() => handleOpenModal(user)}>Düzenle</Button>
                        <Button size="sm" icon="delete" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => handleDeleteUser(user)}>Sil</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ))}
        </div>
      )}

      {/* User Edit/Create Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="p-8 w-full max-w-lg shadow-2xl rounded-[32px]">
            <h3 className="text-2xl font-extrabold mb-6">{isNewUser ? 'Yeni Kullanıcı Oluştur' : 'Kullanıcıyı Düzenle'}</h3>
            <div className="flex flex-col gap-4">
                <input placeholder="Ad Soyad" value={formData.full_name || ''} className="p-4 bg-gray-50 rounded-xl font-bold" onChange={e => setFormData({...formData, full_name: e.target.value})} />
                <input type="email" placeholder="E-posta" value={formData.email || ''} disabled={!isNewUser} className="p-4 bg-gray-50 rounded-xl font-bold disabled:bg-gray-200" onChange={e => setFormData({...formData, email: e.target.value})} />
                {isNewUser && (
                  <input type="password" placeholder="Şifre" className="p-4 bg-gray-50 rounded-xl font-bold" onChange={e => setFormData({...formData, password: e.target.value})} />
                )}
                
                <select value={formData.role || ''} className="p-4 bg-gray-50 rounded-xl font-bold" onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="" disabled>Rol Seçin</option>
                  {USER_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                </select>

                <select value={formData.clinic_id || ''} className="p-4 bg-gray-50 rounded-xl font-bold" onChange={e => setFormData({...formData, clinic_id: parseInt(e.target.value)})}>
                  <option value="" disabled>Klinik Seçin</option>
                  {clinics.map(clinic => <option key={clinic.id} value={clinic.id}>{clinic.name}</option>)}
                </select>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowUserModal(false)}>İptal</Button>
                <Button className="flex-1" onClick={handleSaveUser}>Kaydet</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};