import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { patientAPI, scanAPI } from '../services/api';

const PatientsPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [scans, setScans] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, sRes] = await Promise.all([patientAPI.getAll(), scanAPI.getAll()]);
      setPatients(pRes.data);
      setScans(sRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLatestScan = (patientId) => scans.find(s => s.patientId === patientId);

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

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.mobile?.includes(search)
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F5F9FF' }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Patients</h1>
            <p style={styles.subtitle}>{patients.length} patient{patients.length !== 1 ? 's' : ''} found</p>
          </div>
          <button style={styles.newBtn} onClick={() => navigate('/new-scan')}>+ New Scan</button>
        </div>

        <div style={styles.searchBar}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {loading ? (
          <div style={styles.loading}>Loading patients...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>👥</div>
            <h3>No patients found</h3>
            <p style={{ color: '#607D8B', marginTop: 8 }}>Add a new patient scan to get started</p>
            <button style={styles.newBtn} onClick={() => navigate('/new-scan')}>+ New Scan</button>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((patient, i) => {
              const scan = getLatestScan(patient.id);
              const riskColor = getRiskColor(scan?.riskLevel);
              const riskBg = getRiskBg(scan?.riskLevel);
              return (
                <div key={i} style={styles.card} onClick={() => setSelected(selected?.id === patient.id ? null : patient)}>
                  <div style={styles.cardTop}>
                    <div style={{ ...styles.avatar, background: riskBg, color: riskColor }}>
                      {patient.name?.[0]?.toUpperCase()}
                    </div>
                    <div style={styles.info}>
                      <div style={styles.name}>{patient.name}</div>
                      <div style={styles.details}>Age: {patient.age} • {patient.mobile}</div>
                      {scan && (
                        <div style={{ ...styles.riskBadge, background: riskBg, color: riskColor }}>
                          {scan.riskLevel?.toUpperCase()} RISK
                        </div>
                      )}
                    </div>
                    {scan && (
                      <div style={{ ...styles.prob, color: riskColor }}>
                        {Math.round(scan.cancerProbability)}%
                      </div>
                    )}
                  </div>

                  {selected?.id === patient.id && scan && (
                    <div style={styles.detail}>
                      <div style={styles.detailGrid}>
                        <div style={styles.detailItem}>
                          <span style={styles.detailLabel}>Lesion Type</span>
                          <span style={styles.detailValue}>{scan.lesionType}</span>
                        </div>
                        <div style={styles.detailItem}>
                          <span style={styles.detailLabel}>Cancer Probability</span>
                          <span style={{ ...styles.detailValue, color: riskColor }}>{Math.round(scan.cancerProbability)}%</span>
                        </div>
                        {scan.diseaseName && scan.diseaseName !== 'Normal' && (
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Disease</span>
                            <span style={styles.detailValue}>{scan.diseaseName}</span>
                          </div>
                        )}
                        {scan.diseaseMatchProbability && scan.diseaseName !== 'Normal' && (
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Disease Match</span>
                            <span style={styles.detailValue}>{Math.round(scan.diseaseMatchProbability)}%</span>
                          </div>
                        )}
                      </div>
                      <div style={styles.recommendation}>
                        <span style={styles.recIcon}>💊</span>
                        <span>{scan.recommendation}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
  title: { fontSize: 28, fontWeight: 800, color: '#1A237E', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#607D8B' },
  newBtn: { background: '#1565C0', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  searchBar: { background: 'white', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  searchIcon: { fontSize: 18 },
  searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: 15, background: 'transparent' },
  loading: { textAlign: 'center', padding: 60, color: '#607D8B', fontSize: 16 },
  empty: { textAlign: 'center', padding: 60, color: '#1A237E' },
  grid: { display: 'grid', gap: 16 },
  card: { background: 'white', borderRadius: 14, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer' },
  cardTop: { display: 'flex', alignItems: 'center', gap: 14 },
  avatar: { width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, flexShrink: 0 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 700, color: '#1A237E', marginBottom: 2 },
  details: { fontSize: 13, color: '#607D8B', marginBottom: 6 },
  riskBadge: { fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 10, display: 'inline-block' },
  prob: { fontSize: 22, fontWeight: 800 },
  detail: { marginTop: 16, paddingTop: 16, borderTop: '1px solid #F5F5F5' },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 14 },
  detailItem: { display: 'flex', flexDirection: 'column', gap: 4 },
  detailLabel: { fontSize: 11, color: '#607D8B' },
  detailValue: { fontSize: 14, fontWeight: 600, color: '#1A237E' },
  recommendation: { background: '#E3F2FD', borderRadius: 8, padding: 12, display: 'flex', gap: 10, fontSize: 13, color: '#1565C0' },
  recIcon: { flexShrink: 0 },
};

export default PatientsPage;