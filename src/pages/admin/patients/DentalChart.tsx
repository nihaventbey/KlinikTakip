import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Odontogram, Tooth } from 'react-odontogram';
import { db } from '../../../lib/db';
import { Button } from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import TreatmentPlanForm from './TreatmentPlanForm';

interface DentalChartProps {
    patientId: string;
}

const CreateTreatmentPlanModal = ({ isOpen, onClose, selectedTeeth, patientId }: any) => {
    if (!isOpen) return null;

    return (
        <Modal title="Yeni Tedavi Planı Oluştur" onClose={onClose}>
            <TreatmentPlanForm
                patientId={patientId}
                selectedTeeth={selectedTeeth}
                onClose={onClose}
            />
        </Modal>
    );
};


export default function DentalChart({ patientId }: DentalChartProps) {
    const queryClient = useQueryClient();
    const [selectedTeeth, setSelectedTeeth] = useState<Tooth[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCtrlPressed, setIsCtrlPressed] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Control') {
                setIsCtrlPressed(true);
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Control') {
                setIsCtrlPressed(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const { data: conditionsCatalog, isLoading: isLoadingCatalog } = useQuery({
        queryKey: ['tooth_conditions_catalog'],
        queryFn: db.tooth_conditions_catalog.getAll,
    });

    const { data: teethRecords, isLoading: isLoadingRecords } = useQuery({
        queryKey: ['teeth_records', patientId],
        queryFn: () => db.teeth_records.getByPatientId(patientId),
        enabled: !!patientId,
    });

    const teethData = useMemo(() => {
        const data: { [key: number]: any } = {};

        if (teethRecords) {
            teethRecords.forEach(record => {
                const conditionInfo = conditionsCatalog?.find(c => c.name === record.condition);
                data[record.tooth_number] = {
                    status: record.condition,
                    color: conditionInfo?.color_code || '#FFFFFF',
                };
            });
        }
        
        selectedTeeth.forEach(tooth => {
            if (data[tooth.number]) {
                data[tooth.number].borderColor = '#3B82F6';
            } else {
                data[tooth.number] = { borderColor: '#3B82F6' };
            }
        });

        return data;
    }, [teethRecords, conditionsCatalog, selectedTeeth]);

    const handleToothClick = (tooth: Tooth) => {
        setSelectedTeeth(prevSelected => {
            const isSelected = prevSelected.some(t => t.number === tooth.number);
            if (isSelected) {
                return prevSelected.filter(t => t.number !== tooth.number);
            } else {
                return [...prevSelected, tooth];
            }
        });
    };

    const handleToothHover = (tooth: Tooth) => {
        if (isCtrlPressed) {
            handleToothClick(tooth);
        }
    };

    if (isLoadingCatalog || isLoadingRecords) {
        return <div className="text-center p-8">Diş şeması yükleniyor...</div>;
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 bg-white p-4 rounded-lg border shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">Diş seçmek için üzerine gelmeden önce 'Control' tuşuna basılı tutun.</p>
                    <Odontogram 
                        teeth={teethData}
                        onToothHover={handleToothHover}
                    />
                </div>
                <div className="lg:col-span-3">
                    <div className="p-4 border rounded-lg bg-gray-50 h-full">
                        <h3 className="font-bold text-lg mb-2">Seçili Dişler</h3>
                        {selectedTeeth.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {selectedTeeth.map(tooth => (
                                    <span key={tooth.number} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        Diş #{tooth.number}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Tedavi planı oluşturmak için diş seçin.</p>
                        )}

                        <div className="mt-6 text-right">
                            <Button 
                                onClick={() => setIsModalOpen(true)}
                                disabled={selectedTeeth.length === 0}
                            >
                                Tedavi Planı Oluştur
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <CreateTreatmentPlanModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedTeeth={selectedTeeth}
                patientId={patientId}
            />
        </>
    );
}
