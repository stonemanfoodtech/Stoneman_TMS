# Stoneman Ops — Frontend

React 18 + Vite web app for the Stoneman Food and Beverages employee operations portal, styled with the Stoneman brand (Tailwind CSS, Framer Motion, Recharts, Lucide icons).

All pages and the API they call are listed in **ROUTES.md**.

## Setup

```bash
npm install
cp .env.example .env      # optional in development
npm run dev               # http://localhost:5173
```

In development, Vite forwards `/api` requests to the backend at `http://localhost:5000` (change it with `VITE_API_PROXY`). Start the backend first.

## Production build

```bash
npm run build             # outputs dist/
```

- **Separate hosting (Vercel, Netlify, etc.):** set `VITE_API_URL=https://your-api-domain/api` before building, and add an SPA fallback so every path serves `index.html` (Netlify: `/* /index.html 200`; Vercel: a rewrite to `/index.html`). Add the site's URL to the backend's `CLIENT_ORIGIN`.
- **Same server as the API:** put this folder next to the backend as `frontend/`, build it, and set `SERVE_CLIENT=true` in the backend `.env`.

## Structure

```
public/brand/        Stoneman logo files
src/pages/auth       Login, Register
src/pages/employee   Dashboard, Profile
src/pages/admin      Reports, Employees, EmployeeDetail, Holidays
src/components       layout, UI kit, tasks, charts, auth forms
src/lib              API client, dates, constants
src/context          AuthContext (session, roles)
```
