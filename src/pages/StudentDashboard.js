import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PerformanceCard, { computePerformance } from '../components/PerformanceCard';
import * as api from '../api';
import { useAuth } from '../auth/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [student, setStudent] = useState(null);
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

  const perf = computePerformance(marks);
  const subjectPass = (subId) => {
    const m = marks.find((x) => x.subject?._id === subId);
    return m ? m.marksObtained : null;
  };

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
            </div>
            <PerformanceCard student={student} marks={marks} />
          </div>

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
