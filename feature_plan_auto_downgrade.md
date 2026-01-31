# Feature Plan: Automatic Account Downgrade (Pro expiration)

## 📌 Current Status (The Issue)

Currently, the **User Tier (FREE/PRO)** is only updated/re-calculated when a **Payment Webhook** is received from the payment gateway (Sepay).

**The Bug/Loophole:**

- If a user reaches PRO status (>= 500k VND/30 days).
- They stop paying effectively.
- Since no new payment webhook is triggered, `updateUserTier` is never called.
- **Result**: The user retains **PRO status indefinitely** until they make another payment (which triggers a recalculation).

## 🛠 Proposed Solution

Implement a **"Lazy Check" mechanism on Login**. Instead of a complex server-side timer/cronjob, we simply re-validate the user's status whenever they start a new session.

### Technical Implementation Steps

#### 1. Modify Authentication Logic (`src/lib/auth.ts`)

Update the `next-auth` configuration to force a tier check during the `jwt` callback or `authorize` function.

**Changes:**

- Import `updateUserTier` in `auth.ts`.
- Inside `callbacks.jwt`:
  - Check if `trigger === "signIn"`.
  - If yes, call `await updateUserTier(user.id)`.
  - Update the token with the fresh tier value.

```typescript
// Pseudo-code for src/lib/auth.ts
async jwt({ token, user, trigger }) {
    if (user && trigger === 'signIn') {
        // Force refresh tier from DB calculation on every login
        const freshTier = await updateUserTier(user.id);
        token.tier = freshTier;
    }
    return token;
}
```

#### 2. (Optional) Middleware Check

If users stay logged in for months (persistent sessions), the Login check might not trigger often enough.

- **Solution**: Add a check in `middleware.ts` or a global layout wrapper to check `lastUpdated` timestamp of the tier. If > 24h, verify again.

## 📉 Impact of Downgrade (When fixed)

When a user's status reverts to **FREE**:

1.  **Deployments**:
    - **Blocked**: Cannot deploy new versions or updates (`canDeployVercel: false`).
    - **Existing Sites**: Live sites **remain active** (we do not delete generated Nginx configs or files).

2.  **Projects**:
    - **Read-only**: Can access existing projects.
    - **Creation Blocked**: If `projectCount >= 3`, cannot create new projects.

3.  **Editor Features**:
    - **Locked**: "Pro-only" tabs (like Product Page, Advanced SEO) will be disabled or show Upgrade prompt.

## ✅ Action Plan

This feature is marked as **pending**. To be implemented after the initial sales phase to enforce recurring revenue.
