import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { db } from '../../lib/db';
import { Lead } from '../../types';

export const MarketingPage: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    
    const load = async () => {
        const data = await db.leads.getAll();
        setLeads(data);
    };

    useEffect(() => { load(); }, []);

    const updateStatus = async (id: string, status: string) => {
        await db.leads.updateStatus(id, status);
        load();
    };

    const statuses = ['new', 'contacted', 'appointed', 'converted'];

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <h1 className="text-2xl font-bold">Pazarlama Kanvası</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
                {statuses.map(status => (
                    <div key={status} className="bg-gray-100 rounded-2xl flex flex-col h-full border">
                        <div className="p-4 bg-white rounded-t-2xl border-b font-bold uppercase text-xs tracking-widest">{status}</div>
                        <div className="p-3 flex-1 overflow-y-auto space-y-3">
                            {leads.filter(l => l.status === status).map(lead => (
                                <Card key={lead.id} className="p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="font-bold text-sm">{lead.name}</p>
                                    <p className="text-xs text-gray-500 mb-2">{lead.interest}</p>
                                    <div className="flex gap-2 border-t pt-2">
                                        {statuses.filter(s => s !== status).map(s => (
                                            <button key={s} onClick={() => updateStatus(lead.id, s)} className="text-[8px] uppercase font-bold text-primary">→ {s}</button>
                                        ))}
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