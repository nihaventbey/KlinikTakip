import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '../../../lib/db';
import { Stethoscope, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface PatientTreatmentPlansProps {
  patientId: string;
}

const statusConfig = {
  planned: { icon: Clock, color: 'text-yellow-500', label: 'Planlandı' },
  active: { icon: Stethoscope, color: 'text-blue-500', label: 'Devam Ediyor' },
  completed: { icon: CheckCircle, color: 'text-green-500', label: 'Tamamlandı' },
  cancelled: { icon: AlertCircle, color: 'text-red-500', label: 'İptal Edildi' },
};

const PlanCard = ({ plan }: { plan: any }) => {
  const config = statusConfig[plan.status as keyof typeof statusConfig] || statusConfig.planned;
  const Icon = config.icon;

  return (
    <div className="p-4 bg-white rounded-lg border shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full ${config.color.replace('text-', 'bg-').replace('-500', '-100')}`}>
            <Icon className={`h-6 w-6 ${config.color}`} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">{plan.treatment?.name || 'İsimsiz Tedavi'}</h3>
          <p className="text-sm text-gray-500">
            {plan.teeth_numbers?.length > 0 ? `${plan.teeth_numbers.join(', ')} numaralı dişler` : 'Genel tedavi'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
             <time dateTime={plan.created_at}>{new Date(plan.created_at).toLocaleDateString('tr-TR')}</time> tarihinde oluşturuldu.
          </p>
        </div>
      </div>
      <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color.replace('text-', 'bg-').replace('-500', '-100')} ${config.color}`}>
            {config.label}
          </span>
          <p className="text-lg font-semibold text-gray-900">
            {plan.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </p>
      </div>
    </div>
  );
};

export default function PatientTreatmentPlans({ patientId }: PatientTreatmentPlansProps) {
  
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['treatment_plans', patientId],
    queryFn: () => db.treatment_plans.getByPatientId(patientId),
    enabled: !!patientId,
  });

  if (isLoading) {
    return <div className="text-center py-8">Tedavi planları yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">Hata: Tedavi planları yüklenemedi.</div>;
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 border-2 border-dashed rounded-lg">
        <Stethoscope className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz Tedavi Planı Yok</h3>
        <p className="mt-1 text-sm text-gray-500">Bu hasta için henüz bir tedavi planı oluşturulmamış.</p>
        <div className="mt-6">
          {/* Buraya yeni plan oluşturma butonu eklenebilir, ancak şimdilik DentalChart'tan yönetiliyor. */}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
