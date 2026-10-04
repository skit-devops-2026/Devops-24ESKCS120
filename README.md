# TaskFlow — Project Management SaaS

| Roll No.   | Name           | GitHub username   |
|------------|----------------|-------------------|
| 24ESKCS120 | Durgesh Sharma | durgesharma1208   |

---

## What is TaskFlow?

TaskFlow is a premium, full-stack project management SaaS application. It provides a team-focused workspace for managing projects and tasks via a polished, modern UI inspired by Linear and Notion.

---

## Architecture

```
PROJECT-MANAGEMENT-SAAS/
├── backend/               # Node.js + Express 5 + Mongoose API
│   ├── src/
│   │   ├── config/        # MongoDB connection, email transport
│   │   ├── controllers/   # Route handlers (auth, user, workspace, team, project, task)
│   │   ├── middleware/     # auth.js, workspace.js, errorHandler.js
│   │   ├── models/        # Mongoose schemas (User, Workspace, Membership, Invitation, Team, Project, Task, Comment, Activity)
│   │   ├── routes/        # Express routers
│   │   ├── services/      # Business logic (authService.js)
│   │   ├── server.js      # App entry point
│   │   └── seed.js        # Demo data seeder
│   ├── .env               # (git-ignored) local config
│   └── .env.example
│
└── frontend/              # React 19 + Vite 8 + Tailwind CSS
    ├── src/
    │   ├── components/
    │   │   ├── layout/    # AppLayout, Sidebar, TopNav
    │   │   └── ui/        # Alert, Avatar, Badge, Dialog, Form, Spinner
    │   ├── contexts/      # AuthContext, WorkspaceContext
    │   ├── lib/           # api.js (Axios client with token refresh)
    │   └── pages/
    │       ├── auth/      # Login, Register, ForgotPassword, ResetPassword, AcceptInvite
    │       ├── dashboard/ # DashboardPage
    │       ├── projects/  # ProjectsPage, ProjectDetailPage, KanbanBoardPage
    │       ├── tasks/     # MyTasksPage
    │       ├── teams/     # TeamsPage
    │       └── settings/  # SettingsPage (workspace + members + profile)
    ├── .env.example
    └── tailwind.config.js
```

---

## Tech Stack

| Layer     | Technology                                    |
|-----------|-----------------------------------------------|
| Frontend  | React 19, Vite 8, Tailwind CSS 3              |
| Routing   | React Router v7                               |
| State     | TanStack Query v5 (server state)              |
| Forms     | React Hook Form + Zod                         |
| Drag/Drop | @hello-pangea/dnd                             |
| Icons     | Lucide React                                  |
| Backend   | Node.js, Express 5                            |
| Database  | MongoDB + Mongoose 8                          |
| Auth      | JWT (access token 15m + HTTP-only refresh 7d) |
| Email     | Nodemailer (dev: console logging)             |
| Validation| Zod (backend request validation)             |

---

## Prerequisites

- Node.js 18+
- MongoDB 6+ running locally (or MongoDB Atlas URI)

---

## Setup

### 1. Clone / open project

```bash
# Navigate to project root
cd PROJECT-MANAGEMENT-SAAS
```

### 2. Backend setup

