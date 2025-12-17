import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PATIENTS, ADMIN_NAV } from '../constants';

export const GlobalSearch: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    
    // Close on Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filteredPatients = query ? MOCK_PATIENTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase())) : [];
  const filteredPages = query ? ADMIN_NAV.filter(p => p.label.toLowerCase().includes(query.toLowerCase())) : [];

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[15vh] p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <span className="material-symbols-outlined text-gray-400 text-2xl">search</span>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Hasta, Randevu, Sayfa veya İşlem ara..." 
            className="flex-1 text-lg outline-none text-gray-800 placeholder-gray-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex gap-2">
             <kbd className="hidden md:inline-block px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs text-gray-500 font-sans">ESC</kbd>
          </div>
        </div>
        
        <div className="overflow-y-auto p-2">
            {!query && (
                <div className="p-8 text-center text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">keyboard_command_key</span>
                    <p>Aramaya başlamak için yazın...</p>
                    <div className="flex justify-center gap-4 mt-4 text-xs">
                        <span className="bg-gray-50 px-2 py-1 rounded">Hastalar</span>
                        <span className="bg-gray-50 px-2 py-1 rounded">Sayfalar</span>
                        <span className="bg-gray-50 px-2 py-1 rounded">Randevular</span>
                    </div>
                </div>
            )}

            {filteredPages.length > 0 && (
                <div className="mb-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase px-3 py-2">Sayfalar</h3>
                    {filteredPages.map(page => (
                        <div key={page.path} onClick={() => handleNavigate(page.path)} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 cursor-pointer group">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-lg">{page.icon}</span>
                            </div>
                            <span className="font-medium text-gray-800">{page.label}</span>
                            <span className="ml-auto text-xs text-gray-400">Git</span>
                        </div>
                    ))}
                </div>
            )}

            {filteredPatients.length > 0 && (
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase px-3 py-2">Hastalar</h3>
                    {filteredPatients.map(patient => (
                        <div key={patient.id} onClick={() => handleNavigate('/admin/patients')} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 cursor-pointer group">
                            <img src={patient.image} className="w-8 h-8 rounded-full object-cover" alt={patient.name} />
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">{patient.name}</p>
                                <p className="text-xs text-gray-500">{patient.phone}</p>
                            </div>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded group-hover:bg-primary group-hover:text-white transition-colors">Görüntüle</span>
                        </div>
                    ))}
                </div>
            )}

            {query && filteredPages.length === 0 && filteredPatients.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    Sonuç bulunamadı.
                </div>
            )}
        </div>
        
        <div className="bg-gray-50 p-2 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 px-4">
             <span><strong>↑↓</strong> ile gezin</span>
             <span><strong>Enter</strong> ile seç</span>
        </div>
      </div>
    </div>
  );
};
