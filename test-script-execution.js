const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

async function testScriptExecution() {
  console.log('🧪 Testing script execution...');
  
  // Test 1: Kiểm tra file script có tồn tại không
  const scriptPath = 'deploy-nginx.sh';
  const currentDir = process.cwd();
  const fullScriptPath = path.join(currentDir, scriptPath);
  
  console.log('Current directory:', currentDir);
  console.log('Looking for script:', fullScriptPath);
  
  try {
    await fs.promises.access(fullScriptPath);
    console.log('✅ Script found:', fullScriptPath);
    
    // Test 2: Kiểm tra nội dung thư mục
    const files = await fs.promises.readdir(currentDir);
    console.log('📁 Files in current directory:', files);
    
    // Test 3: Kiểm tra quyền thực thi
    const stats = await fs.promises.stat(fullScriptPath);
    console.log('📋 Script permissions:', stats.mode.toString(8));
    
    // Test 4: Thử chạy script (chỉ test syntax, không thực sự chạy)
    console.log('🔍 Testing script syntax...');
    exec(`bash -n "${fullScriptPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Script syntax error:', error.message);
      } else {
        console.log('✅ Script syntax is valid');
      }
    });
    
  } catch (error) {
    console.log('❌ Script not found:', error.message);
    
    // Thử tìm trong các thư mục khác
    const searchPaths = [
      path.join(currentDir, 'public', 'deploys'),
      path.join(currentDir, 'public'),
      path.join(currentDir, '..')
    ];
    
    for (const searchPath of searchPaths) {
      try {
        const testPath = path.join(searchPath, scriptPath);
        await fs.promises.access(testPath);
        console.log('✅ Script found in:', testPath);
        break;
      } catch (e) {
        console.log('❌ Not found in:', searchPath);
      }
    }
  }
}

testScriptExecution().catch(console.error); 