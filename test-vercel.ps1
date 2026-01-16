Write-Host "🚀 Testing Vercel Deployment..." -ForegroundColor Cyan
Write-Host ""

# Use the repo we created earlier
$repoFullName = "donbmt92/coffee-shop-1768460885-usr001"
$projectName = "coffee-test-deploy"

Write-Host "📋 Config:" -ForegroundColor Yellow
Write-Host "  Repo: $repoFullName" -ForegroundColor White
Write-Host "  Project: $projectName" -ForegroundColor White
Write-Host ""

$body = @{
    repoFullName = $repoFullName
    projectName = $projectName
} | ConvertTo-Json

try {
    Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/vercel/deploy" -Method Post -Body $body -ContentType "application/json" -UseBasicParsing
    
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    $result = $response.Content | ConvertFrom-Json
    
    if ($result.success) {
        Write-Host "`n🎉 DEPLOYMENT SUCCESS!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Deployment URL:" -ForegroundColor Yellow
        Write-Host "   $($result.vercel.deploymentUrl)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📊 Project Dashboard:" -ForegroundColor Yellow
        Write-Host "   $($result.vercel.projectUrl)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "🆔 Deployment ID:" -ForegroundColor Yellow
        Write-Host "   $($result.vercel.deploymentId)" -ForegroundColor White
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
