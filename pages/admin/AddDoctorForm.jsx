import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase ayarlarınızın .env dosyasında olduğunu varsayıyoruz
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AddDoctorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    email: '',
    password: '', // Şifre alanı eklendi
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
          persistSession: false,
          autoRefreshToken: false,
        }
      });

      // 2. Auth Kullanıcısını Oluştur
      const { data: authData, error: authError } = await tempSupabase.auth.signUp({
        email: formData.email,
        password: formData.password || '123456', // Varsayılan şifre
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Kullanıcı oluşturulamadı.');

      const userId = authData.user.id;
      let photoUrl = '';

      // 3. Fotoğrafı Yükle
      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`; // Benzersiz isim
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('doctor-profiles') 
          .upload(filePath, photo);

        if (uploadError) throw uploadError;

        // Yüklenen dosyanın URL'ini al
        const { data } = supabase.storage.from('doctor-profiles').getPublicUrl(filePath);
        photoUrl = data.publicUrl;
      }

      // 4. Doktor verisini 'profiles' tablosuna kaydet (AuthContext burayı okur)
      const { error: dbError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId, // Auth ID ile eşleşmeli
            full_name: formData.name,
            specialty: formData.specialization,
            email: formData.email,
            avatar_url: photoUrl,
            role: 'DOCTOR',
            updated_at: new Date(),
          },
        ]);

      if (dbError) throw dbError;

      alert('Doktor başarıyla eklendi!');
      setFormData({ name: '', specialization: '', email: '', password: '' });
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
      <h2 className="text-xl mb-4">Yeni Doktor Ekle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Ad Soyad" className="w-full border p-2" required
          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        
        <input type="text" placeholder="Uzmanlık Alanı" className="w-full border p-2" required
          value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} />

        <input type="email" placeholder="E-posta" className="w-full border p-2" required
          value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />

        <input type="password" placeholder="Şifre (Min 6 karakter)" className="w-full border p-2" required
          value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />

        <div>
          <label className="block text-sm text-gray-600">Profil Fotoğrafı</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full" />
        </div>

        <button type="submit" disabled={uploading} className="w-full bg-blue-600 text-white p-2 rounded">
          {uploading ? 'Yükleniyor...' : 'Kaydet'}
        </button>
      </form>
    </div>
  );
};

export default AddDoctorForm;