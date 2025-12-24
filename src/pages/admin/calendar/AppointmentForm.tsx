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

export default function AppointmentForm({ eventInfo, onClose }: AppointmentFormProps) {
  const { user: profile } = useAuth();
  const queryClient = useQueryClient();
  const isEditMode = !!eventInfo?.id;

  // --- State for async patient search ---
  const [patientSearch, setPatientSearch] = useState('');
  const [patientResults, setPatientResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedPatientSearch = useDebounce(patientSearch, 300);

  const { data: staff } = useQuery({
    queryKey: ['staff', profile?.clinic_id],
    queryFn: () => db.staff.getAll(profile!.clinic_id!),
    enabled: !!profile?.clinic_id,
  });

  const { register, handleSubmit, formState: { errors }, reset, control, setValue } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  // Effect for searching patients
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
        start_time: eventInfo.start?.toISOString().substring(0, 16) || '',
        end_time: eventInfo.end?.toISOString().substring(0, 16) || '',
        notes: eventInfo.notes || '',
      });
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
    mutation.mutate(data);
  };
  
  // --- Patient selection handler ---
  const handlePatientSelect = (patient: Patient) => {
    setValue('patient_id', patient.id, { shouldValidate: true });
    setPatientSearch(patient.full_name); // Show selected patient's name in input
    setPatientResults([]); // Close results dropdown
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* --- Patient Async Search Input --- */}
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
        
        {/* Search Results Dropdown */}
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
      
      <div className="grid grid-cols-2 gap-4">
        <FormInput<AppointmentFormData> label="Başlangıç" name="start_time" type="datetime-local" register={register} error={errors.start_time} />
        <FormInput<AppointmentFormData> label="Bitiş" name="end_time" type="datetime-local" register={register} error={errors.end_time} />
      </div>

      <FormTextarea<AppointmentFormData> label="Konu / Notlar" name="notes" register={register} error={errors.notes} rows={4} />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} disabled={mutation.isPending}>
          İptal
        </Button>
        <Button type="submit" isLoading={mutation.isPending}>
          {isEditMode ? 'Güncelle' : 'Kaydet'}
        </Button>
      </div>
    </form>
  );
}
