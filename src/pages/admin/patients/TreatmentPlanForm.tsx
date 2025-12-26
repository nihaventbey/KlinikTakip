import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { Button } from '../../../components/ui/Button';
import { FormInput } from '../../../components/ui/FormInput';
import { FormTextarea } from '../../../components/ui/FormTextarea';
import { FormSelect } from '../../../components/ui/FormSelect';
import { useAuth } from '../../../contexts/AuthContext';

interface TreatmentPlanFormProps {
    patientId: string;
    selectedTeeth: any[];
    onClose: () => void;
}

export default function TreatmentPlanForm({ patientId, selectedTeeth, onClose }: TreatmentPlanFormProps) {
    const queryClient = useQueryClient();
    const { user: profile } = useAuth();
    const [selectedTreatment, setSelectedTreatment] = useState<any>(null);
    const [price, setPrice] = useState('');
    const [notes, setNotes] = useState('');

    const { data: treatmentTemplates, isLoading: isLoadingTemplates } = useQuery({
        queryKey: ['treatment_templates'],
        queryFn: db.treatment_templates.getAll,
    });

    const createPlanMutation = useMutation({
        mutationFn: (newPlan: any) => db.treatment_plans.create(newPlan),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['treatment_plans', patientId] });
            toast.success('Tedavi planı başarıyla oluşturuldu.');
            onClose();
        },
        onError: (error) => {
            toast.error(`Hata: ${error.message}`);
        },
    });

    const handleTreatmentChange = (templateId: string) => {
        const template = treatmentTemplates?.find(t => t.id === templateId);
        if (template) {
            setSelectedTreatment(template);
            setPrice(template.default_price.toString());
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTreatment) {
            toast.error('Lütfen bir tedavi seçin.');
            return;
        }

        const planData = {
            patient_id: patientId,
            clinic_id: profile?.clinic_id,
            treatment_id: selectedTreatment.id,
            price: parseFloat(price),
            notes: notes,
            status: 'planned',
            teeth_numbers: selectedTeeth.map(t => t.number),
        };

        createPlanMutation.mutate(planData);
    };

    const treatmentOptions = treatmentTemplates?.map(t => ({ value: t.id, label: t.name })) || [];

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-1">
            <div>
                <h3 className="font-medium text-lg">Seçili Dişler</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTeeth.map(tooth => (
                        <span key={tooth.number} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            #{tooth.number}
                        </span>
                    ))}
                </div>
            </div>

            <FormSelect
                label="Tedavi"
                options={[{ value: '', label: 'Tedavi Seçin...' }, ...treatmentOptions]}
                onChange={(e) => handleTreatmentChange(e.target.value)}
                disabled={isLoadingTemplates}
                required
            />
            
            {selectedTreatment && (
                <>
                    <FormInput
                        label="Ücret (TL)"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                    <FormTextarea
                        label="Notlar"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Tedavi ile ilgili ek notlar..."
                    />
                </>
            )}

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                    İptal
                </Button>
                <Button type="submit" disabled={createPlanMutation.isLoading}>
                    {createPlanMutation.isLoading ? 'Kaydediliyor...' : 'Planı Kaydet'}
                </Button>
            </div>
        </form>
    );
}
