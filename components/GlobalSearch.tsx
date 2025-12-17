
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_NAV } from '../constants';
import { db } from '../lib/db';
import { Patient } from '../types';

export const GlobalSearch: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (query.length < 2) {
        setPatients([]);
        return;
    }
    const results = db.patients.search(query);
    setPatients(results);
  }, [query]);

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
            placeholder="Hasta adı veya sayfa ara..." 
            className="flex-1 text-lg outline-none text-gray-800 placeholder-gray-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        <div className="overflow-y-auto p-2">
            {!query && <div className="p-8 text-center text-gray-400"><p>Aramaya başlamak için yazın...</p></div>}
            
            {filteredPages.map(page => (
                <div key={page.path} onClick={() => handleNavigate(page.path)} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 cursor-pointer group">
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">{page.icon}</span>
                    <span className="font-medium text-gray-800">{page.label}</span>
                </div>
            ))}

            {patients.map(patient => (
                <div key={patient.id} onClick={() => handleNavigate('/admin/patients')} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 cursor-pointer group">
                    <img src={patient.avatar_url || 'https://i.pravatar.cc/150'} className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                        <p className="font-medium text-gray-800">{patient.full_name}</p>
                        <p className="text-xs text-gray-500">{patient.phone}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
