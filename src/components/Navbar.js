import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const userName = localStorage.getItem('user_name') || 'Doctor';

  const logout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'New Scan', path: '/new-scan', icon: '🔍' },
    { label: 'Patients', path: '/patients', icon: '👥' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.navInner}>
        <div style={styles.logo} onClick={() => navigate('/dashboard')}>
          <div style={styles.logoIcon}>+</div>
          <span style={styles.logoText}>DentalScan AI</span>
        </div>

        {/* Desktop menu */}
        <div style={styles.desktopMenu}>
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.navItem,
                ...(location.pathname === item.path ? styles.navItemActive : {})
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
          <div style={styles.userBadge}>
            Dr. {userName.split(' ')[0]}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          style={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMenuOpen(false); }}
              style={styles.mobileMenuItem}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <button onClick={logout} style={styles.mobileLogout}>
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    background: '#1565C0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
  },
  logoIcon: {
    width: 36,
    height: 36,
    background: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1565C0',
    fontWeight: 900,
    fontSize: 22,
  },
  logoText: {
    color: 'white',
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  desktopMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    '@media (max-width: 768px)': { display: 'none' },
  },
  navItem: {
    background: 'transparent',
    color: 'rgba(255,255,255,0.85)',
    padding: '8px 14px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
  },
  navItemActive: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    fontWeight: 700,
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.15)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    border: '1px solid rgba(255,255,255,0.3)',
    cursor: 'pointer',
    marginLeft: 8,
  },
  userBadge: {
    background: 'white',
    color: '#1565C0',
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 700,
    marginLeft: 8,
  },
  hamburger: {
    display: 'none',
    background: 'transparent',
    color: 'white',
    fontSize: 24,
    border: 'none',
    cursor: 'pointer',
    '@media (max-width: 768px)': { display: 'block' },
  },
  mobileMenu: {
    background: '#0D47A1',
    padding: '12px 20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  mobileMenuItem: {
    background: 'transparent',
    color: 'white',
    padding: '12px 16px',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },
  mobileLogout: {
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    padding: '12px 16px',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    marginTop: 8,
  },
};

export default Navbar;