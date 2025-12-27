import React, { useState } from 'react';
import StaffList from './StaffList';
import StaffSalary from './StaffSalary';
import StaffLeave from './StaffLeave';
import StaffCommission from './StaffCommission';

const tabs = [
  { name: 'Personel Listesi', component: StaffList },
  { name: 'Hak Ediş Oranları', component: StaffCommission },
  { name: 'Maaş Yönetimi', component: StaffSalary },
  { name: 'İzin Yönetimi', component: StaffLeave },
];

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  const ActiveComponent = tabs.find(tab => tab.name === activeTab)?.component;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Personel Yönetimi</h1>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
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
}
