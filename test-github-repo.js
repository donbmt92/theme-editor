// Test script for GitHub integration with donbmt92/project1
const fetch = require('node-fetch');

async function testGitHubIntegration() {
  console.log('🧪 Testing GitHub Integration with donbmt92/project1');
  
  const testData = {
    projectId: 'test-project-001',
    repoName: 'project1', // Using the existing repository name
    description: 'Test project generated from Theme Editor',
    private: false,
    projectFiles: {
      'package.json': JSON.stringify({
        name: 'test-project',
        version: '1.0.0',
        description: 'Test project',
        main: 'index.js',
        scripts: {
          start: 'node index.js'
        }
      }, null, 2),
      'README.md': '# Test Project\n\nThis is a test project generated from Theme Editor.',
      'index.js': 'console.log("Hello from Theme Editor!");'
    }
  };

  try {
    console.log('📤 Sending request to GitHub API...');
    
    const response = await fetch('http://localhost:3000/api/create-github-repo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log('📥 Response received:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Test successful!');
      console.log(`🔗 Repository URL: ${result.repoUrl}`);
      console.log(`⏱️ Creation time: ${result.creationTime}ms`);
    } else {
      console.log('❌ Test failed!');
      console.log(`Error: ${result.error}`);
    }
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
  }
}

// Run the test
testGitHubIntegration(); 