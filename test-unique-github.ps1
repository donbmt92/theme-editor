$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$uniqueRepoName = "coffee-shop-$timestamp"

Write-Host "🧪 Testing with unique repo: $uniqueRepoName" -ForegroundColor Cyan

$testBody = @{
    projectName = $uniqueRepoName
    description = "Test Coffee Shop - Auto Generated"
    themeName = "vietnam-coffee"
    userId = "usr001"
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
            }
        }
    }
} | ConvertTo-Json -Depth 10

try {
    Write-Host "Sending request..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/github/create-repo" -Method Post -Body $testBody -ContentType "application/json" -UseBasicParsing
    
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    $result = $response.Content | ConvertFrom-Json
    
    if ($result.success) {
        Write-Host "`n🎉 SUCCESS!" -ForegroundColor Green
        Write-Host "Repo URL: $($result.github.repoUrl)" -ForegroundColor Cyan
        Write-Host "Files: $($result.fileCount)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Failed: $($result.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ HTTP Error: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Error: $($errorObj.error)" -ForegroundColor Yellow
        if ($errorObj.details) {
            Write-Host "`nDetails:" -ForegroundColor Gray
            Write-Host $errorObj.details -ForegroundColor Gray
        }
    }
}
