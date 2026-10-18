# TaskFlow — Project Management SaaS

| Roll No. | Name | GitHub username |
|---|---|---|
| 24ESKCS120 | Durgesh Sharma | [durgesharma1208](https://github.com/durgesharma1208) |


## Live URL

- **Production Live URL:** https://taskflow-ui-24eskcs120.onrender.com
- **Production Health Endpoint:** https://taskflow-api-24eskcs120.onrender.com/api/health
- **Backend API Base URL:** https://taskflow-api-24eskcs120.onrender.com
- **Local Deployment URL:** http://localhost:5173
- **Local Health Endpoint:** http://localhost:5000/api/health

## What is TaskFlow?

TaskFlow is a full-stack project management application for organizing workspaces, teams, projects, tasks, and Kanban workflows. The application uses a React frontend and a Node.js/Express API backed by MongoDB.

## Architecture

```text
Browser
  |
  v
Render Static Site: taskflow-ui-24eskcs120
  |  VITE_API_URL
  v
Render Web Service: taskflow-api-24eskcs120
  |
  v
MongoDB Atlas
```

The repository also contains Docker Compose, Prometheus/Grafana configuration, and Kubernetes manifests for local DevOps practice. Those local monitoring/container components are separate from the current Render deployment; the presence of configuration files in GitHub does not by itself mean Prometheus/Grafana is running on Render.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JWT access tokens and HTTP-only refresh cookies |
| Monitoring configuration | Prometheus, Grafana, `prom-client` metrics (where the instrumented backend is run) |
| Deployment | Render; Docker Compose and Kubernetes manifests are also provided for local practice |

## Run Locally

Requirements: Node.js 18+ and a MongoDB instance or MongoDB Atlas URI.

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set MONGODB_URI and required JWT secrets
npm run dev
```

The backend is expected to run at `http://localhost:5000` when using the default local port.

### Frontend

In a second terminal:

```bash
cd frontend
npm install
# Set VITE_API_URL in frontend/.env to http://localhost:5000/api
npm run dev
```

The Vite development server will print its local URL in the terminal.

## Main Features

- User registration, login, logout, and protected pages
- Forgot-password and reset-password flows
- Workspaces, workspace members, invitations, teams, and roles
- Project creation, search, filters, status, progress, and archive action
- Task create/read/update/delete, priorities, labels, assignees, due dates, subtasks, and pagination
- Kanban board with drag-and-drop status changes
- Task comments and activity feed
- Dashboard with task and project summaries

## API Health Check

Use this endpoint to check whether the deployed backend responds:

```text
GET https://taskflow-api-24eskcs120.onrender.com/api/health
```

The root URL (`/`) is not documented as a health route. A `Route GET / not found` JSON response at `/` means that the requested root route is not defined; it does not, on its own, mean the API process is down.

## Module 6 — Deployment and Monitoring (8 Marks)

The assignment checks four items worth 2 marks each. The README URL, actual endpoint response, configuration files, dashboard file, and screenshot files all need to match what is committed in this repository.

| Check | Marks | Evidence / action |
|---|---:|---|
| Live URL responding | 2 | Frontend URL and backend `/api/health` URL are listed above. Open the health URL and confirm it returns a successful response before submission. |
| Prometheus config present | 2 | [`monitoring/prometheus.yml`](monitoring/prometheus.yml) |
| Monitoring dashboard committed under `monitoring/` | 2 | [`monitoring/grafana/dashboards/taskflow-dashboard.json`](monitoring/grafana/dashboards/taskflow-dashboard.json) |
| Deployment screenshot committed under `docs/` | 2 | [`docs/deployment.png`](docs/deployment.png) is the expected evidence path. Confirm the file is visible on `main` and shows the real deployed app; replace it if it is missing or outdated. |

### Monitoring configuration

The committed Prometheus configuration scrapes Prometheus itself and a backend target named `backend:5000` at `/metrics`. This target name is intended for the Docker Compose network. It will not automatically scrape the Render public service; use the correct reachable target and verify the deployment/network setup before claiming live Prometheus collection.

The committed Grafana dashboard includes panels for:

- Backend service availability (`up{job="taskflow-backend"}`)
- In-flight and total HTTP requests
- Node.js heap usage
- HTTP request rate
- HTTP 5xx error rate
- p50/p95 request latency
- HTTP status-code distribution

## Required Steps to Finish Module 6

1. **Verify the deployed backend.** Open [the backend health endpoint](https://taskflow-api-24eskcs120.onrender.com/api/health). Confirm the response is HTTP 200 and shows the application's healthy status. Do not use the backend root URL as the health check.
2. **Keep the live URLs in this README.** The scanner reads the README, so commit the file containing the current public frontend and health URLs.
3. **Confirm the Prometheus file exists.** In GitHub, open `monitoring/prometheus.yml` and ensure it is visible on the `main` branch.
4. **Confirm the dashboard JSON exists.** In GitHub, open `monitoring/grafana/dashboards/taskflow-dashboard.json` and ensure it is visible on the `main` branch.
5. **Verify the deployment screenshot.** Open `docs/deployment.png` in GitHub and make sure it is a genuine screenshot of your deployed TaskFlow frontend. If it is missing or outdated, take a fresh browser screenshot and save it at that path. Optionally add `docs/health-check.png`.
6. **Commit and push the README update.** The Prometheus config, dashboard JSON, and deployment screenshot already appear to be present in the repository. Confirm all four paths (`README.md`, Prometheus config, dashboard JSON, screenshot) are visible on `main` after pushing.
7. **Check the scanner again.** Re-run the assignment scanner after the new commit. README documentation alone cannot make a down/unhealthy endpoint pass; the real endpoint must respond successfully.

Example commands to add the deployment screenshot and README changes from the repository root:

```bash
mkdir -p docs
# Save your genuine browser screenshot as docs/deployment.png first
git add README.md monitoring/prometheus.yml monitoring/grafana/dashboards/taskflow-dashboard.json docs/deployment.png
git commit -m "docs: complete Module 6 deployment evidence"
git push origin main
```

Only add `docs/deployment.png` to Git if you created or updated that file locally. Do not submit a fabricated screenshot or claim the monitoring stack is running in production unless you have verified it.

## Known Limitations / Deployment Notes

- The Render root URL `/` can return a route-not-found JSON message while `/api/health` is the intended health endpoint.
- Render logs in the provided screenshot show MongoDB connecting and repeated `GET /api/health` responses with HTTP 200. They also show an Express rate-limit warning about `X-Forwarded-For` and `trust proxy`; resolve this separately by configuring Express proxy trust appropriately for Render and your rate-limiting setup.
- The committed `monitoring/prometheus.yml` uses `backend:5000`, a Docker-network service address. A local configuration file being committed satisfies file-presence evidence, but it does not prove remote Render metrics are being scraped.
- The repository documents Docker/Kubernetes monitoring exercises; only claim that any component is live when you have actually run and checked it.

## Repository Layout (key DevOps files)

```text
.
├── README.md
├── render.yaml
├── docker-compose.yml
├── monitoring/
│   ├── prometheus.yml
│   └── grafana/
│       └── dashboards/
│           └── taskflow-dashboard.json
├── docs/
│   └── deployment.png             # Add a real screenshot here
├── backend/
├── frontend/
└── k8s/
```
