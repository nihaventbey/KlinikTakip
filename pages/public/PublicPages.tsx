
import React from 'react';
import { Card, Button, BeforeAfterSlider } from '../../components/UI';
import { useSettings } from '../../contexts/SettingsContext';

export const HomePage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="flex flex-col gap-16 pb-20 animate-fade-in">
      <section className="relative px-4 md:px-10 mt-6">
        <div className="max-w-7xl mx-auto rounded-[32px] overflow-hidden relative bg-gray-900 h-[600px] md:h-[750px] flex items-center shadow-2xl">
          <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url('${settings?.hero_image}')` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/40 to-transparent"></div>
          <div className="relative z-10 p-8 md:p-20 max-w-2xl text-white">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tight">{settings?.hero_title}</h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed font-medium">{settings?.hero_subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Button className="h-16 px-10 text-lg rounded-2xl shadow-xl">Ücretsiz Randevu Al</Button>
              <Button variant="secondary" className="h-16 px-10 text-lg rounded-2xl bg-white/10 text-white border-white/20 backdrop-blur-md hover:bg-white/20 transition-all" icon="play_circle">Süreci İzle</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {settings?.features?.map((f) => (
              <Card key={f.id} className="p-10 hover:shadow-2xl hover:-translate-y-2 transition-all group rounded-3xl border-gray-100">
                <div className="w-20 h-20 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <span className="material-symbols-outlined text-4xl">{f.icon}</span>
                </div>
                <h4 className="text-2xl font-extrabold mb-4 text-gray-900">{f.title}</h4>
                <p className="text-gray-500 leading-relaxed font-medium">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-32 px-4 md:px-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full -mr-64 -mt-64"></div>
        <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-20">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Mutlu Gülüşler</h2>
                <p className="text-gray-400 text-lg">Hastalarımızın deneyimleri bizim en büyük referansımızdır.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {settings?.testimonials?.map((t) => (
                    <div key={t.id} className="bg-white/5 border border-white/10 p-10 rounded-[32px] backdrop-blur-sm hover:bg-white/10 transition-colors group">
                        <div className="flex gap-1 text-yellow-500 mb-6">
                            {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined text-lg">star</span>)}
                        </div>
                        <p className="text-gray-200 italic mb-8 leading-relaxed text-lg">"{t.text}"</p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">{t.name[0]}</div>
                            <div>
                                <p className="font-bold text-white">{t.name}</p>
                                <p className="text-xs text-primary font-bold uppercase tracking-widest">{t.treatment}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export const ServicesPage: React.FC = () => {
    const { settings } = useSettings();

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-20 flex flex-col gap-24 animate-fade-in">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-gray-900">Tedavilerimiz & Teknolojiler</h1>
                <p className="text-gray-500 text-xl leading-relaxed">Modern diş hekimliğinin tüm imkanlarını kullanarak, kişiye özel, ağrısız ve hızlı tedavi yöntemleri sunuyoruz.</p>
            </div>

            <section>
                <h2 className="text-3xl font-extrabold mb-12 text-center text-gray-900 tracking-tight italic uppercase">Değişime Tanık Olun</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                   <BeforeAfterSlider 
                        before={settings?.service_before_img || ""} 
                        after={settings?.service_after_img || ""} 
                   />
                   <div className="p-10 md:p-14 bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-primary/5 flex flex-col gap-8">
                       <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">{settings?.service_highlight_title}</h3>
                       <p className="text-gray-600 text-xl leading-relaxed font-medium">{settings?.service_highlight_desc}</p>
                       <div className="grid grid-cols-2 gap-6 mt-4">
                           <div className="flex items-center gap-4 bg-primary/5 p-6 rounded-3xl group hover:bg-primary transition-all duration-300">
                               <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                   <span className="material-symbols-outlined text-primary">schedule</span>
                               </div>
                               <div>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-white/70">Süreç</p>
                                   <p className="text-lg font-bold text-gray-900 group-hover:text-white">{settings?.service_duration}</p>
                               </div>
                           </div>
                           <div className="flex items-center gap-4 bg-primary/5 p-6 rounded-3xl group hover:bg-primary transition-all duration-300">
                               <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                   <span className="material-symbols-outlined text-primary">dentistry</span>
                               </div>
                               <div>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-white/70">Uygulama</p>
                                   <p className="text-lg font-bold text-gray-900 group-hover:text-white">{settings?.service_teeth_count}</p>
                               </div>
                           </div>
                       </div>
                       <Button className="h-16 text-lg mt-4 rounded-2xl font-extrabold">Fiyat Teklifi Al</Button>
                   </div>
                </div>
            </section>
        </div>
    );
};

export const TeamPage: React.FC = () => <div className="p-20 text-center text-gray-500 text-xl font-bold animate-fade-in">Doktor kadrosu güncelleniyor...</div>;
export const ContactPage: React.FC = () => <div className="p-20 text-center text-gray-500 text-xl font-bold animate-fade-in">İletişim bilgileri Ayarlar sekmesinden yönetilebilir.</div>;
export const AppointmentPage: React.FC = () => <div className="p-20 text-center text-gray-500 text-xl font-bold animate-fade-in">Online randevu sistemi aktif.</div>;
