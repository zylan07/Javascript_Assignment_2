# U21CSP12 JavaScript Frameworks – Assignment II

**Name:** Sathya R V  
**Roll No:** 24CS192  
**Class:** III Year / V Semester – B.E. CSE, KPR Institute of Engineering and Technology  
**Academic Year:** 2026–2027

## Projects in this folder

| Question | Project | Stack | Backend port | Frontend URL |
|---|---|---|---|---|
| Q1 (8 marks) | [EduRoster – Student Management System](./Q1_EduRoster_Student_Management) | MERN | 5001 | http://localhost:5173 |
| Q2 (Task 1) (16 marks) | [PageTurn Books – Online Bookstore](./Q2_PageTurn_Online_Bookstore) | MERN | 5002 | http://localhost:5174 |
| Q3 (Task 1) (16 marks) | [EnrollEase – Course Registration (MEAN)](./Q3_EnrollEase_Course_Registration_MEAN) | MEAN | 5003 | http://localhost:4200 |

Every project has its own README with features, API list and run steps. The short report (7 pages) with screenshots is
`Sathya_R_V_JS_2_Report.docx` (also as PDF).

## Step 1 – Install the software (one time)

1. Install **Node.js 20 LTS or 22 LTS** from https://nodejs.org (tick "Add to PATH"). Check: `node -v` and `npm -v`.
2. Install **MongoDB Community Server** from https://www.mongodb.com/try/download/community
   - Choose your OS → `msi` (Windows) → Next → **Complete** → keep **"Install MongoD as a Service"** ticked.
   - Keep **"Install MongoDB Compass"** ticked (a GUI to see your data).
3. MongoDB now runs automatically in the background at `mongodb://127.0.0.1:27017`. Nothing else to configure.
4. (Optional) Open **MongoDB Compass** → click **Connect** → after you run a project you will see its database (e.g. `sathya_eduroster`) with the records.

> **No MongoDB installed?** Every backend still starts: if it cannot reach MongoDB it automatically starts a temporary
> in-memory MongoDB (first start downloads it, ~1 minute). Data is then lost when the server stops, so for the demo/viva
> installing MongoDB (step 2) is recommended.

> **Using MongoDB Atlas (cloud) instead?** In a project's backend folder copy `.env.example` to `.env` and replace
> `MONGO_URI` with your Atlas connection string.

## Step 2 – Run a project

1. Open the project folder (for example `Q1_EduRoster_Student_Management`).
2. Terminal 1: `cd backend` → `npm install` → `npm start` (API).
3. Terminal 2: `cd frontend` → `npm install` → `npm run dev` (UI).
4. Open the frontend URL from the table above.
5. All six ports are different, so all three projects can run at the same time.

### Common problems

1. **`npm` not recognised** → reinstall Node.js with "Add to PATH" and reopen the terminal.
2. **UI shows "Server not reachable" / empty list** → the backend terminal is not running; start it first.
3. **Port already in use** → close the old terminal running that project, or change `PORT` in `.env`.
4. **Angular asks about analytics** → it is turned off in `angular.json`; if asked, type `N`.

## Upload to GitHub

1. Sign in at https://github.com → **New repository** → name it `U21CSP12-Assignment2-24CS192` → Public → **Create repository** (do NOT add a README).
2. Install Git from https://git-scm.com if `git --version` does not work.
3. Open a terminal **inside this `Sathya_R_V_JS_2` folder** and run:

```bash
git init
git add .
git commit -m "U21CSP12 Assignment II - Sathya R V (24CS192)"
git branch -M main
git remote add origin https://github.com/<your-username>/U21CSP12-Assignment2-24CS192.git
git push -u origin main
```

4. `node_modules` is excluded by `.gitignore`, so the upload is small. Submit the repository link.
