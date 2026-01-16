Write-Host "Testing Vercel Deployment..." -ForegroundColor Cyan

$repoFullName = "donbmt92/coffee-shop-1768460885-usr001"
$projectName = "coffee-test-deploy"

Write-Host "Repo: $repoFullName" -ForegroundColor Yellow
Write-Host "Project: $projectName" -ForegroundColor Yellow

$body = @{
    repoFullName = $repoFullName
    projectName = $projectName
} | ConvertTo-Json

try {
    Write-Host "Deploying..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/vercel/deploy" -Method Post -Body $body -ContentType "application/json" -UseBasicParsing
    
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    $result = $response.Content | ConvertFrom-Json
    
    if ($result.success) {
        Write-Host "SUCCESS!" -ForegroundColor Green
        Write-Host "Deployment URL: $($result.vercel.deploymentUrl)" -ForegroundColor Cyan
        Write-Host "Project URL: $($result.vercel.projectUrl)" -ForegroundColor Cyan
        Write-Host "Deployment ID: $($result.vercel.deploymentId)" -ForegroundColor White
    } else {
        Write-Host "Failed: $($result.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "HTTP Error: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Error: $($errorObj.error)" -ForegroundColor Yellow
    }
}
