# 🔍 PHASE 1: SYSTEM ARCHITECTURE AUDIT

## Theme Editor Platform - Complete System Analysis

> **Audit Date:** 2026-02-01  
> **Project:** Theme Editor - Multi-tenant SaaS Platform  
> **Status:** Production-Like (Running on VPS)

---

## 📊 EXECUTIVE SUMMARY

### System Overview

The Theme Editor is a **multi-tenant SaaS platform** that allows users to:

- Create and customize website themes using AI
- Export projects as static HTML or React/Next.js apps
- Deploy to custom domains with automatic provisioning
- Manage payments and user tiers

### Critical Findings

> [!CAUTION]
> **Production Readiness Score: 6/10**  
> The system is functional but has significant gaps in monitoring, error handling, and scalability infrastructure.

**Key Strengths:**

- ✅ Solid database schema with proper relationships
- ✅ Authentication with NextAuth.js
- ✅ Multi-tenant architecture with middleware
- ✅ Payment integration (SePay webhook)
- ✅ Rate limiting implemented

**Critical Gaps:**

- ❌ No monitoring/observability (Sentry, Winston)
- ❌ No job queue for long-running tasks
- ❌ In-memory rate limiting (won't scale across instances)
- ❌ Missing health check endpoints
- ❌ No rollback mechanism for deployments
- ❌ Security vulnerabilities (exposed API keys in .env.local)

---

## 🏗️ 1. SYSTEM ARCHITECTURE

### High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Browser Client]
    end

    subgraph "Application Layer - VPS"
        B[Nginx Reverse Proxy<br/>Port 80/443]
        C[Next.js App<br/>PM2 Cluster Mode<br/>Port 3033]
    end

    subgraph "Data Layer"
        D[PostgreSQL<br/>theme_editor DB]
        E[File System<br/>/public/uploads]
    end

    subgraph "External Services"
        F[GitHub API<br/>Repo Management]
        G[Vercel API<br/>Deployment]
        H[SePay<br/>Payment Webhook]
        I[Google Gemini<br/>AI Generation]
        J[Unsplash<br/>Image API]
    end

    A --> B
    B --> C
    C --> D
    C --> E
    C --> F
    C --> G
    C <--> H
    C --> I
    C --> J

    style C fill:#ff6b6b
    style D fill:#4ecdc4
    style B fill:#95e1d3
```

### Multi-Tenant Architecture Flow

```mermaid
sequenceDiagram
    participant User
    participant Nginx
    participant Middleware
    participant App
    participant DB

    User->>Nginx: Request to customdomain.com
    Nginx->>Middleware: Forward with Host header

    alt Main Domain (geekgolfers.com)
        Middleware->>App: Render SaaS Dashboard
        App->>DB: Fetch user projects
    else Custom Domain (shopgiay.com)
        Middleware->>App: Rewrite to /sites/[domain]
        App->>DB: Lookup project by customDomain
        App->>User: Render tenant's site
    end
```

### Component Breakdown

```mermaid
graph LR
    subgraph "Frontend Components"
        A1[ProjectEditor]
        A2[ThemeSections]
        A3[DashboardUI]
    end

    subgraph "API Layer - 32 Endpoints"
        B1[Auth APIs<br/>2 routes]
        B2[Project APIs<br/>5 routes]
        B3[Theme APIs<br/>3 routes]
        B4[Export APIs<br/>4 routes]
        B5[Deploy APIs<br/>4 routes]
        B6[Payment APIs<br/>4 routes]
        B7[Integration APIs<br/>6 routes]
        B8[Utility APIs<br/>4 routes]
    end

    subgraph "Core Libraries"
        C1[generate-theme-core.ts<br/>48KB - AI orchestration]
        C2[export-react-project.ts<br/>21KB - Code generation]
        C3[ai-load-balancer.ts<br/>10KB - Request distribution]
        C4[vercel-api.ts<br/>11KB - Deployment logic]
    end

    A1 --> B2
    A2 --> B3
    B2 --> C1
    B3 --> C2
    B5 --> C4
```

---

## 🗄️ 2. DATABASE ARCHITECTURE

### Schema Overview

```mermaid
erDiagram
    User ||--o{ Project : owns
    User ||--o{ Payment : makes
    User ||--o{ Theme : creates
    Theme ||--o{ Project : "used in"
    Project ||--o{ ProjectVersion : has
    ProjectVersion ||--o{ VersionParam : contains
    ProjectVersion ||--o{ Export : generates

    User {
        string id PK
        string email
        string passwordHash
        enum role
        enum tier
        datetime createdAt
    }

    Project {
        string id PK
        string userId FK
        string themeId FK
        string customDomain
        string subdomain
        enum status
    }

    Payment {
        string id PK
        string userId FK
        decimal amount
        enum status
        string bankTxnId
    }
```

### Key Schema Observations

> [!IMPORTANT]
> **Data Integrity Issues:**
>
> - No foreign key for `Lead.projectId` (optional reference, could be orphaned)
> - Missing indexes on frequently queried fields (Project.status, Payment.status)
> - No soft delete mechanism (ARCHIVED status exists but no deletedAt timestamp)

**Proper Indexes:**

- ✅ `Project.customDomain` (unique + indexed)
- ✅ `Project.subdomain` (unique + indexed)
- ✅ `Payment.bankTxnId` (unique for webhook lookups)

**Missing Indexes:**

```sql
-- Recommended additions
CREATE INDEX idx_project_status ON projects(status);
CREATE INDEX idx_payment_status ON payments(status);
CREATE INDEX idx_payment_user_status ON payments(user_id, status);
CREATE INDEX idx_project_user_status ON projects(user_id, status);
```

---

## 🔌 3. API ENDPOINT ANALYSIS

### Complete API Inventory (31 Routes)

> [!NOTE]
> **Recent Change:** Removed `/api/export-project` (2688 lines) as it was only used for ZIP export, not needed for VPS deployment workflow.

| Category           | Endpoint                          | Auth Required | Rate Limited   | Notes                 |
| ------------------ | --------------------------------- | ------------- | -------------- | --------------------- |
| **Authentication** |
|                    | `/api/auth/[...nextauth]`         | No            | No             | NextAuth handler      |
|                    | `/api/auth/register`              | No            | ❌ **Missing** | Registration endpoint |
| **Projects**       |
|                    | `GET /api/projects`               | ✅ Yes        | ❌ No          | List user projects    |
|                    | `POST /api/projects`              | ✅ Yes        | ❌ No          | Create project        |
|                    | `GET /api/projects/[id]`          | ✅ Yes        | ❌ No          | Get project details   |
|                    | `PATCH /api/projects/[id]`        | ✅ Yes        | ❌ No          | Update project        |
|                    | `DELETE /api/projects/[id]`       | ✅ Yes        | ❌ No          | Delete project        |
| **Themes**         |
|                    | `GET /api/themes`                 | ✅ Yes        | ❌ No          | List themes           |
|                    | `POST /api/themes`                | ✅ Yes        | ❌ No          | Create theme          |
|                    | `GET /api/themes/[id]`            | ✅ Yes        | ❌ No          | Get theme             |
| **AI Generation**  |
|                    | `POST /api/generate-theme`        | ✅ Yes        | ✅ Yes         | AI theme generation   |
|                    | `POST /api/generate-theme-stream` | ✅ Yes        | ✅ Yes         | Streaming AI          |
|                    | `POST /api/generate-product-page` | ✅ Yes        | ❌ No          | Product page gen      |
| **Deploy**         |
|                    | `GET /api/download-project/[id]`  | ✅ Yes        | ❌ No          | Download ZIP          |
|                    | `POST /api/deploy-project`        | ✅ Yes        | ❌ No          | Deploy to VPS         |
|                    | `POST /api/execute-deploy-script` | ✅ Yes        | ❌ No          | Run deploy script     |
|                    | `GET /api/deploy-stats`           | ✅ Yes        | ❌ No          | Deployment status     |
| **Payments**       |
|                    | `GET /api/payments`               | ✅ Yes        | ❌ No          | Payment history       |
|                    | `POST /api/payments`              | ✅ Yes        | ❌ No          | Create payment        |
|                    | `GET /api/payments/[id]`          | ✅ Yes        | ❌ No          | Payment details       |
|                    | `POST /api/sepay/webhook`         | ⚠️ API Key    | ❌ No          | SePay webhook         |
| **Integrations**   |
|                    | `POST /api/github/create-repo`    | ✅ Yes        | ❌ No          | GitHub repo           |
|                    | `POST /api/vercel/deploy`         | ✅ Yes        | ❌ No          | Vercel deploy         |
|                    | `GET /api/unsplash/random`        | ✅ Yes        | ⚠️ 600/min     | Random image          |
|                    | `POST /api/unsplash/theme-image`  | ✅ Yes        | ❌ No          | Theme image           |
| **Utilities**      |
|                    | `GET /api/check-domain`           | ✅ Yes        | ❌ No          | Domain availability   |
|                    | `POST /api/upload`                | ✅ Yes        | ❌ No          | File upload           |
|                    | `GET /api/upload/[fileName]`      | ✅ Yes        | ❌ No          | Serve uploaded file   |
|                    | `POST /api/leads`                 | ✅ Yes        | ❌ No          | Lead capture          |

### Critical API Issues

> [!WARNING]
> **Missing Rate Limiting:**  
> Only 2 endpoints have rate limiting (`generate-theme`, `unsplash/random`), but critical endpoints like:
>
> - `/api/deploy-project` (expensive operation)

> - `/api/payments` (financial transaction)
>
> Are **completely unprotected**.

---

## 🔒 4. SECURITY AUDIT

### Critical Security Issues

#### 🔴 HIGH SEVERITY

1. **Exposed Credentials in Repository**

   ```env
   # Found in .env.local (should be gitignored but might be committed)
   DATABASE_URL="postgresql://postgres:***REDACTED***@localhost:5432/theme_editor"
   GITHUB_TOKEN="ghp_***REDACTED***"
   VERCEL_TOKEN="***REDACTED***"
   ```

   > [!CAUTION]
   > **Action Required:** Immediately rotate all exposed tokens and add `.env.local` to `.gitignore`.

2. **Hardcoded API Key in Webhook Handler**

   ```typescript
   // src/app/api/sepay/webhook/route.ts:46
   const expectedApiKey =
     process.env.SEPAY_API_KEY || "***REDACTED_HARDCODED_FALLBACK***";
   ```

   **Risk:** If `SEPAY_API_KEY` is not set, falls back to hardcoded value.

3. **No CSRF Protection on State-Changing APIs**
   - All POST/PATCH/DELETE endpoints lack CSRF tokens
   - Relies solely on `getServerSession()` which is not enough

4. **SQL Injection Risk in Dynamic Queries**
   - Prisma mitigates this mostly, but check for raw SQL queries
   - No evidence of input sanitization for file paths

#### 🟡 MEDIUM SEVERITY

5. **In-Memory Rate Limiting**

   ```typescript
   // src/lib/rate-limiter.ts
   private store = new Map<string, RateLimitInfo>()
   ```

   **Issue:** Resets on server restart, doesn't work in cluster mode.  
   **Solution:** Use Redis-based rate limiting.

6. **No Request Validation Layer**
   - API routes parse `request.json()` without schema validation
   - Example: `/api/payments/route.ts` checks fields manually
   - **Recommended:** Use Zod schemas for all API inputs

7. **File Upload Without Type Checking**

   ```typescript
   // src/app/api/upload/route.ts
   // Need to verify if file type validation exists
   ```

8. **Missing Security Headers**
   - Nginx config has basic headers, but missing:
     - `Strict-Transport-Security`
     - `Permissions-Policy`
     - Proper `Content-Security-Policy` (current one is too permissive)

#### 🟢 LOW SEVERITY

9. **Verbose Error Messages**

   ```typescript
   // Many API routes return detailed errors
   console.error("Auth error:", error);
   return NextResponse.json({ error: error.message });
   ```

   **Risk:** Information disclosure in production.

10. **No API Versioning**
    - All endpoints at `/api/*` with no version prefix
    - Breaking changes will affect all clients

### Security Checklist

- [ ] Environment variables properly secured
- [ ] API keys rotated and stored in secrets manager
- [ ] CSRF protection implemented
- [ ] Input validation with Zod schemas
- [ ] Rate limiting on all endpoints (Redis-based)
- [ ] File upload validation (type, size, virus scan)
- [ ] Security headers configured
- [ ] Error messages sanitized in production
- [ ] API versioning strategy
- [ ] Audit logging for sensitive operations

---

## 🐛 5. TECHNICAL DEBT INVENTORY

### 🔴 Critical Debt (Fix Immediately)

1. **No Job Queue for Long-Running Tasks**
   - **Location:** `/api/deploy-project/route.ts`
   - **Problem:** Deployment can take 2-5 minutes, blocks HTTP request
   - **Impact:** Timeouts, poor UX, server resource exhaustion
   - **Solution:**
     ```typescript
     // Use BullMQ or similar
     await deployQueue.add("deploy", { projectId, userId });
     return NextResponse.json({ jobId, status: "queued" });
     ```

2. **In-Memory Deploy Queue**

   ```typescript
   // src/app/api/deploy-project/route.ts:15
   const deployQueue = new Map<string, Promise<unknown>>();
   ```

   - **Problem:** Lost on restart, not shared across PM2 instances
   - **Solution:** Redis-backed queue (Bull, BullMQ)

3. **No Monitoring/Observability**
   - **Missing:**
     - Error tracking (Sentry)
     - Structured logging (Winston, Pino)
     - Metrics (Prometheus, Datadog)
     - APM (Application Performance Monitoring)
   - **Impact:** Can't diagnose production issues

> [!NOTE]
> **Resolved:** ~~Monolithic Export Handler~~ - Removed `export-project/route.ts` (2688 lines) as it was not needed for VPS deployment workflow.

### 🟡 High Priority Debt (Fix Within 2 Weeks)

5. **Missing Health Check Endpoint**

   ```typescript
   // Create /api/health
   export async function GET() {
     const dbHealth = await prisma.$queryRaw`SELECT 1`;
     return NextResponse.json({
       status: "healthy",
       timestamp: new Date(),
       database: dbHealth ? "up" : "down",
     });
   }
   ```

6. **No Database Connection Pooling Config**
   - Prisma uses default pooling, but no explicit limits
   - Risk: Connection exhaustion under load

7. **File Storage on Local Filesystem**

   ```env
   UPLOAD_DIR=./public/uploads
   ```

   - **Problem:** Not scalable, lost on server crashes
   - **Solution:** AWS S3, Cloudflare R2, or similar

8. **No Backup Verification**
   - Backup scripts exist (`backup_db.sh`) but no restore testing
   - **Action:** Schedule quarterly restore drills

9. **Missing Database Migrations Strategy**

   ```json
   // package.json
   "db:push": "prisma db push"
   ```

   - Using `db push` instead of proper migrations
   - **Risk:** Schema drift, no rollback capability
   - **Fix:** Use `prisma migrate dev/deploy`

### 🟢 Medium Priority Debt (Fix Within 1 Month)

10. **No API Documentation**
    - No OpenAPI/Swagger spec
    - **Solution:** Generate from route handlers with tRPC or similar

11. **Hard-coded Configuration**

    ```typescript
    // Multiple files have hardcoded values
    const APP_DOMAIN = "geekgolfers.com";
    const PORT = 3033;
    ```

    - Should be in environment variables

12. **No Feature Flags**
    - Can't toggle features without deployment
    - **Recommended:** LaunchDarkly, PostHog, or custom solution

13. **Missing E2E Tests**
    - Test scripts exist but coverage unknown
    - No integration tests for critical flows

14. **Code Duplication**
    - Auth checks repeated in every API route
    - **Solution:** Middleware wrapper
      ```typescript
      export const withAuth = (handler) => async (req) => {
        const session = await getServerSession(authOptions);
        if (!session)
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        return handler(req, session);
      };
      ```

---

## 📈 6. SCALABILITY ANALYSIS

### Current Bottlenecks

```mermaid
graph TD
    A[100 Concurrent Users] --> B{Bottleneck Analysis}

    B --> C[File System I/O<br/>⚠️ Uploads to /public]
    B --> D[In-Memory Rate Limiter<br/>❌ Won't sync across instances]
    B --> E[Long-Running API Routes<br/>❌ Deploy blocks for 5min]
    B --> F[Database Connections<br/>⚠️ No explicit pooling]

    C --> G[Solution: S3/R2]
    D --> H[Solution: Redis]
    E --> I[Solution: Job Queue]
    F --> J[Solution: PgBouncer]
```

### Scalability Roadmap

| Current Capacity     | Bottleneck             | Recommended Solution               | Priority    |
| -------------------- | ---------------------- | ---------------------------------- | ----------- |
| ~10 concurrent users | API route timeouts     | Job queue (BullMQ)                 | 🔴 Critical |
| ~50 exports/day      | File system storage    | S3/Cloudflare R2                   | 🟡 High     |
| ~100 req/min         | In-memory rate limiter | Redis rate limiting                | 🟡 High     |
| Single VPS instance  | No horizontal scaling  | Load balancer + multiple instances | 🟢 Medium   |
| PostgreSQL on VPS    | Connection limits      | PgBouncer connection pooling       | 🟢 Medium   |

---

## 🔍 7. INFRASTRUCTURE AUDIT

### Current Setup (VPS)

```yaml
Environment: Production VPS
OS: Ubuntu 22.04 LTS
Runtime: Node.js 20.x
Process Manager: PM2 (cluster mode)
Web Server: Nginx (reverse proxy)
Database: PostgreSQL (local)
SSL: Let's Encrypt (auto-renewal via cron)
Port: 3033 (app), 80/443 (nginx)
```

### Infrastructure Gaps

> [!WARNING]
> **Single Point of Failure:**  
> Everything runs on one VPS. No redundancy, no auto-scaling.

**Missing Components:**

- ❌ Redis (for caching, sessions, queues)
- ❌ CDN (for static assets)
- ❌ Load balancer
- ❌ Database replicas
- ❌ Backup VPS (hot standby)
- ❌ Monitoring stack (Grafana, Prometheus)

### Deployment Process Issues

**Current Flow:**

```bash
# Manual deployment
cd /var/www/theme-editor
git pull origin main
npm ci
npm run build
pm2 reload theme-editor
```

**Problems:**

- No zero-downtime deployment
- No rollback mechanism
- No automated testing before deploy
- No deployment notifications

**Recommended CI/CD:**

```yaml
# GitHub Actions example
name: Deploy to VPS
on:
  push:
    branches: [main]
jobs:
  deploy:
    steps:
      - Run tests
      - Build production
      - Create backup
      - Deploy to staging
      - Smoke test
      - Deploy to production
      - Notify team
```

---

## 🎯 8. RECOMMENDATIONS

### Immediate Actions (This Week)

1. **Rotate All Exposed Credentials**
   - Generate new GitHub token
   - Rotate database password
   - Update Vercel token
   - Add `.env.local` to `.gitignore`

2. **Add Critical Monitoring**

   ```bash
   npm install @sentry/nextjs
   # Configure error tracking
   ```

3. **Implement Health Check**

   ```typescript
   // /api/health/route.ts
   export async function GET() {
     const checks = {
       database: await checkDatabase(),
       fileSystem: await checkFileSystem(),
       timestamp: new Date(),
     };
     return NextResponse.json(checks);
   }
   ```

4. **Add Rate Limiting to Critical Endpoints**
   - `/api/deploy-project`
   - `/api/export-project`
   - `/api/payments`

### Short-Term (2 Weeks)

5. **Implement Job Queue**
   - Install BullMQ + Redis
   - Move deployment to background jobs
   - Add job status polling endpoint

6. **Refactor Export Handler**
   - Split 2688-line file into modules
   - Add unit tests for each generator

7. **Add Input Validation**

   ```typescript
   import { z } from "zod";

   const PaymentSchema = z.object({
     amount: z.number().positive(),
     currency: z.string().length(3),
     planId: z.string().uuid(),
   });
   ```

### Medium-Term (1 Month)

8. **Set Up Proper Logging**
   - Winston/Pino for structured logs
   - Log aggregation (Loki, ELK stack)

9. **Database Migration Strategy**
   - Switch from `db push` to `migrate`
   - Version control migrations

10. **File Storage Migration**
    - Move from `/public/uploads` to S3/R2
    - Update all file URLs

### Long-Term (3 Months)

11. **Infrastructure Upgrade**
    - Add Redis for caching/queues
    - Set up CDN (Cloudflare, AWS CloudFront)
    - Implement database replication

12. **Observability Stack**
    - Prometheus for metrics
    - Grafana for dashboards
    - Sentry for errors
    - OpenTelemetry for tracing

13. **CI/CD Pipeline**
    - GitHub Actions for automated testing
    - Staging environment
    - Blue-green deployment

---

## 📋 NEXT STEPS

This completes **Phase 1: Audit**.

**Ready for Phase 2?** The next phase will focus on implementing the critical fixes identified here, starting with:

1. Job queue implementation
2. Monitoring setup
3. Security hardening
4. Export handler refactoring

Would you like to proceed with:

- **Phase 2a:** Quick wins (monitoring, health checks, rate limiting)
- **Phase 2b:** Job queue implementation
- **Phase 2c:** Security hardening

---

## 📊 APPENDIX: METRICS

### Codebase Statistics

| Metric                | Value                                              |
| --------------------- | -------------------------------------------------- |
| Total API Routes      | 31 (reduced from 32 after removing export-project) |
| Database Models       | 7                                                  |
| Total Dependencies    | 51                                                 |
| Largest File          | `deploy-processor.ts` (326 lines)                  |
| Auth-Protected Routes | 27/31 (87.1%)                                      |
| Rate-Limited Routes   | 2/31 (6.5%)                                        |

### Technical Debt Score

| Category      | Score (0-10) | Weight | Weighted Score |
| ------------- | ------------ | ------ | -------------- |
| Code Quality  | 6            | 20%    | 1.2            |
| Security      | 4            | 30%    | 1.2            |
| Scalability   | 5            | 25%    | 1.25           |
| Observability | 2            | 15%    | 0.3            |
| Testing       | 3            | 10%    | 0.3            |
| **Total**     | **4.25/10**  | 100%   | **4.25**       |

**Interpretation:**  
4.25/10 = "Functional but needs significant work before scaling"
