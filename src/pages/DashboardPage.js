import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Navbar from '../components/Navbar';
import { dashboardAPI, scanAPI, patientAPI } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalPatients: 0, totalScans: 0, highRisk: 0, moderateRisk: 0, lowRisk: 0 });
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem('user_name') || 'Doctor';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, scansRes, patientsRes] = await Promise.all([
        dashboardAPI.stats(),
        scanAPI.getAll(),
        patientAPI.getAll(),
      ]);
      setStats(statsRes.data);
      const scans = scansRes.data.slice(0, 5);
      const patients = patientsRes.data;
      const enriched = scans.map(scan => {
        const patient = patients.find(p => p.id === scan.patientId);
        return { ...scan, patientName: patient?.name || 'Unknown' };
      });
      setRecentScans(enriched);
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ['High Risk', 'Moderate', 'Low Risk'],
    datasets: [{
      data: [stats.highRisk, stats.moderateRisk, stats.lowRisk],
      backgroundColor: ['#C62828', '#F57C00', '#2E7D32'],
      borderWidth: 0,
    }],
  };

  const getRiskColor = (risk) => {
    if (risk === 'high') return '#C62828';
    if (risk === 'moderate') return '#F57C00';
    return '#2E7D32';
  };

  const getRiskBg = (risk) => {
    if (risk === 'high') return '#FFEBEE';
    if (risk === 'moderate') return '#FFF3E0';
    return '#E8F5E9';
  };

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: '#F5F9FF' }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {/* Welcome card */}
        <div style={styles.welcomeCard}>
          <div>
            <div style={styles.welcomeSub}>Welcome back,</div>
            <div style={styles.welcomeName}>Dr. {userName}</div>
            <div style={styles.welcomeDate}>{today}</div>
            <div style={styles.welcomeStats}>
              {stats.totalPatients} patient{stats.totalPatients !== 1 ? 's' : ''} • {stats.totalScans} scan{stats.totalScans !== 1 ? 's' : ''} recorded
            </div>
          </div>
          <button style={styles.newScanBtn} onClick={() => navigate('/new-scan')}>
            + New Scan
          </button>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow}>
          {[
            { label: 'Total Patients', value: stats.totalPatients, icon: '👥', color: '#1565C0', bg: '#E3F2FD' },
            { label: 'Total Scans', value: stats.totalScans, icon: '🔬', color: '#6A1B9A', bg: '#F3E5F5' },
            { label: 'High Risk', value: stats.highRisk, icon: '⚠️', color: '#C62828', bg: '#FFEBEE' },
            { label: 'Moderate', value: stats.moderateRisk, icon: 'ℹ️', color: '#F57C00', bg: '#FFF3E0' },
            { label: 'Low Risk', value: stats.lowRisk, icon: '✅', color: '#2E7D32', bg: '#E8F5E9' },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: s.bg }}>{s.icon}</div>
              <div style={{ ...styles.statNum, color: s.color }}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={styles.mainGrid}>
          {/* Recent scans */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Recent Scans</h3>
              <button style={styles.viewAllBtn} onClick={() => navigate('/patients')}>View All</button>
            </div>
            {loading ? (
              <div style={styles.loading}>Loading...</div>
            ) : recentScans.length === 0 ? (
              <div style={styles.empty}>
                <div style={styles.emptyIcon}>🔬</div>
                <div>No scans yet</div>
                <button style={styles.startBtn} onClick={() => navigate('/new-scan')}>Start First Scan</button>
              </div>
            ) : (
              recentScans.map((scan, i) => (
                <div key={i} style={styles.scanRow}>
                  <div style={{ ...styles.scanAvatar, background: getRiskBg(scan.riskLevel) }}>
                    {scan.patientName[0]?.toUpperCase()}
                  </div>
                  <div style={styles.scanInfo}>
                    <div style={styles.scanName}>{scan.patientName}</div>
                    <div style={styles.scanType}>{scan.lesionType}</div>
                  </div>
                  <div style={styles.scanRight}>
                    <div style={{ ...styles.scanProb, color: getRiskColor(scan.riskLevel) }}>
                      {Math.round(scan.cancerProbability)}%
                    </div>
                    <div style={{ ...styles.riskBadge, background: getRiskBg(scan.riskLevel), color: getRiskColor(scan.riskLevel) }}>
                      {scan.riskLevel?.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chart */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Risk Distribution</h3>
            {stats.totalScans > 0 ? (
              <div style={{ maxWidth: 280, margin: '20px auto' }}>
                <Doughnut data={chartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
              </div>
            ) : (
              <div style={styles.empty}>
                <div style={styles.emptyIcon}>📊</div>
                <div>No data yet</div>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div style={styles.actionsGrid}>
          {[
            { icon: '🔍', label: 'New Scan', desc: 'Start AI analysis', path: '/new-scan', color: '#1565C0' },
            { icon: '👥', label: 'Patients', desc: 'View all patients', path: '/patients', color: '#6A1B9A' },
            { icon: '👤', label: 'Profile', desc: 'Manage account', path: '/profile', color: '#00838F' },
          ].map((a, i) => (
            <div key={i} style={styles.actionCard} onClick={() => navigate(a.path)}>
              <div style={{ ...styles.actionIcon, background: a.color }}>{a.icon}</div>
              <div style={styles.actionLabel}>{a.label}</div>
              <div style={styles.actionDesc}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  welcomeCard: { background: '#1565C0', borderRadius: 16, padding: '28px 32px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 },
  welcomeSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 },
  welcomeName: { color: 'white', fontSize: 26, fontWeight: 800, marginBottom: 6 },
  welcomeDate: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 8 },
  welcomeStats: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 500 },
  newScanBtn: { background: 'white', color: '#1565C0', border: 'none', padding: '12px 24px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 },
  statCard: { background: 'white', borderRadius: 14, padding: '20px 16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statIcon: { width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: 20 },
  statNum: { fontSize: 28, fontWeight: 800, marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#607D8B', fontWeight: 500 },
  mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 },
  card: { background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: '#1A237E' },
  viewAllBtn: { background: '#E3F2FD', color: '#1565C0', border: 'none', padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  loading: { textAlign: 'center', color: '#607D8B', padding: 20 },
  empty: { textAlign: 'center', padding: 40, color: '#607D8B' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  startBtn: { background: '#1565C0', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 12 },
  scanRow: { display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid #F5F5F5' },
  scanAvatar: { width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#1A237E', flexShrink: 0 },
  scanInfo: { flex: 1 },
  scanName: { fontSize: 14, fontWeight: 600, color: '#1A237E', marginBottom: 2 },
  scanType: { fontSize: 12, color: '#607D8B' },
  scanRight: { textAlign: 'right' },
  scanProb: { fontSize: 18, fontWeight: 800, marginBottom: 4 },
  riskBadge: { fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, display: 'inline-block' },
  actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  actionCard: { background: 'white', borderRadius: 14, padding: 24, textAlign: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'transform 0.2s' },
  actionIcon: { width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 24 },
  actionLabel: { fontSize: 16, fontWeight: 700, color: '#1A237E', marginBottom: 6 },
  actionDesc: { fontSize: 13, color: '#607D8B' },
};

export default DashboardPage;