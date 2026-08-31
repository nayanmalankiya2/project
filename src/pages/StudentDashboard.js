import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PerformanceCard from '../components/PerformanceCard';
import * as api from '../api';
import { useAuth } from '../auth/AuthContext';
import StudentProfileForm from '../components/StudentProfileForm';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [student, setStudent] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const load = async () => {
      try {
        const [markRes, subRes, profileRes] = await Promise.all([
          api.getMarks(),
          api.getSubjects(),
          api.getMyStudentProfile(),
        ]);
        setMarks(markRes.data);
        setSubjects(subRes.data);
        const profile = profileRes.data;
        setStudent({
          name: profile.name || user.name,
          rollNumber: profile.rollNumber || '—',
          className: profile.className || '—',
          email: profile.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
        });
      } catch (err) {
        // fallback to basic info if profile fetch fails
        setStudent({ name: user.name, rollNumber: '—', className: '—' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  return (
    <div className="dashboard">
      <Navbar title="Student Dashboard - View Only" />
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="student-hero">
            <div className="student-hero-info">
              <h2>Welcome, {user.name} 👋</h2>
              <p>Your academic performance index and marks</p>
              <button className="btn btn-primary btn-hero" onClick={() => setShowProfile(true)}>
                👤 View Profile
              </button>
            </div>
            <PerformanceCard student={student} marks={marks} />
          </div>

          {showProfile && (
            <StudentProfileForm
              profile={student}
              onSaved={(updated) => setStudent((prev) => ({ ...prev, ...updated }))}
              onClose={() => setShowProfile(false)}
            />
          )}

          <div className="panel">
            <div className="panel-header"><h2>📋 Subject-wise Marks</h2></div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Code</th>
                    <th>Marks Obtained</th>
                    <th>Max Marks</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((sub) => {
                    const m = marks.find((x) => x.subject?._id === sub._id);
                    return (
                      <tr key={sub._id}>
                        <td><strong>{sub.name}</strong></td>
                        <td><span className="badge badge-neutral">{sub.code}</span></td>
                        <td className={m && m.marksObtained < 40 ? 'mark-fail' : ''}>{m ? m.marksObtained : '—'}</td>
                        <td>{sub.maxMarks}</td>
                        <td>
                          {m ? (
                            <span className={`badge ${m.marksObtained >= 40 ? 'badge-pass' : 'badge-fail'}`}>
                              {m.marksObtained >= 40 ? 'Passed' : 'Failed'}
                            </span>
                          ) : (
                            <span className="badge badge-neutral">Not available</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