```bash
cd backend

# Install dependencies
npm install

# Copy and configure environment variables
copy .env.example .env
# Edit .env — set MONGODB_URI if not using default localhost:27017
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

---

## Running Locally

Open two terminals:

**Terminal 1 — Backend**
```bash
cd backend
npm run dev
# → API running at http://localhost:5000
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
# → App running at http://localhost:5173
```

### Seed demo data (optional)

```bash
cd backend
npm run seed
```

This creates:
- Demo user: `demo@taskflow.dev` / `Demo1234!`
- Workspace: "Acme Corp"
- 2 teams, 3 projects, 12 tasks across Kanban columns

---

## Environment Variables

### Backend (`backend/.env`)

| Variable              | Default                              | Description                              |
|-----------------------|--------------------------------------|------------------------------------------|
| `PORT`                | `5000`                               | API server port                          |
| `MONGODB_URI`         | `mongodb://localhost:27017/taskflow` | MongoDB connection string                |
| `JWT_ACCESS_SECRET`   | (required)                           | Secret for access tokens                 |
| `JWT_REFRESH_SECRET`  | (required)                           | Secret for refresh tokens                |
| `JWT_ACCESS_EXPIRES_IN` | `15m`                              | Access token lifetime                    |
| `JWT_REFRESH_EXPIRES_IN` | `7d`                              | Refresh token lifetime                   |
| `CLIENT_URL`          | `http://localhost:5173`              | Frontend URL (CORS + email links)        |
| `SMTP_HOST`           | (blank)                              | SMTP server — blank = dev console mode   |
| `SMTP_USER`           | (blank)                              | SMTP username                            |
| `SMTP_PASS`           | (blank)                              | SMTP password                            |
| `EMAIL_FROM`          | `noreply@taskflow.dev`               | Sender address                           |

> **Email dev mode:** When SMTP variables are blank, emails are printed to the backend console with the full invitation/reset URL. No real email provider needed for local development.

### Frontend (`frontend/.env`)

| Variable       | Default                      | Description       |
|----------------|------------------------------|-------------------|
| `VITE_API_URL` | `http://localhost:5000/api`  | Backend API URL   |

---

## Features Implemented

### ✅ Authentication & User Management
- Register with auto workspace creation
- Login / logout
- JWT access token (15m) + HTTP-only refresh cookie (7d) rotation
- Protected frontend routes
- Session restoration on page reload
- Forgot password + reset password flow
- Profile editing (name, job title, bio)
- Change password

### ✅ Workspace & Team Management
- Create and switch workspaces
- Workspace sidebar switcher
- Workspace member list
- Invite members by email (token-based, dev console mode)
- Accept invitation flow
- Workspace roles: Owner, Admin, Member
- Create and view teams with member roles (lead/member)

### ✅ Project Management
- Project listing with search and status filters
- Project cards with progress bars, priority, member avatars
- Create project dialog with emoji/color picker
- Project detail page with tabbed overview and activity feed
- Project status (Planned, Active, On Hold, Completed, Archived)
- Archive project action
- Task count breakdown per project

### ✅ Task Management Engine
- Create, read, update, delete tasks
- Task fields: title, description, status, priority, assignee, creator, labels, dates, estimated hours, subtasks
- Task search and filters (status, priority, assignee, label)
- Pagination
- Comment system (add, view)
- Activity feed per task and project
- Permission enforcement: workspace isolation on all endpoints

### ✅ Kanban Board
- 5 columns: Backlog, To Do, In Progress, In Review, Done
- Drag-and-drop via @hello-pangea/dnd
- Optimistic updates with rollback on failure
- Persistent status changes via API
- Inline task creation per column
- Task card: priority, assignee avatar, due date, subtask progress
- Filter by priority
- Task detail slide-in drawer with comments and activity

### ✅ Dashboard
- Greeting with time of day
- Stats: total tasks, in-progress, completed, projects
- My Tasks list (assigned to current user)
- Due soon list (next 7 days)
- Recent projects with progress bars
- Full empty/onboarding state

---

## API Endpoints

