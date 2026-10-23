# EnrollEase – Course Registration (MEAN)

**U21CSP12 JavaScript Frameworks – Assignment II – Q3 (Task 1) (MEAN stack, 16 marks, CO4)**  
Student: Sathya R V (24CS192)

## Task

Create a course registration application for college students: display available courses using Angular, implement course registration and cancellation, store course and student details in MongoDB, validate user inputs using Angular forms.

## Features

- Angular course cards with category filter, search and live seat bar
- Reactive form validation: custom roll-number validator, name pattern, email, year, confirmation checkbox
- Register several courses at once; server checks seat capacity, duplicates and a 24-credit limit
- "My Registrations" lookup by roll number with Cancel (status kept as Cancelled for history)
- Manage Courses screen with a validated form to add courses

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Angular 20 (standalone components, Reactive Forms, signals) |
| Backend | Node.js + Express.js (REST API) |
| Database | MongoDB with Mongoose (database `sathya_enrollease`) |

## How to run

> Prerequisite: Node.js and MongoDB installed (see the main README one folder up).

1. Open **two terminals**.
2. Terminal 1 – start the API:

```bash
cd backend
npm install
npm start
```

   You should see `MongoDB connected` and the API on **http://localhost:5003**. Sample data is inserted automatically on the first run.
3. Terminal 2 – start the UI:

```bash
cd frontend
npm install
npm start
```

4. Open **http://localhost:4200** in the browser.
5. (Optional) Reset the sample data: inside `backend` run `npm run seed`.

## REST API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/courses` | Courses with enrolled count and seats left |
| POST | `/api/courses` | Add a course (admin) |
| DELETE | `/api/courses/:id` | Delete a course (only if nobody registered) |
| POST | `/api/registrations` | Register a student for selected courses |
| GET | `/api/registrations/student/:rollNo` | A student's registrations + total credits |
| PATCH | `/api/registrations/:id/cancel` | Cancel a registration |
| GET | `/api/registrations` | All registrations (admin) |

## Folder structure

- `backend/` – server.js, config/db.js, models/Course.js, models/Student.js, models/Registration.js, controllers/*, routes/*
- `frontend/` – app.ts, services/course.service.ts, services/registration.service.ts, components/course-list, register-form, my-registrations, add-course
