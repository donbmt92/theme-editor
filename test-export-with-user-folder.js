#!/usr/bin/env node

/**
 * Script test export project với user folder và deploy script
 * Chạy: node test-export-with-user-folder.js
 */

const https = require('https')

// Cấu hình test
const TEST_CONFIG = {
  projectId: 'test-project-' + Date.now(),
  userId: 'user-test-' + Math.random().toString(36).substr(2, 9),
  projectName: 'vietnam-coffee-export-test',
  description: 'Test project export với user folder',
  framework: 'html', // html, react, nextjs
  serverType: 'nginx', // nginx, apache, node, docker
  apiUrl: 'http://localhost:3000/api/export-project'
}

console.log('🧪 Bắt đầu test export project...')
console.log('📋 Cấu hình test:', TEST_CONFIG)

// Payload cho API
const payload = {
  projectId: TEST_CONFIG.projectId,
  userId: TEST_CONFIG.userId,
  projectName: TEST_CONFIG.projectName,
  description: TEST_CONFIG.description,
  framework: TEST_CONFIG.framework,
  typescript: false,
  cssFramework: 'vanilla',
  includeAssets: true,
  createGitHubRepo: false,
  deployToVercel: false,
  createUserFolder: true,  // ✅ Test user folder
  generateDeployScript: true,  // ✅ Test deploy script
  serverType: TEST_CONFIG.serverType,
  themeParams: {
    colors: {
      primary: '#8B4513',
      secondary: '#D2691E',
      accent: '#CD853F',
      background: '#F5F5DC',
      text: '#2D3748'
    },
    content: {
      header: {
        title: 'Cà Phê Việt Test',
        subtitle: 'Premium Export Coffee'
      },
      hero: {
        title: 'Test Export với User Folder',
        description: 'Đây là project test để kiểm tra tính năng user folder và deploy script',
        ctaText: 'Tìm hiểu thêm'
      },
      meta: {
        title: 'Test Project - Cà Phê Việt',
        description: 'Test export functionality với user folder',
        keywords: 'test, export, user folder, deploy script'
      }
    }
  }
}

// Helper function để make HTTP request
function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(data))
      }
    }

    const req = (urlObj.protocol === 'https:' ? https : require('http')).request(options, (res) => {
      let body = ''
      
      res.on('data', (chunk) => {
        body += chunk
      })
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body)
          resolve({ status: res.statusCode, data: response })
        } catch (error) {
          reject(new Error('Invalid JSON response: ' + body))
        }
      })
    })

    req.on('error', reject)
    req.write(JSON.stringify(data))
    req.end()
  })
}

// Main test function
async function runTest() {
  try {
    console.log('\n🚀 Gửi request export...')
    
    const response = await makeRequest(TEST_CONFIG.apiUrl, payload)
    
    console.log('\n📊 Response status:', response.status)
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Export thành công!')
      console.log('\n📁 Kết quả:')
      console.log('  - Project ID:', response.data.projectId)
      console.log('  - Project Name:', response.data.projectName)
      console.log('  - Download URL:', response.data.downloadUrl)
      console.log('  - File Size:', (response.data.fileSize / 1024).toFixed(2) + ' KB')
      console.log('  - File Count:', response.data.fileCount)
      
      if (response.data.userFolderPath) {
        console.log('  - User Folder:', response.data.userFolderPath)
        console.log('    ✅ User folder được tạo thành công!')
      } else {
        console.log('    ❌ User folder không được tạo')
      }
      
      if (response.data.deployScriptPath) {
        console.log('  - Deploy Script:', response.data.deployScriptPath)
        console.log('    ✅ Deploy script được tạo thành công!')
      } else {
        console.log('    ❌ Deploy script không được tạo')
      }
      
      console.log('\n🎉 Test case PASSED!')
      console.log('\n📝 Bước tiếp theo:')
      console.log('  1. Tải file ZIP từ:', response.data.downloadUrl)
      console.log('  2. Giải nén và kiểm tra cấu trúc folder')
      console.log('  3. Chạy deploy script để test:', response.data.deployScriptPath)
      
    } else {
      console.log('❌ Export thất bại!')
      console.log('Error:', response.data.error || 'Unknown error')
      console.log('Details:', response.data.details || 'No details')
      process.exit(1)
    }
    
  } catch (error) {
    console.log('💥 Test thất bại!')
    console.error('Error:', error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Hướng dẫn:')
      console.log('  1. Đảm bảo Next.js dev server đang chạy')
      console.log('  2. Chạy: npm run dev')
      console.log('  3. Kiểm tra URL API:', TEST_CONFIG.apiUrl)
    }
    
    process.exit(1)
  }
}

// Validation function
function validateConfig() {
  const required = ['projectId', 'userId', 'projectName', 'framework', 'serverType']
  const missing = required.filter(field => !TEST_CONFIG[field])
  
  if (missing.length > 0) {
    console.log('❌ Missing required config:', missing.join(', '))
    process.exit(1)
  }
  
  const validFrameworks = ['html', 'react', 'nextjs']
  if (!validFrameworks.includes(TEST_CONFIG.framework)) {
    console.log('❌ Invalid framework:', TEST_CONFIG.framework)
    console.log('Valid options:', validFrameworks.join(', '))
    process.exit(1)
  }
  
  const validServerTypes = ['nginx', 'apache', 'node', 'docker']
  if (!validServerTypes.includes(TEST_CONFIG.serverType)) {
    console.log('❌ Invalid serverType:', TEST_CONFIG.serverType)
    console.log('Valid options:', validServerTypes.join(', '))
    process.exit(1)
  }
}

// Chạy test
console.log('🔍 Kiểm tra cấu hình...')
validateConfig()
console.log('✅ Cấu hình hợp lệ')

runTest()

// Export cho sử dụng programmatically
module.exports = {
  runTest,
  TEST_CONFIG,
  makeRequest
}