```
GET    /api/health

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

GET    /api/users/profile
PATCH  /api/users/profile
POST   /api/users/change-password

GET    /api/workspaces
POST   /api/workspaces
GET    /api/workspaces/:id
PATCH  /api/workspaces/:id
GET    /api/workspaces/:id/members
PATCH  /api/workspaces/:id/members/:memberId
DELETE /api/workspaces/:id/members/:memberId
POST   /api/workspaces/:id/invitations
GET    /api/workspaces/invitations/:token
POST   /api/workspaces/invitations/:token/accept

GET    /api/workspaces/:id/teams
POST   /api/workspaces/:id/teams
GET    /api/workspaces/:id/teams/:teamId
PATCH  /api/workspaces/:id/teams/:teamId
DELETE /api/workspaces/:id/teams/:teamId
POST   /api/workspaces/:id/teams/:teamId/members
DELETE /api/workspaces/:id/teams/:teamId/members/:memberId

GET    /api/workspaces/:id/projects
POST   /api/workspaces/:id/projects
GET    /api/workspaces/:id/projects/:projectId
PATCH  /api/workspaces/:id/projects/:projectId
POST   /api/workspaces/:id/projects/:projectId/archive
DELETE /api/workspaces/:id/projects/:projectId
GET    /api/workspaces/:id/projects/:projectId/activity

GET    /api/workspaces/:id/tasks/dashboard
GET    /api/workspaces/:id/tasks
POST   /api/workspaces/:id/tasks
GET    /api/workspaces/:id/tasks/:taskId
PATCH  /api/workspaces/:id/tasks/:taskId
POST   /api/workspaces/:id/tasks/:taskId/move
DELETE /api/workspaces/:id/tasks/:taskId
GET    /api/workspaces/:id/tasks/:taskId/activity
POST   /api/workspaces/:id/tasks/:taskId/subtasks
PATCH  /api/workspaces/:id/tasks/:taskId/subtasks/:subtaskId/toggle
GET    /api/workspaces/:id/tasks/:taskId/comments
POST   /api/workspaces/:id/tasks/:taskId/comments
PATCH  /api/workspaces/:id/tasks/comments/:commentId
DELETE /api/workspaces/:id/tasks/comments/:commentId
```

---

## Tests Run

| Test | Result |
|------|--------|
| Frontend build (`npm run build`) | ✅ Passes — 2431 modules |
| Backend startup | ✅ MongoDB connects, server starts |
| `GET /api/health` | ✅ 200 OK |
| `POST /api/auth/register` | ✅ Returns user + JWT + workspace |
| `POST /api/auth/login` | ✅ Returns user + JWT |
| `GET /api/auth/me` (with token) | ✅ Returns current user |
| Workspace list | ✅ Returns owned workspace |
| Project CRUD | ✅ Create returns project with members |
| Task creation | ✅ Creates task in backlog |
| Kanban move | ✅ Persists status change via `/move` |
| Cross-workspace isolation | ✅ Returns 404 for other workspace's resources |

---

## Known Limitations

1. **Real-time collaboration** — No WebSocket/SSE. Browser must be refreshed for changes made by other users. Extension point: add Socket.io or SSE to the server and `invalidateQueries` on events.

2. **File uploads** — Avatar images are stored as URLs only. Requires S3/Cloudinary integration.

3. **Mobile responsiveness** — Desktop-first layout. Sidebar collapses on mobile but the Kanban board requires horizontal scroll on small screens.

4. **Email delivery** — In dev mode, emails are printed to the backend console. Configure `SMTP_*` variables for production delivery.

5. **Notifications** — The notification bell is visible in the UI but no notification records are persisted yet.

6. **Search** — Backend uses MongoDB regex search (no full-text index). For production, consider MongoDB Atlas Search or Elasticsearch.

7. **Permissions** — Project-level access control (owner/collaborator distinction within a project) is not enforced — only workspace membership is checked.

8. **Code splitting** — The frontend bundle is ~664KB. Dynamic imports should be added for route-level code splitting in production.

---

## Extension Points for Future Features

| Future Feature | Where to Add |
|---------------|--------------|
| Task Blueprint Engine | Replace hardcoded `TASK_STATUSES` in `Task.js` with a `WorkflowDefinition` model |
| Dependency Graph | Add `dependencies: [{ type: ObjectId, ref: 'Task' }]` to Task model |
| Gantt / Monte Carlo | New `/api/workspaces/:id/projects/:id/schedule` endpoint |
| Algorithmic assignment | New service `src/services/assignmentEngine.js` |
| GitHub integration | `metadata.githubRepo` field on Project; new `src/routes/webhooks.js` |
| AI triage | New `src/services/aiService.js` + `/api/ai/triage` route |
| Automation engine | New `Automation` model + cron/event runner |
| Real-time | Add `socket.io` to `server.js`; client subscribes to workspace room |
| Audit logging | `Activity` model is already in place — extend event types |
| DORA metrics | Query `Activity` events with type `task.done` filtered by project/time |
