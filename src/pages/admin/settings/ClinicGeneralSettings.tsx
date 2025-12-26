
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { db } from '../../../lib/db'; // Import the db object

// Combined interface for data from both tables
interface CombinedClinicInfo {
  name: string;
  address: string | null;
  phone_number: string | null;
  logo_url: string | null;
  currency: string | null;
}

const ClinicGeneralSettings: React.FC = () => {
  const [clinicInfo, setClinicInfo] = useState<Partial<CombinedClinicInfo>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const auth = useAuth();
  const clinicId = auth?.user?.clinic_id;

  useEffect(() => {
    const fetchClinicInfo = async () => {
      if (!clinicId) return;
      setLoading(true);
      try {
        const data = await db.settings.get(clinicId);
        if (data) {
          const combinedData = {
            name: data.name,
            address: data.address,
            phone_number: data.phone_number,
            logo_url: data.settings?.logo_url,
            currency: data.settings?.currency,
          };
          setClinicInfo(combinedData);
        }
      } catch (error) {
        console.error("Bilgiler getirilirken bir hata oluştu:", error);
      }
      setLoading(false);
    };

    fetchClinicInfo();
  }, [clinicId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClinicInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!clinicId || !clinicInfo) return;

    setSaving(true);
    
    const dataToUpdate = {
        name: clinicInfo.name,
        address: clinicInfo.address,
        phone_number: clinicInfo.phone_number,
        settings: {
            logo_url: clinicInfo.logo_url,
            currency: clinicInfo.currency,
        }
    };

    try {
      const updatedData = await db.settings.update(clinicId, dataToUpdate);
      // Update state with the fresh data returned from the db function
      if (updatedData) {
        const combinedData = {
            name: updatedData.name,
            address: updatedData.address,
            phone_number: updatedData.phone_number,
            logo_url: updatedData.settings?.logo_url,
            currency: updatedData.settings?.currency,
        };
        setClinicInfo(combinedData);
      }
      alert('Ayarlar başarıyla kaydedildi.');
    } catch (error: any) {
      alert('Ayarları kaydederken bir hata oluştu: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Ayarlar yükleniyor...</p>;
  }

  const inputStyle = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors border-gray-300";

  return (
    <div className="max-w-2xl">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Genel Klinik Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Klinik Adı"
                    name="name"
                    value={clinicInfo.name || ''}
                    onChange={handleInputChange}
                    placeholder="Örn: DentCare İstanbul"
                />
                <Input
                    label="Telefon Numarası"
                    name="phone_number"
                    value={clinicInfo.phone_number || ''}
                    onChange={handleInputChange}
                    placeholder="Örn: +90 555 123 4567"
                />
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                    <textarea
                        name="address"
                        value={clinicInfo.address || ''}
                        onChange={handleInputChange}
                        placeholder="Klinik adresini giriniz"
                        className={inputStyle}
                        rows={3}
                    />
                </div>
                 <Input
                    label="Logo URL'i"
                    name="logo_url"
                    value={clinicInfo.logo_url || ''}
                    onChange={handleInputChange}
                    placeholder="https://.../logo.png"
                />
                <Input
                    label="Para Birimi"
                    name="currency"
                    value={clinicInfo.currency || 'TRY'}
                    onChange={handleInputChange}
                    placeholder="Örn: TRY, USD, EUR"
                />
            </div>
            <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </Button>
            </div>
        </div>
    </div>
  );
};

export default ClinicGeneralSettings;
