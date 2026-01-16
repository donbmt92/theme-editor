# Vercel Integration Setup Guide

## Prerequisites

You need a Vercel API Token to deploy projects automatically.

## Steps to Setup

### 1. Get Vercel API Token

1. Go to [Vercel Account Settings > Tokens](https://vercel.com/account/tokens)
2. Click **"Create Token"**
3. Give it a name: `Theme Editor Deployment`
4. Select scope: **Full Account** (recommended) or specific team
5. Click **"Create"**
6. **IMPORTANT:** Copy the token immediately (starts with `ver_` or similar)

### 2. Get Team ID (Optional)

If you're using a team account:
1. Go to your Vercel dashboard
2. Click on your team name
3. Go to Settings > General
4. Copy the Team ID

### 3. Add to Environment Variables

Edit `.env.local` file:

```bash
# Vercel Integration
VERCEL_TOKEN="your_vercel_token_here"
VERCEL_TEAM_ID="team_xxxxxxxxxxxxx"  # Optional, only if using team
```

**Example:**
```bash
VERCEL_TOKEN="ver_abc123xyz789..."
VERCEL_TEAM_ID="team_aBc123XyZ"
```

### 4. Restart Development Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## Testing the Integration

### Option 1: Deploy existing GitHub repo

```powershell
$body = @{
    repoFullName = "donbmt92/coffee-shop-1768460885-usr001"
    projectName = "coffee-shop-test"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/vercel/deploy" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

### Expected Result

```json
{
  "success": true,
  "vercel": {
    "deploymentUrl": "https://coffee-shop-test.vercel.app",
    "projectUrl": "https://vercel.com/your-account/coffee-shop-test",
    "deploymentId": "dpl_xxxxxxxxxxxxx"
  }
}
```

## What Happens During Deployment

1. **Create Vercel Project** - Links to GitHub repository
2. **Trigger Deployment** - Deploys from main branch
3. **Return URLs** - Gives you live deployment URL

## Troubleshooting

### Error: "VERCEL_TOKEN must be set"

**Solution:** Make sure `.env.local` contains valid token.

### Error: "Failed to create Vercel project"

**Possible causes:**
- Token is invalid or expired
- Repository doesn't exist
- No permission to deploy (check token scope)

### Error: "Repository not found"

**Solution:** 
- Make sure GitHub repo exists
- Check repo name format: `owner/repo-name`
- Ensure Vercel has access to your GitHub account

## Vercel GitHub Integration

For Vercel to deploy from GitHub, you need to:

1. Go to [Vercel Integrations](https://vercel.com/account/integrations)
2. Find **GitHub** integration
3. Click **"Configure"** or **"Add"**
4. Grant Vercel access to your repositories
5. Select **All repositories** or specific repos

## Security Notes

- ✅ Never commit `.env.local` to Git (already in `.gitignore`)
- ✅ Token has full account access - keep it secure
- ⚠️ If token is compromised, revoke it immediately on Vercel
- ✅ Team ID is not sensitive, but token is

## Next Steps

After Vercel integration works:
- Combine GitHub + Vercel in single API call
- Update UI to show both repo and deployment URLs
- Add deployment status polling
