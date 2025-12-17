import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { LAB_ORDERS, TASKS, STAFF_SHIFTS } from '../../constants';

// --- Lab Tracking (Kanban) ---
export const LabTrackingPage: React.FC = () => {
    const columns = [
        { id: 'ordered', title: 'Sipariş Verildi', color: 'bg-gray-100 border-gray-200' },
        { id: 'in-progress', title: 'Hazırlanıyor', color: 'bg-blue-50 border-blue-200' },
        { id: 'shipped', title: 'Kargoda', color: 'bg-yellow-50 border-yellow-200' },
        { id: 'arrived', title: 'Teslim Alındı', color: 'bg-green-50 border-green-200' },
    ];

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-120px)]">
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Laboratuvar Takibi</h1>
                    <p className="text-gray-500 text-sm">Protez ve ürün süreçleri</p>
                </div>
                <Button icon="add">Yeni Sipariş</Button>
            </div>
            
            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-4 h-full min-w-[1000px]">
                    {columns.map(col => (
                        <div key={col.id} className={`flex-1 rounded-xl border ${col.color} p-4 flex flex-col gap-4`}>
                            <div className="flex justify-between items-center font-bold text-gray-700">
                                <span>{col.title}</span>
                                <span className="bg-white px-2 py-0.5 rounded text-xs shadow-sm">
                                    {LAB_ORDERS.filter(o => o.status === col.id).length}
                                </span>
                            </div>
                            <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
                                {LAB_ORDERS.filter(o => o.status === col.id).map(order => (
                                    <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-move hover:shadow-md transition-shadow group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-gray-400">{order.id}</span>
                                            <span className="material-symbols-outlined text-gray-300 text-sm group-hover:text-gray-500">drag_indicator</span>
                                        </div>
                                        <p className="font-bold text-gray-900">{order.patientName}</p>
                                        <p className="text-sm text-primary font-medium">{order.item}</p>
                                        <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center text-xs text-gray-500">
                                            <span>{order.labName}</span>
                                            <span className="flex items-center gap-1 text-orange-600 font-bold">
                                                <span className="material-symbols-outlined text-[14px]">schedule</span> {order.dueDate}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {/* Empty State for Drag Drop Target */}
                                <div className="h-12 border-2 border-dashed border-gray-300/50 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                                    Buraya Sürükle
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Staff & Task Manager ---
export const StaffManagerPage: React.FC = () => {
    return (
        <div className="flex flex-col gap-8">
            {/* Shifts */}
            <section>
                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-bold">Vardiya Çizelgesi</h2>
                     <div className="flex gap-2">
                        <button className="p-1 rounded hover:bg-gray-100"><span className="material-symbols-outlined">chevron_left</span></button>
                        <span className="font-bold text-sm flex items-center">Bu Hafta</span>
                        <button className="p-1 rounded hover:bg-gray-100"><span className="material-symbols-outlined">chevron_right</span></button>
                     </div>
                </div>
                <Card className="overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="p-4">Gün</th>
                                <th className="p-4">Personel Durumu</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {STAFF_SHIFTS.map((shift, i) => (
                                <tr key={i}>
                                    <td className="p-4 font-bold w-32">{shift.day}</td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-2">
                                            {shift.staff.map((s, j) => (
                                                <div key={j} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                                                    s.status === 'working' ? 'bg-green-50 border-green-200 text-green-700' :
                                                    s.status === 'half' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                                                    'bg-gray-100 border-gray-200 text-gray-500'
                                                }`}>
                                                    <span className="font-bold">{s.name}</span>
                                                    <span className="text-[10px] uppercase opacity-70">({s.status === 'working' ? 'Tam' : s.status === 'half' ? 'Yarım' : 'İzin'})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </section>

            {/* Tasks */}
            <section>
                 <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-bold">Görev Yöneticisi</h2>
                     <Button icon="add_task" variant="secondary">Yeni Görev</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TASKS.map(task => (
                        <div key={task.id} className={`p-4 rounded-xl border ${task.completed ? 'bg-gray-50 border-gray-200 opacity-70' : 'bg-white border-gray-200 shadow-sm'}`}>
                             <div className="flex justify-between items-start mb-2">
                                 <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                     task.priority === 'high' ? 'bg-red-100 text-red-700' : 
                                     task.priority === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                 }`}>
                                     {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'} Öncelik
                                 </span>
                                 <input type="checkbox" defaultChecked={task.completed} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                             </div>
                             <p className={`font-bold mb-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>{task.title}</p>
                             <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
                                 <div className="flex items-center gap-1">
                                     <span className="material-symbols-outlined text-sm">person</span> {task.assignee}
                                 </div>
                                 <span className={task.dueDate === 'Bugün' ? 'text-red-500 font-bold' : ''}>{task.dueDate}</span>
                             </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

// --- Form Builder ---
export const FormBuilderPage: React.FC = () => {
    return (
        <div className="h-[calc(100vh-120px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dinamik Form Tasarlayıcı</h1>
                    <p className="text-gray-500 text-sm">Hasta onam ve anamnez formlarını sürükle-bırak ile tasarlayın.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" icon="visibility">Önizle</Button>
                    <Button icon="save">Formu Kaydet</Button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Left Sidebar: Components */}
                <Card className="w-64 p-4 flex flex-col gap-4 overflow-y-auto">
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Bileşenler</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {['Metin Alanı', 'Uzun Metin', 'Seçim Kutusu', 'Çoklu Seçim', 'Tarih', 'İmza Alanı', 'Başlık'].map(item => (
                            <div key={item} className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-move hover:bg-white hover:shadow-sm hover:border-primary transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-gray-400 text-lg">drag_indicator</span>
                                {item}
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Main Canvas */}
                <div className="flex-1 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 overflow-y-auto p-8 flex justify-center">
                    <div className="bg-white w-full max-w-2xl min-h-full shadow-lg p-8 rounded-lg space-y-6">
                         <div className="border-b-2 border-gray-100 pb-4 mb-4">
                             <input type="text" defaultValue="İmplant Tedavisi Onam Formu" className="text-2xl font-bold text-gray-900 w-full outline-none border-none placeholder-gray-300" placeholder="Form Başlığı" />
                             <input type="text" defaultValue="Lütfen aşağıdaki maddeleri dikkatlice okuyup imzalayınız." className="text-gray-500 w-full outline-none border-none text-sm mt-1" />
                         </div>

                         {/* Mock Fields */}
                         <div className="group relative border border-transparent hover:border-blue-300 hover:bg-blue-50/50 p-2 rounded transition-all cursor-pointer">
                             <label className="block text-sm font-bold text-gray-700 mb-1">Kronik Rahatsızlığınız var mı?</label>
                             <div className="flex gap-4">
                                 <label className="flex items-center gap-2"><input type="radio" name="r1" /> Evet</label>
                                 <label className="flex items-center gap-2"><input type="radio" name="r1" /> Hayır</label>
                             </div>
                             <div className="absolute right-2 top-2 hidden group-hover:flex gap-1">
                                 <button className="p-1 bg-white shadow rounded hover:text-red-500"><span className="material-symbols-outlined text-sm">delete</span></button>
                             </div>
                         </div>

                         <div className="group relative border border-transparent hover:border-blue-300 hover:bg-blue-50/50 p-2 rounded transition-all cursor-pointer">
                             <label className="block text-sm font-bold text-gray-700 mb-1">Kullandığınız İlaçlar</label>
                             <textarea className="w-full border border-gray-300 rounded p-2 text-sm bg-gray-50" rows={3} disabled></textarea>
                         </div>
                         
                         <div className="group relative border border-transparent hover:border-blue-300 hover:bg-blue-50/50 p-2 rounded transition-all cursor-pointer">
                             <label className="block text-sm font-bold text-gray-700 mb-1">Hasta İmzası</label>
                             <div className="w-full h-24 border border-gray-300 border-dashed rounded bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
                                 Dijital İmza Alanı
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
