import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { db } from '../../lib/db';
import { Task } from '../../types';

export const LabTrackingPage: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLab = async () => {
            const data = await db.lab.getAll();
            setOrders(data);
            setLoading(false);
        };
        fetchLab();
    }, []);

    const columns = [
        { id: 'ordered', title: 'Sipariş Verildi' },
        { id: 'in-progress', title: 'Laboratuvar Süreci' },
        { id: 'shipped', title: 'Yola Çıktı' },
        { id: 'arrived', title: 'Klinikte / Hazır' }
    ];

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Protez & Laboratuvar Takibi</h1>
                <Button icon="biotech" variant="outline">Yeni İş Emri</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[600px]">
                {columns.map(col => (
                    <div key={col.id} className="bg-slate-50/50 rounded-[32px] p-5 flex flex-col gap-5 border border-slate-100">
                        <div className="flex items-center justify-between px-3">
                            <h3 className="font-extrabold text-slate-400 text-[10px] uppercase tracking-[0.2em]">{col.title}</h3>
                            <span className="bg-white px-2 py-1 rounded-lg text-[10px] font-bold text-slate-400 border border-slate-100">{orders.filter(o => o.status === col.id).length}</span>
                        </div>
                        <div className="flex flex-col gap-4 overflow-y-auto">
                            {orders.filter(o => o.status === col.id).map(order => (
                                <Card key={order.id} className="p-6 border-none shadow-lg shadow-slate-200/50 rounded-3xl hover:scale-[1.02] transition-transform cursor-pointer group">
                                    <p className="font-extrabold text-slate-900">{order.patient_name}</p>
                                    <div className="mt-2 p-2 bg-primary/5 rounded-xl inline-block"><p className="text-[11px] text-primary font-bold uppercase tracking-wider">{order.item}</p></div>
                                    <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px]">
                                        <span className="font-bold text-slate-400 uppercase">{order.lab_name}</span>
                                        <span className="font-extrabold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">{order.due_date}</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const StaffManagerPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    
    const loadTasks = async () => {
        const data = await db.tasks.getAll();
        setTasks(data);
    };

    useEffect(() => { loadTasks(); }, []);

    const handleAddTask = async () => {
        const title = prompt("Yeni Görev:");
        if(title) {
            await db.tasks.add({ title, priority: 'medium', status: 'pending', assignee: 'Klinik Ekibi', due_date: new Date().toISOString() });
            loadTasks();
        }
    };

    return (
        <div className="flex flex-col gap-10 animate-fade-in">
            <section>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Ekip Görev Yönetimi</h2>
                    <Button icon="playlist_add_check" onClick={handleAddTask} className="h-12 px-6 rounded-xl font-bold">Yeni Görev Tanımla</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map(task => (
                        <Card key={task.id} className={`p-8 border-none shadow-xl rounded-[32px] transition-all group ${task.status === 'completed' ? 'opacity-40 grayscale scale-[0.98]' : 'hover:shadow-2xl hover:shadow-primary/5'}`}>
                            <div className="flex justify-between items-start mb-6">
                                <Badge status={task.priority === 'high' ? 'late' : 'pending'} />
                                <div onClick={async () => { await db.tasks.toggle(task.id, task.status); loadTasks(); }} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${task.status === 'completed' ? 'bg-primary border-primary text-white' : 'border-slate-200 text-transparent hover:border-primary'}`}>
                                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                                </div>
                            </div>
                            <h4 className={`text-lg font-extrabold text-slate-900 leading-tight mb-4 ${task.status === 'completed' ? 'line-through' : ''}`}>{task.title}</h4>
                            <div className="flex items-center gap-3 mt-auto pt-6 border-t border-slate-50">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">EK</div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sorumlu: {task.assignee}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
};