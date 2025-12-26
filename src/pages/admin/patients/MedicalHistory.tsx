import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { MedicalRecord } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { X } from 'lucide-react';

interface MedicalHistoryProps {
  patientId: string;
}

// --- Tag Input Component for JSONB arrays ---
const TagInput = React.forwardRef<HTMLInputElement, { value?: string[], onChange: (tags: string[]) => void, placeholder: string }>(({ value = [], onChange, placeholder }, ref) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!value.includes(inputValue.trim())) {
                onChange([...value, inputValue.trim()]);
            }
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter(tag => tag !== tagToRemove));
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {value.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-blue-600 hover:text-blue-800">
                            <X size={14} />
                        </button>
                    </span>
                ))}
            </div>
            <input
                ref={ref}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
        </div>
    );
});


// --- Main Medical History Form Component ---
export default function MedicalHistory({ patientId }: MedicalHistoryProps) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, control, reset, formState: { errors, isDirty } } = useForm<MedicalRecord>();

    const { data: medicalRecord, isLoading } = useQuery({
        queryKey: ['medical_record', patientId],
        queryFn: () => db.medical_records.getByPatientId(patientId),
        enabled: !!patientId,
    });

    useEffect(() => {
        if (medicalRecord) {
            reset(medicalRecord);
        }
    }, [medicalRecord, reset]);
    
    const upsertMutation = useMutation({
        mutationFn: (data: MedicalRecord) => {
            const recordToSave = {
                ...data,
                patient_id: patientId,
                id: medicalRecord?.id, // Pass existing id for upsert
            };
            return db.medical_records.upsert(recordToSave);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['medical_record', patientId], data);
            toast.success('Medikal geçmiş başarıyla güncellendi.');
        },
        onError: (error) => {
            toast.error(`Güncelleme sırasında hata: ${error.message}`);
        }
    });

    const onSubmit = (data: MedicalRecord) => {
        upsertMutation.mutate(data);
    };

    if (isLoading) {
        return <div className="text-center p-8">Medikal geçmiş yükleniyor...</div>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blood Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kan Grubu</label>
                    <input {...register('blood_type')} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                
                {/* High Risk */}
                <div className="flex items-center h-full">
                    <div className="flex items-center gap-2 mt-4">
                        <input id="is_high_risk" type="checkbox" {...register('is_high_risk')} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="is_high_risk" className="text-sm font-medium text-gray-700">Yüksek Riskli Hasta</label>
                    </div>
                </div>
            </div>

            {/* Allergies */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alerjiler</label>
                <Controller
                    name="allergies"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => <TagInput {...field} placeholder="Alerji eklemek için yazıp Enter'a basın..." />}
                />
            </div>

            {/* Chronic Diseases */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kronik Hastalıklar</label>
                <Controller
                    name="chronic_diseases"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => <TagInput {...field} placeholder="Hastalık eklemek için yazıp Enter'a basın..." />}
                />
            </div>

            {/* Current Medications */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sürekli Kullandığı İlaçlar</label>
                <textarea {...register('current_medications')} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>

            <div className="text-right pt-4">
                <Button type="submit" isLoading={upsertMutation.isPending} disabled={!isDirty}>
                    Medikal Geçmişi Güncelle
                </Button>
            </div>
        </form>
    );
}
