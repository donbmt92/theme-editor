# Test Uploads Locally for Windows
Write-Host "🧪 Testing Uploads Locally..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Checking uploads directory..." -ForegroundColor Yellow

# Check if uploads directory exists
if (-not (Test-Path "public/uploads")) {
    Write-Host "📂 Creating uploads directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "public/uploads" -Force | Out-Null
    Write-Host "✅ Uploads directory created" -ForegroundColor Green
} else {
    Write-Host "✅ Uploads directory exists" -ForegroundColor Green
}

# Check if there are any files in uploads
$uploadFiles = Get-ChildItem "public/uploads" -File
if ($uploadFiles.Count -gt 0) {
    Write-Host "📄 Found $($uploadFiles.Count) files in uploads directory:" -ForegroundColor Cyan
    $uploadFiles | ForEach-Object {
        Write-Host "   - $($_.Name) ($($_.Length) bytes)" -ForegroundColor White
    }
} else {
    Write-Host "📄 No files found in uploads directory" -ForegroundColor Yellow
}

# Test if we can write to the directory
Write-Host "🔐 Testing write permissions..." -ForegroundColor Yellow
try {
    $testFile = "public/uploads/test-write.txt"
    "test" | Out-File -FilePath $testFile -Encoding UTF8
    Remove-Item $testFile -Force
    Write-Host "✅ Uploads directory is writable" -ForegroundColor Green
} catch {
    Write-Host "❌ Uploads directory is not writable" -ForegroundColor Red
    Write-Host "💡 Try running as Administrator or check folder permissions" -ForegroundColor Yellow
}

# Check if Next.js dev server is running
Write-Host "🌐 Checking if Next.js dev server is running..." -ForegroundColor Yellow
$devServer = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq "node" }

if ($devServer) {
    Write-Host "✅ Node.js processes found:" -ForegroundColor Green
    $devServer | ForEach-Object {
        Write-Host "   - PID: $($_.Id), Memory: $([math]::Round($_.WorkingSet64/1MB, 2)) MB" -ForegroundColor White
    }
} else {
    Write-Host "⚠️  No Node.js processes found" -ForegroundColor Yellow
    Write-Host "💡 Start dev server with: npm run dev" -ForegroundColor Cyan
}

# Test upload API endpoint
Write-Host "🧪 Testing upload API endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/upload" -Method GET -TimeoutSec 5
    Write-Host "✅ Upload API is accessible (Method not allowed - expected)" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 405) {
        Write-Host "✅ Upload API is accessible (Method not allowed - expected)" -ForegroundColor Green
    } else {
        Write-Host "❌ Upload API is not accessible: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "💡 Make sure Next.js dev server is running" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "1. Start dev server: npm run dev" -ForegroundColor White
Write-Host "2. Open test-upload.html in browser" -ForegroundColor White
Write-Host "3. Test file upload functionality" -ForegroundColor White
Write-Host "4. Check if files appear in public/uploads directory" -ForegroundColor White
Write-Host ""
Write-Host "📝 For production deployment:" -ForegroundColor Yellow
Write-Host "- Run fix-nginx-uploads.sh on your VPS" -ForegroundColor White
Write-Host "- Ensure Nginx serves /uploads/ location" -ForegroundColor White
Write-Host "- Check file permissions on server" -ForegroundColor White
