# 📝 Task Manager App

A full-stack task management application built with React, Node.js, Express, and PostgreSQL. Users can register, log in, and manage their personal tasks with full CRUD functionality, filtering, priority levels, due dates, and dark mode support.

## 🚀 Live Demo

[https://task-manager-delta-sand.vercel.app](https://task-manager-delta-sand.vercel.app)

---

## 🛠️ Tech Stack

### Frontend
- **React 19** — UI library
- **Vite** — build tool and dev server
- **Tailwind CSS v4** — utility-first CSS framework
- **Axios** — HTTP client
- **React Router DOM** — client-side routing

### Backend
- **Node.js** — JavaScript runtime
- **Express 5** — web framework
- **Prisma 7** — ORM for database access
- **PostgreSQL** — relational database
- **JWT (jsonwebtoken)** — authentication tokens
- **bcryptjs** — password hashing

### DevOps
- **Vercel** — frontend deployment
- **Railway** — backend and database hosting
- **Git** — version control with feature branch workflow

---

## ✨ Features

- 🔐 **Authentication** — secure register and login with JWT tokens
- ✅ **Task CRUD** — create, read, update and delete tasks
- 🔄 **Status management** — cycle tasks through Pending → In Progress → Completed
- 🎯 **Priority levels** — assign Low, Medium or High priority to tasks
- 📅 **Due dates** — optional deadline for each task
- 🔍 **Filtering** — filter tasks by status and priority
- 📊 **Dashboard stats** — real-time counters by task status
- 🌙 **Dark mode** — toggle between light and dark themes
- 🔔 **Notifications** — toast notifications for every action
- 🔒 **Protected routes** — authenticated users only

---

## 📁 Project Structure

```
task-manager/
├── client/                   → React frontend
│   └── src/
│       ├── components/       → reusable UI components
│       ├── context/          → global state
│       ├── hooks/            → custom React hooks
│       ├── pages/            → Login, Register, Dashboard
│       └── services/         → API calls (axios instance)
├── server/                   → Node.js backend
│   ├── prisma/               → schema and migrations
│   └── src/
│       ├── controllers/      → business logic
│       ├── middleware/       → JWT authentication
│       └── routes/           → API endpoints
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register a new user | ❌ |
| POST | `/auth/login` | Login and receive JWT token | ❌ |

### Tasks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/tasks` | Get all tasks for authenticated user | ✅ |
| POST | `/tasks` | Create a new task | ✅ |
| PUT | `/tasks/:id` | Update a task | ✅ |
| DELETE | `/tasks/:id` | Delete a task | ✅ |

---

## 🗄️ Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Task {
  id          Int        @id @default(autoincrement())
  title       String
  description String?
  status      TaskStatus @default(PENDING)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?
  userId      Int
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum TaskStatus { PENDING, IN_PROGRESS, COMPLETED }
enum Priority  { LOW, MEDIUM, HIGH }
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone git@github.com:yourusername/task-manager.git
cd task-manager
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager"
JWT_SECRET="your_secret_key"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the backend:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd ../client
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

### 4. Open the app

Navigate to [http://localhost:5173](http://localhost:5173)

---

## 🌍 Deployment

### Backend — Railway
1. Create a new project on [Railway](https://railway.app)
2. Deploy a PostgreSQL database
3. Deploy the backend service pointing to the `server/` directory
4. Set environment variables: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`
5. Run migrations: `railway run npx prisma migrate deploy`

### Frontend — Vercel
1. Import the repository on [Vercel](https://vercel.com)
2. Set root directory to `client/`
3. Set environment variable: `VITE_API_URL` → your Railway backend URL
4. Deploy

---

## 🔐 Security

- Passwords are hashed with **bcrypt** (10 salt rounds) before storing
- Authentication uses **JWT tokens** with 7-day expiration
- All task endpoints verify token validity and ownership before any operation
- Environment variables are never committed to the repository
- CORS is restricted to the frontend URL only

---

## 🗺️ Roadmap

- [ ] Categories and tags for tasks
- [ ] Search functionality
- [ ] Email notifications for due dates
- [ ] Drag and drop task ordering
- [ ] User profile settings

---

## 👤 Author

**José Manuel Coca**
- GitHub: [@JoseCoca98](https://github.com/JoseCoca98)
- LinkedIn: [José Manuel Coca Tudela](https://www.linkedin.com/in/jose-manuel-coca-tudela/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).