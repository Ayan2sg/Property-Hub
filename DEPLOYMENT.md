# Deploy Prop Haven

This app has two parts:

| Part | Stack | Host example |
|------|--------|----------------|
| **Frontend** | Vite + React | Render Static, Vercel, Netlify |
| **Backend** | Express + Prisma | Render Web Service, Railway |

Use **PostgreSQL** in production (included in `render.yaml`). SQLite is not suitable for cloud deploys because data is lost on redeploy.

---

## Option A — Render (recommended, one platform)

### 1. Push code to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Create Render Blueprint

1. Go to [render.com](https://render.com) → **New** → **Blueprint**
2. Connect your GitHub repo
3. Render reads `render.yaml` and creates:
   - PostgreSQL database `prop-haven-db`
   - API service `prop-haven-api`
   - Static site `prop-haven-web`

### 3. Set environment variables

After the first deploy, open each service in the Render dashboard.

**API (`prop-haven-api`)**

| Variable | Example |
|----------|---------|
| `FRONTEND_URL` | `https://prop-haven-web.onrender.com` (your static site URL) |
| `RAZORPAY_KEY_ID` | From Razorpay dashboard (test/live) |
| `RAZORPAY_KEY_SECRET` | From Razorpay dashboard |
| `ADMIN_EMAIL` | `admin@yourdomain.com` |
| `ADMIN_PASSWORD` | Strong password |

`DATABASE_URL` and `JWT_SECRET` are set automatically by the blueprint.

**Web (`prop-haven-web`)**

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://prop-haven-api.onrender.com` (your API URL, no trailing slash) |
| `VITE_UPI_ID` | Optional UPI ID for manual UPI checkout |

Redeploy the **web** service after changing `VITE_*` variables (they are baked in at build time).

### 4. Seed the database (once)

In Render → **prop-haven-api** → **Shell**:

```bash
npm run db:seed
```

This creates the admin user and sample properties.

### 5. Open the site

- Site: `https://prop-haven-web.onrender.com`
- Admin: `https://prop-haven-web.onrender.com/admin/login`

---

## Option B — Vercel (frontend) + Render (backend)

### Backend on Render

1. **New** → **Web Service** → connect repo
2. **Root directory:** `backend`
3. **Build command:** `npm install && npx prisma generate && npx prisma db push && npm run build`
4. **Start command:** `npm start`
5. Add a **PostgreSQL** database in Render and set `DATABASE_URL`
6. Set `FRONTEND_URL`, `JWT_SECRET`, Razorpay, and admin env vars (see table above)
7. Run `npm run db:seed` in the Render shell once

### Frontend on Vercel

1. Import the repo at [vercel.com](https://vercel.com)
2. **Root directory:** project root (not `backend`)
3. **Framework:** Vite
4. **Environment variables:**
   - `VITE_API_URL` = your Render API URL
5. Deploy

`vercel.json` is included for client-side routing (`react-router`).

Update `FRONTEND_URL` on the API to your Vercel URL (e.g. `https://your-app.vercel.app`) and redeploy the API.

---

## Local development (PostgreSQL)

```bash
# Start database
docker compose up -d

# Backend
cd backend
cp .env.example .env
npm install
npx prisma db push
npm run db:seed
npm run dev

# Frontend (new terminal, project root)
cp .env.example .env
npm install
npm run dev
```

Frontend: http://localhost:8080  
API: http://localhost:3001

---

## Razorpay in production

1. Create a [Razorpay](https://razorpay.com) account
2. Use **Test keys** first, then **Live keys** when ready
3. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to the API service
4. In Razorpay dashboard, allow your frontend domain for checkout if required

---

## Custom domain

- **Render:** Service → Settings → Custom Domain
- **Vercel:** Project → Settings → Domains

After adding a domain, update:

- `FRONTEND_URL` on the API
- `VITE_API_URL` on the frontend (rebuild)
- Razorpay allowed domains if applicable

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| **`prop-haven-api` deploy failed** | Open the failed deploy → **Logs**. Common fixes: (1) push latest code with updated `render.yaml`, (2) confirm `DATABASE_URL` is linked to the API service, (3) set **Build command** to `NPM_CONFIG_PRODUCTION=false npm install && npx prisma generate && npm run build` and **Start command** to `npm run start:prod` (free tier does **not** support pre-deploy commands) |
| API CORS error | `FRONTEND_URL` must exactly match the browser URL (scheme + host, no trailing slash) |
| Empty property list | Run `npm run db:seed` on the API; approve listings in admin |
| Buy/Rent payment fails | Set Razorpay keys on the API |
| 404 on refresh (e.g. `/admin`) | Use `vercel.json` or `public/_redirects` (already included) |
| Build fails on Prisma | Ensure `DATABASE_URL` is set on the API service (not only at build time for `db push` — use **Release command** instead of build-time `db push`) |

---

## Security checklist before going live

- [ ] Change `ADMIN_PASSWORD` from default
- [ ] Use a strong `JWT_SECRET` (Render can auto-generate)
- [ ] Use Razorpay **live** keys only on production
- [ ] Do not commit `.env` files (they are gitignored)
