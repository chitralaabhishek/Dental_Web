import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NewScanPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [patient, setPatient] = useState({ name: '', age: '', mobile: '', date: '' });
  const [images, setImages] = useState([null, null, null, null]);
  const [previews, setPreviews] = useState([null, null, null, null]);
  const [error, setError] = useState('');

  const imageTypes = [
    { title: 'Tongue', subtitle: 'Top surface of tongue', icon: '👅', instruction: 'Capture the top surface of the tongue clearly' },
    { title: 'Gums', subtitle: 'Upper & lower gums', icon: '🦷', instruction: 'Pull lips back to expose gums completely' },
    { title: 'Floor of Mouth', subtitle: 'Under the tongue', icon: '👄', instruction: 'Lift tongue to expose the floor of mouth' },
    { title: 'Buccal Mucosa', subtitle: 'Inner cheek lining', icon: '😮', instruction: 'Pull cheek to expose inner lining' },
  ];

  const handlePatientSubmit = (e) => {
    e.preventDefault();
    if (!patient.name || !patient.age || !patient.mobile || !patient.date) {
      setError('Please fill all fields');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleImageUpload = (index, file) => {
    if (!file) return;
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages[index] = file;
    newPreviews[index] = URL.createObjectURL(file);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const allCaptured = images.every(img => img !== null);
  const capturedCount = images.filter(Boolean).length;

  const handleAnalyze = () => {
    const patientData = {
      id: Date.now().toString(),
      name: patient.name,
      age: parseInt(patient.age),
      mobile: patient.mobile,
      date: patient.date,
      createdAt: new Date().toISOString(),
    };
    navigate('/results', { state: { patient: patientData, images: previews, imageFiles: images } });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F9FF' }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        {/* Progress steps */}
        <div style={styles.progressBar}>
          {['Patient Details', 'Capture Images', 'AI Analysis'].map((label, i) => (
            <div key={i} style={styles.progressStep}>
              <div style={{ ...styles.stepCircle, background: step > i ? '#1565C0' : step === i + 1 ? '#1565C0' : '#E0E0E0', color: step >= i + 1 ? 'white' : '#9E9E9E' }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <div style={{ ...styles.stepLabel, color: step >= i + 1 ? '#1565C0' : '#9E9E9E' }}>{label}</div>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Patient Registration</h2>
            <p style={styles.cardDesc}>Enter patient details to begin</p>
            {error && <div style={styles.error}>⚠️ {error}</div>}
            <form onSubmit={handlePatientSubmit}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name *</label>
                <input style={styles.input} type="text" placeholder="Patient's full name" value={patient.name} onChange={e => setPatient({...patient, name: e.target.value})} />
              </div>
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Age *</label>
                  <input style={styles.input} type="number" placeholder="Age" value={patient.age} onChange={e => setPatient({...patient, age: e.target.value})} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Mobile Number *</label>
                  <input style={styles.input} type="tel" placeholder="10-digit number" maxLength={10} value={patient.mobile} onChange={e => setPatient({...patient, mobile: e.target.value})} />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Appointment Date *</label>
                <input style={styles.input} type="date" value={patient.date} onChange={e => setPatient({...patient, date: e.target.value})} />
              </div>
              <button type="submit" style={styles.submitBtn}>Save & Continue →</button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div style={styles.card}>
            <div style={styles.patientBadge}>
              👤 {patient.name} • Age: {patient.age} • {patient.mobile}
            </div>
            <h2 style={styles.cardTitle}>Capture Oral Images</h2>
            <div style={styles.progressCount}>
              <div style={styles.progressFill}>
                <div style={{ ...styles.progressBar2, width: `${capturedCount / 4 * 100}%` }} />
              </div>
              <span style={styles.progressText}>{capturedCount}/4 Complete</span>
            </div>

            <div style={styles.imageGrid}>
              {imageTypes.map((type, i) => (
                <div key={i} style={{ ...styles.imageCard, borderColor: images[i] ? '#2E7D32' : '#E0E0E0' }}>
                  <div style={styles.imageHeader}>
                    <span style={styles.imageTypeIcon}>{type.icon}</span>
                    <div>
                      <div style={styles.imageTitle}>{type.title}</div>
                      <div style={styles.imageSub}>{type.subtitle}</div>
                    </div>
                    {images[i] && <span style={styles.checkMark}>✓</span>}
                  </div>

                  {previews[i] ? (
                    <div style={styles.previewWrap}>
                      <img src={previews[i]} alt={type.title} style={styles.preview} />
                      <button style={styles.changeBtn} onClick={() => document.getElementById(`img-${i}`).click()}>
                        Change
                      </button>
                    </div>
                  ) : (
                    <div style={styles.uploadArea} onClick={() => document.getElementById(`img-${i}`).click()}>
                      <div style={styles.uploadIcon}>📷</div>
                      <div style={styles.uploadText}>Click to upload</div>
                      <div style={styles.uploadHint}>{type.instruction}</div>
                    </div>
                  )}
                  <input
                    id={`img-${i}`}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => handleImageUpload(i, e.target.files[0])}
                  />
                </div>
              ))}
            </div>

            <button
              style={{ ...styles.submitBtn, background: allCaptured ? '#1565C0' : '#BDBDBD', cursor: allCaptured ? 'pointer' : 'not-allowed' }}
              onClick={allCaptured ? handleAnalyze : undefined}
              disabled={!allCaptured}
            >
              {allCaptured ? '🤖 Analyze with AI →' : `Capture ${4 - capturedCount} more image${4 - capturedCount !== 1 ? 's' : ''}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  progressBar: { display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 32, flexWrap: 'wrap' },
  progressStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  stepCircle: { width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 },
  stepLabel: { fontSize: 13, fontWeight: 500 },
  card: { background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  cardTitle: { fontSize: 22, fontWeight: 700, color: '#1A237E', marginBottom: 6 },
  cardDesc: { fontSize: 14, color: '#607D8B', marginBottom: 24 },
  error: { background: '#FFEBEE', color: '#C62828', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
  inputGroup: { marginBottom: 18, flex: 1 },
  label: { display: 'block', fontSize: 13, color: '#607D8B', fontWeight: 500, marginBottom: 6 },
  input: { width: '100%', padding: '12px 14px', border: '1.5px solid #E0E0E0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  row: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  submitBtn: { width: '100%', background: '#1565C0', color: 'white', border: 'none', padding: '14px', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  patientBadge: { background: '#E3F2FD', color: '#1565C0', padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16 },
  progressCount: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 },
  progressFill: { flex: 1, height: 8, background: '#E0E0E0', borderRadius: 4, overflow: 'hidden' },
  progressBar2: { height: '100%', background: '#1565C0', borderRadius: 4, transition: 'width 0.3s' },
  progressText: { fontSize: 13, fontWeight: 600, color: '#1565C0', whiteSpace: 'nowrap' },
  imageGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 24 },
  imageCard: { border: '2px solid', borderRadius: 12, padding: 16, transition: 'border-color 0.2s' },
  imageHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  imageTypeIcon: { fontSize: 24 },
  imageTitle: { fontWeight: 700, fontSize: 14, color: '#1A237E' },
  imageSub: { fontSize: 12, color: '#607D8B' },
  checkMark: { marginLeft: 'auto', color: '#2E7D32', fontSize: 20, fontWeight: 700 },
  uploadArea: { border: '2px dashed #E0E0E0', borderRadius: 10, padding: '24px 16px', textAlign: 'center', cursor: 'pointer' },
  uploadIcon: { fontSize: 32, marginBottom: 8 },
  uploadText: { fontSize: 14, fontWeight: 600, color: '#1565C0', marginBottom: 4 },
  uploadHint: { fontSize: 11, color: '#9E9E9E' },
  previewWrap: { position: 'relative' },
  preview: { width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 },
  changeBtn: { position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer' },
};

export default NewScanPage;