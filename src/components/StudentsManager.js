import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../api';
import StudentForm from './StudentForm';
import { computePerformance } from './PerformanceCard';

const StudentsManager = ({ canEdit = true }) => {
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [stuRes, markRes] = await Promise.all([api.getStudents(), api.getMarks()]);
      setStudents(stuRes.data);
      setMarks(markRes.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getStudentMarks = (studentId) => marks.filter((m) => m.student?._id === studentId);

  const handleAdd = async (formData) => {
    try {
      await api.createStudent(formData);
      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student');
    }
  };

  const handleEdit = async (formData) => {
    try {
      await api.updateStudent(editing._id, formData);
      setShowForm(false);
      setEditing(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update student');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.deleteStudent(id);
        loadData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete student');
      }
    }
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.className.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>👨‍🎓 Students Management</h2>
        {canEdit && (
          <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
            + Add Student
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="search-bar">
        <input
          placeholder="🔍 Search by name, roll number or class..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Class</th>
                <th>Contact</th>
                <th>Performance</th>
                {canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={canEdit ? 6 : 5} className="empty-cell">No students found</td>
                </tr>
              )}
              {filtered.map((s) => {
                const perf = computePerformance(getStudentMarks(s._id));
                return (
                  <tr key={s._id}>
                    <td>
                      <div className="student-cell">
                        <span className="student-avatar">{s.name.charAt(0)}</span>
                        <div>
                          <span className="student-name">{s.name}</span>
                          <span className="student-email">{s.email || '—'}</span>
                        </div>
                      </div>
                    </td>
                    <td>{s.rollNumber}</td>
                    <td>{s.className}</td>
                    <td>{s.phone || '—'}</td>
                    <td>
                      <span className="perf-pill">
                        <span className="perf-pill-index">{perf.index}</span>/10
                        <span className="perf-pill-grade">{perf.grade}</span>
                      </span>
                    </td>
                    {canEdit && (
                      <td className="actions-cell">
                        <button className="btn-icon" title="Edit" onClick={() => { setEditing(s); setShowForm(true); }}>
                          ✏️
                        </button>
                        <button className="btn-icon btn-danger" title="Delete" onClick={() => handleDelete(s._id)}>
                          🗑️
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <StudentForm
          initialData={editing}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          onSubmit={editing ? handleEdit : handleAdd}
        />
      )}
    </div>
  );
};

export default StudentsManager;
