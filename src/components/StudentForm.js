import React, { useState } from 'react';

const initialForm = {
  name: '',
  rollNumber: '',
  className: '',
  email: '',
  phone: '',
  address: '',
  username: '',
  password: '',
};

// Only keep the clean editable fields (strip out Mongoose-only fields)
const sanitize = (data) => {
  if (!data) return initialForm;
  return {
    name: data.name || '',
    rollNumber: data.rollNumber || '',
    className: data.className || '',
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    username: (data.user && data.user.username) || data.username || '',
    password: '',
  };
};

const StudentForm = ({ onSubmit, onCancel, initialData }) => {
  const [form, setForm] = useState(sanitize(initialData));
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.rollNumber || !form.className) {
      setError('Name, Roll Number and Class are required');
      return;
    }
    setError('');
    // Send only clean fields
    const payload = {
      name: form.name,
      rollNumber: form.rollNumber,
      className: form.className,
      email: form.email || null,
      phone: form.phone,
      address: form.address,
      username: form.username,
      password: form.password || undefined,
    };
    onSubmit(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{initialData ? 'Edit Student' : 'Add New Student'}</h3>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Student name" />
            </div>
            <div className="form-group">
              <label>Roll Number *</label>
              <input name="rollNumber" value={form.rollNumber} onChange={handleChange} placeholder="e.g. S101" />
            </div>
            <div className="form-group">
              <label>Class *</label>
              <input name="className" value={form.className} onChange={handleChange} placeholder="e.g. 10-A" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="student@school.com" />
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
          <div className="form-grid">
            <div className="form-group">
              <label>Username {!initialData && '*'}</label>
              <input name="username" value={form.username} onChange={handleChange} placeholder="Login username" required={!initialData} />
            </div>
            <div className="form-group">
              <label>Password {!initialData && '*'}</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder={initialData ? 'New password (optional)' : 'Login password'} required={!initialData} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Update' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
