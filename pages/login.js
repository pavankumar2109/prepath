import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    targetRole: 'Software Development Engineer (SDE-1)',
    targetCompany: 'Product Companies (MAANG / Top Tech)'
  });
  const [error, setError] = useState('');

  // Check if already logged in
  useEffect(() => {
    try {
      const user = localStorage.getItem('prepath_user');
      if (user) {
        router.push('/');
      }
    } catch (e) {
      console.error(e);
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in both email and password.');
      return;
    }

    if (isSignUp && !formData.name) {
      setError('Please provide your full name.');
      return;
    }

    // Save session in LocalStorage
    const userProfile = {
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      targetRole: formData.targetRole,
      targetCompany: formData.targetCompany,
      loggedInAt: new Date().toISOString()
    };

    localStorage.setItem('prepath_user', JSON.stringify(userProfile));
    router.push('/');
  };

  const handleGuestLogin = () => {
    const guestUser = {
      name: 'Candidate Guest',
      email: 'guest@prepath.ai',
      targetRole: 'Software Engineer',
      targetCompany: 'Tier-1 Product Companies',
      isGuest: true
    };
    localStorage.setItem('prepath_user', JSON.stringify(guestUser));
    router.push('/');
  };

  return (
    <div className="auth-wrapper">
      <Head>
        <title>Sign In - PrePath AI Placement Prep</title>
      </Head>

      <div className="auth-card">
        <div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div className="logo-icon" style={{ width: '48px', height: '48px', fontSize: '1.6rem' }}>⚡</div>
          <div className="brand-text" style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: '1.8rem' }}>PrePath</h1>
            <p>Placement Preparation Platform</p>
          </div>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab-btn ${!isSignUp ? 'active' : ''}`}
            onClick={() => { setIsSignUp(false); setError(''); }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab-btn ${isSignUp ? 'active' : ''}`}
            onClick={() => { setIsSignUp(true); setError(''); }}
          >
            Create Account
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Alex Johnson"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="alex@college.edu"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {isSignUp && (
            <>
              <div className="form-group">
                <label className="form-label">Target Placement Role</label>
                <select
                  className="form-select"
                  value={formData.targetRole}
                  onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                >
                  <option value="Software Development Engineer (SDE-1)">Software Development Engineer (SDE-1)</option>
                  <option value="Frontend Engineer">Frontend Developer (React/Next.js)</option>
                  <option value="Backend Engineer">Backend Developer (Node/Java/Python)</option>
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="Data Engineer / Analyst">Data Engineer / Analyst</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Target Company Tier</label>
                <select
                  className="form-select"
                  value={formData.targetCompany}
                  onChange={e => setFormData({ ...formData, targetCompany: e.target.value })}
                >
                  <option value="Product Companies (MAANG / Top Tech)">Product Companies (MAANG / Top Tech)</option>
                  <option value="High Growth Startups">High Growth Startups</option>
                  <option value="Service Based & IT Companies">Service Based & IT Companies</option>
                  <option value="Fintech & Quantitative Firms">Fintech & Quantitative Firms</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {isSignUp ? 'Create PrePath Account →' : 'Sign In to Workspace →'}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button className="btn btn-secondary" style={{ width: '100%' }} onClick={handleGuestLogin}>
          ⚡ Continue as Guest (Quick Demo)
        </button>
      </div>
    </div>
  );
}
