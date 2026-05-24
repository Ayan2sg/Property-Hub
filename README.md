## Local setup

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for full deploy instructions (Render, Vercel, env vars, Razorpay).

**Quick start (local):**

```sh
docker compose up -d
cd backend && cp .env.example .env && npm i && npx prisma db push && npm run db:seed && npm run dev
cd .. && cp .env.example .env && npm i && npm run dev
```

Frontend `.env`:

```
VITE_API_URL=http://localhost:3001
```

The dev server proxies `/api` to `VITE_API_URL` (see `vite.config.ts`).
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/430c5134-ec3c-4df9-b172-73f2c6963f84

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/430c5134-ec3c-4df9-b172-73f2c6963f84) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Follow **[DEPLOYMENT.md](./DEPLOYMENT.md)** to deploy the frontend and API (Render blueprint is included).

You can also publish the UI via [Lovable](https://lovable.dev/projects/430c5134-ec3c-4df9-b172-73f2c6963f84) (Share → Publish), but you still need a hosted backend and database for listings, auth, and payments.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
