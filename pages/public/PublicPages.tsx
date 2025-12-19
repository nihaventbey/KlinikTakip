import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, BeforeAfterSlider } from '../../components/UI';
import { useSettings } from '../../contexts/SettingsContext';
import { db } from '../../lib/db';

// --- Testimonials Slider Component ---
const TestimonialsSlider: React.FC = () => {
    const { settings } = useSettings();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const testimonials = settings?.testimonials || [];

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [testimonials]);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const width = scrollRef.current.clientWidth * 0.8;
        scrollRef.current.scrollBy({ left: direction === 'left' ? -width : width, behavior: 'smooth' });
    };

    return (
        <section className="px-6 md:px-12 py-24 bg-slate-50 rounded-[64px] mx-4 md:mx-12 overflow-hidden relative">
            <div className="max-w-7xl mx-auto flex flex-col gap-10 relative">
                <div className="flex flex-col gap-4 text-center">
                    <span className="text-primary font-bold text-xs uppercase tracking-[0.4em] mb-2 block">Hasta Deneyimleri</span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tighter">{settings?.testimonials_title || 'Mutlu Gülüşler'}</h2>
                    <p className="text-slate-500 text-lg font-medium mx-auto max-w-2xl">{settings?.testimonials_subtitle || 'Hastalarımızın deneyimleri bizim en büyük referansımızdır.'}</p>
                </div>

                <div className="relative group">
                    <button onClick={() => scroll('left')} disabled={!canScrollLeft} className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-900 transition-all ${!canScrollLeft ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100 hover:bg-primary hover:text-white'}`}>
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </button>
                    <button onClick={() => scroll('right')} disabled={!canScrollRight} className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-900 transition-all ${!canScrollRight ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100 hover:bg-primary hover:text-white'}`}>
                        <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                    </button>

                    <div ref={scrollRef} onScroll={checkScroll} className="flex gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-8 pt-4 px-2">
                        {testimonials.map((t: any) => (
                            <div key={t.id} className="min-w-[320px] md:min-w-[450px] snap-center bg-white p-10 md:p-12 rounded-[48px] shadow-xl shadow-slate-200/40 border border-slate-100 transition-all hover:shadow-2xl hover:shadow-primary/5 group relative">
                                <span className="material-symbols-outlined text-7xl text-slate-50 absolute top-8 right-8 pointer-events-none">format_quote</span>
                                <div className="flex gap-1 text-amber-500 mb-8">
                                    {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined text-lg">star</span>)}
                                </div>
                                <p className="text-slate-600 italic mb-10 leading-relaxed text-lg font-medium min-h-[100px]">"{t.text}"</p>
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center font-bold text-primary text-xl border border-primary/10">{t.name[0]}</div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-lg">{t.name}</p>
                                        <p className="text-[11px] text-primary font-bold uppercase tracking-widest">{t.treatment}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export const HomePage: React.FC = () => {
  const { settings, loading } = useSettings();
  const [activeSlide, setActiveSlide] = useState(0);
  const gallery = settings?.gallery || [];

  useEffect(() => {
    if (gallery.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % gallery.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [gallery.length]);

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="flex flex-col gap-16 pb-32 animate-fade-in pt-24">
      <section className="relative px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto rounded-[56px] overflow-hidden relative bg-slate-900 h-[600px] md:h-[750px] flex items-center shadow-2xl">
          {gallery.map((item: any, idx: number) => (
            <div key={item.id} className={`absolute inset-0 transition-all duration-[1.5s] ease-in-out ${idx === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
              <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent"></div>
              <div className="absolute bottom-12 right-12 z-20 hidden md:block">
                  <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] border border-white/5">{item.caption}</span>
              </div>
            </div>
          ))}
          
          <div className="relative z-10 px-8 md:px-24 max-w-4xl text-white">
            <span className="inline-block bg-primary/20 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.3em] mb-8">Estetik & Teknoloji</span>
            <p className="text-primary font-bold text-sm md:text-base uppercase tracking-[0.2em] mb-4">{settings?.hero_catchy_text}</p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] mb-8 tracking-tighter">{settings?.hero_title}</h1>
            <p className="text-lg md:text-xl text-slate-200/80 mb-10 leading-relaxed font-medium max-w-xl">{settings?.hero_subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Button className="h-16 px-12 text-lg rounded-2xl shadow-2xl shadow-primary/30 font-bold border-none transition-all hover:scale-105">Ücretsiz Muayene Randevusu</Button>
              <Button variant="secondary" className="h-16 px-10 text-lg rounded-2xl bg-white/5 border-white/10 backdrop-blur-xl text-white hover:bg-white/10 font-semibold" icon="play_arrow">Tedavi Süreçlerimizi İzleyin</Button>
            </div>
          </div>

          {gallery.length > 1 && (
              <div className="absolute bottom-12 left-24 flex gap-3 z-20">
                  {gallery.map((_: any, idx: number) => (
                      <button key={idx} onClick={() => setActiveSlide(idx)} className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeSlide ? 'bg-primary w-12' : 'bg-white/20 w-4'}`} />
                  ))}
              </div>
          )}
        </div>
      </section>

      <section className="px-6 md:px-12 -mt-24 relative z-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {settings?.features?.map((f: any) => (
              <div key={f.id} className="bg-white/95 backdrop-blur-lg p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 hover:-translate-y-3 transition-all duration-500 border border-slate-50 group">
                <div className="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <span className="material-symbols-outlined text-3xl">{f.icon}</span>
                </div>
                <h4 className="text-2xl font-extrabold mb-4 text-slate-900 tracking-tight">{f.title}</h4>
                <p className="text-slate-500 leading-relaxed font-medium text-[16px]">{f.desc}</p>
              </div>
            ))}
        </div>
      </section>

      <TestimonialsSlider />
    </div>
  );
};

export const TeamPage: React.FC = () => {
    const { settings } = useSettings();
    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 flex flex-col gap-24 animate-fade-in pt-32">
            <div className="text-center max-w-3xl mx-auto flex flex-col gap-6">
                <span className="text-primary font-bold text-xs uppercase tracking-[0.5em]">Klinik Kadromuz</span>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-gray-900 leading-tight">{settings?.team_title}</h1>
                <p className="text-slate-500 text-xl font-medium leading-relaxed">{settings?.team_subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {settings?.doctors?.map((doc: any) => (
                    <div key={doc.id} className="group relative">
                        <div className="aspect-[3/4] rounded-[48px] overflow-hidden mb-8 shadow-2xl shadow-slate-200/50">
                            <img src={doc.image} alt={doc.name} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute bottom-10 left-10 right-10 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <Button className="w-full h-14 rounded-2xl font-bold backdrop-blur-xl bg-white/10 border-white/20 text-white">Randevu Talebi</Button>
                            </div>
                        </div>
                        <div className="px-4 text-center">
                            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">{doc.name}</h3>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{doc.specialty}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ServicesPage: React.FC = () => {
    const { settings } = useSettings();
    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 flex flex-col gap-32 animate-fade-in pt-32">
            <div className="text-center max-w-3xl mx-auto flex flex-col gap-6">
                <span className="text-primary font-bold text-xs uppercase tracking-[0.4em]">Uzmanlık Alanlarımız</span>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-gray-900">Estetik Gülüş Tasarımı</h1>
                <p className="text-slate-500 text-xl font-medium leading-relaxed">Sadece dişlerinizi değil, özgüveninizi de yeniliyoruz. Modern teknolojinin sanatsal dokunuşla buluştuğu nokta.</p>
            </div>
            <section>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                   <div className="relative">
                       <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full"></div>
                       <BeforeAfterSlider before={settings?.service_before_img || ""} after={settings?.service_after_img || ""} />
                   </div>
                   <div className="flex flex-col gap-10">
                       <h3 className="text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">{settings?.service_highlight_title}</h3>
                       <p className="text-slate-600 text-xl leading-relaxed font-medium">{settings?.service_highlight_desc}</p>
                       <div className="grid grid-cols-2 gap-6">
                           <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 group hover:bg-primary transition-all duration-500">
                               <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl mb-4 block">event_note</span>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-white/70 mb-1">Tedavi Süresi</p>
                               <p className="text-xl font-bold text-gray-900 group-hover:text-white">{settings?.service_duration}</p>
                           </div>
                           <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 group hover:bg-primary transition-all duration-500">
                               <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl mb-4 block">dentistry</span>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-white/70 mb-1">Kapsam</p>
                               <p className="text-xl font-bold text-gray-900 group-hover:text-white">{settings?.service_teeth_count}</p>
                           </div>
                       </div>
                       <Button className="h-16 text-lg rounded-2xl font-bold shadow-xl shadow-primary/20">Tedavi İçin Teklif Alın</Button>
                   </div>
                </div>
            </section>
        </div>
    );
};

export const ContactPage: React.FC = () => {
    const { settings } = useSettings();
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target as any;
        try {
            await db.leads.add({
                full_name: form[0].value,
                phone: form[1].value,
                interest: form[2].value,
                status: 'new',
                source: 'Website',
                created_at: new Date().toISOString()
            });
            setSent(true);
        } catch (err) {
            alert("Gönderim sırasında hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 animate-fade-in pt-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className="flex flex-col gap-12">
                    <div>
                        <span className="text-primary font-bold text-xs uppercase tracking-[0.5em] mb-4 block">Bize Ulaşın</span>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-gray-900">Randevu Alın</h1>
                        <p className="text-slate-500 text-xl font-medium mt-6 leading-relaxed">Hayalinizdeki gülüşe giden ilk adım bir mesaj kadar uzağınızda.</p>
                    </div>
                    <div className="flex flex-col gap-10">
                        <div className="flex gap-8 items-start">
                            <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center shrink-0 border border-primary/5">
                                <span className="material-symbols-outlined text-3xl">map</span>
                            </div>
                            <div>
                                <p className="font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em] mb-2">Lokasyon</p>
                                <p className="text-xl font-bold text-gray-900 leading-snug">{settings?.address}</p>
                            </div>
                        </div>
                        <div className="flex gap-8 items-start">
                            <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center shrink-0 border border-primary/5">
                                <span className="material-symbols-outlined text-3xl">support_agent</span>
                            </div>
                            <div>
                                <p className="font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em] mb-2">Telefon & Whatsapp</p>
                                <p className="text-xl font-bold text-gray-900">{settings?.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-50 rounded-[56px] p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
                    <h3 className="text-2xl font-extrabold mb-10 tracking-tight text-center">İletişim Formu</h3>
                    {sent ? (
                        <div className="text-center py-20 flex flex-col items-center gap-4">
                            <span className="material-symbols-outlined text-7xl text-emerald-500">check_circle</span>
                            <h4 className="text-2xl font-bold">Mesajınız Alındı!</h4>
                            <p className="text-slate-500">Ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input placeholder="Adınız Soyadınız" required className="p-5 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 font-medium text-slate-600 transition-all" />
                                <input placeholder="Telefon Numaranız" required className="p-5 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 font-medium text-slate-600 transition-all" />
                            </div>
                            <textarea placeholder="Size nasıl yardımcı olabiliriz?" required rows={4} className="p-5 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 font-medium text-slate-600 transition-all resize-none" />
                            <Button disabled={loading} className="h-16 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20">
                                {loading ? 'Gönderiliyor...' : 'Gönder'}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
export const AppointmentPage: React.FC = () => <div className="p-40 text-center font-extrabold text-slate-200 text-2xl uppercase tracking-[0.5em]">Online Takvim Hazırlanıyor...</div>;