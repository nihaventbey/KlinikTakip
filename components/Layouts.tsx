
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { PUBLIC_NAV, ADMIN_NAV } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

export const Logo: React.FC<{ light?: boolean }> = ({ light }) => {
  const { settings } = useSettings();
  
  return (
    <div className="flex items-center gap-3 select-none">
      {settings?.logo_url ? (
          <img src={settings.logo_url} alt="Logo" className="w-10 h-10 rounded-xl object-contain" />
      ) : (
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${light ? 'bg-white/10 text-white' : 'bg-primary/10 text-primary'}`}>
            <span className="material-symbols-outlined text-2xl">dentistry</span>
          </div>
      )}
      <span className={`text-xl font-extrabold tracking-tight whitespace-nowrap leading-none ${light ? 'text-white' : 'text-gray-900'}`}>
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
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform group"
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-8 h-8" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap px-0 group-hover:px-2">Canlı Destek</span>
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
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <header className={`fixed top-0 z-40 w-full transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-between">
          <Link to="/" className="shrink-0">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <nav className="flex items-center gap-8">
              {PUBLIC_NAV.filter(item => item.path !== '/appointment').map((item) => (
                <Link key={item.path} to={item.path} className={`text-[15px] font-bold transition-colors ${location.pathname === item.path ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-[13px] font-bold text-gray-500 hover:text-primary">
                    <span className="material-symbols-outlined text-lg">language</span> TR
                </button>
                <Link to="/appointment" className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/25 transition-all">
                Randevu Al
                </Link>
            </div>
          </div>

          <button className="md:hidden text-gray-700 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-2xl p-6 flex flex-col gap-5 animate-fade-in">
            {PUBLIC_NAV.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} className={`text-lg font-bold ${location.pathname === item.path ? 'text-primary' : 'text-gray-700'}`}>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <WhatsAppWidget />

      <footer className="bg-surface-dark text-white pt-20 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="flex flex-col gap-6">
              <Logo light />
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">Yeni nesil diş hekimliği anlayışıyla, hayalinizdeki gülüşü en son teknolojiyle gerçeğe dönüştürüyoruz.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6 text-primary-light/80">Tedaviler</h3>
              <ul className="flex flex-col gap-3 text-[15px] text-gray-400">
                <li><Link to="/services" className="hover:text-primary transition-colors">Gülüş Tasarımı</Link></li>
                <li><Link to="/services" className="hover:text-primary transition-colors">İmplant Tedavisi</Link></li>
                <li><Link to="/services" className="hover:text-primary transition-colors">Porselen Lamina</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6 text-primary-light/80">İletişim</h3>
              <ul className="flex flex-col gap-4 text-sm text-gray-400">
                <li className="flex items-start gap-3"><span className="material-symbols-outlined text-primary">location_on</span><span>{settings?.address}</span></li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">call</span><span>{settings?.phone}</span></li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">mail</span><span>{settings?.email}</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6 text-primary-light/80">Klinik</h3>
              <ul className="flex flex-col gap-3 text-sm text-gray-400">
                <li className="flex justify-between border-b border-white/5 pb-2"><span>Hafta İçi:</span> <span>09:00 - 19:00</span></li>
                <li className="flex justify-between border-b border-white/5 pb-2"><span>Cumartesi:</span> <span>09:00 - 14:00</span></li>
                <li className="mt-4">
                    {/* LOGIN LINK PLACED HERE SECURELY */}
                    <Link to="/admin/login" className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg inline-flex">
                        <span className="material-symbols-outlined text-sm">admin_panel_settings</span> Yönetim Paneli
                    </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center text-xs text-gray-500">
            © 2024 {settings?.clinic_name}. Tüm hakları saklıdır.
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

  if (loading) return <div className="h-screen w-full flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!session) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex h-screen bg-surface-dim overflow-hidden font-sans">
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <Logo />
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
          {ADMIN_NAV.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-50'}`}>
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-[14px] font-bold">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
           <div className="flex flex-col min-w-0">
               <span className="text-[13px] font-bold text-gray-900 truncate">{profile?.full_name}</span>
               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Yönetici</span>
           </div>
           <button onClick={() => { signOut(); navigate('/'); }} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors">
             <span className="material-symbols-outlined">logout</span>
           </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b h-16 flex items-center px-4 lg:px-8 shrink-0 justify-between">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden mr-4 text-gray-500"><span className="material-symbols-outlined">menu</span></button>
            <h2 className="font-bold text-gray-900 text-lg">{ADMIN_NAV.find(n => n.path === location.pathname)?.label || 'Yönetim'}</h2>
          </div>
          <Link to="/" className="text-gray-500 hover:text-primary text-sm font-bold flex items-center gap-1 border border-gray-100 px-3 py-1.5 rounded-lg transition-all">
             <span className="material-symbols-outlined text-lg">open_in_new</span> Siteyi Önizle
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#fdfdff]">{children}</main>
      </div>
    </div>
  );
};
