#!/bin/bash

echo "🔧 Fixing Upload Directory Issues..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📁 Checking upload directory..."

# Create upload directory if it doesn't exist
if [ ! -d "public/uploads" ]; then
    echo "📂 Creating upload directory..."
    mkdir -p public/uploads
    echo "✅ Upload directory created"
else
    echo "✅ Upload directory exists"
fi

# Check permissions
echo "🔐 Checking permissions..."

# Make sure the directory is writable
if [ -w "public/uploads" ]; then
    echo "✅ Upload directory is writable"
else
    echo "⚠️  Upload directory is not writable, attempting to fix..."
    chmod 755 public/uploads
    if [ -w "public/uploads" ]; then
        echo "✅ Permissions fixed"
    else
        echo "❌ Failed to fix permissions"
        echo "💡 Try running: sudo chmod 755 public/uploads"
    fi
fi

# Check if Node.js can write to the directory
echo "🧪 Testing Node.js write access..."
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

if [ $? -eq 0 ]; then
    echo "✅ Upload directory is fully functional"
else
    echo "❌ Upload directory has issues"
    echo "💡 Try running: sudo chown -R $USER:$USER public/uploads"
fi

echo ""
echo "🚀 Next steps:"
echo "1. Run: npm run build"
echo "2. Run: npm start"
echo "3. Test upload functionality in the browser"
echo ""
echo "📝 If upload still doesn't work, check the console logs for errors"
