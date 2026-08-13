import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (un, pw) => {
    setUsername(un);
    setPassword(pw);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🎓</div>
        <h2>Student Academic Performance Index</h2>
        <p className="login-sub">Sign in to your account</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Accounts section - commented out
        <div className="demo-accounts">
          <p className="demo-title">Demo Accounts (click to fill)</p>
          <div className="demo-buttons">
            <button className="demo-btn demo-admin" onClick={() => quickFill('admin', 'admin123')}>
              👑 Admin
            </button>
            <button className="demo-btn demo-faculty" onClick={() => quickFill('faculty', 'faculty123')}>
              🧑‍🏫 Faculty
            </button>
            <button className="demo-btn demo-student" onClick={() => quickFill('student', 'student123')}>
              🎒 Student
            </button>
          </div>
        </div>
        */}
      </div>
    </div>
  );
};

export default Login;
