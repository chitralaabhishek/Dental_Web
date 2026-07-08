import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const AuthPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await authAPI.login(loginData);
      localStorage.setItem('auth_token', res.data.access_token);
      localStorage.setItem('user_name', res.data.user.name);
      localStorage.setItem('user_email', res.data.user.email);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await authAPI.signup({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
      });
      localStorage.setItem('auth_token', res.data.access_token);
      localStorage.setItem('user_name', res.data.user.name);
      localStorage.setItem('user_email', res.data.user.email);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>+</div>
            <span style={styles.logoText}>DentalScan AI</span>
          </div>
          <h1 style={styles.leftTitle}>AI-Powered Oral Cancer Detection</h1>
          <p style={styles.leftDesc}>
            Professional dental screening tool using advanced AI to detect oral cancer lesions early and accurately.
          </p>
          <div style={styles.features}>
            {['🔬 AI Analysis with 87% accuracy', '📸 4-area oral image scanning', '📄 Professional PDF reports', '☁️ Secure cloud storage'].map((f, i) => (
              <div key={i} style={styles.feature}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.tabs}>
            <button
              style={{ ...styles.tab, ...(tab === 'login' ? styles.tabActive : {}) }}
              onClick={() => { setTab('login'); setError(''); }}
            >Login</button>
            <button
              style={{ ...styles.tab, ...(tab === 'signup' ? styles.tabActive : {}) }}
              onClick={() => { setTab('signup'); setError(''); }}
            >Sign Up</button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin}>
              <h2 style={styles.formTitle}>Welcome back</h2>
              <p style={styles.formDesc}>Sign in to your account</p>
              {error && <div style={styles.error}>⚠️ {error}</div>}
              <div style={styles.inputGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={e => setLoginData({...loginData, email: e.target.value})}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label>Password</label>
                <div style={styles.passWrap}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={e => setLoginData({...loginData, password: e.target.value})}
                    required
                    style={{...styles.input, paddingRight: 40}}
                  />
                  <button type="button" style={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <button type="submit" style={styles.submitBtn} disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              <p style={styles.switchText}>
                Don't have an account?{' '}
                <span style={styles.switchLink} onClick={() => setTab('signup')}>Sign Up</span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <h2 style={styles.formTitle}>Create account</h2>
              <p style={styles.formDesc}>Register to get started</p>
              {error && <div style={styles.error}>⚠️ {error}</div>}
              <div style={styles.inputGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={signupData.name}
                  onChange={e => setSignupData({...signupData, name: e.target.value})}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={e => setSignupData({...signupData, email: e.target.value})}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={signupData.password}
                  onChange={e => setSignupData({...signupData, password: e.target.value})}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={signupData.confirmPassword}
                  onChange={e => setSignupData({...signupData, confirmPassword: e.target.value})}
                  required
                  style={styles.input}
                />
              </div>
              <button type="submit" style={styles.submitBtn} disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
              <p style={styles.switchText}>
                Already have an account?{' '}
                <span style={styles.switchLink} onClick={() => setTab('login')}>Login</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { display: 'flex', minHeight: '100vh', flexWrap: 'wrap' },
  left: { flex: 1, minWidth: 300, background: '#1565C0', padding: '60px 40px', display: 'flex', alignItems: 'center' },
  leftContent: { maxWidth: 400 },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 },
  logoIcon: { width: 44, height: 44, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1565C0', fontWeight: 900, fontSize: 26 },
  logoText: { color: 'white', fontWeight: 700, fontSize: 20 },
  leftTitle: { fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 16, lineHeight: 1.3 },
  leftDesc: { fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: 32 },
  features: { display: 'flex', flexDirection: 'column', gap: 12 },
  feature: { color: 'rgba(255,255,255,0.9)', fontSize: 14, background: 'rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: 8 },
  right: { flex: 1, minWidth: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#F5F9FF' },
  card: { background: 'white', borderRadius: 16, padding: 36, width: '100%', maxWidth: 420, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  tabs: { display: 'flex', background: '#F5F9FF', borderRadius: 10, padding: 4, marginBottom: 28 },
  tab: { flex: 1, padding: '10px', border: 'none', background: 'transparent', borderRadius: 8, fontSize: 15, fontWeight: 600, color: '#607D8B', cursor: 'pointer' },
  tabActive: { background: '#1565C0', color: 'white' },
  formTitle: { fontSize: 22, fontWeight: 700, color: '#1A237E', marginBottom: 4 },
  formDesc: { fontSize: 13, color: '#607D8B', marginBottom: 20 },
  error: { background: '#FFEBEE', color: '#C62828', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  passWrap: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 },
  input: { width: '100%', padding: '12px 14px', border: '1.5px solid #E0E0E0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  submitBtn: { width: '100%', background: '#1565C0', color: 'white', border: 'none', padding: '14px', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  switchText: { textAlign: 'center', fontSize: 13, color: '#607D8B', marginTop: 16 },
  switchLink: { color: '#1565C0', fontWeight: 600, cursor: 'pointer' },
};

export default AuthPage;