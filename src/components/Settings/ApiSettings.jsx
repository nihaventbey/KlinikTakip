import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const ApiSettings = () => {
  const { user } = useAuth();

  const [smsKey, setSmsKey] = useState('');
  const [whatsappKey, setWhatsappKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', isError: false });

  const showNotification = (message, isError = false) => {
    setNotification({ show: true, message, isError });
    setTimeout(() => {
      setNotification({ show: false, message: '', isError: false });
    }, 3000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user || !user.clinic_id) {
      showNotification('Kullanıcı bilgileri bulunamadı. Lütfen tekrar giriş yapın.', true);
      return;
    }

    setLoading(true);

    const apiKeysToUpdate = [
      { name: 'sms', value: smsKey },
      { name: 'whatsapp', value: whatsappKey },
      { name: 'gemini', value: geminiKey },
    ];

    // Filter out empty keys and create promises for the ones with new values
    const updatePromises = apiKeysToUpdate
      .filter(key => key.value.trim() !== '')
      .map(key => 
        supabase.functions.invoke('update-api-secret', {
          body: {
            clinic_id: user.clinic_id,
            secret_name: key.name,
            secret_value: key.value,
          },
        })
      );

    if (updatePromises.length === 0) {
      setLoading(false);
      showNotification('Kaydedilecek yeni bir API anahtarı girilmedi.', true);
      return;
    }

    try {
      const results = await Promise.all(updatePromises);
      
      const hasError = results.some(res => res.error);
      if (hasError) {
        throw new Error('Bir veya daha fazla API anahtarı güncellenirken hata oluştu.');
      }

      showNotification('API anahtarları başarıyla kaydedildi.');
      // Clear fields after successful save
      setSmsKey('');
      setWhatsappKey('');
      setGeminiKey('');

    } catch (error) {
      console.error('API Key Save Error:', error);
      showNotification(error.message || 'API anahtarları kaydedilirken bir hata oluştu.', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">API Bağlantı Ayarları</h3>
      <p className="mt-1 text-sm text-gray-500 mb-6">
        Harici servislerle (SMS, WhatsApp, AI) iletişim kurmak için API anahtarlarını buradan yapılandırın.
        Mevcut bir anahtarı değiştirmek için yeni değeri girip kaydedin.
      </p>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 gap-y-6">
          
          {/* SMS API Key */}
          <div>
            <label htmlFor="sms-api-key" className="block text-sm font-medium text-gray-700">
              SMS API Anahtarı
            </label>
            <div className="mt-1">
              <input
                type="password"
                name="sms-api-key"
                id="sms-api-key"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="Değiştirmek için yeni anahtarı girin"
                value={smsKey}
                onChange={(e) => setSmsKey(e.target.value)}
              />
            </div>
          </div>

          {/* WhatsApp API Key */}
          <div>
            <label htmlFor="whatsapp-api-key" className="block text-sm font-medium text-gray-700">
              WhatsApp API Anahtarı
            </label>
            <div className="mt-1">
              <input
                type="password"
                name="whatsapp-api-key"
                id="whatsapp-api-key"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="Değiştirmek için yeni anahtarı girin"
                value={whatsappKey}
                onChange={(e) => setWhatsappKey(e.target.value)}
              />
            </div>
          </div>
          
          {/* Gemini API Key */}
          <div>
            <label htmlFor="gemini-api-key" className="block text-sm font-medium text-gray-700">
              Google Gemini API Anahtarı
            </label>
            <div className="mt-1">
              <input
                type="password"
                name="gemini-api-key"
                id="gemini-api-key"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="Değiştirmek için yeni anahtarı girin"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
              />
            </div>
          </div>

        </div>

        <div className="mt-6 flex items-center justify-end gap-4">
          {notification.show && (
            <span className={`text-sm font-medium ${notification.isError ? 'text-red-600' : 'text-green-600'}`}>
              {notification.message}
            </span>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApiSettings;