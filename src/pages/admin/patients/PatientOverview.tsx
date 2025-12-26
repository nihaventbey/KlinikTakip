import React from 'react';
import { Patient } from '../../../types';
import { User, Phone, Mail, Hash, Calendar, MapPin } from 'lucide-react';

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
    </div>
  );
}
