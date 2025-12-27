import React, { useState } from 'react';
import ClinicGeneralSettings from './ClinicGeneralSettings';
import ClinicWorkingHours from './ClinicWorkingHours';
import ClinicHolidays from './ClinicHolidays';
import TreatmentTemplates from './TreatmentTemplates';
import NotificationTemplates from './NotificationTemplates';
import { Settings, Clock, CalendarOff, ClipboardList, BellRing } from 'lucide-react';

export default function ClinicSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Genel Bilgiler', icon: Settings },
    { id: 'hours', label: 'Çalışma Saatleri', icon: Clock },
    { id: 'holidays', label: 'Tatil Günleri', icon: CalendarOff },
    { id: 'treatments', label: 'Tedavi Şablonları', icon: ClipboardList },
    { id: 'notifications', label: 'Bildirim Ayarları', icon: BellRing },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Klinik Ayarları</h1>
        <p className="text-gray-500 text-sm">Kliniğinizin genel işleyiş ve sistem ayarlarını buradan yönetebilirsiniz.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sol Menü / Mobilde Üst Menü */}
        <div className="w-full lg:w-64 flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* İçerik Alanı */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8">
          {activeTab === 'general' && <ClinicGeneralSettings />}
          {activeTab === 'hours' && <ClinicWorkingHours />}
          {activeTab === 'holidays' && <ClinicHolidays />}
          {activeTab === 'treatments' && <TreatmentTemplates />}
          {activeTab === 'notifications' && <NotificationTemplates />}
        </div>
      </div>
    </div>
  );
}