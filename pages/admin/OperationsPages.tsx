
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { db } from '../../lib/db';
import { Task } from '../../types';

// --- Lab Tracking ---
export const LabTrackingPage: React.FC = () => {
    const orders = [
        { id: '1', patient_name: 'Zeynep Yılmaz', item: 'Zirkonyum Köprü', lab_name: 'DentaLab', status: 'in-progress', due_date: '25.10.2023' },
        { id: '2', patient_name: 'Mehmet Aksoy', item: 'Gece Plağı', lab_name: 'Express Lab', status: 'shipped', due_date: '24.10.2023' }
    ];

    const columns = [
        { id: 'ordered', title: 'Sipariş' },
        { id: 'in-progress', title: 'Üretim' },
        { id: 'shipped', title: 'Kargo' },
        { id: 'arrived', title: 'Hazır' }
    ];

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Lab & Protez Takibi</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {columns.map(col => (
                    <div key={col.id} className="bg-gray-50 rounded-xl p-4 flex flex-col gap-4 border border-gray-100">
                        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-widest">{col.title}</h3>
                        {orders.filter(o => o.status === col.id).map(order => (
                            <Card key={order.id} className="p-4 shadow-sm border-l-4 border-l-primary">
                                <p className="font-bold text-sm">{order.patient_name}</p>
                                <p className="text-xs text-primary font-medium mt-1">{order.item}</p>
                                <div className="mt-4 flex justify-between items-center text-[10px] text-gray-400">
                                    <span>{order.lab_name}</span>
                                    <span className="font-bold text-orange-500">{order.due_date}</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Staff & Task ---
export const StaffManagerPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    
    useEffect(() => {
        const load = () => setTasks(db.tasks.getAll());
        load();
        window.addEventListener('storage_update', load);
        return () => window.removeEventListener('storage_update', load);
    }, []);

    return (
        <div className="flex flex-col gap-8">
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Günlük Görevler</h2>
                    <Button icon="add_task" onClick={() => {
                        const title = prompt("Görev:");
                        if(title) db.tasks.add({ title, priority: 'medium', status: 'pending', assignee: 'Asistan', due_date: new Date().toISOString() });
                    }}>Yeni Görev</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tasks.map(task => (
                        <Card key={task.id} className={`p-4 transition-all ${task.status === 'completed' ? 'opacity-50 grayscale' : ''}`}>
                            <div className="flex justify-between items-start mb-3">
                                <Badge status={task.priority === 'high' ? 'late' : 'pending'} />
                                <input 
                                    type="checkbox" 
                                    checked={task.status === 'completed'} 
                                    onChange={() => db.tasks.toggle(task.id)}
                                    className="w-5 h-5 rounded text-primary"
                                />
                            </div>
                            <p className={`font-bold text-sm ${task.status === 'completed' ? 'line-through' : ''}`}>{task.title}</p>
                            <p className="text-xs text-gray-400 mt-2">Sorumlu: {task.assignee}</p>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
};

export const FormBuilderPage: React.FC = () => <div className="p-10 text-center text-gray-400">Dinamik form oluşturucu modülü yüklendi. (Geliştirme aşamasında)</div>;
