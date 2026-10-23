# PageTurn Books – Online Bookstore

**U21CSP12 JavaScript Frameworks – Assignment II – Q2 (Task 1) (MERN stack, 16 marks, CO5)**  
Student: Sathya R V (24CS192)

## Task

Design an online bookstore application: display books using React components, store book title, author, price and availability in MongoDB, create APIs to retrieve and manage books, implement search by book title or author.

## Features

- Books displayed as reusable React components (BookList → BookCard) with a drawn cover
- Search by Title, by Author, or both (switch), done on the server with MongoDB regex
- Genre chips, "In stock only" filter and price / title sorting
- Manage Books screen: add, edit, delete and one-click availability toggle
- Header shows total titles, in-stock and sold-out counts

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite) |
| Backend | Node.js + Express.js (REST API) |
| Database | MongoDB with Mongoose (database `sathya_pageturn`) |

## How to run

> Prerequisite: Node.js and MongoDB installed (see the main README one folder up).

1. Open **two terminals**.
2. Terminal 1 – start the API:

```bash
cd backend
npm install
npm start
```

   You should see `MongoDB connected` and the API on **http://localhost:5002**. Sample data is inserted automatically on the first run.
3. Terminal 2 – start the UI:

```bash
cd frontend
npm install
npm run dev
```

4. Open **http://localhost:5174** in the browser.
5. (Optional) Reset the sample data: inside `backend` run `npm run seed`.

## REST API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/books` | List / search books (query: q, searchBy=title|author|all, genre, available, sort) |
| GET | `/api/books/:id` | Get one book |
| POST | `/api/books` | Add a book |
| PUT | `/api/books/:id` | Edit a book |
| PATCH | `/api/books/:id/availability` | Toggle In stock / Out of stock |
| DELETE | `/api/books/:id` | Delete a book |
| GET | `/api/books/meta/summary` | Totals for the header + genre list |

## Folder structure

- `backend/` – server.js, config/db.js, models/Book.js, controllers/bookController.js, routes/bookRoutes.js, seed.js
- `frontend/` – src/App.jsx, services/bookService.js, components/SearchBar.jsx, BookList.jsx, BookCard.jsx, ManageBooks.jsx, BookForm.jsx
