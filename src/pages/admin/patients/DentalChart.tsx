import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Odontogram, Tooth } from 'react-odontogram';
import { db } from '../../../lib/db';
import { Button } from '../../../components/ui/Button';

interface DentalChartProps {
    patientId: string;
}

// --- Condition Editor Panel ---
const ConditionEditor = ({ tooth, conditions, patientId, onSave }: any) => {
    const [selectedCondition, setSelectedCondition] = useState(tooth.condition || 'healthy');
    const [notes, setNotes] = useState(tooth.notes || '');

    useEffect(() => {
        setSelectedCondition(tooth.condition || 'healthy');
        setNotes(tooth.notes || '');
    }, [tooth]);

    const handleSave = () => {
        onSave({
            patient_id: patientId,
            tooth_number: tooth.number,
            condition: selectedCondition,
            notes: notes,
        });
    };

    return (
        <div className="p-4 border rounded-lg bg-white h-full">
            <h3 className="font-bold text-lg mb-2">Diş #{tooth.number}</h3>
            <p className="text-sm text-gray-500 mb-4">FDI: {tooth.notations.fdi}</p>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                    <select
                        value={selectedCondition}
                        onChange={(e) => setSelectedCondition(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        {conditions.map((c: any) => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
            </div>

            <div className="mt-6 text-right">
                <Button onClick={handleSave}>Durumu Kaydet</Button>
            </div>
        </div>
    );
};


// --- Main Dental Chart Component ---
export default function DentalChart({ patientId }: DentalChartProps) {
    const queryClient = useQueryClient();
    const [selectedTooth, setSelectedTooth] = useState<any>(null);

    // 1. Fetch the catalog of possible tooth conditions
    const { data: conditionsCatalog, isLoading: isLoadingCatalog } = useQuery({
        queryKey: ['tooth_conditions_catalog'],
        queryFn: db.tooth_conditions_catalog.getAll,
    });

    // 2. Fetch the patient's existing teeth records
    const { data: teethRecords, isLoading: isLoadingRecords } = useQuery({
        queryKey: ['teeth_records', patientId],
        queryFn: () => db.teeth_records.getByPatientId(patientId),
        enabled: !!patientId,
    });
    
    // 3. Mutation to update a tooth's condition
    const upsertMutation = useMutation({
        mutationFn: (record: any) => db.teeth_records.upsert(record),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teeth_records', patientId] });
            toast.success('Diş durumu güncellendi.');
        },
        onError: (error) => {
            toast.error(`Hata: ${error.message}`);
        }
    });

    // 4. Transform fetched data for the Odontogram component
    const teethData = useMemo(() => {
        if (!teethRecords || !conditionsCatalog) return {};

        const data: { [key: number]: { status: string, color: string } } = {};
        
        teethRecords.forEach(record => {
            const conditionInfo = conditionsCatalog.find(c => c.name === record.condition);
            data[record.tooth_number] = {
                status: record.condition,
                color: conditionInfo?.color_code || '#FFFFFF',
            };
        });
        
        return data;
    }, [teethRecords, conditionsCatalog]);

    const handleToothClick = (tooth: Tooth) => {
        const record = teethRecords?.find(r => r.tooth_number === tooth.number) || {};
        setSelectedTooth({
            ...tooth, // Pass all original tooth data, including notations
            condition: record.condition || 'healthy',
            notes: record.notes || '',
        });
    };

    if (isLoadingCatalog || isLoadingRecords) {
        return <div className="text-center p-8">Diş şeması yükleniyor...</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-4 rounded-lg border shadow-sm">
                <Odontogram 
                    teeth={teethData}
                    onToothClick={handleToothClick}
                />
            </div>
            <div className="lg:col-span-1">
                {selectedTooth ? (
                     <ConditionEditor 
                        tooth={selectedTooth}
                        conditions={conditionsCatalog || []}
                        patientId={patientId}
                        onSave={(data) => upsertMutation.mutate(data)}
                    />
                ) : (
                    <div className="p-4 border rounded-lg bg-gray-50 h-full flex items-center justify-center">
                        <p className="text-gray-500">Durumunu düzenlemek için bir diş seçin.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
