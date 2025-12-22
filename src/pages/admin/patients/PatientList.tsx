import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Patient } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Veritabanından hastaları çek
  const fetchPatients = async () => {
    setLoading(true);
    let query = supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('full_name', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) console.error('Hata:', error);
    else setPatients(data || []);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, [search]); // Arama yapıldığında tekrar çek

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hasta Listesi</h1>
        <Button>+ Yeni Hasta Ekle</Button>
      </div>

      {/* Filtreleme */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
        <Input 
          placeholder="İsim veya TC No ile ara..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TC No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Ziyaret</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Yükleniyor...</td></tr>
            ) : patients.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Kayıtlı hasta bulunamadı.</td></tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                        {patient.full_name.charAt(0)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{patient.full_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.identity_number || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(patient.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Detay</button>
                    <button className="text-red-600 hover:text-red-900">Sil</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}