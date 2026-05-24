## Environment

Copy `.env.example` to `.env`. Requires PostgreSQL (`docker compose up -d` from project root).

```sh
npx prisma db push
npm run db:seed
npm run dev
```

Production deploy: see [DEPLOYMENT.md](../DEPLOYMENT.md).

