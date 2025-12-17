import React, { useState, useEffect } from 'react';
import { APP_NAME } from '../../constants';

export const KioskPage: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const queue = [
        { no: '102', patient: 'A*** Y.', doctor: 'Dr. Ahmet Yılmaz', room: '1', status: 'inside' },
        { no: '103', patient: 'K*** S.', doctor: 'Dr. Ayşe Demir', room: '2', status: 'next' },
        { no: '104', patient: 'M*** D.', doctor: 'Dr. Mehmet Öz', room: '3', status: 'waiting' },
        { no: '105', patient: 'Z*** Ç.', doctor: 'Dr. Ahmet Yılmaz', room: '1', status: 'waiting' },
    ];

    return (
        <div className="bg-gray-900 min-h-screen text-white font-sans overflow-hidden flex flex-col">
            {/* Header */}
            <header className="bg-gray-800 p-8 flex justify-between items-center shadow-lg z-10">
                <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                         <span className="material-symbols-outlined text-5xl">dentistry</span>
                     </div>
                     <div>
                         <h1 className="text-3xl font-bold tracking-tight">{APP_NAME}</h1>
                         <p className="text-gray-400 text-lg">Bekleme Salonu Ekranı</p>
                     </div>
                </div>
                <div className="text-right">
                    <div className="text-5xl font-bold font-mono">
                        {currentTime.toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="text-gray-400 text-xl">
                        {currentTime.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex p-8 gap-8">
                {/* Left: Video/Announcement Area */}
                <div className="w-1/3 flex flex-col gap-8">
                     <div className="flex-1 bg-black rounded-3xl overflow-hidden relative shadow-2xl border border-gray-700">
                         <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Relax" />
                         <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                         <div className="absolute bottom-8 left-8 right-8">
                             <h2 className="text-2xl font-bold mb-2">Gülüş Tasarımı ile Tanışın</h2>
                             <p className="text-gray-300">Yeni nesil dijital diş hekimliği ile hayalinizdeki gülüşe kavuşmak artık çok kolay.</p>
                         </div>
                     </div>
                     <div className="h-40 bg-primary rounded-3xl p-6 flex items-center justify-between shadow-xl">
                          <div>
                              <p className="font-bold text-lg opacity-80">WiFi Şifresi</p>
                              <p className="text-4xl font-bold tracking-wider mt-1">DentCare2024</p>
                          </div>
                          <span className="material-symbols-outlined text-6xl opacity-50">wifi</span>
                     </div>
                </div>

                {/* Right: Queue List */}
                <div className="w-2/3 bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-700 flex flex-col">
                    <div className="bg-gray-700/50 p-6 flex text-gray-400 font-bold text-lg uppercase tracking-wider">
                        <div className="w-32">Sıra No</div>
                        <div className="flex-1">Hasta Adı</div>
                        <div className="flex-1">Doktor</div>
                        <div className="w-32 text-center">Oda</div>
                        <div className="w-48 text-right">Durum</div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        {queue.map((item, i) => (
                            <div key={i} className={`flex items-center p-8 border-b border-gray-700 ${item.status === 'inside' ? 'bg-primary/20' : ''} ${item.status === 'next' ? 'bg-green-900/20' : ''}`}>
                                <div className="w-32 text-4xl font-bold text-white">{item.no}</div>
                                <div className="flex-1 text-3xl font-medium text-white">{item.patient}</div>
                                <div className="flex-1 text-2xl text-gray-300">{item.doctor}</div>
                                <div className="w-32 text-center">
                                    <span className="inline-block w-16 h-16 bg-gray-700 rounded-xl leading-[64px] text-3xl font-bold">{item.room}</span>
                                </div>
                                <div className="w-48 text-right">
                                    {item.status === 'inside' && <span className="text-primary font-bold text-xl uppercase animate-pulse">İçeride</span>}
                                    {item.status === 'next' && <span className="text-green-400 font-bold text-xl uppercase">Sıradaki</span>}
                                    {item.status === 'waiting' && <span className="text-gray-500 font-bold text-xl uppercase">Bekliyor</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Ticker */}
            <div className="bg-primary py-3 overflow-hidden whitespace-nowrap">
                <div className="inline-block animate-[marquee_20s_linear_infinite] text-lg font-bold">
                    📢 Değerli hastalarımız, lütfen randevu saatinizden 10 dakika önce geliniz. • Diş fırçalama alışkanlığı kalp sağlığınızı korur. • Kliniğimizde 6 ayda bir ücretsiz kontrol hakkınız bulunmaktadır.
                </div>
            </div>
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
            `}</style>
        </div>
    );
};
