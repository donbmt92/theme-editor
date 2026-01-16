Write-Host "Testing Full Export Flow (GitHub + Vercel)..." -ForegroundColor Cyan

$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$projectName = "test-full-$timestamp"

Write-Host "Project: $projectName" -ForegroundColor Yellow

$body = @{
    projectName = $projectName
    description = "Full test with fixed dependencies"
    themeName = "vietnam-coffee"
    userId = "usr-test"
    isPrivate = $false
    themeParams = @{
        colors = @{
            primary = "#D2691E"
            secondary = "#8B4513"
            accent = "#FFA500"
            text = "#2D3748"
            background = "#FFFFFF"
            border = "#E2E8F0"
        }
        typography = @{
            fontFamily = "Inter"
            fontSize = "16px"
            lineHeight = "1.6"
            fontWeight = "400"
            headingSize = "xl"
            bodySize = "base"
        }
        layout = @{
            containerWidth = "1200px"
            sectionSpacing = "32px"
            spacing = "comfortable"
            borderRadius = "8px"
        }
        components = @{
            button = @{
                style = "solid"
                size = "medium"
                rounded = $false
            }
        }
    }
} | ConvertTo-Json -Depth 10

try {
    Write-Host "Step 1: Creating GitHub repo..." -ForegroundColor Yellow
    $githubResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/github/create-repo" -Method Post -Body $body -ContentType "application/json"
    
    if ($githubResponse.success) {
        Write-Host "SUCCESS - GitHub repo created!" -ForegroundColor Green
        Write-Host "  Repo: $($githubResponse.github.repoUrl)" -ForegroundColor Cyan
        Write-Host "  Files: $($githubResponse.fileCount)" -ForegroundColor White
        
        Write-Host "`nStep 2: Deploying to Vercel..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
        
        $vercelBody = @{
            repoFullName = $githubResponse.github.repoFullName
            projectName = $projectName
        } | ConvertTo-Json
        
        $vercelResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/vercel/deploy" -Method Post -Body $vercelBody -ContentType "application/json"
        
        if ($vercelResponse.success) {
            Write-Host "SUCCESS - Vercel deployment created!" -ForegroundColor Green
            Write-Host "`nFinal URLs:" -ForegroundColor Yellow
            Write-Host "  GitHub: $($githubResponse.github.repoUrl)" -ForegroundColor Cyan
            Write-Host "  Live Site: $($vercelResponse.vercel.deploymentUrl)" -ForegroundColor Green
            Write-Host "  Vercel Dashboard: $($vercelResponse.vercel.projectUrl)" -ForegroundColor White
            Write-Host "`nWait 1-2 minutes for Vercel build to complete, then check live site!" -ForegroundColor Yellow
        } else {
            Write-Host "Vercel failed: $($vercelResponse.error)" -ForegroundColor Red
        }
    } else {
        Write-Host "GitHub failed: $($githubResponse.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
