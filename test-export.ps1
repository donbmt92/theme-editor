$body = @{
    themeName = "vietnam-coffee"
    projectName = "test-coffee-export"
    userId = "test-user-123"
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
            spacing = "comfortable"
            borderRadius = "medium"
        }
        components = @{
            button = @{
                style = "solid"
                size = "medium"
            }
        }
        content = @{
            hero = @{
                title = "Test Coffee"
            }
        }
    }
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/test-export" -Method Post -Body $body -ContentType "application/json"

Write-Host "Status: $($response.success)" -ForegroundColor Green
Write-Host "File Count: $($response.fileCount)" -ForegroundColor Cyan
Write-Host "`nGenerated Files:" -ForegroundColor Yellow
$response.files | ForEach-Object { Write-Host "  - $_" }
