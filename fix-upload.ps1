# Fix Upload Directory Issues for Windows
Write-Host "🔧 Fixing Upload Directory Issues..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Checking upload directory..." -ForegroundColor Yellow

# Create upload directory if it doesn't exist
if (-not (Test-Path "public/uploads")) {
    Write-Host "📂 Creating upload directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "public/uploads" -Force | Out-Null
    Write-Host "✅ Upload directory created" -ForegroundColor Green
} else {
    Write-Host "✅ Upload directory exists" -ForegroundColor Green
}

# Check permissions
Write-Host "🔐 Checking permissions..." -ForegroundColor Yellow

# Test if we can write to the directory
try {
    $testFile = "public/uploads/test-write.txt"
    "test" | Out-File -FilePath $testFile -Encoding UTF8
    Remove-Item $testFile -Force
    Write-Host "✅ Upload directory is writable" -ForegroundColor Green
} catch {
    Write-Host "❌ Upload directory is not writable" -ForegroundColor Red
    Write-Host "💡 Try running as Administrator or check folder permissions" -ForegroundColor Yellow
}

# Check if Node.js can write to the directory
Write-Host "🧪 Testing Node.js write access..." -ForegroundColor Yellow

try {
    node -e "
    const fs = require('fs');
    const path = require('path');

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const testFile = path.join(uploadDir, 'test-write.txt');

    try {
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
        console.log('✅ Node.js can write to upload directory');
    } catch (error) {
        console.log('❌ Node.js cannot write to upload directory:', error.message);
        process.exit(1);
    }
    "
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Upload directory is fully functional" -ForegroundColor Green
    } else {
        Write-Host "❌ Upload directory has issues" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Failed to test Node.js access" -ForegroundColor Red
}

Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run build" -ForegroundColor White
Write-Host "2. Run: npm start" -ForegroundColor White
Write-Host "3. Test upload functionality in the browser" -ForegroundColor White
Write-Host ""
Write-Host "📝 If upload still doesn't work, check the console logs for errors" -ForegroundColor Yellow
