# LibreAgents Registry web application

The Next.js application browses the approved LibreAgents catalog and exposes
read-oriented entry APIs. PostgreSQL stores searchable catalog rows and download
counters; source entries and generated checksums remain authoritative.

## Local development

```bash
docker compose up -d db
cd web
npm install
npm run db:setup
npm run dev
```

The default site is available at `http://localhost:3000`.

## Production image

The repository workflow builds `web/Dockerfile`. The container applies database
migrations, imports `index.json` plus source entry folders, and starts the web
application. Configure `DATABASE_URL` and do not use the development database
password in production.
