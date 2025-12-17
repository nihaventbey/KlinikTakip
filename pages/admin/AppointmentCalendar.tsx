import React from 'react';
import { Card } from '../../components/UI';

const HOURS = Array.from({ length: 9 }, (_, i) => i + 9); // 09:00 - 17:00
const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

export const AppointmentCalendar: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] animate-fade-in">
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
             <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700" title="Dr. Ahmet">A</div>
             <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700" title="Dr. Ayşe">A</div>
             <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-700" title="Dr. Mehmet">M</div>
          </div>
          <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
            <button className="px-3 py-1 bg-white shadow-sm rounded text-gray-900">Haftalık</button>
            <button className="px-3 py-1 text-gray-500 hover:text-gray-900">Günlük</button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto bg-white flex flex-col relative select-none">
        {/* Header Row */}
        <div className="flex border-b border-gray-200 sticky top-0 z-20 bg-white">
          <div className="w-16 border-r border-gray-200 flex items-center justify-center p-2 text-xs font-bold text-gray-400">
            GMT+3
          </div>
          {DAYS.map((day, i) => (
            <div key={day} className={`flex-1 border-r border-gray-200 p-2 text-center group ${i === 1 ? 'bg-blue-50/30' : ''}`}>
              <div className={`text-xs font-semibold uppercase mb-1 ${i === 1 ? 'text-blue-600' : 'text-gray-500'}`}>{day}</div>
              <div className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-lg font-medium ${i === 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-900 group-hover:bg-gray-100'}`}>{14 + i}</div>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="relative">
           {/* Grid Lines */}
           <div className="absolute inset-0 flex pointer-events-none">
             <div className="w-16 border-r border-gray-200 bg-white"></div>
             {DAYS.map((_, i) => (
               <div key={i} className="flex-1 border-r border-gray-200"></div>
             ))}
           </div>

           {HOURS.map(hour => (
             <div key={hour} className="flex h-24 border-b border-gray-100 relative z-0">
               <div className="w-16 flex-shrink-0 text-xs text-gray-400 text-right pr-3 -mt-2.5">
                 {hour}:00
               </div>
               <div className="flex-1"></div>
             </div>
           ))}

           {/* --- Appointment Items (Visual Drag & Drop Simulation) --- */}
           
           {/* Monday 9:00 - Draggable Item */}
           <div className="absolute top-[4px] left-[calc(4rem+0.5%)] w-[calc(16.5%-0.5rem)] h-[88px] bg-green-50 border-l-4 border-green-500 rounded p-1.5 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all z-10 group overflow-hidden">
             <div className="flex justify-between items-start">
               <span className="text-xs font-bold text-green-800 truncate">Emre Demir</span>
             </div>
             <p className="text-[10px] text-green-600 mt-0.5 truncate">Diş Temizliği</p>
             <div className="text-[10px] text-green-600 mt-0.5 opacity-70">Dr. Ahmet</div>
             
             {/* Resize Handle */}
             <div className="absolute bottom-0 inset-x-0 h-2 cursor-ns-resize flex justify-center items-center opacity-0 group-hover:opacity-100">
                <div className="w-8 h-1 bg-green-200 rounded-full"></div>
             </div>
           </div>

           {/* Tuesday 10:00 (Conflict & Selected State) */}
           <div className="absolute top-[100px] left-[calc(4rem+16.6%)] w-[calc(16.5%-0.5rem)] h-[130px] bg-primary text-white rounded p-2 shadow-xl z-20 ring-2 ring-white ring-offset-2 ring-offset-blue-50 cursor-grab active:cursor-grabbing">
             {/* Move Handle (Visual) */}
             <div className="absolute top-0 inset-x-0 h-4 cursor-grab active:cursor-grabbing flex justify-center items-start pt-1 opacity-50 hover:opacity-100">
                <span className="material-symbols-outlined text-[10px] rotate-90">drag_handle</span>
             </div>

             <div className="mt-2">
                 <p className="text-sm font-bold">Selin Kaya</p>
                 <p className="text-[10px] text-blue-100">Kanal Tedavisi</p>
                 <div className="mt-2 flex items-center gap-1 text-[10px] border-t border-white/20 pt-1">
                 <span className="material-symbols-outlined text-[12px]">schedule</span> 10:00 - 11:30
                 </div>
             </div>

             {/* Resize Handle */}
             <div className="absolute bottom-0 inset-x-0 h-3 cursor-ns-resize flex justify-center items-center hover:bg-white/10">
                <div className="w-8 h-1 bg-white/50 rounded-full"></div>
             </div>
           </div>

           {/* Wednesday 14:00 */}
           <div className="absolute top-[480px] left-[calc(4rem+33.2%)] w-[calc(16.5%-0.5rem)] h-[44px] bg-purple-50 border-l-4 border-purple-500 rounded p-1.5 shadow-sm cursor-grab hover:shadow-md transition-all z-10 group">
             <div className="flex justify-between items-center h-full">
               <span className="text-xs font-bold text-purple-800 truncate">Berk Atar</span>
               <span className="text-[10px] text-purple-600">Kontrol</span>
             </div>
             <div className="absolute bottom-0 inset-x-0 h-1 cursor-ns-resize opacity-0 group-hover:opacity-100 bg-purple-200"></div>
           </div>

           {/* Ghost Event (Drag Preview Simulation) */}
           <div className="absolute top-[200px] left-[calc(4rem+49.8%)] w-[calc(16.5%-0.5rem)] h-[88px] bg-gray-100 border-2 border-dashed border-gray-400 rounded p-2 opacity-50 z-0 pointer-events-none flex items-center justify-center">
               <span className="text-xs font-bold text-gray-500">09:00 - 10:00</span>
           </div>

           {/* Current Time Indicator */}
           <div className="absolute left-16 right-0 top-[340px] border-t-2 border-red-500 z-30 pointer-events-none flex items-center">
             <div className="absolute -left-1.5 w-3 h-3 bg-red-500 rounded-full"></div>
             <div className="absolute -left-16 w-16 text-right pr-3 text-xs font-bold text-red-500 bg-white">12:30</div>
           </div>
        </div>
      </div>
    </div>
  );
};
