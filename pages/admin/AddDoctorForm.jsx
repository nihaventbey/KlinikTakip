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
      let photoUrl = '';

      // 1. Fotoğrafı 'doctor-profiles' bucket'ına yükle
      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`; // Benzersiz isim
        const filePath = `${fileName}`;

        // 'doctor-profiles' bucket'ının Supabase panelinden oluşturulmuş ve public olması gerekir.
        const { error: uploadError } = await supabase.storage
          .from('doctor-profiles') 
          .upload(filePath, photo);

        if (uploadError) throw uploadError;

        // Yüklenen dosyanın URL'ini al
        const { data } = supabase.storage.from('doctor-profiles').getPublicUrl(filePath);
        photoUrl = data.publicUrl;
      }

      // 2. Doktor verisini veritabanına kaydet (Örnek tablo: profiles veya doctors)
      const { error: dbError } = await supabase
        .from('doctors')
        .insert([
          {
            name: formData.name,
            specialization: formData.specialization,
            email: formData.email,
            photo_url: photoUrl, // Fotoğraf linkini kaydet
            role: 'DOCTOR'
          },
        ]);

      if (dbError) throw dbError;

      alert('Doktor başarıyla eklendi!');
      setFormData({ name: '', specialization: '', email: '' });
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