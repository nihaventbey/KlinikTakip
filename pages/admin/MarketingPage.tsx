import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { supabase } from '../../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const MarketingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'leads'>('overview');
    const [leads, setLeads] = useState<any[]>([]);
    const [campaigns, setCampaigns] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: leadsData } = await supabase.from('marketing_leads').select('*');
            if(leadsData) setLeads(leadsData);

            const { data: campData } = await supabase.from('campaigns').select('*');
            if(campData) setCampaigns(campData);
        };
        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pazarlama ve Büyüme</h1>
                </div>
                <div className="flex gap-2">
                     {activeTab === 'campaigns' && <Button icon="add_circle">Yeni Kampanya</Button>}
                </div>
            </div>

            <div className="flex border-b border-gray-200 gap-6">
                <button onClick={() => setActiveTab('overview')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}>Genel Bakış</button>
                <button onClick={() => setActiveTab('campaigns')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'campaigns' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}>Kampanyalar</button>
                <button onClick={() => setActiveTab('leads')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'leads' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}>Potansiyel Hastalar</button>
            </div>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 col-span-2 flex items-center justify-center bg-gray-50">
                        <p className="text-gray-500">Pazarlama hunisi grafikleri burada görüntülenecek.</p>
                    </Card>
                    <div className="flex flex-col gap-6">
                         <Card className="p-6 flex-1 flex flex-col justify-center items-center text-center">
                             <h4 className="text-3xl font-bold text-gray-900">{leads.length}</h4>
                             <p className="text-gray-500 text-sm">Toplam Lead</p>
                         </Card>
                    </div>
                </div>
            )}

            {activeTab === 'campaigns' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {campaigns.map(camp => (
                        <Card key={camp.id} className="p-0 overflow-hidden group">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <Badge status={camp.status} />
                                </div>
                                <h3 className="font-bold text-lg mb-1">{camp.title}</h3>
                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100 mt-4">
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Ulaşılan</p>
                                        <p className="font-bold text-gray-900">{camp.sent_count}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 font-bold uppercase">Dönüşüm</p>
                                        <p className="font-bold text-green-600">%{camp.conversion_rate}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {activeTab === 'leads' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in h-[calc(100vh-200px)] overflow-hidden">
                    {['new', 'contacted', 'converted'].map(status => (
                        <div key={status} className="bg-gray-100 rounded-xl flex flex-col h-full">
                            <div className="p-3 bg-gray-200 rounded-t-xl text-gray-700 font-bold text-sm uppercase">
                                {status}
                            </div>
                            <div className="p-2 flex-1 overflow-y-auto space-y-2">
                                {leads.filter(l => l.status === status).map(lead => (
                                    <div key={lead.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-gray-900">{lead.full_name}</span>
                                            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{lead.source}</span>
                                        </div>
                                        <p className="text-xs text-primary font-medium">{lead.interest}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
