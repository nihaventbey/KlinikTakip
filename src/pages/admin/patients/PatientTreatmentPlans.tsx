import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Stethoscope, CheckCircle, Clock } from 'lucide-react';

// Tipleri import etmek yerine burada geçici olarak tanımlayalım, sonra merkezi tipe taşırız.
interface TreatmentPlan {
  id: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  total_cost: number;
  start_date: string;
  created_at: string;
  treatments: {
    name: string;
  };
  staff: {
    full_name: string;
  };
}

const statusConfig = {
  planned: { icon: Clock, color: 'text-yellow-500', label: 'Planlandı' },
  active: { icon: Stethoscope, color: 'text-blue-500', label: 'Devam Ediyor' },
  completed: { icon: CheckCircle, color: 'text-green-500', label: 'Tamamlandı' },
  cancelled: { icon: CheckCircle, color: 'text-red-500', label: 'İptal Edildi' },
};


export default function PatientTreatmentPlans({ patientId }: { patientId: string }) {
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('treatment_plans')
        .select(`
          id,
          status,
          total_cost,
          start_date,
          created_at,
          treatments ( name ),
          staff:doctor_id ( full_name )
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Hastanın tedavi planları alınırken hata: ", error);
      } else {
        setPlans(data as any);
      }
      setLoading(false);
    };

    fetchPlans();
  }, [patientId]);

  if (loading) return <div className="text-center py-8">Tedavi planları yükleniyor...</div>;
  if (plans.length === 0) return <div className="text-center text-gray-500 py-8">Bu hastanın kayıtlı bir tedavi planı bulunmuyor.</div>;

  return (
    <div className="space-y-4">
      {plans.map((plan) => {
        const config = statusConfig[plan.status] || statusConfig.planned;
        const Icon = config.icon;
        
        return (
          <div key={plan.id} className="p-4 bg-gray-50 rounded-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Icon className={`h-6 w-6 ${config.color}`} />
              <div>
                <h3 className="font-bold text-gray-800">{plan.treatments.name}</h3>
                <p className="text-sm text-gray-500">
                  Dr. {plan.staff.full_name} tarafından <time dateTime={plan.created_at}>{new Date(plan.created_at).toLocaleDateString('tr-TR')}</time> tarihinde oluşturuldu.
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color.replace('text-', 'bg-').replace('-500', '-100')} ${config.color}`}>
                  {config.label}
                </span>
                <p className="text-lg font-semibold text-gray-700 mt-1">
                  {plan.total_cost.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </p>
            </div>
          </div>
        )
      })}
    </div>
  );
}
