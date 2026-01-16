$body = @{
    projectName = "test-coffee-shop"
    description = "Test Coffee Shop - Built with Theme Editor"
    themeName = "vietnam-coffee"
    userId = "test-user-xyz"
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
            sectionSpacing = "comfortable"
            spacing = "comfortable"
            borderRadius = "medium"
        }
        components = @{
            button = @{
                style = "solid"
                size = "medium"
                rounded = $false
            }
            card = @{
                shadow = "medium"
                border = $true
            }
        }
        content = @{
            meta = @{
                title = "Test Coffee Shop"
                description = "Premium Vietnamese Coffee for Export"
            }
            hero = @{
                title = "Test Coffee Shop"
                description = "Premium Vietnamese Coffee"
            }
        }
    }
} | ConvertTo-Json -Depth 10

Write-Host "🚀 Testing GitHub Integration (Attempt 2)..." -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/github/create-repo" -Method Post -Body $body -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "✅ SUCCESS!" -ForegroundColor Green
        Write-Host ""
        Write-Host "GitHub Repository Created:" -ForegroundColor Yellow
        Write-Host "  - URL: $($response.github.repoUrl)" -ForegroundColor Cyan
        Write-Host "  - Name: $($response.github.repoName)" -ForegroundColor Cyan
        Write-Host "  - Files: $($response.fileCount)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "✅ Open in browser: $($response.github.repoUrl)" -ForegroundColor Green
    } else {
        Write-Host "❌ FAILED: $($response.error)" -ForegroundColor Red
        if ($response.details) {
            Write-Host "Details: $($response.details)" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "❌ ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Server Response:" -ForegroundColor Yellow
        Write-Host ($_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 5) -ForegroundColor Yellow
    }
}
