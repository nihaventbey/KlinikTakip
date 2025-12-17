import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../components/UI';
import { supabase } from '../../lib/supabase';
import { Task } from '../../types';

// --- Lab Tracking (Kanban) ---
export const LabTrackingPage: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    
    useEffect(() => {
        const fetchOrders = async () => {
            const { data } = await supabase.from('lab_orders').select('*');
            if(data) setOrders(data);
        };
        fetchOrders();
    }, []);

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
                                    {orders.filter(o => o.status === col.id).length}
                                </span>
                            </div>
                            <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
                                {orders.filter(o => o.status === col.id).map(order => (
                                    <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-move hover:shadow-md transition-shadow group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-gray-400">#{order.id.slice(0,5)}</span>
                                            <span className="material-symbols-outlined text-gray-300 text-sm group-hover:text-gray-500">drag_indicator</span>
                                        </div>
                                        <p className="font-bold text-gray-900">{order.patient_name}</p>
                                        <p className="text-sm text-primary font-medium">{order.item}</p>
                                        <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center text-xs text-gray-500">
                                            <span>{order.lab_name}</span>
                                            <span className="flex items-center gap-1 text-orange-600 font-bold">
                                                <span className="material-symbols-outlined text-[14px]">schedule</span> {order.due_date}
                                            </span>
                                        </div>
                                    </div>
                                ))}
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
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        setLoading(true);
        const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
        if(data) setTasks(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const toggleTask = async (task: Task) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        
        // Optimistic update
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

        await supabase.from('tasks').update({ status: newStatus }).eq('id', task.id);
    };

    const addTask = async () => {
        const title = prompt("Görev başlığı:");
        if (!title) return;
        
        const { data, error } = await supabase.from('tasks').insert({
            title,
            priority: 'medium',
            status: 'pending',
            assignee: 'Personel',
            due_date: new Date().toISOString()
        }).select().single();

        if (data) setTasks(prev => [data, ...prev]);
    };

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            {/* Tasks */}
            <section>
                 <div className="flex justify-between items-center mb-4">
                     <div>
                        <h2 className="text-xl font-bold text-gray-900">Görev Yöneticisi</h2>
                        <p className="text-gray-500 text-sm">Personel görev takibi</p>
                     </div>
                     <Button icon="add_task" variant="secondary" onClick={addTask}>Yeni Görev</Button>
                </div>
                {loading ? <p>Yükleniyor...</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tasks.map(task => (
                            <div key={task.id} className={`p-4 rounded-xl border transition-all ${task.status === 'completed' ? 'bg-gray-50 border-gray-200 opacity-70' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                        task.priority === 'high' ? 'bg-red-100 text-red-700' : 
                                        task.priority === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                        {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'} Öncelik
                                    </span>
                                    <input 
                                        type="checkbox" 
                                        checked={task.status === 'completed'} 
                                        onChange={() => toggleTask(task)}
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" 
                                    />
                                </div>
                                <p className={`font-bold mb-1 ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>{task.title}</p>
                                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                                    <span>{task.assignee || 'Atanmamış'}</span>
                                    <span>{task.due_date ? new Date(task.due_date).toLocaleDateString('tr-TR') : '-'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

// --- Form Builder (UI Only) ---
export const FormBuilderPage: React.FC = () => {
    return (
        <div className="h-[calc(100vh-120px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Form Tasarlayıcı</h1>
            </div>
            <div className="flex-1 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                 <p className="text-gray-400">Form oluşturucu modülü bu alanda yer alacak.</p>
            </div>
        </div>
    );
};
