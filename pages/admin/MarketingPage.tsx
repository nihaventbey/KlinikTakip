import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { db } from '../../lib/db';
import { Lead } from '../../types';
import { supabase } from '../../lib/supabase';

export const MarketingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'leads' | 'campaigns'>('leads');
    const [leads, setLeads] = useState<Lead[]>([]);
    
    // Kampanya State'leri
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [campaignForm, setCampaignForm] = useState({ id: '', title: '', discount_percentage: 0, start_date: '', end_date: '' });
    const [campaignStats, setCampaignStats] = useState<Record<string, number>>({});
    const [showActiveOnly, setShowActiveOnly] = useState(false);
    const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [treatmentsList, setTreatmentsList] = useState<any[]>([]);
    const [interestInput, setInterestInput] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    
    // Lead State'leri
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [leadForm, setLeadForm] = useState({ name: '', phone: '', interest: '' });
    
    const load = async () => {
        const data = await db.leads.getAll();
        setLeads(data);
    };

    useEffect(() => { load(); }, []);

    useEffect(() => {
        const fetchTreatments = async () => {
            const { data } = await supabase.from('treatments').select('name');
            if (data) setTreatmentsList(data);
        };
        fetchTreatments();
    }, []);

    useEffect(() => {
        if (activeTab === 'campaigns') {
            const loadCampaigns = async () => {
                const { data } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
                
                if (data) {
                    // Süresi dolmuş kampanyaları kontrol et ve pasife çek
                    const today = new Date().toLocaleDateString('en-CA');
                    const updatedData = await Promise.all(data.map(async (c) => {
                        if (c.is_active && c.end_date && c.end_date < today) {
                            await supabase.from('campaigns').update({ is_active: false }).eq('id', c.id);
                            return { ...c, is_active: false };
                        }
                        return c;
                    }));
                    setCampaigns(updatedData);
                }

                // Kampanya kullanım istatistikleri
                const { data: plans } = await supabase.from('treatment_plans').select('campaign_id').not('campaign_id', 'is', null);
                if (plans) {
                    const stats: Record<string, number> = {};
                    plans.forEach((p: any) => {
                        if (p.campaign_id) stats[p.campaign_id] = (stats[p.campaign_id] || 0) + 1;
                    });
                    setCampaignStats(stats);
                }
            };
            loadCampaigns();
        }
    }, [activeTab]);

    const updateStatus = async (id: string, status: string) => {
        await db.leads.updateStatus(id, status);
        load();
    };

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData('leadId', id);
    };

    const handleDragOver = (e: React.DragEvent, status: string) => {
        e.preventDefault();
        if (dragOverStatus !== status) setDragOverStatus(status);
    };

    const handleDrop = async (e: React.DragEvent, status: string) => {
        e.preventDefault();
        setDragOverStatus(null);
        const id = e.dataTransfer.getData('leadId');
        if (id) {
            await updateStatus(id, status);
        }
    };

    const handleSaveLead = async () => {
        if (!leadForm.name) return;

        const interest = selectedInterests.length > 0 ? selectedInterests.join(', ') : leadForm.interest;
        
        const { data, error } = await supabase.from('leads').insert([{ ...leadForm, interest, status: 'new', created_at: new Date().toISOString() }]).select();

        if (data) {
            setLeads([data[0], ...leads]);
            setShowLeadModal(false);
            setLeadForm({ name: '', phone: '', interest: '' });
            setSelectedInterests([]);
            setInterestInput('');
        } else if (error) {
            alert('Hata: ' + error.message);
        }
    };

    const handleSaveCampaign = async () => {
        if (!campaignForm.title) return;
        
        const payload = {
            title: campaignForm.title,
            discount_percentage: campaignForm.discount_percentage,
            start_date: campaignForm.start_date || null,
            end_date: campaignForm.end_date || null,
        };

        let error;
        let data;

        if (campaignForm.id) {
            const res = await supabase.from('campaigns').update(payload).eq('id', campaignForm.id).select();
            error = res.error;
            data = res.data;
            if (data) {
                setCampaigns(campaigns.map(c => c.id === campaignForm.id ? data[0] : c));
            }
        } else {
            const res = await supabase.from('campaigns').insert([{ ...payload, is_active: true }]).select();
            error = res.error;
            data = res.data;
            if (data) {
                setCampaigns([data[0], ...campaigns]);
            }
        }

        if (!error) {
            setShowCampaignModal(false);
            setCampaignForm({ id: '', title: '', discount_percentage: 0, start_date: '', end_date: '' });
        } else {
            alert('Hata: ' + error.message);
        }
    };

    const handleEditCampaign = (c: any) => {
        setCampaignForm({
            id: c.id,
            title: c.title,
            discount_percentage: c.discount_percentage,
            start_date: c.start_date || '',
            end_date: c.end_date || ''
        });
        setShowCampaignModal(true);
    };

    const toggleCampaignStatus = async (id: string, currentStatus: boolean) => {
        // Aktif edilmeye çalışılıyorsa tarih kontrolü
        if (!currentStatus) {
            const campaign = campaigns.find(c => c.id === id);
            if (campaign && campaign.end_date) {
                const today = new Date().toLocaleDateString('en-CA');
                if (campaign.end_date < today) {
                    return alert('Süresi dolmuş kampanya aktif edilemez. Lütfen önce tarihi güncelleyin.');
                }
            }
        }

        const { error } = await supabase.from('campaigns').update({ is_active: !currentStatus }).eq('id', id);
        
        if (error) {
            alert('Güncelleme hatası: ' + error.message);
        } else {
            setCampaigns(campaigns.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));
        }
    };

    const deleteCampaign = async (id: string) => {
        if (!confirm('Bu kampanyayı silmek istediğinize emin misiniz?')) return;
        await supabase.from('campaigns').delete().eq('id', id);
        setCampaigns(campaigns.filter(c => c.id !== id));
    };

    const toggleSort = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    const handleDeleteLead = async (id: string) => {
        if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
        const { error } = await supabase.from('leads').delete().eq('id', id);
        if (!error) {
            setLeads(leads.filter(l => l.id !== id));
        } else {
            alert('Silme hatası: ' + error.message);
        }
    };

    const addInterest = (val: string) => {
        if (val && !selectedInterests.includes(val)) {
            setSelectedInterests([...selectedInterests, val]);
        }
        setInterestInput('');
    };

    const removeInterest = (val: string) => {
        setSelectedInterests(selectedInterests.filter(i => i !== val));
    };

    const getRemainingDays = (dateStr: string) => {
        if (!dateStr) return null;
        const today = new Date();
        const end = new Date(dateStr);
        const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff < 0) return <span className="text-red-500 font-bold text-[10px]">Süresi Doldu</span>;
        return <span className="text-green-600 font-bold text-[10px]">{diff} gün kaldı</span>;
    };

    const sortedCampaigns = [...campaigns].sort((a, b) => {
        if (sortOrder === 'asc') return a.discount_percentage - b.discount_percentage;
        if (sortOrder === 'desc') return b.discount_percentage - a.discount_percentage;
        return 0;
    });

    const statuses = ['new', 'contacted', 'appointed', 'converted'];
    const statusLabels: Record<string, string> = {
        new: 'Yeni Başvuru',
        contacted: 'İletişime Geçildi',
        appointed: 'Randevu Planlandı',
        converted: 'Kazanıldı'
    };
    const statusIcons: Record<string, string> = {
        new: 'new_releases',
        contacted: 'contact_phone',
        appointed: 'event',
        converted: 'verified'
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Pazarlama & Kampanyalar</h1>
                <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                    <button onClick={() => setActiveTab('leads')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'leads' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Potansiyel Müşteriler</button>
                    <button onClick={() => setActiveTab('campaigns')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'campaigns' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Kampanyalar</button>
                </div>
            </div>

            {activeTab === 'leads' ? (
                <div className="flex flex-col gap-6">
                    {/* Kampanya Performans Grafiği */}
                    {Object.keys(campaignStats).length > 0 && (
                        <Card className="p-6 border-none shadow-lg rounded-[32px] bg-white mb-4">
                            <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">bar_chart</span> Kampanya Performansı</h3>
                            <div className="flex items-end gap-4 h-32 border-b border-slate-100 pb-2">
                                {campaigns.filter(c => campaignStats[c.id]).map(c => {
                                    const count = campaignStats[c.id] || 0;
                                    const max = Math.max(...Object.values(campaignStats));
                                    const height = max > 0 ? (count / max) * 100 : 0;
                                    return (
                                        <div key={c.id} className="flex-1 flex flex-col justify-end items-center group relative">
                                            <div className="w-full bg-primary/20 rounded-t-xl hover:bg-primary transition-colors relative" style={{ height: `${height}%` }}>
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity">{count}</div>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 mt-2 truncate w-full text-center" title={c.title}>{c.title}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    )}

                    {showLeadModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                            <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
                                <h3 className="text-xl font-extrabold text-gray-900 mb-6">Yeni Potansiyel Müşteri</h3>
                                <div className="flex flex-col gap-4">
                                    <input value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} className="p-4 bg-slate-50 border-none rounded-xl font-bold text-sm" placeholder="Ad Soyad" autoFocus />
                                    <input value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} className="p-4 bg-slate-50 border-none rounded-xl font-bold text-sm" placeholder="Telefon" />
                                    
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">İlgilendiği Tedaviler</label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {selectedInterests.map(i => (
                                                <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                                    {i} <button onClick={() => removeInterest(i)} className="hover:text-red-500">×</button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="relative">
                                            <input 
                                                value={interestInput} 
                                                onChange={e => setInterestInput(e.target.value)} 
                                                onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); addInterest(interestInput); } }}
                                                className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-sm" 
                                                placeholder="Tedavi seçin veya yazıp Enter'a basın" 
                                            />
                                            {interestInput && <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-xl mt-1 z-50 max-h-40 overflow-y-auto border border-slate-100">{treatmentsList.filter(t => t.name.toLowerCase().includes(interestInput.toLowerCase())).map(t => <div key={t.id} onClick={() => addInterest(t.name)} className="p-3 hover:bg-slate-50 cursor-pointer text-sm font-bold text-slate-700">{t.name}</div>)}</div>}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        <Button variant="outline" className="flex-1" onClick={() => setShowLeadModal(false)}>İptal</Button>
                                        <Button className="flex-1" onClick={handleSaveLead}>Kaydet</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex justify-end">
                         <Button icon="person_add" onClick={() => setShowLeadModal(true)}>Yeni Kayıt Ekle</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-250px)]">
                        {statuses.map(status => (
                            <div 
                                key={status} 
                                className={`rounded-[32px] flex flex-col h-full border transition-all duration-300 ${
                                    dragOverStatus === status 
                                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20 scale-[1.01]' 
                                        : 'border-slate-100'
                                } ${
                                    status === 'new' ? 'bg-blue-50/50' : status === 'contacted' ? 'bg-yellow-50/50' : status === 'appointed' ? 'bg-purple-50/50' : 'bg-green-50/50'
                                }`}
                                onDragOver={(e) => handleDragOver(e, status)}
                                onDragLeave={() => setDragOverStatus(null)}
                                onDrop={(e) => handleDrop(e, status)}
                            >
                                <div className="p-6 border-b border-slate-100/50 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 text-lg">{statusIcons[status]}</span>
                                    <span className="font-extrabold uppercase text-xs tracking-widest text-slate-500">{statusLabels[status]}</span>
                                    <span className="ml-auto bg-white px-2 py-1 rounded-lg text-[10px] font-bold text-slate-400 shadow-sm">{leads.filter(l => l.status === status).length}</span>
                                </div>
                                <div className="p-4 flex-1 overflow-y-auto space-y-3">
                                    {leads.filter(l => l.status === status).map(lead => (
                                        <div key={lead.id} draggable onDragStart={(e) => handleDragStart(e, lead.id)} className="cursor-grab active:cursor-grabbing">
                                            <Card className="p-5 border-none shadow-lg rounded-2xl hover:scale-[1.02] transition-transform bg-white group relative">
                                                <button onClick={() => handleDeleteLead(lead.id)} className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10">
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                                <p className="font-bold text-slate-900 pr-6">{lead.name}</p>
                                                <p className="text-xs text-slate-500 font-bold mb-3 line-clamp-2">{lead.interest}</p>
                                                {(lead as any).phone && <p className="text-[10px] text-slate-400 font-mono mb-3 flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">call</span> {(lead as any).phone}</p>}
                                                <div className="flex gap-1 border-t border-slate-50 pt-3 overflow-x-auto no-scrollbar relative z-20">
                                                    {statuses.filter(s => s !== status).map(s => (
                                                        <button key={s} onClick={(e) => { e.stopPropagation(); updateStatus(lead.id, s); }} className="text-[9px] uppercase font-extrabold text-slate-400 hover:text-primary hover:bg-primary/5 px-2 py-1 rounded whitespace-nowrap transition-colors">
                                                            {statusLabels[s].split(' ')[0]}
                                                        </button>
                                                    ))}
                                                </div>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {showCampaignModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                            <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
                                <h3 className="text-xl font-extrabold text-gray-900 mb-6">{campaignForm.id ? 'Kampanyayı Düzenle' : 'Yeni Kampanya'}</h3>
                                <div className="flex flex-col gap-4">
                                    <input value={campaignForm.title} onChange={e => setCampaignForm({...campaignForm, title: e.target.value})} className="p-4 bg-slate-50 border-none rounded-xl font-bold text-sm" placeholder="Kampanya Adı" autoFocus />
                                    <div className="flex gap-4">
                                        <input type="number" value={campaignForm.discount_percentage} onChange={e => setCampaignForm({...campaignForm, discount_percentage: Number(e.target.value)})} className="flex-1 p-4 bg-slate-50 border-none rounded-xl font-bold text-sm" placeholder="İndirim %" />
                                        <div className="flex-1 flex items-center justify-center font-bold text-slate-400">% İndirim</div>
                                    </div>
                                    <div className="flex gap-4">
                                        <input type="date" value={campaignForm.start_date} onChange={e => setCampaignForm({...campaignForm, start_date: e.target.value})} className="flex-1 p-4 bg-slate-50 border-none rounded-xl font-bold text-xs text-slate-500" />
                                        <input type="date" value={campaignForm.end_date} onChange={e => setCampaignForm({...campaignForm, end_date: e.target.value})} className="flex-1 p-4 bg-slate-50 border-none rounded-xl font-bold text-xs text-slate-500" />
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <Button variant="outline" className="flex-1" onClick={() => setShowCampaignModal(false)}>İptal</Button>
                                        <Button className="flex-1" onClick={handleSaveCampaign}>Kaydet</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
                                <input type="checkbox" checked={showActiveOnly} onChange={e => setShowActiveOnly(e.target.checked)} className="w-4 h-4 accent-primary cursor-pointer" />
                                <span className="text-sm font-bold text-slate-600 select-none">Sadece Aktif Kampanyalar</span>
                            </label>
                            <button onClick={toggleSort} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors text-sm font-bold text-slate-600">
                                <span className="material-symbols-outlined text-lg">sort</span>
                                {sortOrder === 'asc' ? 'İndirim Artan' : sortOrder === 'desc' ? 'İndirim Azalan' : 'Sıralama'}
                            </button>
                        </div>
                        <Button icon="campaign" onClick={() => { setCampaignForm({ id: '', title: '', discount_percentage: 0, start_date: '', end_date: '' }); setShowCampaignModal(true); }}>Yeni Kampanya Oluştur</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {sortedCampaigns.filter(c => !showActiveOnly || c.is_active).map(c => (
                            <Card key={c.id} className={`p-6 border-none shadow-xl rounded-[32px] relative overflow-hidden ${!c.is_active ? 'opacity-60 grayscale' : ''}`}>
                                <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-8xl">local_offer</span></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge status={c.is_active ? 'active' : 'inactive'} />
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEditCampaign(c)} className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors"><span className="material-symbols-outlined text-sm">edit</span></button>
                                            <button onClick={() => toggleCampaignStatus(c.id, c.is_active)} className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors"><span className="material-symbols-outlined text-sm">{c.is_active ? 'visibility_off' : 'visibility'}</span></button>
                                            <button onClick={() => deleteCampaign(c.id)} className="p-2 bg-white/50 rounded-full hover:bg-red-50 text-red-500 transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-extrabold text-slate-900 mb-1">{c.title}</h3>
                                    <p className="text-4xl font-extrabold text-primary mb-4">%{c.discount_percentage}</p>
                                    <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>B: {new Date(c.start_date).toLocaleDateString()}</span>
                                        <span>B: {new Date(c.end_date).toLocaleDateString()}</span>
                                        {getRemainingDays(c.end_date)}
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-500">
                                        <span className="material-symbols-outlined text-sm">group</span>
                                        {campaignStats[c.id] || 0} Hasta Yararlandı
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};