import React, { useState } from 'react';
import StaffList from './StaffList';
import StaffSalary from './StaffSalary';
import StaffLeave from './StaffLeave';
import StaffCommission from './StaffCommission';
import { Users, CreditCard, CalendarDays, Percent } from 'lucide-react';

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState('list');

  const tabs = [
    { id: 'list', label: 'Personel Listesi', icon: Users },
    { id: 'salaries', label: 'Maaş ve Ödemeler', icon: CreditCard },
    { id: 'leaves', label: 'İzin Yönetimi', icon: CalendarDays },
    { id: 'commissions', label: 'Primler', icon: Percent },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Personel Yönetimi</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Responsive Sekme Yapısı: Mobilde alt alta, Tablet/Masaüstü yan yana */}
        <div className="flex flex-col sm:flex-row border-b border-gray-100 bg-gray-50/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 sm:border-b-0 sm:border-r last:border-r-0 ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 border-indigo-600 sm:border-b-2 sm:border-b-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border-transparent'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'list' && <StaffList />}
          {activeTab === 'salaries' && <StaffSalary />}
          {activeTab === 'leaves' && <StaffLeave />}
          {activeTab === 'commissions' && <StaffCommission />}
        </div>
      </div>
    </div>
  );
}