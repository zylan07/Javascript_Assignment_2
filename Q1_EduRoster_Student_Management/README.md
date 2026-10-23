# EduRoster – Student Management System

**U21CSP12 JavaScript Frameworks – Assignment II – Q1 (MERN stack, 8 marks, CO3)**  
Student: Sathya R V (24CS192)

## Task

Develop a Student Management System using MERN Stack: React form to enter student details, REST APIs with Express.js and Node.js, student records stored in MongoDB, add / view / update / delete operations.

## Features

- React form with client-side validation (roll number format, email, phone, CGPA range)
- Full CRUD: Add, View, Edit (form switches to edit mode), Delete with confirmation
- Live search by name / roll number / email, filter by department and year, sort by CGPA / name
- Grade badge (Outstanding / Excellent / Good / Average) and class average CGPA in the header
- Duplicate roll number is blocked on the server (HTTP 409) and shown as a message

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite) |
| Backend | Node.js + Express.js (REST API) |
| Database | MongoDB with Mongoose (database `sathya_eduroster`) |

## How to run

> Prerequisite: Node.js and MongoDB installed (see the main README one folder up).

1. Open **two terminals**.
2. Terminal 1 – start the API:

```bash
cd backend
npm install
npm start
```

   You should see `MongoDB connected` and the API on **http://localhost:5001**. Sample data is inserted automatically on the first run.
3. Terminal 2 – start the UI:

```bash
cd frontend
npm install
npm run dev
```

4. Open **http://localhost:5173** in the browser.
5. (Optional) Reset the sample data: inside `backend` run `npm run seed`.

## REST API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/students` | List students (query: search, department, year, sort) |
| GET | `/api/students/:id` | Get one student |
| POST | `/api/students` | Add a student (409 if roll number exists) |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |
| GET | `/api/students/meta/departments` | Department list for the form |

## Folder structure

- `backend/` – server.js, config/db.js, models/Student.js, controllers/studentController.js, routes/studentRoutes.js, seed.js
- `frontend/` – src/App.jsx, src/api.js, components/StudentForm.jsx, components/StudentTable.jsx, components/FilterBar.jsx
