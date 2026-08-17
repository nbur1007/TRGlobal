# TRGlobal — Mini E-Commerce Platform
 
A full-stack e-commerce application built with NestJS, Prisma, PostgreSQL, and React.
 
- `/backend` — NestJS REST API with JWT auth, role-based guards, and Prisma ORM
- `/frontend` — React + TypeScript client (Vite)

<img src = "./images/TRGlobal.png"/>

---
 
## Prerequisites
 
- **Node.js 20+** and npm
- **PostgreSQL** database (local instance or a hosted one such as Prisma Postgres)
---
 
## Backend Setup
 
### 1. Install dependencies
 
```bash
cd backend
npm install
```
 
### 2. Create your environment file
 
Create a `.env` file in the `backend/` directory:
 
```env
# PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
 
# Secret used to sign JWTs — generate your own, do not reuse this placeholder
JWT_SECRET="your-generated-secret-here"
 
# Password assigned to the seeded admin account
SEED_ADMIN_PASSWORD="choose-a-password"
```
 
`.env` is gitignored and must never be committed.
 
To generate a strong `JWT_SECRET`:
 
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```
 
### 3. Run migrations
 
This applies the schema to your database and generates the Prisma client:
 
```bash
npx prisma migrate dev
```
 
> The generated Prisma client is written to `backend/generated/prisma` and is **not** committed to the repository. If you ever see `Cannot find module 'generated/prisma/...'`, run `npx prisma generate` to recreate it.
 
### 4. Seed the database
 
```bash
npx prisma db seed
```
 
This creates:
 
- One **admin** account — `admin@trglobal.com`, using the password from `SEED_ADMIN_PASSWORD`
- Four **categories** — Electronics, Clothing, Home & Kitchen, Sports & Outdoors
- **33 products** spread across the first three categories
Sports & Outdoors is intentionally left empty so the category-deletion behaviour can be tested (see *Design Decisions* below).
 
Seeding must be run explicitly — under Prisma 7 it no longer runs automatically after `migrate dev` or `migrate reset`.
 
Customer accounts are **not** seeded. Registration is a public endpoint, so create one through the API as part of the normal flow.
 
### 5. Start the API
 
```bash
npm run start:dev
```
 
The API runs on `http://localhost:3000` by default.
 
---
 
## Frontend Setup
 
```bash
cd frontend
npm install
npm run dev
```
 
Vite serves the app on `http://localhost:5173` by default.
 
---
 
## Quick Start (from a clean clone)
 
```bash
# Backend
cd backend
npm install
# ...create .env as described above...
npx prisma migrate dev
npx prisma db seed
npm run start:dev
 
# Frontend (in a second terminal)
cd frontend
npm install
npm run dev
```
