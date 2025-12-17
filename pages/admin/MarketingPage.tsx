
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { db } from '../../lib/db';
import { Lead } from '../../types';

export const MarketingPage: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    
    useEffect(() => {
        const load = () => setLeads(db.leads.getAll());
        load();
        window.addEventListener('storage_update', load);
        return () => window.removeEventListener('storage_update', load);
    }, []);

    const updateStatus = (id: string, status: Lead['status']) => {
        db.leads.updateStatus(id, status);
    };

    const statuses: Lead['status'][] = ['new', 'contacted', 'appointed', 'converted'];

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pazarlama Kanvası</h1>
                    <p className="text-gray-500 text-sm">Potansiyel hasta adayları ve dönüşüm hunisi</p>
                </div>
                <Button icon="campaign">Yeni Kampanya</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-220px)] overflow-hidden">
                {statuses.map(status => (
                    <div key={status} className="bg-gray-100 rounded-2xl flex flex-col h-full border border-gray-200">
                        <div className="p-4 bg-white rounded-t-2xl border-b border-gray-200 flex justify-between items-center">
                            <span className="font-bold text-gray-700 uppercase text-xs tracking-widest">{status}</span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold text-gray-500">
                                {leads.filter(l => l.status === status).length}
                            </span>
                        </div>
                        <div className="p-3 flex-1 overflow-y-auto space-y-3">
                            {leads.filter(l => l.status === status).map(lead => (
                                <Card key={lead.id} className="p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-bold text-gray-900 text-sm">{lead.name}</p>
                                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase">{lead.source}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">{lead.interest}</p>
                                    <div className="flex gap-1 mt-auto pt-3 border-t border-gray-50">
                                        {statuses.filter(s => s !== status).map(s => (
                                            <button 
                                                key={s} 
                                                onClick={() => updateStatus(lead.id, s)}
                                                className="text-[9px] font-bold uppercase text-gray-400 hover:text-primary transition-colors"
                                            >
                                                → {s}
                                            </button>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                            {leads.filter(l => l.status === status).length === 0 && (
                                <div className="h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Boş</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
