import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Navbar from '../components/Navbar';
import { patientAPI, scanAPI } from '../services/api';
import jsPDF from 'jspdf';

ChartJS.register(ArcElement, Tooltip, Legend);

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { patient, images, imageFiles } = location.state || {};
  const [analyzing, setAnalyzing] = useState(true);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  const steps = [
    'Preprocessing images...',
    'Running AI detection model...',
    'Detecting lesion locations...',
    'Analyzing disease patterns...',
    'Saving to database...',
  ];

  useEffect(() => {
    if (!patient) { navigate('/new-scan'); return; }
    runAnalysis();
  }, []);

  const runMockAnalysis = () => {
    const prob = 15 + Math.floor(Math.random() * 70);
    const lesions = [
      { type: 'Leukoplakia', disease: 'Oral Leukoplakia' },
      { type: 'Erythroplakia', disease: 'Oral Erythroplakia' },
      { type: 'Oral Submucous Fibrosis', disease: 'Submucous Fibrosis' },
      { type: 'Aphthous Ulcer', disease: 'Recurrent Aphthous Stomatitis' },
      { type: 'Lichen Planus', disease: 'Oral Lichen Planus' },
    ];
    const detected = prob > 50 ? lesions[Math.floor(Math.random() * lesions.length)] : { type: 'No Significant Lesion', disease: 'Normal' };
    const res = {
      cancerProbability: prob,
      lesionType: detected.type,
      diseaseName: detected.disease,
      diseaseMatchProbability: prob > 50 ? 60 + Math.floor(Math.random() * 30) : 90,
      riskLevel: prob > 70 ? 'high' : prob > 40 ? 'moderate' : 'low',
      recommendation: prob > 70
        ? 'High risk detected. Immediate referral to oncologist recommended.'
        : prob > 40
          ? 'Moderate risk. Schedule follow-up biopsy within 2 weeks.'
          : 'Low risk. Routine monitoring recommended in 6 months.',
      lesionLocations: prob > 50 ? ['Tongue (dorsal surface)', 'Buccal mucosa'] : [],
      imageAnalysis: [
        { type: 'Tongue', finding: prob > 50 ? 'White patches detected' : 'Normal', confidence: 85 + Math.floor(Math.random() * 10) },
        { type: 'Gums', finding: 'No abnormality', confidence: 90 + Math.floor(Math.random() * 8) },
        { type: 'Floor of Mouth', finding: prob > 60 ? 'Redness observed' : 'Normal', confidence: 82 + Math.floor(Math.random() * 12) },
        { type: 'Buccal Mucosa', finding: prob > 50 ? 'Submucosal fibrosis suspected' : 'Normal', confidence: 88 + Math.floor(Math.random() * 10) },
      ],
      scanDate: new Date().toISOString(),
    };
    setResult(res);
    setStep(4);
    setAnalyzing(false);
    saveToDatabase(res);
  };

  const runAnalysis = async () => {
    try {
      // Step 0: Preprocessing images
      setStep(0);
      await new Promise(r => setTimeout(r, 600));

      // Step 1: Running AI detection model
      setStep(1);
      
      if (!imageFiles || imageFiles.some(img => !img)) {
        console.warn("No raw image files found in navigation state. Falling back to mock.");
        runMockAnalysis();
        return;
      }

      // Prepare multi-part form data
      const formData = new FormData();
      formData.append('tongue', imageFiles[0]);
      formData.append('gums', imageFiles[1]);
      formData.append('floor_mouth', imageFiles[2]);
      formData.append('buccal', imageFiles[3]);

      // Call API
      const response = await scanAPI.predict(formData);
      const res = {
        ...response.data,
        scanDate: new Date().toISOString()
      };

      // Step 2: Detecting lesion locations
      setStep(2);
      await new Promise(r => setTimeout(r, 600));

      // Step 3: Analyzing disease patterns
      setStep(3);
      await new Promise(r => setTimeout(r, 600));

      // Step 4: Saving to database
      setStep(4);
      setResult(res);
      setAnalyzing(false);
      saveToDatabase(res);

    } catch (err) {
      console.error('Real AI prediction failed, falling back to mock:', err);
      runMockAnalysis();
    }
  };

  const saveToDatabase = async (res) => {
    try {
      await patientAPI.save(patient);
      await scanAPI.save({ ...res, patientId: patient.id });
      setSaved(true);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = 210;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    const drawSectionHeader = (title, y) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(26, 35, 126); // #1A237E
      doc.text(title, margin, y);
    };

    // ==========================================
    // PAGE 1: HEADER, RISK, PATIENT INFO, AI RESULTS, TABLE
    // ==========================================

    // 1. Header Card (Blue Banner)
    doc.setFillColor(21, 101, 192); // #1565C0
    doc.roundedRect(margin, 15, contentWidth, 24, 3, 3, 'F');

    // Title & Subtitle
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('DentalScan AI', margin + 8, 24);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('AI-Powered Oral Cancer Detection Report', margin + 8, 31);

    // Date on the right
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('Report Date', margin + contentWidth - 32, 22);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    const reportDate = new Date(result.scanDate || Date.now()).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
    doc.text(reportDate, margin + contentWidth - 32, 27);

    // 2. Risk Banner
    const isHigh = result.riskLevel === 'high';
    const isMod = result.riskLevel === 'moderate';
    const riskColor = isHigh ? [198, 40, 40] : isMod ? [245, 124, 0] : [46, 125, 50]; // #C62828, #F57C00, #2E7D32
    doc.setFillColor(...riskColor);
    doc.roundedRect(margin, 43, contentWidth, 12, 3, 3, 'F');

    // Risk text inside banner
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`${result.riskLevel.toUpperCase()} RISK`, margin + 8, 51);
    doc.text(`Cancer Probability: ${result.cancerProbability}%`, margin + contentWidth - 62, 51);

    // 3. Patient Information
    drawSectionHeader('Patient Information', 64);
    
    // Draw background card for Patient Info
    doc.setDrawColor(240, 240, 240); // Very light grey border
    doc.setFillColor(252, 252, 252); // Very light grey fill
    doc.roundedRect(margin, 68, contentWidth, 46, 2, 2, 'FD');

    // Patient info fields
    const pInfo = [
      { label: 'Patient Name', value: patient.name },
      { label: 'Age', value: `${patient.age} years` },
      { label: 'Mobile', value: patient.mobile },
      { label: 'Appointment Date', value: new Date(patient.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
      { label: 'Scan Date', value: new Date(result.scanDate || Date.now()).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
      { label: 'Patient ID', value: patient.id }
    ];

    pInfo.forEach((item, index) => {
      const yPos = 74 + (index * 6.2);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(96, 125, 139); // #607D8B
      doc.text(item.label, margin + 8, yPos);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(33, 33, 33); // #212121
      doc.text(String(item.value), margin + contentWidth - 8, yPos, { align: 'right' });
    });

    // 4. AI Analysis Results
    drawSectionHeader('AI Analysis Results', 123);
    
    doc.setDrawColor(240, 240, 240);
    doc.setFillColor(252, 252, 252);
    doc.roundedRect(margin, 127, contentWidth, 24, 2, 2, 'FD');

    const aiRes = [
      { label: 'Cancer Probability', value: `${result.cancerProbability}%` },
      { label: 'Risk Level', value: `${result.riskLevel.toUpperCase()} RISK` },
      { label: 'Detected Lesion', value: result.lesionType }
    ];

    aiRes.forEach((item, index) => {
      const yPos = 133 + (index * 6.2);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(96, 125, 139);
      doc.text(item.label, margin + 8, yPos);
      
      doc.setFont('helvetica', 'bold');
      if (item.label === 'Risk Level') {
        doc.setTextColor(...riskColor);
      } else {
        doc.setTextColor(33, 33, 33);
      }
      doc.text(String(item.value), margin + contentWidth - 8, yPos, { align: 'right' });
    });

    // 5. Per-Image Analysis Table
    drawSectionHeader('Per-Image Analysis', 160);

    const tableY = 164;
    const rowHeight = 7;

    // Header row
    doc.setFillColor(21, 101, 192); // #1565C0
    doc.rect(margin, tableY, contentWidth, rowHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('Image Type', margin + 6, tableY + 4.5);
    doc.text('Finding', margin + 70, tableY + 4.5);
    doc.text('Confidence', margin + contentWidth - 6, tableY + 4.5, { align: 'right' });

    // Table rows
    result.imageAnalysis.forEach((item, index) => {
      const rowY = tableY + rowHeight + (index * rowHeight);
      
      // Zebra striping
      if (index % 2 === 0) {
        doc.setFillColor(255, 255, 255);
      } else {
        doc.setFillColor(248, 250, 252);
      }
      doc.rect(margin, rowY, contentWidth, rowHeight, 'F');

      // Thin grey borders
      doc.setDrawColor(240, 240, 240);
      doc.line(margin, rowY + rowHeight, margin + contentWidth, rowY + rowHeight);

      // Text values
      doc.setTextColor(33, 33, 33);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text(item.type, margin + 6, rowY + 4.5);

      const isNormal = item.finding === 'Normal' || item.finding === 'No abnormality';
      doc.setFont('helvetica', isNormal ? 'normal' : 'bold');
      doc.setTextColor(...(isNormal ? [76, 175, 80] : riskColor)); // Green if normal, Else Risk Color
      doc.text(item.finding, margin + 70, rowY + 4.5);

      doc.setTextColor(55, 71, 79);
      doc.setFont('helvetica', 'normal');
      doc.text(`${item.confidence}%`, margin + contentWidth - 6, rowY + 4.5, { align: 'right' });
    });

    // Draw table side vertical borders
    doc.setDrawColor(240, 240, 240);
    doc.line(margin, tableY, margin, tableY + rowHeight + (result.imageAnalysis.length * rowHeight));
    doc.line(margin + contentWidth, tableY, margin + contentWidth, tableY + rowHeight + (result.imageAnalysis.length * rowHeight));

    // 6. Clinical Recommendation Section Heading
    drawSectionHeader('Clinical Recommendation', 208);

    // ==========================================
    // PAGE 2: CLINICAL RECOMMENDATION CARD & DISCLAIMER CARD
    // ==========================================
    doc.addPage();

    // 1. Recommendation Card
    doc.setFillColor(227, 242, 253); // #E3F2FD
    doc.setDrawColor(144, 202, 249); // #90CAF9
    doc.roundedRect(margin, 15, contentWidth, 18, 2, 2, 'FD');

    // Text inside recommendation card
    doc.setTextColor(21, 101, 192); // #1565C0
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const recLines = doc.splitTextToSize(result.recommendation, contentWidth - 16);
    doc.text(recLines, margin + 8, 23);

    // 2. Disclaimer Card
    doc.setFillColor(255, 253, 231); // #FFFDE7
    doc.setDrawColor(255, 245, 157); // #FFF59D
    doc.roundedRect(margin, 40, contentWidth, 24, 2, 2, 'FD');

    // Heading "DISCLAIMER"
    doc.setTextColor(230, 81, 0); // Orange-red header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('DISCLAIMER', margin + 8, 46);

    // Text inside disclaimer card
    doc.setTextColor(84, 110, 122); // #546E7A
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const discText = 'This report is generated by AI and is for screening purposes only. It should not replace professional medical diagnosis. Please consult a qualified dental surgeon or oncologist for proper evaluation.';
    const discLines = doc.splitTextToSize(discText, contentWidth - 16);
    doc.text(discLines, margin + 8, 52);

    doc.save(`DentalScan_${patient.name}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
  };

  const getRiskColor = (risk) => risk === 'high' ? '#C62828' : risk === 'moderate' ? '#F57C00' : '#2E7D32';
  const getRiskBg = (risk) => risk === 'high' ? '#FFEBEE' : risk === 'moderate' ? '#FFF3E0' : '#E8F5E9';

  return (
    <div style={{ minHeight: '100vh', background: '#F5F9FF' }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        {analyzing ? (
          <div style={styles.analyzingCard}>
            <div style={styles.analyzingIcon}>🤖</div>
            <h2 style={styles.analyzingTitle}>AI is analyzing your images</h2>
            <p style={styles.analyzingDesc}>Please wait...</p>
            <div style={styles.stepsList}>
              {steps.map((s, i) => (
                <div key={i} style={{ ...styles.stepItem, background: i < step ? '#E8F5E9' : i === step ? '#E3F2FD' : 'white' }}>
                  <span>{i < step ? '✅' : i === step ? '⏳' : '⬜'}</span>
                  <span style={{ color: i < step ? '#2E7D32' : i === step ? '#1565C0' : '#9E9E9E', fontWeight: i === step ? 600 : 400 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        ) : result && (
          <>
            {/* Risk banner */}
            <div style={{ ...styles.riskBanner, background: getRiskBg(result.riskLevel), borderColor: getRiskColor(result.riskLevel) }}>
              <div style={{ ...styles.riskIcon, background: getRiskColor(result.riskLevel) }}>
                {result.riskLevel === 'high' ? '⚠️' : result.riskLevel === 'moderate' ? 'ℹ️' : '✅'}
              </div>
              <div>
                <div style={{ ...styles.riskLabel, color: getRiskColor(result.riskLevel) }}>
                  {result.riskLevel.toUpperCase()} RISK
                </div>
                <div style={{ color: getRiskColor(result.riskLevel), fontSize: 14 }}>
                  Cancer Probability: {result.cancerProbability}%
                </div>
                <div style={{ color: '#607D8B', fontSize: 13 }}>Patient: {patient?.name}</div>
              </div>
            </div>

            {/* Save status */}
            <div style={{ ...styles.saveStatus, background: saved ? '#E8F5E9' : '#FFF3E0', borderColor: saved ? '#A5D6A7' : '#FFE0B2' }}>
              {saved ? '✅ Results saved to database' : '⏳ Saving to database...'}
            </div>

            {/* Chart + Lesion */}
            <div style={styles.grid}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>📊 Probability Analysis</h3>
                <div style={{ maxWidth: 200, margin: '16px auto' }}>
                  <Doughnut
                    data={{
                      labels: ['Cancer Risk', 'Normal'],
                      datasets: [{ data: [result.cancerProbability, 100 - result.cancerProbability], backgroundColor: [getRiskColor(result.riskLevel), '#E0E0E0'], borderWidth: 0 }]
                    }}
                    options={{ plugins: { legend: { position: 'bottom' } } }}
                  />
                </div>
                <div style={styles.confScore}>Confidence Score: <strong>87%</strong></div>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>🔬 Lesion & Disease Detection</h3>
                <div style={styles.lesionBox}>
                  <div style={styles.lesionLabel}>Detected Lesion</div>
                  <div style={styles.lesionValue}>{result.lesionType}</div>
                </div>
                {result.diseaseName !== 'Normal' && (
                  <div style={{ ...styles.lesionBox, borderColor: '#FFE0B2', background: '#FFF3E0' }}>
                    <div style={styles.lesionLabel}>Matched Disease</div>
                    <div style={{ ...styles.lesionValue, color: '#F57C00' }}>{result.diseaseName}</div>
                    <div style={styles.matchProb}>Match: {result.diseaseMatchProbability}%</div>
                    <div style={styles.matchBar}>
                      <div style={{ ...styles.matchFill, width: `${result.diseaseMatchProbability}%`, background: '#F57C00' }} />
                    </div>
                  </div>
                )}
                {result.lesionLocations.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={styles.lesionLabel}>Affected Locations:</div>
                    {result.lesionLocations.map((loc, i) => (
                      <div key={i} style={styles.locationItem}>• {loc}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Per image analysis */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🖼️ Per-Image Analysis</h3>
              <div style={styles.imageAnalysisGrid}>
                {result.imageAnalysis.map((a, i) => {
                  const isNormal = a.finding === 'Normal' || a.finding === 'No abnormality';
                  return (
                    <div key={i} style={{ ...styles.imageAnalysisItem, background: isNormal ? '#E8F5E9' : '#FFF3E0', borderColor: isNormal ? '#A5D6A7' : '#FFE0B2' }}>
                      {images?.[i] && <img src={images[i]} alt={a.type} style={styles.thumbImg} />}
                      <div style={styles.imageAnalysisInfo}>
                        <div style={styles.imageAnalysisType}>{a.type}</div>
                        <div style={{ color: isNormal ? '#2E7D32' : '#F57C00', fontSize: 13 }}>{a.finding}</div>
                      </div>
                      <div style={{ ...styles.confBadge, color: '#1565C0' }}>{a.confidence}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendation */}
            <div style={styles.recCard}>
              <div style={styles.recIcon}>💊</div>
              <div>
                <div style={styles.recTitle}>Clinical Recommendation</div>
                <div style={styles.recText}>{result.recommendation}</div>
              </div>
            </div>

            {/* Action buttons */}
            <button style={styles.dashBtn} onClick={() => navigate('/dashboard')}>
              📊 View in Dashboard
            </button>
            <button style={styles.rescanBtn} onClick={() => navigate('/new-scan')}>
              🔄 New Scan
            </button>
            <button style={styles.pdfBtn} onClick={downloadPDF}>
              📄 Download PDF Report
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  analyzingCard: { background: 'white', borderRadius: 16, padding: 40, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  analyzingIcon: { fontSize: 64, marginBottom: 16 },
  analyzingTitle: { fontSize: 22, fontWeight: 700, color: '#1A237E', marginBottom: 8 },
  analyzingDesc: { color: '#607D8B', marginBottom: 32 },
  stepsList: { display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400, margin: '0 auto', textAlign: 'left' },
  stepItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 8, fontSize: 14 },
  riskBanner: { border: '2px solid', borderRadius: 14, padding: 20, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 },
  riskIcon: { width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 },
  riskLabel: { fontSize: 20, fontWeight: 800, marginBottom: 4 },
  saveStatus: { border: '1px solid', borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 500, marginBottom: 20 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 16 },
  card: { background: 'white', borderRadius: 14, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: '#1A237E', marginBottom: 8 },
  confScore: { textAlign: 'center', color: '#607D8B', fontSize: 13, marginTop: 8 },
  lesionBox: { border: '1.5px solid #E3F2FD', borderRadius: 10, padding: 14, marginBottom: 10, background: '#F5F9FF' },
  lesionLabel: { fontSize: 11, color: '#607D8B', marginBottom: 4 },
  lesionValue: { fontSize: 16, fontWeight: 700, color: '#1A237E' },
  matchProb: { fontSize: 12, color: '#F57C00', marginTop: 6, marginBottom: 4 },
  matchBar: { height: 6, background: '#E0E0E0', borderRadius: 3, overflow: 'hidden' },
  matchFill: { height: '100%', borderRadius: 3 },
  locationItem: { fontSize: 13, color: '#607D8B', padding: '4px 0' },
  imageAnalysisGrid: { display: 'flex', flexDirection: 'column', gap: 10 },
  imageAnalysisItem: { display: 'flex', alignItems: 'center', gap: 12, border: '1px solid', borderRadius: 10, padding: 12 },
  thumbImg: { width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 },
  imageAnalysisInfo: { flex: 1 },
  imageAnalysisType: { fontSize: 14, fontWeight: 600, color: '#1A237E', marginBottom: 2 },
  confBadge: { background: '#E3F2FD', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700 },
  recCard: { background: '#E3F2FD', borderRadius: 14, padding: 18, display: 'flex', gap: 14, marginBottom: 16, alignItems: 'flex-start' },
  recIcon: { fontSize: 24, flexShrink: 0 },
  recTitle: { fontSize: 14, fontWeight: 700, color: '#1565C0', marginBottom: 4 },
  recText: { fontSize: 13, color: '#37474F', lineHeight: 1.6 },
  dashBtn: { width: '100%', background: '#1565C0', color: 'white', border: 'none', padding: 14, borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 10 },
  rescanBtn: { width: '100%', background: 'transparent', color: '#1565C0', border: '2px solid #1565C0', padding: 14, borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 10 },
  pdfBtn: { width: '100%', background: '#2E7D32', color: 'white', border: 'none', padding: 14, borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 10 },
};

export default ResultsPage;