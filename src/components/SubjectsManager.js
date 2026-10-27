import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../api';

const SubjectsManager = ({ canEdit = true, canAddSubject = true }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', maxMarks: 100 });
  const [search, setSearch] = useState('');

  const loadSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getSubjects();
      setSubjects(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load subjects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filtered = subjects.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || 
           s.code.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({ name: '', code: '', maxMarks: 100 });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.updateSubject(editing._id, form);
      } else {
        await api.createSubject(form);
      }
      resetForm();
      loadSubjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save subject');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await api.deleteSubject(id);
        loadSubjects();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete subject');
      }
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>📚 Subjects Management {!canEdit && <span className="badge badge-neutral">View Only</span>}</h2>
        <div className="search-bar">
          <input
            placeholder="🔍 Search subjects..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        {canAddSubject && (
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
            + Add Subject
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="inline-form card">
          <input name="name" placeholder="Subject name" value={form.name} onChange={handleChange} required />
          <input name="code" placeholder="Code (e.g. MAT)" value={form.code} onChange={handleChange} required />
          <input name="maxMarks" type="number" placeholder="Max marks" value={form.maxMarks} onChange={handleChange} required min="1" />
          <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'} Subject</button>
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
                <th>Subject</th>
                <th>Code</th>
                <th>Max Marks</th>
                {canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id}>
                  <td><strong>{s.name}</strong></td>
                  <td><span className="badge badge-neutral">{s.code}</span></td>
                  <td>{s.maxMarks}</td>
                  {canEdit && (
                    <td className="actions-cell">
                      <button className="btn-icon" title="Edit"
                        onClick={() => { setEditing(s); setForm({ name: s.name, code: s.code, maxMarks: s.maxMarks }); setShowForm(true); }}>
                        ✏️
                      </button>
                      <button className="btn-icon btn-danger" title="Delete" onClick={() => handleDelete(s._id)}>
                        🗑️
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubjectsManager;
