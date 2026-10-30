const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Student = require('./models/Student');
const Subject = require('./models/Subject');
const Mark = require('./models/Mark');

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await Promise.all([
    User.deleteMany(),
    Student.deleteMany(),
    Subject.deleteMany(),
    Mark.deleteMany(),
  ]);

  console.log('Existing data cleared');

  // Create users
  const salt = await bcrypt.genSalt(10);
  const admin = await User.create({
    name: 'Admin User',
    username: 'admin',
    email: 'admin@test.com',
    password: await bcrypt.hash('admin123', 10),
    role: 'admin',
  });
  const faculty = await User.create({
    name: 'Dr. Patel',
    username: 'faculty',
    email: 'faculty@test.com',
    password: await bcrypt.hash('faculty123', 10),
    role: 'faculty',
  });
  const studentUser = await User.create({
    name: 'Aarav Sharma',
    username: 'student',
    email: 'student@test.com',
    password: await bcrypt.hash('student123', 10),
    role: 'student',
  });

  // Create students
  const students = await Student.create([
    { name: 'Aarav Sharma', enrolmentNumber: '10101', className: '10-A', email: 'aarav@school.com', phone: '9876543210', address: 'Ahmedabad', user: studentUser._id },
    { name: 'Priya Patel', enrolmentNumber: '10102', className: '10-A', email: 'priya@school.com', phone: '9876543211', address: 'Gandhinagar' },
    { name: 'Rohan Mehta', enrolmentNumber: '10103', className: '10-B', email: 'rohan@school.com', phone: '9876543212', address: 'Surat' },
    { name: 'Sneha Desai', enrolmentNumber: '10104', className: '10-B', email: 'sneha@school.com', phone: '9876543213', address: 'Vadodara' },
  ]);

  // Create subjects
  const subjects = await Subject.create([
    { name: 'Mathematics', code: 'MAT', maxMarks: 100 },
    { name: 'Science', code: 'SCI', maxMarks: 100 },
    { name: 'English', code: 'ENG', maxMarks: 100 },
    { name: 'Computer', code: 'CS', maxMarks: 100 },
  ]);

  // Create marks
  const sampleMarks = [
    { student: 0, marks: [92, 88, 85, 95] },
    { student: 1, marks: [78, 82, 90, 74] },
    { student: 2, marks: [65, 70, 72, 68] },
    { student: 3, marks: [88, 91, 84, 89] },
  ];

  for (const sm of sampleMarks) {
    const student = students[sm.student];
    for (let i = 0; i < subjects.length; i++) {
      await Mark.create({
        student: student._id,
        subject: subjects[i]._id,
        marksObtained: sm.marks[i],
        maxMarks: subjects[i].maxMarks,
        term: 'Term 1',
        date: new Date(),
      });
    }
  }

  console.log('Demo data seeded successfully!');
  console.log('--------------------------------');
  console.log('Admin:   username=admin / admin123');
  console.log('Faculty: username=faculty / faculty123');
  console.log('Student: username=student / student123');
  console.log('--------------------------------');

  process.exit(0);
};

seedData().catch((err) => {
  console.error(err);
  process.exit(1);
});
