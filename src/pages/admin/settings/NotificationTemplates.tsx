
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

interface NotificationTemplate {
  id: string;
  clinic_id: string;
  name: string;
  type: 'sms' | 'email' | 'in-app';
  subject: string | null;
  content_body: string;
}

const NotificationTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<NotificationTemplate> | null>(null);
  const auth = useAuth();

  const clinicId = auth?.user?.clinic_id;

  useEffect(() => {
    fetchTemplates();
  }, [clinicId]);

  const fetchTemplates = async () => {
    if (!clinicId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('notification_templates')
      .select('*')
      .eq('clinic_id', clinicId);

    if (error) {
      console.error('Bildirim şablonlarını çekerken hata:', error);
    } else {
      setTemplates(data || []);
    }
    setLoading(false);
  };

  const handleOpenModal = (template: Partial<NotificationTemplate> | null = null) => {
    setEditingTemplate(template || { name: '', type: 'in-app', content_body: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTemplate(null);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (!clinicId || !editingTemplate) return;

    const templateToSave = {
      ...editingTemplate,
      clinic_id: clinicId,
    };

    const { error } = await supabase.from('notification_templates').upsert(templateToSave);

    if (error) {
      alert('Şablon kaydedilirken hata: ' + error.message);
    } else {
      alert('Şablon başarıyla kaydedildi.');
      handleCloseModal();
      fetchTemplates();
    }
  };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingTemplate) {
        setEditingTemplate({ ...editingTemplate, [name]: value });
    }
  };

  if (loading) return <p>Bildirim şablonları yükleniyor...</p>;
  
  const inputStyle = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors border-gray-300";

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Bildirim Şablonları</h2>
        <Button onClick={() => handleOpenModal()}>Yeni Şablon Ekle</Button>
      </div>
       <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Şablon Adı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Türü</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık/Konu</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {templates.map(template => (
              <tr key={template.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(template)} className="text-indigo-600 hover:text-indigo-900">Düzenle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && editingTemplate && (
        <Modal title={editingTemplate.id ? "Şablonu Düzenle" : "Yeni Şablon Ekle"} onClose={handleCloseModal}>
            <div className="space-y-4">
                <Input label="Şablon Adı (Değiştirilemez)" name="name" value={editingTemplate.name || ''} onChange={handleInputChange} placeholder="örn: randevu_hatirlatici" disabled={!!editingTemplate.id} />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Şablon Türü</label>
                    <select 
                        name="type" 
                        value={editingTemplate.type || 'in-app'} 
                        onChange={handleInputChange}
                        className={inputStyle}
                    >
                        <option value="in-app">Uygulama İçi</option>
                        <option value="sms">SMS</option>
                        <option value="email">E-Posta</option>
                    </select>
                </div>
                {editingTemplate.type === 'email' &&
                    <Input label="E-Posta Konusu" name="subject" value={editingTemplate.subject || ''} onChange={handleInputChange} />
                }
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                    <textarea name="content_body" value={editingTemplate.content_body || ''} onChange={handleInputChange} rows={6} className={inputStyle} />
                </div>
                <div className="text-xs text-gray-500">
                    <p>Kullanabileceğiniz değişkenler: `{{kullanici_adi}}`, `{{randevu_tarihi}}`, `{{klinik_adi}}`</p>
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
                <Button variant="secondary" onClick={handleCloseModal}>İptal</Button>
                <Button onClick={handleSave}>Kaydet</Button>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default NotificationTemplates;
