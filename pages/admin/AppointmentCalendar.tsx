import React from 'react';
import { Card } from '../../components/UI';

const HOURS = Array.from({ length: 9 }, (_, i) => i + 9); // 09:00 - 17:00
const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

export const AppointmentCalendar: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px]">
      {/* Calendar Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button className="p-1 hover:bg-white rounded shadow-sm transition-all"><span className="material-symbols-outlined text-gray-600 text-sm">chevron_left</span></button>
            <button className="p-1 hover:bg-white rounded shadow-sm transition-all"><span className="material-symbols-outlined text-gray-600 text-sm">chevron_right</span></button>
          </div>
          <h2 className="text-lg font-bold text-gray-900">14 - 20 Ekim 2023</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
             {[1,2,3].map(i => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">Dr</div>
             ))}
          </div>
          <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
            <button className="px-3 py-1 bg-white shadow-sm rounded text-gray-900">Haftalık</button>
            <button className="px-3 py-1 text-gray-500 hover:text-gray-900">Günlük</button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto bg-gray-50 flex flex-col relative">
        {/* Header Row */}
        <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="w-16 border-r border-gray-200 bg-gray-50 flex items-center justify-center p-2 text-xs font-bold text-gray-400">
            SAAT
          </div>
          {DAYS.map((day, i) => (
            <div key={day} className={`flex-1 border-r border-gray-200 p-2 text-center ${i === 1 ? 'bg-primary/5' : ''}`}>
              <div className="text-xs font-semibold text-gray-500 uppercase">{day}</div>
              <div className={`text-xl font-bold mt-1 ${i === 1 ? 'text-primary' : 'text-gray-900'}`}>{14 + i}</div>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="relative">
           {/* Grid Lines */}
           <div className="absolute inset-0 flex pointer-events-none">
             <div className="w-16 border-r border-gray-200 bg-white"></div>
             {DAYS.map((_, i) => (
               <div key={i} className="flex-1 border-r border-gray-200 bg-transparent"></div>
             ))}
           </div>

           {HOURS.map(hour => (
             <div key={hour} className="flex h-24 border-b border-gray-200 relative z-0">
               <div className="w-16 flex-shrink-0 text-xs text-gray-400 text-right pr-2 pt-2 -mt-2.5">
                 {hour}:00
               </div>
               {/* Cells area */}
               <div className="flex-1"></div>
             </div>
           ))}

           {/* Events (Absolute positioning simulation) */}
           {/* Monday 9:00 */}
           <div className="absolute top-[4px] left-[calc(4rem+0.5%)] w-[calc(16.5%-0.5rem)] h-[88px] bg-green-50 border-l-4 border-green-500 rounded p-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow z-10">
             <div className="flex justify-between items-start">
               <span className="text-xs font-bold text-green-800">Emre Demir</span>
               <span className="material-symbols-outlined text-[14px] text-green-600">check_circle</span>
             </div>
             <p className="text-[10px] text-green-600 mt-1">Diş Temizliği • Dr. Ali</p>
           </div>

           {/* Tuesday 10:00 (Conflict) */}
           <div className="absolute top-[100px] left-[calc(4rem+16.6%)] w-[calc(16.5%-0.5rem)] h-[130px] bg-primary text-white rounded p-2 shadow-lg z-20 hover:scale-[1.02] transition-transform">
             <div className="flex justify-between items-start mb-1">
               <span className="text-[10px] bg-white/20 px-1 rounded font-bold">Onaylı</span>
             </div>
             <p className="text-sm font-bold">Selin Kaya</p>
             <p className="text-[10px] text-blue-100">Kanal Tedavisi</p>
             <div className="mt-2 flex items-center gap-1 text-[10px] border-t border-white/20 pt-1">
               <span className="material-symbols-outlined text-[12px]">schedule</span> 10:00 - 11:30
             </div>
           </div>

           {/* Current Time Indicator */}
           <div className="absolute left-16 right-0 top-[340px] border-t-2 border-red-500 z-30 pointer-events-none flex items-center">
             <div className="absolute -left-1.5 w-3 h-3 bg-red-500 rounded-full"></div>
           </div>
        </div>
      </div>
    </div>
  );
};
