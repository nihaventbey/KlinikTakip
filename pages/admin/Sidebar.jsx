import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { FaChartPie, FaCalendarAlt, FaUserInjured, FaFileInvoiceDollar, FaUserMd, FaUserPlus, FaList, FaCog } from 'react-icons/fa';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Sidebar = ({ user, isOpen = true, isMobile = false, onClose }) => {
  const location = useLocation();
  // Başlangıç değerini localStorage'dan okuyoruz (Varsa anında gösterir)
  const [menuItems, setMenuItems] = useState(() => {
    // Benzersiz bir cache key kullanarak diğer projelerle çakışmayı önlüyoruz
    const cached = localStorage.getItem('dentcare_menu_items_v1');
    return cached ? JSON.parse(cached) : [];
  });

  useEffect(() => {
    const fetchMenuItems = async () => {
      // Veritabanından menü öğelerini çek (Tablo adı: menu_items varsayılıyor)
      // Tablo yapısı: id, label, path, allowed_roles (array)
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('id'); // Sıralama için bir sütun kullanılabilir

      if (data && !error) {
        setMenuItems(data);
        // Veriyi localStorage'a kaydet
        localStorage.setItem('dentcare_menu_items_v1', JSON.stringify(data));
      }
    };
    fetchMenuItems();
  }, []);

  // Kullanıcının rolüne uygun menüleri filtrele
  const authorizedItems = menuItems.filter(item => {
    // Veritabanından gelen 'allowed_roles' (snake_case) veya cache'den gelen 'allowedRoles'
    const roles = item.allowed_roles || item.allowedRoles || [];
    return roles.includes(user.role);
  });

  // İkon belirleme fonksiyonu (Basitlik için emoji kullanıldı, SVG veya FontAwesome da olabilir)
  const getIcon = (path) => {
    switch (path) {
      case '/': return <FaChartPie />;
      case '/calendar': return <FaCalendarAlt />;
      case '/patients': return <FaUserInjured />;
      case '/financials': return <FaFileInvoiceDollar />;
      case '/admin/staff': return <FaList />;
      case '/admin/add-user': return <FaUserPlus />;
      case '/settings': return <FaCog />;
      case '/admin/settings': return <FaCog />;
      default: return <FaChartPie />;
    }
  };

  const sidebarStyle = {
    width: '250px',
    backgroundColor: '#2c3e50',
    color: 'white',
    height: '100vh',
    padding: '20px',
    position: 'fixed',
    top: 0,
    left: isMobile ? (isOpen ? 0 : '-250px') : 0,
    transition: 'left 0.3s ease-in-out',
    zIndex: 1000,
    boxShadow: isMobile && isOpen ? '4px 0 15px rgba(0,0,0,0.3)' : 'none'
  };

  return (
    <div style={sidebarStyle}>
      <h2 style={{ marginBottom: '30px', borderBottom: '1px solid #34495e', paddingBottom: '10px' }}>DentCare</h2>
      
      <div style={{ marginBottom: '20px', fontSize: '0.9em', color: '#bdc3c7' }}>
        Giriş: {user.name} <br/>
        <span style={{ fontSize: '0.8em', textTransform: 'uppercase', color: '#f1c40f' }}>{user.role}</span>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {authorizedItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={index} style={{ marginBottom: '10px' }}>
            <Link 
              to={item.path} 
              onClick={() => isMobile && onClose && onClose()}
              style={{ 
                color: isActive ? 'white' : '#ecf0f1', 
                textDecoration: 'none', 
                display: 'flex', 
                alignItems: 'center',
                padding: '10px',
                backgroundColor: isActive ? '#3498db' : 'transparent',
                borderRadius: '6px',
                transition: 'background-color 0.2s',
                fontWeight: isActive ? 'bold' : 'normal'
              }}
            >
              <span style={{ marginRight: '10px', fontSize: '1.2em' }}>{getIcon(item.path)}</span>
              {item.label}
            </Link>
          </li>
          );
        })}
      </ul>
      
      <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #34495e' }}>
        <button onClick={() => window.location.href = '/login'} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default Sidebar;