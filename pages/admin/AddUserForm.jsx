import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ROLES } from './roles';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '', // Şifre alanı eklendi
    role: ROLES.DOCTOR, // Varsayılan rol
    specialization: '',
    commissionRate: 0,
  });
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // 1. Admin oturumunu bozmadan yeni kullanıcı oluşturmak için geçici client
      const tempSupabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false, // Oturumu tarayıcıda saklama
          autoRefreshToken: false,
        }
      });

      // 2. Auth Kullanıcısını Oluştur
      const { data: authData, error: authError } = await tempSupabase.auth.signUp({
        email: formData.email,
        password: formData.password || '123456', // Varsayılan veya girilen şifre
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Kullanıcı oluşturulamadı.');

      const userId = authData.user.id;
      let photoUrl = '';

      // 3. Fotoğraf Yükleme (Varsa)
      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('doctor-profiles') // İsim 'avatars' veya 'staff-photos' olarak da güncellenebilir
          .upload(filePath, photo);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('doctor-profiles').getPublicUrl(filePath);
        photoUrl = data.publicUrl;
      }

      // 4. Profil Verisini Kaydetme (profiles tablosu)
      const { error: dbError } = await supabase
        .from('profiles') 
        .insert([
          {
            id: userId, // Auth ID ile eşleşmeli
            full_name: formData.name,
            email: formData.email, // Email sütununu da dolduruyoruz
            role: formData.role,
            specialty: formData.role === ROLES.DOCTOR ? formData.specialization : null,
            commission_rate: formData.role === ROLES.DOCTOR ? formData.commissionRate : 0,
            avatar_url: photoUrl,
            updated_at: new Date(),
          },
        ]);

      if (dbError) throw dbError;

      alert(`${formData.role} başarıyla eklendi!`);
      // Formu temizle
      setFormData({ name: '', email: '', password: '', role: ROLES.DOCTOR, specialization: '', commissionRate: 0 });
      setPhoto(null);

    } catch (error) {
      console.error('Hata:', error.message);
      alert('Bir hata oluştu: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-xl mb-4 font-bold text-gray-800">Yeni Personel Ekle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Rol Seçimi */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Personel Rolü</label>
          <select 
            className="w-full border p-2 rounded mt-1"
            value={formData.role} 
            onChange={e => setFormData({...formData, role: e.target.value})}
          >
            <option value={ROLES.DOCTOR}>Doktor</option>
            <option value={ROLES.ASSISTANT}>Asistan</option>
            <option value={ROLES.SECRETARY}>Sekreter</option>
            <option value={ROLES.ACCOUNTANT}>Muhasebeci</option>
          </select>
        </div>

        <input type="text" placeholder="Ad Soyad" className="w-full border p-2 rounded" required
          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        
        <input type="email" placeholder="E-posta" className="w-full border p-2 rounded" required
          value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />

        <input type="password" placeholder="Şifre (Min 6 karakter)" className="w-full border p-2 rounded" required
          value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />

        {/* Sadece Doktorlar İçin Ek Alanlar */}
        {formData.role === ROLES.DOCTOR && (
          <>
            <input type="text" placeholder="Uzmanlık Alanı (Örn: Ortodonti)" className="w-full border p-2 rounded"
              value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} />
            
            <div>
              <label className="block text-sm text-gray-600">Hakediş Oranı (0.0 - 1.0)</label>
              <input type="number" step="0.01" min="0" max="1" placeholder="0.40" className="w-full border p-2 rounded"
                value={formData.commissionRate} onChange={e => setFormData({...formData, commissionRate: parseFloat(e.target.value)})} />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm text-gray-600">Profil Fotoğrafı</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full mt-1" />
        </div>

        <button type="submit" disabled={uploading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          {uploading ? 'Kaydediliyor...' : 'Personeli Kaydet'}
        </button>
      </form>
    </div>
  );
};

export default AddUserForm;