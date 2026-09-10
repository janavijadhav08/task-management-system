# TaskFlow — Task Management System

A full-stack task management web application built with **React**, **Node.js**, **Express**, and **MongoDB**.

---

## Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Register Page
![Register Page](screenshots/register.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Create Task
![Create Task](screenshots/create-task.png)

### Task List
![Task List](screenshots/task-list.png)

---

## Features

- User Registration & Login with JWT Authentication
- Create, Read, Update, Delete Tasks
- Task status management — To Do / In Progress / Completed
- Task priority levels — Low / Medium / High
- Search and filter tasks
- Live progress ring showing completion percentage
- Stats overview — total, completed, in-progress, to-do
- Responsive design — works on mobile and desktop
- Data persists in MongoDB

---

## Tech Stack

| Layer     | Technology              |
|-----------|------------------------|
| Frontend  | React 19, Vite, CSS    |
| Backend   | Node.js, Express 5     |
| Database  | MongoDB, Mongoose      |
| Auth      | JWT, bcryptjs          |

---

## Project Structure

```
task-management-system/
├── backend/                  # Node.js + Express API
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js # Register & Login logic
│   │   └── taskController.js # CRUD task logic
│   ├── middleware/
│   │   └── authMiddleware.js # JWT protect middleware
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── Task.js           # Task schema
│   ├── routes/
│   │   ├── authRoutes.js     # /api/auth routes
│   │   └── taskRoutes.js     # /api/tasks routes
│   ├── .env                  # Backend environment variables
│   ├── package.json
│   └── server.js             # Express app entry point
│
├── src/                      # React frontend
│   ├── App.jsx               # Main app (Auth + Dashboard)
│   ├── App.css               # All styles
│   ├── index.css             # Base reset
│   └── main.jsx              # React entry point
│
├── public/
├── index.html
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB running locally

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/task-management-system.git
cd task-management-system
```

**2. Install backend dependencies**
```bash
cd backend
npm install
```

**3. Install frontend dependencies**
```bash
cd ..
npm install
```

**4. Set up environment variables**

`backend/.env` already contains:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task_management
JWT_SECRET=taskflow_secret_key_2026
```

### Running the App

**Terminal 1 — Backend**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend**
```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## API Endpoints

### Auth
| Method | Endpoint             | Description       |
|--------|---------------------|-------------------|
| POST   | /api/auth/register  | Register new user |
| POST   | /api/auth/login     | Login user        |

### Tasks (Protected — requires JWT)
| Method | Endpoint          | Description       |
|--------|------------------|-------------------|
| GET    | /api/tasks        | Get all tasks     |
| POST   | /api/tasks        | Create task       |
| PUT    | /api/tasks/:id    | Update task       |
| DELETE | /api/tasks/:id    | Delete task       |

---

## Author

**Janavi Jadhav**

---

## License

MIT
