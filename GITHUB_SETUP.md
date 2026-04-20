# GitHub Integration Setup Guide

## Prerequisites

You need a GitHub Personal Access Token to use the export feature.

## Steps to Setup

### 1. Create GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Give it a name: `Theme Editor Export`
4. Select expiration: **No expiration** (recommended) or custom
5. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
6. Click **"Generate token"**
7. **IMPORTANT:** Copy the token immediately (starts with `ghp_`)

### 2. Add to Environment Variables

Create or edit `.env.local` file:

```bash
# GitHub Integration
GITHUB_TOKEN="ghp_your_token_here"
GITHUB_OWNER="your-github-username"
```

**Example:**
```bash
GITHUB_TOKEN="ghp_abc123xyz789"
GITHUB_OWNER="donbmt92"
```

### 3. Restart Development Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## Testing the Integration

### Option 1: Using PowerShell Script

```powershell
# Run test script
./test-github-export.ps1
```

### Option 2: Manual API Call

```powershell
$body = @{
    projectName = "my-coffee-shop"
    description = "Coffee shop website built with Theme Editor"
    themeName = "vietnam-coffee"
    userId = "test-user-123"
    isPrivate = $false
    themeParams = @{
        colors = @{
            primary = "#D2691E"
            secondary = "#8B4513"
            accent = "#FFA500"
            text = "#2D3748"
            background = "#FFFFFF"
        }
        typography = @{
            fontFamily = "Inter"
            fontSize = "16px"
            lineHeight = "1.6"
            fontWeight = "400"
            headingSize = "xl"
            bodySize = "base"
        }
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:3000/api/github/create-repo" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

## Expected Result

```json
{
  "success": true,
  "github": {
    "repoUrl": "https://github.com/your-username/my-coffee-shop-test123",
    "repoName": "my-coffee-shop-test123",
    "repoFullName": "your-username/my-coffee-shop-test123"
  },
  "fileCount": 23
}
```

## Troubleshooting

### Error: "GITHUB_TOKEN and GITHUB_OWNER must be set"

**Solution:** Make sure `.env.local` exists and contains valid values.

### Error: "Bad credentials"

**Solutions:**
- Check token is correct (starts with `ghp_`)
- Verify token hasn't expired
- Ensure token has `repo` scope

### Error: "Repository already exists"

**Solution:** Repository names must be unique. The API automatically appends userId to project name to avoid conflicts.

## Security Notes

- ✅ Never commit `.env.local` to Git (already in `.gitignore`)
- ✅ Use Classic Personal Access Tokens (Fine-grained tokens have issues with API)
- ✅ Keep token secure - it has full access to your repos
- ⚠️ If token is compromised, revoke it immediately on GitHub

## What Happens During Export

1. **Generate Project Files** - Creates Next.js project structure
2. **Create GitHub Repo** - Creates new repository under your account
3. **Push Files** - Commits all 23 files to the repo
4. **Return URLs** - Gives you the GitHub repo URL

## Next Steps

After GitHub integration works, we'll add:
- Vercel deployment (Phase 3)
- UI integration (Phase 4)