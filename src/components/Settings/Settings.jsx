import React, { useState } from 'react';
import ApiSettings from '../components/Settings/ApiSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ayarlar</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('general')}
              className={`${
                activeTab === 'general'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Genel
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Profil
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`${
                activeTab === 'api'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              API Ayarları
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Genel Ayarlar</h3>
              <p className="mt-1 text-sm text-gray-500">Genel uygulama ayarları buraya gelecek.</p>
            </div>
          )}
          
          {activeTab === 'profile' && (
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Profil Ayarları</h3>
              <p className="mt-1 text-sm text-gray-500">Kullanıcı profil ayarları buraya gelecek.</p>
            </div>
          )}

          {activeTab === 'api' && <ApiSettings />}
        </div>
      </div>
    </div>
  );
};

export default Settings;