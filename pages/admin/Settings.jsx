import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

const Settings = () => {
  const { settings, loading, updateSettings } = useSettings();

  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || '',
        // Diğer klinik bilgileri eklenebilir. Örn: address, phone_number
        settings: {
          logo_url: settings.settings?.logo_url || ''
        }
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 'logo_url' gibi alanlar 'settings' nesnesinin içindedir.
    // 'name' gibi alanlar ise ana nesnenin üzerindedir.
    if (name === 'logo_url') {
      setFormData(prev => ({
        ...prev,
        settings: { ...prev.settings, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateSettings(formData);
      setMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi.' });
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      setMessage({ type: 'error', text: 'Ayarlar kaydedilirken hata oluştu.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading && !formData) return <div style={{ padding: '20px' }}>Ayarlar yükleniyor...</div>;
  if (!settings || !formData) return <div style={{ padding: '20px', color: 'red' }}>Bu ayarları yönetmek için bir kliniğe atanmış olmanız gerekir.</div>;

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
            name="name" // 'clinic_name' -> 'name' olarak değiştirildi
            value={formData.name}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#34495e' }}>Logo URL</label>
          <input
            type="text"
            name="logo_url" // Bu 'settings' altındaki 'logo_url'
            value={formData.settings.logo_url}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="https://ornek.com/logo.png"
          />
          {formData.settings.logo_url && (
            <div style={{ marginTop: '10px' }}>
              <img src={formData.settings.logo_url} alt="Önizleme" style={{ height: '40px' }} />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={saving || loading}
          style={{ 
            backgroundColor: '#3498db', 
            color: 'white', 
            padding: '12px 24px', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: (saving || loading) ? 'not-allowed' : 'pointer',
            opacity: (saving || loading) ? 0.7 : 1,
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

