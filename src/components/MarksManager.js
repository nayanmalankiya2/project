import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../api';
import MarksForm from './MarksForm';

const MarksManager = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [stu, sub, mark] = await Promise.all([api.getStudents(), api.getSubjects(), api.getMarks()]);
      setStudents(stu.data);
      setSubjects(sub.data);
      setMarks(mark.data);
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

  const studentMarks = (studentId) => marks.filter((m) => m.student?._id === studentId);
  const studentHasMarks = (studentId) => studentMarks(studentId).length > 0;

  const openForm = (student) => {
    setSelectedStudent(student);
    setShowForm(true);
  };

  const handleSubmit = async (values) => {
    try {
      const student = selectedStudent;
      const existing = studentMarks(student._id);

      // For each subject, create or update the mark
      const ops = subjects.map(async (sub) => {
        const value = values[sub._id];
        if (value === '' || value === undefined) {
          return; // empty = leave as-is
        }
        const existingMark = existing.find((m) => m.subject?._id === sub._id);
        const payload = {
          student: student._id,
          subject: sub._id,
          marksObtained: Number(value),
          maxMarks: sub.maxMarks || 100,
          term: 'Term 1',
          date: new Date(),
        };
        if (existingMark) {
          await api.updateMark(existingMark._id, { marksObtained: Number(value) });
        } else {
          await api.createMark(payload);
        }
      });
      await Promise.all(ops);

      setShowForm(false);
      setSelectedStudent(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save marks');
    }
  };

  const handleDeleteMark = async (markId) => {
    if (window.confirm('Are you sure you want to delete this mark?')) {
      try {
        await api.deleteMark(markId);
        loadData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete mark');
      }
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>📝 Marks Management</h2>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                {subjects.map((sub) => (
                  <th key={sub._id}>{sub.name} <span className="th-sub">({sub.code})</span></th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && (
                <tr><td colSpan={subjects.length + 2} className="empty-cell">No students found</td></tr>
              )}
              {students.map((student) => (
                <tr key={student._id}>
                  <td>
                    <strong>{student.name}</strong>
                    <span className="student-email">{student.rollNumber}</span>
                  </td>
                  {subjects.map((sub) => {
                    const existing = studentMarks(student._id).find((m) => m.subject?._id === sub._id);
                    return (
                      <td key={sub._id}>
                        {existing ? (
                          <div className="mark-cell">
                            <span className={`mark-score ${existing.marksObtained >= 40 ? 'mark-pass' : 'mark-fail'}`}>
                              {existing.marksObtained}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="actions-cell">
                    <button
                      className="btn-icon"
                      title="Edit Marks"
                      onClick={() => openForm(student)}
                    >
                      ✏️
                    </button>
                    {studentHasMarks(student._id) && (
                      <button
                        className="btn-icon btn-danger"
                        title="Clear all marks"
                        onClick={() => {
                          const all = studentMarks(student._id);
                          if (window.confirm(`Delete all marks for ${student.name}?`)) {
                            all.forEach((m) => handleDeleteMark(m._id));
                          }
                        }}
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && selectedStudent && (
        <MarksForm
          student={selectedStudent}
          subjects={subjects}
          existingMarks={studentMarks(selectedStudent._id)}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setSelectedStudent(null); }}
          isEdit={studentHasMarks(selectedStudent._id)}
        />
      )}
    </div>
  );
};

export default MarksManager;
