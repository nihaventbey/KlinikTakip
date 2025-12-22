import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface AddPatientFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddPatientForm({ onSuccess, onCancel }: AddPatientFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    identity_number: '',
    phone: '',
    email: '',
    birth_date: '',
    gender: 'other',
    address: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.from('patients').insert([
        {
          clinic_id: user?.clinic_id, // Otomatik olarak kullanıcının kliniğine ekler
          ...formData,
          // Boş string gelen opsiyonel alanları null gönder (DB temizliği için)
          email: formData.email || null,
          birth_date: formData.birth_date || null,
          identity_number: formData.identity_number || null,
        }
      ]);

      if (error) throw error;
      onSuccess(); // Başarılı olursa listeyi yenilemek için sinyal gönder
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}
      
      <Input label="Ad Soyad *" name="full_name" required value={formData.full_name} onChange={handleChange} />
      
      <div className="grid grid-cols-2 gap-4">
        <Input label="TC Kimlik No" name="identity_number" maxLength={11} value={formData.identity_number} onChange={handleChange} />
        <Input label="Telefon *" name="phone" required type="tel" value={formData.phone} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Doğum Tarihi" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cinsiyet</label>
          <select 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="male">Erkek</option>
            <option value="female">Kadın</option>
            <option value="other">Diğer</option>
          </select>
        </div>
      </div>

      <Input label="E-posta" name="email" type="email" value={formData.email} onChange={handleChange} />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
        <textarea 
          name="address" 
          rows={2} 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel} className="bg-gray-200 text-gray-800 hover:bg-gray-300">İptal</Button>
        <Button type="submit" isLoading={loading}>Kaydet</Button>
      </div>
    </form>
  );
}