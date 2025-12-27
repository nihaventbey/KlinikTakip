import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { db } from '../../../lib/db';
import { useDebounce } from '../../../hooks/useDebounce';
import { Patient } from '../../../types';
import { User, Phone, Mail, Hash, Calendar, MapPin, StickyNote, Mic } from 'lucide-react';

interface PatientOverviewProps {
  patient: Patient;
}

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined | null }) => (
    <div className="flex items-start p-4 rounded-lg bg-gray-50">
        <div className="p-2 bg-blue-100 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-md font-semibold text-gray-800">{value || '-'}</p>
        </div>
    </div>
);

const QuickNotes = ({ patient }: { patient: Patient }) => {
    const [note, setNote] = useState(patient.notes || '');
    const debouncedNote = useDebounce(note, 500);
    const queryClient = useQueryClient();
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    const { mutate: updateNote, isPending } = useMutation({
        mutationFn: (updatedNote: string) => db.patients.update(patient.id, { notes: updatedNote }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patient', patient.id] });
            toast.success('Not kaydedildi.', { id: 'note-saving', duration: 1500 });
        },
        onError: (error) => {
            toast.error(`Hata: ${error.message}`, { id: 'note-saving' });
        },
    });

    useEffect(() => {
        // İlk renderda ve patient.notes değiştiğinde notu güncelle, ama API'ye gönderme
        setNote(patient.notes || '');
    }, [patient.notes]);

    useEffect(() => {
        // Sadece debouncedNote değiştiğinde ve başlangıçtaki nottan farklıysa API'ye gönder
        if (debouncedNote !== patient.notes) {
            toast.loading('Not kaydediliyor...', { id: 'note-saving' });
            updateNote(debouncedNote);
        }
    }, [debouncedNote, patient.notes, updateNote]);

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            toast.error('Bu tarayıcı ses tanımayı desteklemiyor.');
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'tr-TR';
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            toast('Dinliyorum...', { icon: '🎤' });
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            toast.error(`Ses tanıma hatası: ${event.error}`);
            setIsListening(false);
        };

        recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
                .map((result: any) => result[0])
                .map(result => result.transcript)
                .join(' ');
            setNote(prevNote => prevNote ? `${prevNote} ${transcript}` : transcript);
        };
        
        recognitionRef.current = recognition;
        recognition.start();
    };

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Hızlı Not Alanı</h3>
            <div className="relative">
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Hasta ile ilgili hızlı notlarınızı buraya ekleyebilirsiniz. Yazdıklarınız otomatik olarak kaydedilecektir."
                />
                <button 
                    onClick={handleVoiceInput}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    title="Sesi metne dönüştür"
                >
                    <Mic size={18} />
                </button>
            </div>
        </div>
    );
};


export default function PatientOverview({ patient }: PatientOverviewProps) {
  return (
    <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Hasta Kimlik Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <InfoCard icon={<Hash size={20} className="text-blue-600" />} label="TC Kimlik No" value={patient.tc_number} />
            <InfoCard icon={<Phone size={20} className="text-blue-600" />} label="Telefon" value={patient.phone} />
            <InfoCard icon={<Mail size={20} className="text-blue-600" />} label="Email" value={patient.email} />
            <InfoCard icon={<User size={20} className="text-blue-600" />} label="Cinsiyet" value={patient.gender === 'male' ? 'Erkek' : patient.gender === 'female' ? 'Kadın' : 'Diğer'} />
            <InfoCard icon={<Calendar size={20} className="text-blue-600" />} label="Doğum Tarihi" value={patient.birth_date ? new Date(patient.birth_date).toLocaleDateString('tr-TR') : '-'} />
            <InfoCard icon={<MapPin size={20} className="text-blue-600" />} label="Adres" value={patient.address} />
        </div>

        <QuickNotes patient={patient} />
    </div>
  );
}
