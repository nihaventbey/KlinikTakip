import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { useAuth } from '../../../contexts/AuthContext';
import { useDebounce } from '../../../hooks/useDebounce';
import { Patient } from '../../../types';
import { FormInput } from '../../../components/ui/FormInput';
import { FormSelect } from '../../../components/ui/FormSelect';
import { FormTextarea } from '../../../components/ui/FormTextarea';
import { Button } from '../../../components/ui/Button';

const appointmentSchema = z.object({
  patient_id: z.string().min(1, "Hasta seçimi zorunludur."),
  doctor_id: z.string().min(1, "Doktor seçimi zorunludur."),
  start_time: z.string().min(1, "Başlangıç zamanı zorunludur."),
  end_time: z.string().min(1, "Bitiş zamanı zorunludur."),
  notes: z.string().min(3, "Konu en az 3 karakter olmalıdır."),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  eventInfo?: any;
  onClose: () => void;
}

// Helper to format date to YYYY-MM-DDTHH:mm
const toLocalISOString = (date: Date) => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOString = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, -1);
    return localISOString.substring(0, 16);
};


export default function AppointmentForm({ eventInfo, onClose }: AppointmentFormProps) {
  const { user: profile } = useAuth();
  const queryClient = useQueryClient();
  const isEditMode = !!eventInfo?.id;

  const [patientSearch, setPatientSearch] = useState('');
  const [patientResults, setPatientResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedPatientSearch = useDebounce(patientSearch, 300);

  const { data: staff } = useQuery({
    queryKey: ['staff', profile?.clinic_id],
    queryFn: () => db.staff.getAll(profile!.clinic_id!),
    enabled: !!profile?.clinic_id,
  });

  const { data: clinicSettings } = useQuery({
    queryKey: ['clinicSettings', profile?.clinic_id],
    queryFn: () => db.settings.get(profile!.clinic_id!),
    enabled: !!profile?.clinic_id,
  });

  const { data: holidays } = useQuery({
      queryKey: ['holidays', profile?.clinic_id],
      queryFn: () => db.holidays.getAllByClinicId(profile!.clinic_id!),
      enabled: !!profile?.clinic_id,
  });


  const { register, handleSubmit, formState: { errors }, reset, control, setValue } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  useEffect(() => {
    if (debouncedPatientSearch.length > 2) {
      setIsSearching(true);
      db.patients.search(debouncedPatientSearch, profile!.clinic_id!)
        .then(setPatientResults)
        .finally(() => setIsSearching(false));
    } else {
      setPatientResults([]);
    }
  }, [debouncedPatientSearch, profile?.clinic_id]);


  useEffect(() => {
    if (eventInfo) {
      reset({
        patient_id: eventInfo.resource?.patient_id || '',
        doctor_id: eventInfo.resource?.doctor_id || '',
        start_time: eventInfo.start ? toLocalISOString(eventInfo.start) : '',
        end_time: eventInfo.end ? toLocalISOString(eventInfo.end) : '',
        notes: eventInfo.notes || '',
      });
      if (eventInfo.resource?.patient) {
          setPatientSearch(eventInfo.resource.patient.full_name);
      }
    }
  }, [eventInfo, reset]);

  const mutation = useMutation({
    mutationFn: (data: AppointmentFormData) => {
      const submissionData = {
          ...data,
          start_time: new Date(data.start_time).toISOString(),
          end_time: new Date(data.end_time).toISOString(),
      };
      if (isEditMode) {
        return db.appointments.update(eventInfo.id, submissionData);
      }
      return db.appointments.add(submissionData, profile!.clinic_id!);
    },
    onSuccess: () => {
      toast.success(`Randevu başarıyla ${isEditMode ? 'güncellendi' : 'oluşturuldu'}.`);
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const onSubmit = (data: AppointmentFormData) => {
    const startTime = new Date(data.start_time);
    const dayOfWeek = startTime.getDay(); // 0 = Sunday, 1 = Monday, ...
    const dateStr = startTime.toISOString().split('T')[0];

    // Check for holidays
    if (holidays?.some(h => h.date === dateStr)) {
        toast.error("Seçilen tarih bir tatil günüdür. Lütfen başka bir tarih seçin.");
        return;
    }

    // Check working hours
    const workingHours = clinicSettings?.settings?.working_hours;
    if (workingHours) {
        const daySetting = workingHours.find((wh: any) => wh.day_of_week === dayOfWeek);
        if (!daySetting || !daySetting.is_open) {
            toast.error("Seçilen gün klinik kapalıdır. Lütfen başka bir gün seçin.");
            return;
        }

        const start = new Date(`1970-01-01T${daySetting.start_time}`);
        const end = new Date(`1970-01-01T${daySetting.end_time}`);
        const appointmentTime = new Date(`1970-01-01T${data.start_time.split('T')[1]}`);

        if (appointmentTime < start || appointmentTime > end) {
            toast.error(`Seçilen saat çalışma saatleri (${daySetting.start_time} - ${daySetting.end_time}) dışındadır.`);
            return;
        }
    }


    mutation.mutate(data);
  };
  
  const handlePatientSelect = (patient: Patient) => {
    setValue('patient_id', patient.id, { shouldValidate: true });
    setPatientSearch(patient.full_name);
    setPatientResults([]);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
      <div className="relative">
        <label htmlFor="patient_search" className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
        <input
          id="patient_search"
          type="text"
          value={patientSearch}
          onChange={(e) => setPatientSearch(e.target.value)}
          placeholder="Hasta adı, TCKN veya GSM ile arayın..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        {isSearching && <div className="absolute right-2 top-9 text-xs text-gray-500">Aranıyor...</div>}
        
        {patientResults.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {patientResults.map(p => (
              <li
                key={p.id}
                onClick={() => handlePatientSelect(p)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
              >
                {p.full_name}
              </li>
            ))}
          </ul>
        )}
        {errors.patient_id && <p className="text-xs text-red-600 mt-1">{errors.patient_id.message}</p>}
      </div>

      <FormSelect<AppointmentFormData>
        label="Doktor"
        name="doctor_id"
        register={register}
        error={errors.doctor_id}
      >
        <option value="">Doktor Seçiniz</option>
        {staff?.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
      </FormSelect>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput<AppointmentFormData> label="Başlangıç" name="start_time" type="datetime-local" register={register} error={errors.start_time} />
        <FormInput<AppointmentFormData> label="Bitiş" name="end_time" type="datetime-local" register={register} error={errors.end_time} />
      </div>

      <FormTextarea<AppointmentFormData> label="Konu / Notlar" name="notes" register={register} error={errors.notes} rows={3} />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
          İptal
        </Button>
        <Button type="submit" isLoading={mutation.isPending}>
          {isEditMode ? 'Randevuyu Güncelle' : 'Randevu Oluştur'}
        </Button>
      </div>
    </form>
  );
}
