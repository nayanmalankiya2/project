import React from 'react';
import { useAuth } from '../auth/AuthContext';

const Navbar = ({ title }) => {
  const { user, logout } = useAuth();

  const roleLabel = {
    admin: 'Admin',
    faculty: 'Faculty',
    student: 'Student',
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🎓</span>
        <div>
          <h1>Student Academic Performance Index</h1>
          <p className="brand-sub">{title}</p>
        </div>
      </div>
      <div className="navbar-actions">
        <div className="user-chip">
          <span className="user-avatar">{user?.name?.charAt(0) || 'U'}</span>
          <div>
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{roleLabel[user?.role]}</span>
          </div>
        </div>
        <button className="btn btn-logout" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
