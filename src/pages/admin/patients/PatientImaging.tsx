import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../../../lib/db';
import { supabase } from '../../../lib/supabase';
import { File, Upload } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import DicomViewer from './DicomViewer';

interface PatientImagingProps {
    patientId: string;
}

// Main Component
export default function PatientImaging({ patientId }: PatientImagingProps) {
    const queryClient = useQueryClient();
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

    const { data: files, isLoading } = useQuery({
        queryKey: ['patient_files', patientId],
        queryFn: () => db.patient_files.getByPatientId(patientId),
        enabled: !!patientId,
    });

    const handleFileSelect = (file: any) => {
        // Here we'd get a temporary public URL for the file to pass to a viewer
        const { data } = supabase.storage.from('patient-files').getPublicUrl(`${patientId}/${file.file_name}`);
        setSelectedFile({ ...file, publicURL: data.publicUrl });
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = event.target.files?.[0];
            if (!file) {
                throw new Error("Dosya seçilmedi.");
            }

            const filePath = `${patientId}/${file.name}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('patient-files')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true, // Overwrite if file exists
                });

            if (uploadError) {
                throw uploadError;
            }

            // Check if a record for this file already exists to avoid duplicates
            const existingFile = files?.find(f => f.file_name === file.name);
            if (!existingFile) {
                // Add record to our patient_files table
                await db.patient_files.add({
                    patient_id: patientId,
                    file_name: file.name,
                    file_url: filePath,
                    file_type: file.type,
                });
            }

            queryClient.invalidateQueries({ queryKey: ['patient_files', patientId] });
            toast.success("Dosya başarıyla yüklendi.");

        } catch (error: any) {
            toast.error(`Yükleme hatası: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* File List and Upload */}
            <div className="md:col-span-1">
                <h3 className="font-semibold text-lg mb-4">Dosyalar</h3>
                <div className="mb-4">
                    <Button asChild variant="outline">
                        <label htmlFor="file-upload" className="cursor-pointer flex items-center">
                            <Upload size={16} className="mr-2" />
                            Yeni Görüntü Yükle
                        </label>
                    </Button>
                    <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} accept=".dcm" />
                    {uploading && <p className="text-sm text-gray-500 mt-2">Yükleniyor...</p>}
                </div>

                <ul className="space-y-2">
                    {isLoading && <p>Yükleniyor...</p>}
                    {files?.map(file => (
                        <li key={file.id}>
                            <button 
                                onClick={() => handleFileSelect(file)}
                                className={`w-full text-left flex items-center gap-2 p-2 rounded-md transition-colors ${selectedFile?.id === file.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                            >
                                <File size={16} />
                                <span className="truncate">{file.file_name}</span>
                            </button>
                        </li>
                    ))}
                     {!isLoading && files?.length === 0 && (
                        <p className="text-sm text-gray-400 mt-4">Bu hasta için yüklenmiş dosya bulunmuyor.</p>
                    )}
                </ul>
            </div>

            {/* Viewer Area */}
            <div className="md:col-span-3 min-h-[60vh] bg-gray-900 rounded-lg flex items-center justify-center text-gray-500 overflow-hidden">
                {selectedFile ? (
                    <DicomViewer fileUrl={selectedFile.publicURL} />
                ) : (
                    <p>Görüntülemek için bir dosya seçin.</p>
                )}
            </div>
        </div>
    );
}

// We need to add the 'add' function to db.patient_files in db.ts
// And also create the 'patient-files' bucket in Supabase storage.
// The user will be notified of these requirements.
