# Student Academic Performance Index (SAPI)

A full-stack **Student Academic Performance Index** application with role-based access:
- **Admin** – Full control (students, faculty, subjects, marks – all CRUD)
- **Faculty** – Student control only (add/edit/delete students)
- **Student** – View only (profile, marks, performance index)

Built with **React (frontend)** + **Node.js/Express/MongoDB (backend)**.

---

## 📋 Requirements (first time only)
1. **Node.js** installed (v16+)
2. **MongoDB** installed and running locally
   - Default: `mongodb://127.0.0.1:27017`
   - Or set `MONGO_URI` in the environment / `.env`

---

## 🚀 How to Run the App

### Open a terminal in the project folder (`d:/node/project`)

### Step 1 – Install dependencies (only the first time)
```bash
npm install
```

### Step 2 – Start both servers (backend + frontend) with ONE command
```bash
npm run dev
```

This runs:
- **Backend** on `http://localhost:5000`
- **Frontend** on `http://localhost:3000`

### Step 3 – Open the app
Go to **http://localhost:3000** in your browser.

---

## 🔑 Demo Login Credentials

| Role     | Username | Password      |
|----------|----------|---------------|
| Admin    | `admin`  | `admin123`    |
| Faculty  | `faculty`| `faculty123`  |
| Student  | `student`| `student123`  |

---

## 🗄️ Database (MongoDB)

If you want to **reset / re-seed** the database with fresh demo data:
```bash
npm run seed
```

---

## 🛠️ Other Scripts

| Command          | What it does                                  |
|------------------|-----------------------------------------------|
| `npm run dev`    | Run backend + frontend together (recommended) |
| `npm run server` | Run only the backend (port 5000)              |
| `npm start`      | Run only the frontend (port 3000)             |
| `npm run seed`   | Reset & re-seed the database                  |

---

## 📁 Project Structure
```
server/
  config/db.js        # MongoDB connection
  models/             # User, Student, Subject, Mark schemas
  routes/             # auth, user, student, subject, mark APIs
  middleware/         # JWT auth & role authorization
  seed.js             # Demo data seeder
src/
  api/                # API client (calls backend)
  auth/               # Auth context (login/logout/session)
  components/         # UI components
  pages/              # Login, Admin, Faculty, Student dashboards
  App.js              # Routing & auth guards
