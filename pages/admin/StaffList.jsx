import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    // 'profiles' tablosundan verileri çek
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) console.error('Hata:', error);
    else setStaff(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bu personeli silmek istediğinize emin misiniz?')) {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Silme hatası: ' + error.message);
      } else {
        // Listeyi güncelle
        setStaff(staff.filter(person => person.id !== id));
      }
    }
  };

  const handleEditClick = (person) => {
    setEditingStaff({ ...person }); // Kopyasını alarak state'e atıyoruz
    setNewPhoto(null);
    setEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let photoUrl = editingStaff.avatar_url;

      if (newPhoto) {
        const fileExt = newPhoto.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('doctor-profiles')
          .upload(filePath, newPhoto);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('doctor-profiles').getPublicUrl(filePath);
        photoUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editingStaff.full_name,
          role: editingStaff.role,
          specialty: editingStaff.specialty,
          commission_rate: editingStaff.commission_rate,
          avatar_url: photoUrl
        })
        .eq('id', editingStaff.id);

      if (error) throw error;

      // Listeyi güncelle
      setStaff(staff.map(p => (p.id === editingStaff.id ? { ...editingStaff, avatar_url: photoUrl } : p)));
      setEditModalOpen(false);
      alert('Personel bilgileri güncellendi.');
    } catch (error) {
      alert('Güncelleme hatası: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="text-xl font-bold">Personel Listesi</h2>
        <button 
          onClick={() => window.location.href = '/admin/add-user'}
          style={{ padding: '8px 16px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          + Yeni Ekle
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Fotoğraf</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Ad Soyad</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Rol</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Uzmanlık</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((person) => (
            <tr key={person.id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '10px' }}>
                {person.avatar_url ? (
                  <img src={person.avatar_url} alt={person.full_name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {person.full_name ? person.full_name.charAt(0) : '?'}
                  </div>
                )}
              </td>
              <td style={{ padding: '10px' }}>{person.full_name}</td>
              <td style={{ padding: '10px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.8em', backgroundColor: person.role === 'DOCTOR' ? '#e3f2fd' : '#fff3e0', color: '#333' }}>
                  {person.role}
                </span>
              </td>
              <td style={{ padding: '10px' }}>{person.specialty || '-'}</td>
              <td style={{ padding: '10px' }}>
                <button 
                  onClick={() => handleEditClick(person)}
                  style={{ padding: '5px 10px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                >
                  Düzenle
                </button>
                <button 
                  onClick={() => handleDelete(person.id)}
                  style={{ padding: '5px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Düzenleme Modalı */}
      {editModalOpen && editingStaff && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', minWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Personel Düzenle</h3>
            
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#666' }}>Ad Soyad</label>
                <input 
                  type="text" 
                  value={editingStaff.full_name || ''} 
                  onChange={e => setEditingStaff({...editingStaff, full_name: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#666' }}>Rol</label>
                <select 
                  value={editingStaff.role} 
                  onChange={e => setEditingStaff({...editingStaff, role: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="DOCTOR">Doktor</option>
                  <option value="SECRETARY">Sekreter</option>
                  <option value="ASSISTANT">Asistan</option>
                  <option value="ACCOUNTANT">Muhasebeci</option>
                </select>
              </div>

              {editingStaff.role === 'DOCTOR' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#666' }}>Uzmanlık</label>
                  <input 
                    type="text" 
                    value={editingStaff.specialty || ''} 
                    onChange={e => setEditingStaff({...editingStaff, specialty: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#666' }}>Profil Fotoğrafı</label>
                {editingStaff.avatar_url && !newPhoto && (
                  <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <img src={editingStaff.avatar_url} alt="Mevcut" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px' }} />
                    <span style={{ fontSize: '0.8em', color: '#666' }}>Mevcut Fotoğraf</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => e.target.files && setNewPhoto(e.target.files[0])}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" disabled={uploading} onClick={() => setEditModalOpen(false)} style={{ padding: '8px 16px', cursor: 'pointer', border: '1px solid #ddd', background: 'white', borderRadius: '4px' }}>İptal</button>
                <button type="submit" disabled={uploading} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px' }}>{uploading ? 'Kaydediliyor...' : 'Kaydet'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffList;
