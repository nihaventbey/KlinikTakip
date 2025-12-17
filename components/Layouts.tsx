import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PUBLIC_NAV, ADMIN_NAV, APP_NAME } from '../constants';

// --- Shared Components ---

export const Logo: React.FC<{ light?: boolean }> = ({ light }) => (
  <div className="flex items-center gap-3 select-none">
    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${light ? 'bg-white/10 text-white' : 'bg-primary/10 text-primary'}`}>
      <span className="material-symbols-outlined text-3xl">dentistry</span>
    </div>
    <span className={`text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-gray-900'}`}>
      {APP_NAME}
    </span>
  </div>
);

// --- WhatsApp Widget ---
const WhatsAppWidget: React.FC = () => (
  <a 
    href="https://wa.me/" 
    target="_blank" 
    rel="noreferrer"
    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform group"
  >
    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-8 h-8" />
    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap px-0 group-hover:px-2">Canlı Destek</span>
  </a>
);

// --- Public Layout ---

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <header className={`fixed top-0 z-40 w-full transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-between">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              {PUBLIC_NAV.filter(item => item.path !== '/appointment').map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-semibold transition-colors ${location.pathname === item.path ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* Language & Actions */}
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-gray-900">
                    <span className="material-symbols-outlined text-lg">language</span> TR
                </button>
                <div className="w-px h-4 bg-gray-300"></div>
                <Link to="/appointment" className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-0.5">
                Randevu Al
                </Link>
            </div>
            
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl p-4 flex flex-col gap-4">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-gray-700 hover:text-primary py-2 px-2 rounded-md hover:bg-gray-50"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/appointment" onClick={() => setMobileMenuOpen(false)} className="bg-primary text-white text-center py-3 rounded-lg font-bold">
              Randevu Al
            </Link>
             <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} className="text-center text-gray-500 py-2">
              Personel Girişi
            </Link>
          </div>
        )}
      </header>

      <main className="flex-grow pt-20">
        {children}
      </main>

      <WhatsAppWidget />

      <footer className="bg-surface-dark text-white pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="flex flex-col gap-4">
              <Logo light />
              <p className="text-gray-400 text-sm leading-relaxed">
                Modern teknoloji ve uzman kadromuzla ağız ve diş sağlığınız için en iyi hizmeti sunuyoruz. Gülüşünüz bizim için önemli.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Hızlı Bağlantılar</h3>
              <ul className="flex flex-col gap-2 text-sm text-gray-400">
                {PUBLIC_NAV.filter(item => item.path !== '/appointment').map((link) => (
                  <li key={link.path}><Link to={link.path} className="hover:text-primary transition-colors">{link.label}</Link></li>
                ))}
                 <li><Link to="/admin/login" className="hover:text-primary transition-colors flex items-center gap-1 text-gray-500 hover:text-gray-400 mt-2"><span className="material-symbols-outlined text-xs">lock</span> Personel Girişi</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">İletişim</h3>
              <ul className="flex flex-col gap-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                  <span>Bağdat Caddesi No: 123, Kadıköy, İstanbul</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">call</span>
                  <span>+90 (212) 555 00 00</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">mail</span>
                  <span>info@dentcare.com</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Çalışma Saatleri</h3>
              <ul className="flex flex-col gap-2 text-sm text-gray-400">
                <li className="flex justify-between"><span>Pazartesi - Cuma:</span> <span className="text-white">09:00 - 19:00</span></li>
                <li className="flex justify-between"><span>Cumartesi:</span> <span className="text-white">09:00 - 14:00</span></li>
                <li className="flex justify-between"><span>Pazar:</span> <span className="text-primary font-bold">Kapalı</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} {APP_NAME}. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Admin Layout ---

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-surface-dim overflow-hidden">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
           <div className="bg-primary/10 p-2 rounded-xl text-primary">
             <span className="material-symbols-outlined text-2xl">dentistry</span>
           </div>
           <div>
             <h1 className="font-bold text-lg text-gray-900">{APP_NAME}</h1>
             <p className="text-xs text-secondary font-medium">Yönetim Paneli</p>
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group ${
                location.pathname === item.path 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className={`material-symbols-outlined ${location.pathname === item.path ? 'material-symbols-filled' : ''}`}>
                {item.icon}
              </span>
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuATgFcULf-qOjMqE5zVR3z5LdIdwfBU95INNJVaBXCXIK1Wu412AnsJ8lYcb92K2E_6Y_ts4g2ADLGH4zeiML_J3UL3xN7_uRyW2QDQjZsu-s7ILuWyWGgcWeEaTi9PcFcu9nmS-q0gtiicYBugQzKV-MLMtHzQDI1Z1jKh4L-G5hX-ZJ4S9AECIuEch6FGMMN22GmEsc21gQWH2x5urD6cRYlyWgmM3bhebV0lA__SlZ41GKb4CkMj6yIMjt7r6QsqCJmvzwa7kdL5')" }}></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">Dr. Mehmet Y.</p>
              <p className="text-xs text-gray-500 truncate">Baş Hekim</p>
            </div>
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-red-500" title="Çıkış Yap">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="lg:hidden text-gray-500 hover:text-primary">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-lg font-bold text-gray-800 hidden sm:block">
              {ADMIN_NAV.find(n => n.path === location.pathname)?.label || 'Yönetim'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">search</span>
              <input 
                type="text" 
                placeholder="Ara..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 w-64 placeholder-gray-400"
              />
            </div>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};