import React, { useState } from 'react';

const initialForm = {
  name: '',
  enrolmentNumber: '',
  className: '',
  email: '',
  phone: '',
  address: '',
  username: '',
  password: '',
};

// Validation helpers
// Only keep the clean editable fields (strip out Mongoose-only fields)
const sanitize = (data) => {
  if (!data) return initialForm;
  return {
    name: data.name || '',
    enrolmentNumber: data.enrolmentNumber || '',
    className: data.className || '',
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    username: (data.user && data.user.username) || data.username || '',
    password: '',
  };
};

// Form state

const divisions = ['DIVISION-A', 'DIVISION-B', 'DIVISION-C', 'DIVISION-D', 'DIVISION-E'];
const isValidName = (name) => /^[A-Za-z\s]+$/.test(name);
const isValidEnrolment = (enrolment) => /^\d{5}$/.test(enrolment);
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^\d{10}$/.test(phone);

const StudentForm = ({ onSubmit, onCancel, initialData }) => {
  const [form, setForm] = useState(sanitize(initialData));
  const [error, setError] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDivisionChange = (e) => {
    setSelectedDivision(e.target.value);
    setForm({ ...form, className: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate name: only characters
    if (!form.name || !isValidName(form.name)) {
      setError('Full name must contain only characters');
      return;
    }

    // Validate enrolment number: exactly 5 digits
    if (!form.enrolmentNumber || !isValidEnrolment(form.enrolmentNumber)) {
      setError('Enrolment number must be exactly 5 digits');
      return;
    }

    // Validate class/division selection
    if (!selectedDivision) {
      setError('Please select a class division');
      return;
    }

    // Validate email
    if (!isValidEmail(form.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate phone: exactly 10 digits
    if (!form.phone || !isValidPhone(form.phone)) {
      setError('Phone number must be exactly 10 digits');
      return;
    }

    setError('');
    // Send only clean fields
    const payload = {
      name: form.name,
      enrolmentNumber: form.enrolmentNumber,
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
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Student name"
                pattern="[A-Za-z\s]+"
                title="Only characters allowed"
              />
            </div>
            <div className="form-group">
              <label>Enrolment Number *</label>
              <input
                name="enrolmentNumber"
                value={form.enrolmentNumber}
                onChange={handleChange}
                placeholder="e.g. S10111"
                pattern="\d{5}"
                title="Exactly 5 digits"
              />
            </div>
            <div className="form-group">
              <label>Class *</label>
              <select
                name="className"
                value={form.className}
                onChange={handleDivisionChange}
              >
                <option value="" disabled>
                  Select Division
                </option>
                {divisions.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="student@school.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                pattern="\d{10}"
                title="Exactly 10 digits"
                required
              />
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
