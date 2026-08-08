import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StudentsManager from '../components/StudentsManager';
import SubjectsManager from '../components/SubjectsManager';
import MarksManager from '../components/MarksManager';
import PerformanceCard, { computePerformance } from '../components/PerformanceCard';
import * as api from '../api';

const FacultyDashboard = () => {
  const [tab, setTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [topStudents, setTopStudents] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [stuRes, markRes] = await Promise.all([api.getStudents(), api.getMarks()]);
        setStudents(stuRes.data);
        setMarks(markRes.data);

        const ranked = stuRes.data
          .map((s) => {
            const sm = markRes.data.filter((m) => m.student?._id === s._id);
            const perf = computePerformance(sm);
            return { ...s, perf };
          })
          .sort((a, b) => parseFloat(b.perf.index) - parseFloat(a.perf.index))
          .slice(0, 5);
        setTopStudents(ranked);
      } catch (err) {
        // ignore
      }
    };
    load();
  }, [tab]);

  const tabs = [
    { id: 'students', label: '👨‍🎓 Students', component: <StudentsManager canEdit /> },
    { id: 'marks', label: '📝 Marks', component: <MarksManager canEdit /> },
    { id: 'subjects', label: '📚 Subjects', component: <SubjectsManager canEdit /> },
    { id: 'performance', label: '📊 Performance Index', component: <PerformanceView students={students} marks={marks} /> },
  ];

  return (
    <div className="dashboard">
      <Navbar title="Faculty Dashboard - Student Control" />
      <div className="stats-row">
        <div className="stat-card"><span className="stat-icon">👨‍🎓</span><div><h3>{students.length}</h3><p>Students</p></div></div>
        <div className="stat-card"><span className="stat-icon">🏆</span><div><h3>{topStudents.length}</h3><p>Top Performers</p></div></div>
      </div>
      {topStudents.length > 0 && (
        <div className="top-performers">
          <h3>🏆 Top Performers</h3>
          <div className="top-list">
            {topStudents.map((s, i) => (
              <div className="top-item" key={s._id}>
                <span className="top-rank">{i + 1}</span>
                <span className="top-name">{s.name}</span>
                <span className="top-index">{s.perf.index} / 10</span>
                <span className={`badge ${s.perf.grade === 'N/A' ? 'badge-neutral' : 'badge-grade'}`}>{s.perf.grade}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="tabs">
        {tabs.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="tab-content">{tabs.find((t) => t.id === tab).component}</div>
    </div>
  );
};

const PerformanceView = ({ students, marks }) => (
  <div className="panel">
    <div className="panel-header"><h2>📊 Student Performance Index</h2></div>
    <div className="perf-grid">
      {students.map((s) => {
        const sm = marks.filter((m) => m.student?._id === s._id);
        return <PerformanceCard key={s._id} student={s} marks={sm} />;
      })}
    </div>
  </div>
);

export default FacultyDashboard;
