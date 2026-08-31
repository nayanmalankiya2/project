import React, { useState } from 'react';
import * as api from '../api';
import { useAuth } from '../auth/AuthContext';

// Student profile — read-only by default, edit mode opens via the "Edit" button.
// Only name, email, phone, address are editable; username/password never are.
const StudentProfileForm = ({ profile, onSaved, onClose }) => {
  const { updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const startEdit = () => {
    setForm({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
    });
    setMessage('');
    setError('');
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setMessage('');
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Full name is required');
      return;
    }

    setSaving(true);
    setMessage('');
    setError('');
    try {
      const updated = {
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim(),
        address: form.address.trim(),
      };
      await api.updateMyStudentProfile(updated);
      updateProfile({ name: updated.name, email: updated.email });
      if (onSaved) onSaved(updated);
      setMessage('✅ Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>👤 My Profile</h3>
          {!editing && (
            <button className="modal-close" title="Close" onClick={onClose}>✕</button>
          )}
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {!editing ? (
          <>
            <div className="table-wrapper">
              <table className="table profile-table">
                <tbody>
                  <tr>
                    <td className="profile-label">Full Name</td>
                    <td>{profile?.name || '—'}</td>
                  </tr>
                  <tr>
                    <td className="profile-label">Roll Number</td>
                    <td>{profile?.rollNumber || '—'}</td>
                  </tr>
                  <tr>
                    <td className="profile-label">Class</td>
                    <td>{profile?.className || '—'}</td>
                  </tr>
                  <tr>
                    <td className="profile-label">Email</td>
                    <td>{profile?.email || '—'}</td>
                  </tr>
                  <tr>
                    <td className="profile-label">Phone</td>
                    <td>{profile?.phone || '—'}</td>
                  </tr>
                  <tr>
                    <td className="profile-label">Address</td>
                    <td>{profile?.address || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-primary" onClick={startEdit}>✏️ Edit</button>
            </div>
          </>
        ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@school.com" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input name="address" value={form.address} onChange={handleChange} placeholder="City / Address" />
            </div>
          </div>
          <p className="profile-note">🔒 Username and password cannot be changed here — contact admin for that.</p>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
      </div>
    </div>
  );
};

export default StudentProfileForm;