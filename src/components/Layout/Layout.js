import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaSignOutAlt, FaTooth, FaHome, FaUser, FaCog, FaCalendarAlt, FaUsers } from 'react-icons/fa';
// DİKKAT: supabaseClient yolu güncellendi
import { supabase } from '../../supabaseClient';

const Layout = ({ user, children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        let role = user.role;
        if (!role || role === 'authenticated') {
            // .maybeSingle() kullanarak 406 hatasını önlüyoruz
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle();
            role = profile?.role;
        }
        setUserRole(role);

        const { data: items, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;

        if (items && role) {
            const filtered = items.filter(item => {
                if (!item.allowed_roles || item.allowed_roles.length === 0) return true;
                const normalizedUserRole = role.toUpperCase();
                const normalizedAllowedRoles = item.allowed_roles.map(r => r.toUpperCase());
                return normalizedAllowedRoles.includes(normalizedUserRole);
            });
            setMenuItems(filtered);
        } else {
            setMenuItems([]);
        }

      } catch (error) {
        console.error('Layout veri hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const getIcon = (label) => {
      const l = label.toLowerCase();
      if (l.includes('dashboard') || l.includes('panel')) return <FaHome />;
      if (l.includes('hasta')) return <FaUser />;
      if (l.includes('randevu') || l.includes('takvim')) return <FaCalendarAlt />;
      if (l.includes('personel') || l.includes('doktor')) return <FaUsers />;
      if (l.includes('ayar')) return <FaCog />;
      return <FaTooth />;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      <div style={{
        width: isSidebarOpen ? '260px' : '70px',
        backgroundColor: '#2c3e50',
        color: '#ecf0f1',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 1000
      }}>
        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', borderBottom: '1px solid #34495e', height: '70px' }}>
            <FaTooth style={{ fontSize: '1.5rem', color: '#3498db' }} />
            {isSidebarOpen && <span style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: '1.2rem' }}>DentCare</span>}
        </div>

        <nav style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
          {loading ? (
             <div style={{ padding: '20px', textAlign: 'center', color: '#bdc3c7' }}>...</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {menuItems.map((item) => (
                    <li key={item.id}>
                        <Link to={item.path} style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', color: location.pathname === item.path ? '#fff' : '#bdc3c7', backgroundColor: location.pathname === item.path ? '#3498db' : 'transparent', textDecoration: 'none', justifyContent: isSidebarOpen ? 'flex-start' : 'center' }} title={!isSidebarOpen ? item.label : ''}>
                            <span style={{ fontSize: '1.1rem' }}>{getIcon(item.label)}</span>
                            {isSidebarOpen && <span style={{ marginLeft: '15px' }}>{item.label}</span>}
                        </Link>
                    </li>
                ))}
            </ul>
          )}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #34495e', backgroundColor: '#233342' }}>
            {isSidebarOpen && (
                <button onClick={handleLogout} style={{ width: '100%', padding: '10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaSignOutAlt style={{ marginRight: '8px' }} /> Çıkış
                </button>
            )}
             {!isSidebarOpen && <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#e74c3c', width: '100%', cursor: 'pointer' }}><FaSignOutAlt /></button>}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '70px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between' }}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: '#2c3e50', cursor: 'pointer' }}><FaBars /></button>
            <div style={{ fontWeight: '500' }}>{userRole} | {user?.email}</div>
        </header>
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
