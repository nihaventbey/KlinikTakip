import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { CAMPAIGNS, LEADS, SOCIAL_POSTS } from '../../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- Components ---

const FunnelChart = () => {
    const data = [
        { name: 'Web Ziyareti', value: 5000, color: '#eef2ff' },
        { name: 'Form Dolumu', value: 320, color: '#c7d2fe' },
        { name: 'Telefon', value: 240, color: '#818cf8' },
        { name: 'Randevu', value: 180, color: '#4f46e5' },
        { name: 'Tedavi', value: 120, color: '#312e81' },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={data} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" barSize={30} radius={[0, 4, 4, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

// --- Page ---

export const MarketingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'leads' | 'social' | 'tools'>('overview');
    const [socialText, setSocialText] = useState(SOCIAL_POSTS[0].caption);

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pazarlama ve Büyüme</h1>
                    <p className="text-gray-500 text-sm">Kampanyalar, potansiyel hastalar ve sosyal medya yönetimi</p>
                </div>
                <div className="flex gap-2">
                     {activeTab === 'campaigns' && <Button icon="add_circle">Yeni Kampanya</Button>}
                     {activeTab === 'social' && <Button icon="post_add" variant="secondary">Post Oluştur</Button>}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 gap-6 overflow-x-auto">
                {[
                    { id: 'overview', label: 'Genel Bakış', icon: 'monitoring' },
                    { id: 'campaigns', label: 'Kampanyalar', icon: 'campaign' },
                    { id: 'leads', label: 'Potansiyel Hastalar', icon: 'filter_alt' },
                    { id: 'social', label: 'Sosyal Medya', icon: 'share' },
                    { id: 'tools', label: 'QR & Araçlar', icon: 'qr_code_2' },
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <div className="flex flex-col gap-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="p-6 col-span-2">
                            <h3 className="font-bold text-lg mb-4 text-gray-900">Lead Dönüşüm Hunisi</h3>
                            <FunnelChart />
                        </Card>
                        <div className="flex flex-col gap-6">
                             <Card className="p-6 flex-1 flex flex-col justify-center items-center text-center">
                                 <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                                     <span className="material-symbols-outlined text-3xl">attach_money</span>
                                 </div>
                                 <h4 className="text-3xl font-bold text-gray-900">₺450</h4>
                                 <p className="text-gray-500 text-sm">Ortalama Lead Maliyeti</p>
                             </Card>
                             <Card className="p-6 flex-1 flex flex-col justify-center items-center text-center">
                                 <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                                     <span className="material-symbols-outlined text-3xl">group_add</span>
                                 </div>
                                 <h4 className="text-3xl font-bold text-gray-900">%12.5</h4>
                                 <p className="text-gray-500 text-sm">Randevu Dönüşüm Oranı</p>
                             </Card>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'campaigns' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {CAMPAIGNS.map(camp => (
                        <Card key={camp.id} className="p-0 overflow-hidden group">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${camp.type === 'sms' ? 'bg-blue-100 text-blue-600' : camp.type === 'email' ? 'bg-orange-100 text-orange-600' : 'bg-pink-100 text-pink-600'}`}>
                                        <span className="material-symbols-outlined">
                                            {camp.type === 'sms' ? 'sms' : camp.type === 'email' ? 'mail' : 'photo_camera'}
                                        </span>
                                    </div>
                                    <Badge status={camp.status === 'active' ? 'active' : 'completed'} />
                                </div>
                                <h3 className="font-bold text-lg mb-1">{camp.title}</h3>
                                <p className="text-gray-500 text-xs mb-4">{camp.date} tarihinde oluşturuldu</p>
                                
                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100">
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Ulaşılan</p>
                                        <p className="font-bold text-gray-900">{camp.sentCount}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 font-bold uppercase">Dönüşüm</p>
                                        <p className="font-bold text-green-600">%{camp.conversionRate}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 flex justify-between items-center group-hover:bg-gray-100 transition-colors cursor-pointer">
                                <span className="text-xs font-bold text-gray-500">Raporu Gör</span>
                                <span className="material-symbols-outlined text-sm text-gray-400">arrow_forward</span>
                            </div>
                        </Card>
                    ))}
                    
                    {/* Create New Card */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 cursor-pointer transition-all min-h-[250px]">
                        <span className="material-symbols-outlined text-4xl mb-2">add_circle</span>
                        <span className="font-bold">Yeni Kampanya Oluştur</span>
                    </div>
                </div>
            )}

            {activeTab === 'leads' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in h-[calc(100vh-200px)] overflow-hidden">
                    {['new', 'contacted', 'appointed', 'converted'].map(status => {
                        const statusLabels: any = { new: 'Yeni', contacted: 'Arandı', appointed: 'Randevu', converted: 'Kazanıldı' };
                        const statusColors: any = { new: 'bg-blue-500', contacted: 'bg-yellow-500', appointed: 'bg-purple-500', converted: 'bg-green-500' };
                        
                        return (
                            <div key={status} className="bg-gray-100 rounded-xl flex flex-col h-full">
                                <div className={`p-3 rounded-t-xl text-white font-bold text-sm flex justify-between items-center ${statusColors[status]}`}>
                                    <span>{statusLabels[status]}</span>
                                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                                        {LEADS.filter(l => l.status === status).length}
                                    </span>
                                </div>
                                <div className="p-2 flex-1 overflow-y-auto space-y-2">
                                    {LEADS.filter(l => l.status === status).map(lead => (
                                        <div key={lead.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-grab hover:shadow-md">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold text-gray-900">{lead.name}</span>
                                                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{lead.source}</span>
                                            </div>
                                            <p className="text-xs text-primary font-medium mb-2">{lead.interest}</p>
                                            <div className="flex justify-between items-center text-[10px] text-gray-400">
                                                <span>{lead.date}</span>
                                                <button className="hover:text-primary"><span className="material-symbols-outlined text-sm">call</span></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {activeTab === 'social' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                    <div className="lg:col-span-2 space-y-6">
                         <Card className="p-6">
                             <h3 className="font-bold text-lg mb-4">İçerik Editörü</h3>
                             <div className="flex flex-col gap-4">
                                 <div className="h-40 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50">
                                     <span className="material-symbols-outlined text-4xl mb-2">add_photo_alternate</span>
                                     <span className="text-sm">Fotoğraf Yükle veya Sürükle</span>
                                 </div>
                                 <textarea 
                                    className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20" 
                                    rows={4}
                                    placeholder="Açıklama yazınız..."
                                    value={socialText}
                                    onChange={(e) => setSocialText(e.target.value)}
                                 ></textarea>
                                 <div className="flex gap-2">
                                     <Button className="flex-1">Taslağı Kaydet</Button>
                                     <Button variant="secondary" className="flex-1">Zamanla</Button>
                                 </div>
                             </div>
                         </Card>
                         
                         <h3 className="font-bold text-lg text-gray-900">Taslaklar & Planlananlar</h3>
                         <div className="grid grid-cols-2 gap-4">
                             {SOCIAL_POSTS.map(post => (
                                 <div key={post.id} className="flex gap-4 p-3 bg-white rounded-xl border border-gray-200">
                                     <img src={post.image} className="w-20 h-20 object-cover rounded-lg" alt="Post" />
                                     <div className="flex flex-col justify-between">
                                         <p className="text-xs font-medium text-gray-600 line-clamp-2">{post.caption}</p>
                                         <div className="flex items-center gap-2 mt-2">
                                             <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${post.status === 'scheduled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                 {post.status === 'scheduled' ? 'Zamanlandı' : 'Taslak'}
                                             </span>
                                         </div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </div>

                    {/* Phone Preview */}
                    <div className="flex justify-center">
                        <div className="w-[300px] h-[600px] bg-black rounded-[40px] p-3 shadow-2xl relative border-4 border-gray-800">
                             {/* Notch */}
                             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
                             
                             {/* Screen */}
                             <div className="w-full h-full bg-white rounded-[32px] overflow-hidden flex flex-col relative">
                                  {/* Instagram Header Mock */}
                                  <div className="h-12 border-b border-gray-100 flex items-center justify-center mt-6">
                                      <span className="font-bold text-sm">Yeni Gönderi</span>
                                  </div>
                                  
                                  {/* Image */}
                                  <div className="aspect-square bg-gray-100 relative">
                                      <img src={SOCIAL_POSTS[0].image} className="w-full h-full object-cover" alt="Preview" />
                                  </div>

                                  {/* Actions */}
                                  <div className="p-3 flex justify-between">
                                      <div className="flex gap-3">
                                          <span className="material-symbols-outlined text-xl">favorite</span>
                                          <span className="material-symbols-outlined text-xl">chat_bubble</span>
                                          <span className="material-symbols-outlined text-xl">send</span>
                                      </div>
                                      <span className="material-symbols-outlined text-xl">bookmark</span>
                                  </div>

                                  {/* Caption */}
                                  <div className="px-3 pb-4 overflow-y-auto">
                                      <p className="text-xs">
                                          <span className="font-bold mr-1">dentcare_klinik</span>
                                          {socialText}
                                      </p>
                                  </div>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'tools' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <Card className="p-6 flex flex-col items-center text-center">
                        <h3 className="font-bold text-lg mb-2">Wi-Fi Erişim QR Kodu</h3>
                        <p className="text-gray-500 text-sm mb-6">Bekleme salonu için otomatik Wi-Fi bağlantısı.</p>
                        
                        <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-sm mb-6">
                             <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=WIFI:S:DentCare_Guest;T:WPA;P:DentCare2024;;" alt="WiFi QR" />
                        </div>
                        
                        <div className="w-full space-y-3">
                             <div className="flex flex-col text-left gap-1">
                                 <label className="text-xs font-bold text-gray-500">Ağ Adı (SSID)</label>
                                 <input type="text" defaultValue="DentCare_Guest" className="p-2 bg-gray-50 border border-gray-200 rounded text-sm" />
                             </div>
                             <div className="flex flex-col text-left gap-1">
                                 <label className="text-xs font-bold text-gray-500">Şifre</label>
                                 <input type="text" defaultValue="DentCare2024" className="p-2 bg-gray-50 border border-gray-200 rounded text-sm" />
                             </div>
                             <Button className="w-full">QR Güncelle & Yazdır</Button>
                        </div>
                    </Card>

                    <Card className="p-6 flex flex-col">
                        <h3 className="font-bold text-lg mb-4">Referans Sistemi & Anket</h3>
                        <div className="space-y-6">
                            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-purple-600">loyalty</span>
                                    <h4 className="font-bold text-purple-900">Arkadaşını Getir</h4>
                                </div>
                                <p className="text-sm text-purple-700 mb-3">Her getirdiği hasta için %10 indirim kuponu tanımlanır.</p>
                                <div className="flex gap-2">
                                    <input type="text" readOnly value="DENT-REF-2024" className="flex-1 bg-white border border-purple-200 rounded px-2 text-sm text-gray-600" />
                                    <button className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-bold">Kopyala</button>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-blue-600">poll</span>
                                    <h4 className="font-bold text-blue-900">Memnuniyet Anketi</h4>
                                </div>
                                <p className="text-sm text-blue-700 mb-3">Tedavi sonrası otomatik gönderilen anket linki.</p>
                                <Button variant="secondary" className="w-full text-xs">Anketi Düzenle</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};
