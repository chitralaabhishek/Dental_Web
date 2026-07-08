import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>+</div>
            <span style={styles.logoText}>DentalScan AI</span>
          </div>
          <div style={styles.navBtns}>
            <button style={styles.loginBtn} onClick={() => navigate('/auth')}>Login</button>
            <button style={styles.signupBtn} onClick={() => navigate('/auth')}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🏥 AI-Powered Healthcare</div>
          <h1 style={styles.heroTitle}>
            Detect Oral Cancer<br />
            <span style={styles.heroHighlight}>Early & Accurately</span>
          </h1>
          <p style={styles.heroDesc}>
            DentalScan AI uses advanced artificial intelligence to analyze oral images
            and detect potential cancer lesions with high accuracy. Fast, reliable, and
            accessible for every dental professional.
          </p>
          <div style={styles.heroBtns}>
            <button style={styles.heroBtn} onClick={() => navigate('/auth')}>
              Start Free Today →
            </button>
            <button style={styles.heroBtnOutline} onClick={() => navigate('/auth')}>
              Login to Dashboard
            </button>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.stat}>
              <span style={styles.statNum}>87%</span>
              <span style={styles.statLabel}>AI Accuracy</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <span style={styles.statNum}>4</span>
              <span style={styles.statLabel}>Image Analysis</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <span style={styles.statNum}>PDF</span>
              <span style={styles.statLabel}>Reports</span>
            </div>
          </div>
        </div>
        <div style={styles.heroImage}>
          <div style={styles.heroCard}>
            <div style={styles.heroCardHeader}>
              <span style={styles.dot} />
              <span style={styles.dot} />
              <span style={styles.dot} />
            </div>
            <div style={styles.heroCardBody}>
              <div style={styles.scanResult}>
                <div style={styles.scanIcon}>🔬</div>
                <div>
                  <div style={styles.scanTitle}>AI Analysis Complete</div>
                  <div style={styles.scanSub}>Patient: John Doe</div>
                </div>
                <div style={styles.scanBadge}>LOW RISK</div>
              </div>
              <div style={styles.probBar}>
                <div style={styles.probLabel}>Cancer Probability</div>
                <div style={styles.probValue}>17%</div>
                <div style={styles.probBarBg}>
                  <div style={{...styles.probBarFill, width: '17%'}} />
                </div>
              </div>
              <div style={styles.imageGrid}>
                {['Tongue', 'Gums', 'Floor', 'Buccal'].map((label, i) => (
                  <div key={i} style={styles.imageBox}>
                    <div style={styles.imageIcon}>📷</div>
                    <div style={styles.imageLabel}>{label}</div>
                    <div style={styles.imageBadge}>Normal</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Why Choose DentalScan AI?</h2>
          <p style={styles.sectionDesc}>
            Professional-grade oral cancer screening powered by cutting-edge AI technology
          </p>
          <div style={styles.featureGrid}>
            {[
              { icon: '🤖', title: 'AI-Powered Detection', desc: 'Advanced machine learning model trained on thousands of oral cancer images for accurate detection.' },
              { icon: '📸', title: '4-Image Analysis', desc: 'Captures Tongue, Gums, Floor of Mouth, and Buccal Mucosa for comprehensive oral screening.' },
              { icon: '⚡', title: 'Instant Results', desc: 'Get AI analysis results in seconds with detailed lesion detection and risk assessment.' },
              { icon: '📄', title: 'PDF Reports', desc: 'Download professional PDF reports with patient details, AI predictions, and clinical recommendations.' },
              { icon: '☁️', title: 'Cloud Storage', desc: 'All patient data securely stored in cloud database accessible from anywhere anytime.' },
              { icon: '📊', title: 'Dashboard Analytics', desc: 'Track patient history, risk levels, and scan statistics with beautiful visual charts.' },
            ].map((f, i) => (
              <div key={i} style={styles.featureCard}>
                <div style={styles.featureIcon}>{f.icon}</div>
                <h3 style={styles.featureTitle}>{f.title}</h3>
                <p style={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={styles.howItWorks}>
        <div className="container">
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <div style={styles.steps}>
            {[
              { num: '1', title: 'Register Patient', desc: 'Enter patient name, age, and contact details' },
              { num: '2', title: 'Capture 4 Images', desc: 'Take photos of tongue, gums, floor of mouth, and cheeks' },
              { num: '3', title: 'AI Analysis', desc: 'Our AI model analyzes all images for cancer detection' },
              { num: '4', title: 'View Results', desc: 'Get detailed report with risk level and recommendations' },
            ].map((step, i) => (
              <div key={i} style={styles.step}>
                <div style={styles.stepNum}>{step.num}</div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to Start Screening?</h2>
        <p style={styles.ctaDesc}>Join dental professionals using AI for early cancer detection</p>
        <button style={styles.ctaBtn} onClick={() => navigate('/auth')}>
          Get Started Free →
        </button>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerLogo}>
            <div style={styles.logoIcon}>+</div>
            <span style={styles.logoText}>DentalScan AI</span>
          </div>
          <p style={styles.footerText}>
            AI-Powered Oral Cancer Detection • Version 1.0.0
          </p>
          <p style={styles.footerCopy}>© 2025 DentalScan AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#F5F9FF' },
  nav: { background: '#1565C0', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' },
  navInner: { maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoIcon: { width: 36, height: 36, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1565C0', fontWeight: 900, fontSize: 22 },
  logoText: { color: 'white', fontWeight: 700, fontSize: 18 },
  navBtns: { display: 'flex', gap: 10 },
  loginBtn: { background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.5)', padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  signupBtn: { background: 'white', color: '#1565C0', border: 'none', padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  hero: { maxWidth: 1200, margin: '0 auto', padding: '60px 24px', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' },
  heroContent: { flex: 1, minWidth: 300 },
  heroBadge: { background: '#E3F2FD', color: '#1565C0', display: 'inline-block', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20 },
  heroTitle: { fontSize: 48, fontWeight: 800, color: '#1A237E', lineHeight: 1.2, marginBottom: 20 },
  heroHighlight: { color: '#1565C0' },
  heroDesc: { fontSize: 16, color: '#607D8B', lineHeight: 1.8, marginBottom: 32, maxWidth: 480 },
  heroBtns: { display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 },
  heroBtn: { background: '#1565C0', color: 'white', border: 'none', padding: '14px 28px', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  heroBtnOutline: { background: 'transparent', color: '#1565C0', border: '2px solid #1565C0', padding: '14px 28px', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  heroStats: { display: 'flex', alignItems: 'center', gap: 24 },
  stat: { display: 'flex', flexDirection: 'column' },
  statNum: { fontSize: 28, fontWeight: 800, color: '#1565C0' },
  statLabel: { fontSize: 12, color: '#607D8B', fontWeight: 500 },
  statDivider: { width: 1, height: 40, background: '#E0E0E0' },
  heroImage: { flex: 1, minWidth: 300 },
  heroCard: { background: 'white', borderRadius: 16, boxShadow: '0 8px 32px rgba(21,101,192,0.15)', overflow: 'hidden' },
  heroCardHeader: { background: '#1565C0', padding: '12px 16px', display: 'flex', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' },
  heroCardBody: { padding: 20 },
  scanResult: { display: 'flex', alignItems: 'center', gap: 12, background: '#E8F5E9', padding: 14, borderRadius: 10, marginBottom: 16 },
  scanIcon: { fontSize: 24 },
  scanTitle: { fontWeight: 700, fontSize: 14, color: '#1A237E' },
  scanSub: { fontSize: 12, color: '#607D8B' },
  scanBadge: { marginLeft: 'auto', background: '#2E7D32', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 },
  probBar: { marginBottom: 16 },
  probLabel: { fontSize: 12, color: '#607D8B', marginBottom: 4 },
  probValue: { fontSize: 20, fontWeight: 800, color: '#2E7D32', marginBottom: 6 },
  probBarBg: { height: 8, background: '#E0E0E0', borderRadius: 4, overflow: 'hidden' },
  probBarFill: { height: '100%', background: '#2E7D32', borderRadius: 4 },
  imageGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  imageBox: { background: '#F5F9FF', borderRadius: 8, padding: 10, textAlign: 'center' },
  imageIcon: { fontSize: 20, marginBottom: 4 },
  imageLabel: { fontSize: 11, fontWeight: 600, color: '#1A237E' },
  imageBadge: { fontSize: 10, color: '#2E7D32', background: '#E8F5E9', padding: '2px 6px', borderRadius: 10, display: 'inline-block', marginTop: 4 },
  features: { background: 'white', padding: '80px 24px' },
  sectionTitle: { fontSize: 36, fontWeight: 800, color: '#1A237E', textAlign: 'center', marginBottom: 12 },
  sectionDesc: { fontSize: 16, color: '#607D8B', textAlign: 'center', marginBottom: 48 },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto' },
  featureCard: { background: '#F5F9FF', borderRadius: 14, padding: 28, border: '1px solid #E3F2FD' },
  featureIcon: { fontSize: 36, marginBottom: 16 },
  featureTitle: { fontSize: 18, fontWeight: 700, color: '#1A237E', marginBottom: 10 },
  featureDesc: { fontSize: 14, color: '#607D8B', lineHeight: 1.7 },
  howItWorks: { padding: '80px 24px', maxWidth: 1200, margin: '0 auto' },
  steps: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginTop: 48 },
  step: { textAlign: 'center', padding: 24 },
  stepNum: { width: 56, height: 56, background: '#1565C0', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, margin: '0 auto 16px' },
  stepTitle: { fontSize: 18, fontWeight: 700, color: '#1A237E', marginBottom: 10 },
  stepDesc: { fontSize: 14, color: '#607D8B', lineHeight: 1.7 },
  cta: { background: '#1565C0', padding: '80px 24px', textAlign: 'center' },
  ctaTitle: { fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 12 },
  ctaDesc: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 32 },
  ctaBtn: { background: 'white', color: '#1565C0', border: 'none', padding: '16px 40px', borderRadius: 12, fontSize: 18, fontWeight: 700, cursor: 'pointer' },
  footer: { background: '#0D47A1', padding: '40px 24px' },
  footerInner: { maxWidth: 1200, margin: '0 auto', textAlign: 'center' },
  footerLogo: { display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 12 },
  footerText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 8 },
  footerCopy: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
};

export default LandingPage;