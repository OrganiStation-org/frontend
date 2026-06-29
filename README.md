# 💻 OrganiStation Frontend

The **Frontend** is a modern Single Page Application (SPA) built using **React 19** and **Vite**, serving as the user interface for the OrganiStation enterprise portal. It features a responsive dashboard, interactive pages for HR directory and leaves, project task boards, financial reporting, and an AI chat interface.

---

## ✨ Key Features

- **Role-Based Routing & Component Visibility**: Exposes dashboard modules, navigation tabs, and admin features dynamically based on the current user's role and permission sets.
- **AI Chat Assistant Interface**: Interactive chat with document sources citation, inline PDF viewing, and document ingestion/reset controls for administrators.
- **Interactive Project Kanban Board**: Real-time project tracking, task updates, and ticket submissions.
- **Leave & WFH Management**: Dedicated requests log and approval queues for HR/Project managers.
- **Financial Expense & Invoice Tracker**: Beautiful reporting summaries, expense request forms, budget allocations, and client invoicing.
- **First-Time Login Redirection**: Detects the `must_change_password` flag on user login and routes users immediately to the Change Password wizard.

---

## 🛠️ Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (using a modern custom variable design system)

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── api/            # API client (fetches gateway routes, handles token storage/refresh)
│   ├── components/     # Shared reusable UI components (Nav, Sidebar, Cards, Modals)
│   ├── context/        # Global context provider (Authentication state, User profile)
│   ├── pages/          # Individual feature views (Dashboard, HR, Finance, AI Assistant, etc.)
│   ├── utils/          # Helper utilities (formatters, date parsers)
│   ├── App.css         # Component styling override
│   ├── App.jsx         # Root router & layout configuration
│   ├── index.css       # Core design system tokens (colors, animations, layout)
│   └── main.jsx        # App entry mounting React DOM
├── index.html          # HTML Shell
├── nginx.conf          # Nginx configurations for production deployment
└── vite.config.js      # Vite compilation settings & local proxy rules
```

---

## ⚙️ Development Proxy

In local development, the SPA is configured to proxy all `/api` requests directly to the API Gateway running on port `3000`. This is configured inside `vite.config.js`:

```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    }
  }
}
```

---

## 🚀 Key Pages & Views

| Page | Filename | Description | Access Role |
| :--- | :--- | :--- | :--- |
| **Landing Page** | `LandingPage.jsx` | Marketing homepage and feature overview | Public |
| **Login** | `LoginPage.jsx` | Login form | Public |
| **Change Password** | `ChangePasswordPage.jsx` | Forced password update wizard | Authenticated |
| **Dashboard** | `DashboardPage.jsx` | Home metrics dashboard showing cards for HR, projects, and finances | Authenticated |
| **AI Assistant** | `AIPage.jsx` | Interactive chatbot and PDF uploader | All (Chat), Admin (Ingest) |
| **HR Directory** | `HRPage.jsx` | Employee records, recruitment postings, and profiles | All (View), HR/Admin (Edit) |
| **Leaves & WFH** | `LeavesPage.jsx` | Request leaves and access approval queues | All (Request), HR/PM (Approve) |
| **Projects Board** | `ProjectsPage.jsx` | Kanban board showing project phases, tasks, and support tickets | Authenticated |
| **Finance Manager** | `FinancePage.jsx` | Revenue dashboard, client invoicing, and budget sheets | Finance Manager / Admin |
| **My Finances** | `MyFinancePage.jsx` | Personal expense reports history and submission forms | Authenticated |
| **Users Admin** | `UsersPage.jsx` | Platform account listings and role/status toggles | Admin |

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Vite Dev Server
```bash
npm run dev
```
The application will run locally at `http://localhost:5173`. Ensure your **API Gateway** is running on `http://localhost:3000` to allow database fetching and authentication.

### 3. Build Production Bundle
To build the application for deployment (outputs production static files to `dist/`):
```bash
npm run build
```

---

## 🐳 Docker Deployment

The frontend uses **Nginx** in production to serve Vite's static build output and reverse-proxy `/api` requests to the gateway service.

```bash
# Build the Image
docker build -t organistation-frontend .

# Run the Container
docker run -d -p 80:80 organistation-frontend
```
