
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { PUBLIC_NAV, ADMIN_NAV } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';

export const Logo: React.FC<{ light?: boolean }> = ({ light }) => {
  const { settings } = useSettings();
  
  return (
    <div className="flex items-center gap-3 select-none group cursor-pointer">
      {settings?.logo_url ? (
          <img src={settings.logo_url} alt="Logo" className="w-9 h-9 rounded-xl object-contain transition-transform group-hover:scale-110" />
      ) : (
          <div className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-all ${light ? 'bg-white/10 text-white' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
            <span className="material-symbols-outlined text-[20px] font-bold">dentistry</span>
          </div>
      )}
      <span className={`text-xl font-extrabold tracking-tighter whitespace-nowrap leading-none transition-colors ${light ? 'text-white' : 'text-slate-900 group-hover:text-primary'}`}>
        {settings?.clinic_name || 'DentCare'}
      </span>
    </div>
  );
};

const WhatsAppWidget: React.FC = () => {
    const { settings } = useSettings();
    const cleanPhone = settings?.phone?.replace(/[^0-9]/g, '') || '902125550000';
    
    return (
      <a 
        href={`https://wa.me/${cleanPhone}`}
        target="_blank" rel="noreferrer"
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-[#25D366] text-white p-3.5 rounded-2xl shadow-[0_20px_40px_-10px_rgba(37,211,102,0.4)] hover:scale-110 transition-all duration-300 group"
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-7 h-7" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap px-0 group-hover:px-3 text-sm">Bize Yazın</span>
      </a>
    );
};

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-primary/10 selection:text-primary">
      {/* Header visibility improved with bg-white/90 even when not scrolled */}
      <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg py-3' : 'bg-white/80 backdrop-blur-md py-5 border-b border-slate-100/50'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link to="/" className="shrink-0">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-12">
            <nav className="flex items-center gap-10">
              {PUBLIC_NAV.filter(item => item.path !== '/appointment').map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`text-[13px] font-bold uppercase tracking-[0.15em] transition-all hover:text-primary ${location.pathname === item.path ? 'text-primary' : 'text-slate-600'}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest transition-colors hover:text-primary text-slate-500">
                    <span className="material-symbols-outlined text-[18px]">language</span> TR
                </button>
                <Link to="/appointment" className="bg-primary hover:bg-primary-hover text-white px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
                Online Randevu
                </Link>
            </div>
          </div>

          <button className="md:hidden text-slate-900 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className="material-symbols-outlined text-3xl font-light">menu</span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-white z-[60] flex flex-col p-10 animate-fade-in">
            <div className="flex justify-between items-center mb-16">
                 <Logo />
                 <button onClick={() => setMobileMenuOpen(false)} className="text-slate-900 p-2">
                    <span className="material-symbols-outlined text-4xl font-light">close</span>
                 </button>
            </div>
            <div className="flex flex-col gap-8">
                {PUBLIC_NAV.map((item) => (
                  <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} className={`text-4xl font-extrabold tracking-tighter ${location.pathname === item.path ? 'text-primary' : 'text-slate-900'}`}>
                    {item.label}
                  </Link>
                ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow pt-0">
        {children}
      </main>

      <WhatsAppWidget />

      <footer className="bg-slate-950 text-white pt-32 pb-12 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
            <div className="flex flex-col gap-8">
              <Logo light />
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">Yeni nesil diş hekimliği anlayışıyla, hayalinizdeki gülüşü sanatsal bir bakış açısıyla tasarlıyoruz.</p>
              <div className="flex gap-4">
                  {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"><span className="material-symbols-outlined text-lg">public</span></div>)}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-[0.4em] mb-10 text-primary">Uzmanlıklar</h3>
              <ul className="flex flex-col gap-5 text-sm text-slate-400 font-medium">
                <li><Link to="/services" className="hover:text-primary transition-colors">Hollywood Smile</Link></li>
                <li><Link to="/services" className="hover:text-primary transition-colors">Digital Smile Design</Link></li>
                <li><Link to="/services" className="hover:text-primary transition-colors">İmplantoloji</Link></li>
                <li><Link to="/services" className="hover:text-primary transition-colors">Porselen Lamina</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-[0.4em] mb-10 text-primary">İletişim</h3>
              <ul className="flex flex-col gap-8 text-sm text-slate-400 font-medium">
                <li className="flex items-start gap-5"><span className="material-symbols-outlined text-primary text-xl">map</span><span className="leading-relaxed">{settings?.address}</span></li>
                <li className="flex items-center gap-5"><span className="material-symbols-outlined text-primary text-xl">local_phone</span><span>{settings?.phone}</span></li>
                <li className="flex items-center gap-5"><span className="material-symbols-outlined text-primary text-xl">alternate_email</span><span>{settings?.email}</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-[0.4em] mb-10 text-primary">Klinik</h3>
              <ul className="flex flex-col gap-5 text-sm text-slate-400 font-medium">
                <li className="flex justify-between border-b border-white/5 pb-3"><span>Pazartesi - Cuma</span> <span>{settings?.working_hours_weekdays}</span></li>
                <li className="flex justify-between border-b border-white/5 pb-3"><span>Cumartesi</span> <span>{settings?.working_hours_saturday}</span></li>
                <li className="mt-6">
                    <Link to="/admin/login" className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-all bg-white/5 px-6 py-3 rounded-xl border border-white/5">
                        <span className="material-symbols-outlined text-sm">lock</span> Personel Girişi
                    </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">
            <span>© 2024 {settings?.clinic_name} • Tüm Hakları Saklıdır.</span>
            <div className="flex gap-8">
                <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
                <a href="#" className="hover:text-white transition-colors">Aydınlatma Metni</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, profile, loading, signOut } = useAuth();

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-slate-50"><div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!session) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <aside className={`fixed lg:static inset-y-0 left-0 z-[60] w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <Logo />
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400">
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-6 flex flex-col gap-1.5">
          {ADMIN_NAV.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${location.pathname === item.path ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900 font-semibold'}`}>
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-[14px] tracking-tight">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
           <div className="flex flex-col min-w-0">
               <span className="text-[14px] font-bold text-slate-900 truncate">{profile?.full_name}</span>
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Klinik Yönetici</span>
           </div>
           <button onClick={() => { signOut(); navigate('/'); }} className="text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-colors">
             <span className="material-symbols-outlined text-[20px]">logout</span>
           </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-100 h-20 flex items-center px-6 lg:px-10 shrink-0 justify-between">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden mr-6 text-slate-500"><span className="material-symbols-outlined text-3xl font-light">menu</span></button>
            <h2 className="font-extrabold text-slate-900 text-xl tracking-tight">{ADMIN_NAV.find(n => n.path === location.pathname)?.label || 'Yönetim'}</h2>
          </div>
          <Link to="/" className="text-slate-400 hover:text-primary text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 border-2 border-slate-50 px-6 py-3 rounded-2xl transition-all bg-white hover:border-primary/20">
             <span className="material-symbols-outlined text-[18px]">visibility</span> Web Sitesini Gör
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-12 bg-slate-50/50">{children}</main>
      </div>
    </div>
  );
};
