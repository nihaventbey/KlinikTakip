import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { Button } from '../../../components/ui/Button';

interface WorkingHour {
  id?: string;
  day_of_week: number; // 0 for Sunday, 1 for Monday, etc.
  opening_time: string;
  closing_time: string;
  is_closed: boolean;
}

const daysOfWeek = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

const ClinicWorkingHours: React.FC = () => {
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const clinicId = user?.clinic_id;

  useEffect(() => {
    const fetchWorkingHours = async () => {
      if (!clinicId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('clinic_working_hours')
        .select('*')
        .eq('clinic_id', clinicId);

      if (error) {
        console.error("Çalışma saatleri getirilirken hata:", error);
      } else {
        const hoursMap = new Map(data.map(h => [h.day_of_week, h]));
        const fullWeekHours = daysOfWeek.map((_, index) => {
          const dayIndex = (index + 1) % 7; // Adjust to match DB if needed, assuming 0=Sunday
          return hoursMap.get(dayIndex) || {
            day_of_week: dayIndex,
            opening_time: '09:00',
            closing_time: '18:00',
            is_closed: dayIndex === 0, // Default Sunday to closed
          };
        });
        setWorkingHours(fullWeekHours);
      }
      setLoading(false);
    };

    fetchWorkingHours();
  }, [clinicId]);

  const handleTimeChange = (day: number, field: 'opening_time' | 'closing_time', value: string) => {
    setWorkingHours(currentHours =>
      currentHours.map(h =>
        h.day_of_week === day ? { ...h, [field]: value } : h
      )
    );
  };

  const handleIsClosedChange = (day: number, isClosed: boolean) => {
    setWorkingHours(currentHours =>
        currentHours.map(h =>
          h.day_of_week === day ? { ...h, is_closed: isClosed } : h
        )
    );
  };

  const handleSave = async () => {
    if (!clinicId) return;
    setSaving(true);

    const dataToUpsert = workingHours.map(({ id, ...h }) => ({
        ...h,
        clinic_id: clinicId,
        // Ensure the PK is included for upsert if it exists
        ...(id && { id: id })
    }));

    const { error } = await supabase.from('clinic_working_hours').upsert(dataToUpsert, {
        onConflict: 'clinic_id, day_of_week' // Assumes this unique constraint exists
    });

    if (error) {
        alert('Çalışma saatleri kaydedilirken bir hata oluştu: ' + error.message);
    } else {
        alert('Çalışma saatleri başarıyla kaydedildi.');
    }
    setSaving(false);
  };
  
  if (loading) return <p>Çalışma saatleri yükleniyor...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">Haftalık Çalışma Saatleri</h2>
      <div className="space-y-4">
        {daysOfWeek.map((dayName, index) => {
          const dayIndex = (index + 1) % 7;
          const day = workingHours.find(h => h.day_of_week === dayIndex);
          if (!day) return null;

          return (
            <div key={day.day_of_week} className="grid grid-cols-4 items-center gap-4 p-3 rounded-md bg-gray-50">
              <span className="font-medium text-gray-700 col-span-1">{dayName}</span>
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="time"
                  disabled={day.is_closed}
                  value={day.opening_time}
                  onChange={e => handleTimeChange(day.day_of_week, 'opening_time', e.target.value)}
                  className="w-full px-2 py-1 border rounded-md disabled:bg-gray-200"
                />
                <span>-</span>
                <input
                  type="time"
                  disabled={day.is_closed}
                  value={day.closing_time}
                  onChange={e => handleTimeChange(day.day_of_week, 'closing_time', e.target.value)}
                  className="w-full px-2 py-1 border rounded-md disabled:bg-gray-200"
                />
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <input
                  type="checkbox"
                  id={`closed-${day.day_of_week}`}
                  checked={day.is_closed}
                  onChange={e => handleIsClosedChange(day.day_of_week, e.target.checked)}
                  className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={`closed-${day.day_of_week}`} className="ml-2 text-sm text-gray-600">Kapalı</label>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </Button>
      </div>
    </div>
  );
};

export default ClinicWorkingHours;
