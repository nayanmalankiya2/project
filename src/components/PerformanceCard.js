import React from 'react';

// Compute performance index from a student's marks
export const computePerformance = (marks) => {
  if (!marks || marks.length === 0) {
    return {
      totalObtained: 0,
      totalMax: 0,
      percentage: 0,
      subjectsCovered: 0,
      index: 0,
      grade: 'N/A',
    };
  }

  let totalObtained = 0;
  let totalMax = 0;

  marks.forEach((m) => {
    totalObtained += m.marksObtained;
    totalMax += m.maxMarks || 100;
  });

  const percentage = (totalObtained / totalMax) * 100;
  const subjectsCovered = marks.length;

  // Performance Index: normalized 0-10 scale based on percentage
  const index = Number(((percentage / 10) * 1).toFixed(2));

  let grade;
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B+';
  else if (percentage >= 60) grade = 'B';
  else if (percentage >= 50) grade = 'C';
  else if (percentage >= 40) grade = 'D';
  else grade = 'F';

  return {
    totalObtained,
    totalMax,
    percentage: percentage.toFixed(2),
    subjectsCovered,
    index: (index * 10).toFixed(1),
    grade,
  };
};

const PerformanceCard = ({ student, marks, compact }) => {
  const perf = computePerformance(marks);

  const indexValue = parseFloat(perf.index) || 0;
  const ringColor = indexValue >= 8 ? '#22c55e' : indexValue >= 6 ? '#f59e0b' : '#ef4444';

  return (
    <div className="performance-card">
      <div className="perf-header">
        <div className="perf-ring" style={{ background: `conic-gradient(${ringColor} ${indexValue * 36}deg, #e5e7eb 0deg)` }}>
          <div className="perf-ring-inner">
            <span className="perf-index">{perf.index}</span>
            <span className="perf-index-label">/ 10</span>
          </div>
        </div>
        <div className="perf-details">
          <h3>{student?.name || 'Student'}</h3>
          {!compact && (
            <>
              <span className="perf-roll">Roll: {student?.rollNumber} | {student?.className}</span>
              <span className={`badge ${perf.grade === 'N/A' ? 'badge-neutral' : 'badge-grade'}`}>Grade: {perf.grade}</span>
            </>
          )}
          {compact && <span className={`badge ${perf.grade === 'N/A' ? 'badge-neutral' : 'badge-grade'}`}>{perf.grade}</span>}
        </div>
      </div>
      {!compact && (
        <div className="perf-stats">
          <div className="perf-stat">
            <span className="perf-stat-value">{perf.percentage}%</span>
            <span className="perf-stat-label">Percentage</span>
          </div>
          <div className="perf-stat">
            <span className="perf-stat-value">{perf.subjectsCovered}</span>
            <span className="perf-stat-label">Subjects</span>
          </div>
          <div className="perf-stat">
            <span className="perf-stat-value">{perf.totalObtained}/{perf.totalMax}</span>
            <span className="perf-stat-label">Total Marks</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceCard;
