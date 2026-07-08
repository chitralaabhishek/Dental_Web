import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem('user_name') || 'Doctor';
  const email = localStorage.getItem('user_email') || '';
  const [editName, setEditName] = useState(name);
  const [editMode, setEditMode] = useState(false);
  const [passData, setPassData] = useState({ current: '', newPass: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [msg, setMsg] = useState('');

  const saveProfile = () => {
    localStorage.setItem('user_name', editName);
    setEditMode(false);
    setMsg('Profile updated successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  const changePassword = (e) => {
    e.preventDefault();
    if (passData.newPass !== passData.confirm) {
      setMsg('Passwords do not match!');
      return;
    }
    if (passData.newPass.length < 6) {
      setMsg('Password must be at least 6 characters!');
      return;
    }
    setMsg('Password changed successfully!');
    setPassData({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setMsg(''), 3000);
  };

  const logout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F9FF' }}>
      <Navbar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px' }}>
        {msg && (
          <div style={{ background: msg.includes('!') && !msg.includes('success') ? '#FFEBEE' : '#E8F5E9', color: msg.includes('!') && !msg.includes('success') ? '#C62828' : '#2E7D32', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontWeight: 500 }}>
            {msg}
          </div>
        )}

        {/* Profile header */}
        <div style={styles.profileCard}>
          <div style={styles.avatar}>{name[0]?.toUpperCase()}</div>
          <div style={styles.profileInfo}>
            <div style={styles.profileName}>Dr. {name}</div>
            <div style={styles.profileEmail}>{email}</div>
            <div style={styles.roleBadge}>Dental Surgeon</div>
          </div>
        </div>

        {/* Edit profile */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>✏️ Edit Profile</h3>
            <button style={styles.editBtn} onClick={() => setEditMode(!editMode)}>
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              style={{ ...styles.input, background: editMode ? 'white' : '#F5F5F5' }}
              value={editName}
              onChange={e => setEditName(e.target.value)}
              disabled={!editMode}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input style={{ ...styles.input, background: '#F5F5F5' }} value={email} disabled />
          </div>
          {editMode && (
            <button style={styles.saveBtn} onClick={saveProfile}>Save Changes</button>
          )}
        </div>

        {/* Change password */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🔒 Change Password</h3>
          <form onSubmit={changePassword}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Current Password</label>
              <input style={styles.input} type={showPass ? 'text' : 'password'} value={passData.current} onChange={e => setPassData({...passData, current: e.target.value})} placeholder="Enter current password" />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>New Password</label>
              <input style={styles.input} type={showPass ? 'text' : 'password'} value={passData.newPass} onChange={e => setPassData({...passData, newPass: e.target.value})} placeholder="Minimum 6 characters" />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input style={styles.input} type={showPass ? 'text' : 'password'} value={passData.confirm} onChange={e => setPassData({...passData, confirm: e.target.value})} placeholder="Re-enter new password" />
            </div>
            <div style={styles.showPassRow}>
              <input type="checkbox" id="show" checked={showPass} onChange={() => setShowPass(!showPass)} />
              <label htmlFor="show" style={{ fontSize: 13, color: '#607D8B', cursor: 'pointer' }}>Show passwords</label>
            </div>
            <button type="submit" style={styles.saveBtn}>Change Password</button>
          </form>
        </div>

        {/* App info */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>ℹ️ About App</h3>
          <div style={styles.infoRow}><span style={styles.infoLabel}>App Name</span><span>DentalScan AI</span></div>
          <div style={styles.infoRow}><span style={styles.infoLabel}>Version</span><span>1.0.0</span></div>
          <div style={styles.infoRow}><span style={styles.infoLabel}>Backend</span><span>FastAPI + MongoDB Atlas</span></div>
          <div style={styles.infoRow}><span style={styles.infoLabel}>Hosted on</span><span>Render.com</span></div>
        </div>

        {/* Logout */}
        <button style={styles.logoutBtn} onClick={logout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  profileCard: { background: '#1565C0', borderRadius: 16, padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap' },
  avatar: { width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 800, color: 'white', flexShrink: 0 },
  profileInfo: {},
  profileName: { fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 4 },
  profileEmail: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  roleBadge: { background: 'rgba(255,255,255,0.2)', color: 'white', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-block' },
  card: { background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: '#1A237E' },
  editBtn: { background: '#E3F2FD', color: '#1565C0', border: 'none', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  inputGroup: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, color: '#607D8B', fontWeight: 500, marginBottom: 6 },
  input: { width: '100%', padding: '12px 14px', border: '1.5px solid #E0E0E0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  saveBtn: { width: '100%', background: '#1565C0', color: 'white', border: 'none', padding: 14, borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  showPassRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F5F5F5', fontSize: 14, color: '#1A237E' },
  infoLabel: { color: '#607D8B' },
  logoutBtn: { width: '100%', background: '#FFEBEE', color: '#C62828', border: '1.5px solid #FFCDD2', padding: 14, borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
};

export default ProfilePage;