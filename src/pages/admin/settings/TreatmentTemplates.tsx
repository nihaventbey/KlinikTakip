
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

interface TreatmentTemplate {
  id: string;
  clinic_id: string;
  template_name: string;
  description: string | null;
  cost: number | null;
  duration_minutes: number | null;
}

const TreatmentTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<TreatmentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<TreatmentTemplate> | null>(null);
  const auth = useAuth();

  const clinicId = auth?.user?.clinic_id;

  useEffect(() => {
    fetchTemplates();
  }, [clinicId]);

  const fetchTemplates = async () => {
    if (!clinicId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('treatment_templates')
      .select('*')
      .eq('clinic_id', clinicId);

    if (error) {
      console.error('Tedavi şablonlarını çekerken hata:', error);
    } else {
      setTemplates(data || []);
    }
    setLoading(false);
  };

  const handleOpenModal = (template: Partial<TreatmentTemplate> | null = null) => {
    setEditingTemplate(template || { template_name: '', cost: 0 });
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
    
    // id'si varsa güncelle, yoksa ekle (upsert)
    const { error } = await supabase.from('treatment_templates').upsert(templateToSave);

    if (error) {
      alert('Şablon kaydedilirken hata: ' + error.message);
    } else {
      alert('Şablon başarıyla kaydedildi.');
      handleCloseModal();
      fetchTemplates(); // Listeyi yenile
    }
  };

  const handleDelete = async (templateId: string) => {
    if(window.confirm("Bu şablonu silmek istediğinizden emin misiniz?")){
        const { error } = await supabase.from('treatment_templates').delete().match({ id: templateId });
        if (error) {
            alert('Şablon silinirken hata: ' + error.message);
        } else {
            alert('Şablon başarıyla silindi.');
            fetchTemplates(); // Listeyi yenile
        }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingTemplate) {
        setEditingTemplate({ ...editingTemplate, [name]: value });
    }
  };


  if (loading) return <p>Şablonlar yükleniyor...</p>;

  const inputStyle = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors border-gray-300";

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tedavi Şablonları Yönetimi</h2>
        <Button onClick={() => handleOpenModal()}>Yeni Şablon Ekle</Button>
      </div>
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Şablon Adı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maliyet</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {templates.map(template => (
              <tr key={template.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.template_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.cost}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(template)} className="text-indigo-600 hover:text-indigo-900 mr-4">Düzenle</button>
                  <button onClick={() => handleDelete(template.id)} className="text-red-600 hover:text-red-900">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && editingTemplate && (
        <Modal title={editingTemplate.id ? "Şablonu Düzenle" : "Yeni Şablon Ekle"} onClose={handleCloseModal}>
            <div className="space-y-4">
                <Input label="Şablon Adı" name="template_name" value={editingTemplate.template_name || ''} onChange={handleInputChange} />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                    <textarea name="description" value={editingTemplate.description || ''} onChange={handleInputChange} className={inputStyle} />
                </div>
                <Input label="Maliyet" name="cost" type="number" value={editingTemplate.cost || ''} onChange={handleInputChange} />
                <Input label="Süre (dakika)" name="duration_minutes" type="number" value={editingTemplate.duration_minutes || ''} onChange={handleInputChange} />
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

export default TreatmentTemplates;
