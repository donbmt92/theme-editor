Write-Host "🧪 Testing simplified GitHub repo creation..." -ForegroundColor Cyan

$testBody = @{
    projectName = "test-simple-repo"
    description = "Simple test repository"
    themeName = "vietnam-coffee"
    userId = "usr123"
    isPrivate = $false
    themeParams = @{
        colors = @{
            primary = "#000000"
            secondary = "#ffffff"
            accent = "#ff0000"
            text = "#000000"
            background = "#ffffff"
        }
        typography = @{
            fontFamily = "Arial"
            fontSize = "16px"
            lineHeight = "1.5"
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
    
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    $result = $response.Content | ConvertFrom-Json
    
    if ($result.success) {
        Write-Host "✅ SUCCESS!" -ForegroundColor Green
        Write-Host "Repo URL: $($result.github.repoUrl)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Failed: $($result.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ HTTP Error: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Error: $($errorObj.error)" -ForegroundColor Yellow
        if ($errorObj.details) {
            Write-Host $errorObj.details -ForegroundColor Gray
        }
    }
}
