import React, { useState } from 'react';

const MarksForm = ({ student, subjects, existingMarks, onSubmit, onCancel, isEdit }) => {
  // Build initial values from existing marks
  const initialValues = {};
  subjects.forEach((sub) => {
    const mark = existingMarks.find((m) => m.subject?._id === sub._id);
    initialValues[sub._id] = mark ? mark.marksObtained : '';
  });

  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState('');

  const handleChange = (subjectId, value) => {
    setValues({ ...values, [subjectId]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate: at least one subject must have a value
    const hasAny = subjects.some((sub) => values[sub._id] !== '');
    if (!hasAny) {
      setError('Please enter marks for at least one subject');
      return;
    }
    setError('');
    onSubmit(values);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{isEdit ? 'Edit Marks' : 'Add Marks'} — {student.name}</h3>
        <p className="modal-sub">
          <span className="badge badge-neutral">{student.rollNumber}</span>
          <span className="badge">{student.className}</span>
        </p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="marks-form-list">
            {subjects.map((sub) => {
              const existing = existingMarks.find((m) => m.subject?._id === sub._id);
              return (
                <div className="marks-form-row" key={sub._id}>
                  <div className="marks-form-label">
                    <strong>{sub.name}</strong>
                    <span className="th-sub">({sub.code})</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={sub.maxMarks || 100}
                    value={values[sub._id]}
                    onChange={(e) => handleChange(sub._id, e.target.value)}
                    placeholder={existing ? `Current: ${existing.marksObtained}` : '—'}
                    className="mark-input"
                  />
                  <span className="marks-form-max">/ {sub.maxMarks || 100}</span>
                </div>
              );
            })}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Update Marks' : 'Save Marks'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarksForm;
