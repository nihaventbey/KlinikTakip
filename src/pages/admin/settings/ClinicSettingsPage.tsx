
import React, { useState } from 'react';
import ClinicGeneralSettings from './ClinicGeneralSettings';
import TreatmentTemplates from './TreatmentTemplates';
import NotificationTemplates from './NotificationTemplates';
import ClinicWorkingHours from './ClinicWorkingHours';
import ClinicHolidays from './ClinicHolidays';
import ApiSettings from '../../../components/Settings/ApiSettings';

const tabs = [
  { name: 'Genel Ayarlar', component: ClinicGeneralSettings },
  { name: 'Çalışma Saatleri', component: ClinicWorkingHours },
  { name: 'Tatil Günleri', component: ClinicHolidays },
  { name: 'Tedavi Şablonları', component: TreatmentTemplates },
  { name: 'Bildirim Şablonları', component: NotificationTemplates },
  { name: 'API Ayarları', component: ApiSettings },
];

const ClinicSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  const ActiveComponent = tabs.find(tab => tab.name === activeTab)?.component;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Klinik Ayarları</h1>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`${
                activeTab === tab.name
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-6">
        {ActiveComponent ? <ActiveComponent /> : <p>Bileşen yüklenemedi.</p>}
      </div>
    </div>
  );
};

export default ClinicSettingsPage;
