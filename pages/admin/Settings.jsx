// c:\Users\rslyl\OneDrive\Desktop\Deneme1\dentcare\pages\admin\Settings.jsx

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    clinic_name: '',
    logo_url: ''
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // .limit(1) kullanarak birden fazla satır olsa bile hata almayı engelliyoruz
      const { data, error } = await supabase
        .from('clinic_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          clinic_name: data.clinic_name || '',
          logo_url: data.logo_url || ''
        });
      }
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error);
      setMessage({ type: 'error', text: 'Ayarlar yüklenemedi.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Mevcut ayar kaydını kontrol et
      const { data: existing } = await supabase
        .from('clinic_settings')
        .select('id')
        .limit(1)
        .maybeSingle();

      let error;
      if (existing) {
        // Varsa güncelle
        const { error: updateError } = await supabase
          .from('clinic_settings')
          .update(formData)
          .eq('id', existing.id);
        error = updateError;
      } else {
        // Yoksa yeni oluştur
        const { error: insertError } = await supabase
          .from('clinic_settings')
          .insert([formData]);
        error = insertError;
      }

      if (error) throw error;
      setMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi.' });
      
      // Sayfayı yenilemek isterseniz: window.location.reload();
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      setMessage({ type: 'error', text: 'Ayarlar kaydedilirken hata oluştu.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Ayarlar yükleniyor...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '20px', color: '#2c3e50', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Klinik Ayarları</h2>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          borderRadius: '4px', 
          backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
          color: message.type === 'error' ? '#dc2626' : '#16a34a'
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#34495e' }}>Klinik Adı</label>
          <input
            type="text"
            name="clinic_name"
            value={formData.clinic_name}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#34495e' }}>Logo URL</label>
          <input
            type="text"
            name="logo_url"
            value={formData.logo_url}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="https://ornek.com/logo.png"
          />
          {formData.logo_url && (
            <div style={{ marginTop: '10px' }}>
              <img src={formData.logo_url} alt="Önizleme" style={{ height: '40px' }} />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={saving}
          style={{ 
            backgroundColor: '#3498db', 
            color: 'white', 
            padding: '12px 24px', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
            fontSize: '1em'
          }}
        >
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </form>
    </div>
  );
};

export default Settings;
