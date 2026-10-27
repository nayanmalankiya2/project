import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../api';
import { useAuth } from '../auth/AuthContext';

const UsersManager = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', role: 'student' });

  const roleLabels = { admin: 'Admin', faculty: 'Faculty', student: 'Student' };

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getUsers();
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ name: '', username: '', email: '', password: '', role: 'student' });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.updateUser(editing._id, form);
      } else {
        await api.createUser(form);
      }
      resetForm();
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUser(id);
        loadUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) ||  
           u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>👤 Users Management</h2>
        <div className="search-bar">
          <input
            placeholder="🔍 Search by name or username..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          + Add User
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="inline-form card">
          <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email (optional)" value={form.email} onChange={handleChange} />
          <input name="password" type="text" placeholder={editing ? 'New password (optional)' : 'Password'} value={form.password} onChange={handleChange} required={!editing} />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="admin">Admin</option>
            <option value="faculty">Faculty</option>
            <option value="student">Student</option>
          </select>
          <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'} User</button>
          <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="student-cell">
                      <span className="student-avatar">{u.name.charAt(0)}</span>
                      <span className="student-name">{u.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-neutral">{u.username}</span></td>
                  <td><span className={`badge badge-role-${u.role}`}>{roleLabels[u.role]}</span></td>
                  <td className="actions-cell">
                    {u._id !== currentUser?._id && (
                      <>
                        <button className="btn-icon" title="Edit"
                      onClick={() => { setEditing(u); setForm({ name: u.name, username: u.username, email: u.email, password: '', role: u.role }); setShowForm(true); }}>
                          ✏️
                        </button>
                        <button className="btn-icon btn-danger" title="Delete" onClick={() => handleDelete(u._id)}>
                          🗑️
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersManager;
