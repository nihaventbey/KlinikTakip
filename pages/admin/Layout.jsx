import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'; // Sidebar'ın aynı klasörde olduğunu varsayıyoruz

const Layout = ({ user, children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {isMobile && (
        <div style={{ padding: '15px', backgroundColor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>DentCare</span>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>
            {isSidebarOpen ? '✕' : '☰'}
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <Sidebar user={user} isOpen={isSidebarOpen} isMobile={isMobile} onClose={() => setIsSidebarOpen(false)} />
        
        {isMobile && isSidebarOpen && (
          <div onClick={() => setIsSidebarOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 900 }} />
        )}

        <div style={{ flex: 1, marginLeft: isMobile ? 0 : '250px', padding: '20px', backgroundColor: '#f4f6f7', minHeight: '100vh', width: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;