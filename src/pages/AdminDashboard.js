import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StudentsManager from '../components/StudentsManager';
import UsersManager from '../components/UsersManager';
import SubjectsManager from '../components/SubjectsManager';
import MarksManager from '../components/MarksManager';
import * as api from '../api';

const AdminDashboard = () => {
  const [tab, setTab] = useState('students');
  const [stats, setStats] = useState({ students: 0, users: 0, subjects: 0, marks: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [u, s, sub, m] = await Promise.all([
          api.getUsers(),
          api.getStudents(),
          api.getSubjects(),
          api.getMarks(),
        ]);
        setStats({ users: u.data.length, students: s.data.length, subjects: sub.data.length, marks: m.data.length });
      } catch (err) {
        // ignore
      }
    };
    loadStats();
  }, [tab]);

  const tabs = [
    { id: 'students', label: '👨‍🎓 Students', component: <StudentsManager canEdit={false} /> },
    { id: 'users', label: '👤 Users', component: <UsersManager /> },
    { id: 'subjects', label: '📚 Subjects', component: <SubjectsManager canEdit /> },
    { id: 'marks', label: '📝 Marks', component: <MarksManager canEdit={false} /> },
  ];

  return (
    <div className="dashboard">
      <Navbar title="Admin Dashboard - Full Control" />
      <div className="stats-row">
        <div className="stat-card"><span className="stat-icon">👨‍🎓</span><div><h3>{stats.students}</h3><p>Students</p></div></div>
        <div className="stat-card"><span className="stat-icon">👤</span><div><h3>{stats.users}</h3><p>Users</p></div></div>
        <div className="stat-card"><span className="stat-icon">📚</span><div><h3>{stats.subjects}</h3><p>Subjects</p></div></div>
        <div className="stat-card"><span className="stat-icon">📝</span><div><h3>{stats.marks}</h3><p>Marks Entries</p></div></div>
      </div>
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

export default AdminDashboard;
