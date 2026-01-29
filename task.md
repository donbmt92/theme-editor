Multi-tenant Migration Guide
This guide details the steps to migrate the Theme Editor to a multi-tenant SaaS architecture using Docker and Caddy.

1. Overview of Changes
   Database: Added customDomain and subdomain fields to the Project model.
   Routing: Introduced
   middleware.ts
   to rewrite requests based on hostname.
   Structure:
   src/app/(main): Requires authentication, handles the "Tool" (Dashboard, Editor).
   src/app/sites/[domain]: Publicly accessible, handles the "Tenant Sites".
   Infrastructure: Switched to Docker Compose with Caddy for automatic SSL management.
2. Setup Instructions
   Step 1: Update Database
   Since we modified prisma/schema.prisma, you need to apply changes:

# Verify schema changes

npx prisma format

# Push changes to DB (or create migration)

npx prisma db push

# Generate client

npx prisma generate
Step 2: Verify File Structure
Ensure the src/app directory looks like this:

src/app/
├── (main)/ # Moved existing folders here
│ ├── dashboard/
│ ├── editor/
│ ├── auth/
│ └── page.tsx # Main Landing Page
├── sites/
│ └── [domain]/ # New Tenant Route
│ └── page.tsx
├── api/ # Global APIs
├── layout.tsx # Root Layout
└── middleware.ts # Domain Routing Logic
Step 3: Run Locally with Docker (Recommended)
Stop existing local server: Ctrl+C in your terminal.
Build and Run:
docker-compose up -d --build
Access:
Main App: http://localhost (or http://geekgolfers.com if mapped in hosts)
Tenant App: Use curl or modify hosts file to point shopgiay.local to 127.0.0.1.
Step 4: Deploy to VPS
Copy Files to VPS:

Dockerfile
docker-compose.yml
Caddyfile
.env (Update with production values)
prisma/
src/
public/
package.json, next.config.ts, etc.
Run on VPS:

# Stop old PM2 process (if running)

pm2 stop theme-editor

# Start with Docker Compose

docker-compose up -d --build

3. Caddy & SSL
   Caddy is configured to ask the Next.js app (/api/domain-check) if a domain is allowed.

If you add a record in Project with customDomain="shopgiay.com", Caddy will automatically issue an SSL certificate when someone visits shopgiay.com.
Note: Ensure your VPS Firewall allows ports 80 and 443.

4. Troubleshooting
   Prisma Error: If you see type errors, make sure to run npx prisma generate.
   File Locks: If npm run dev is running, it might lock files. Stop it before moving files or running Docker.

Comment
Ctrl+Alt+M
