// Test script for GitHub integration with existing repository donbmt92/project1
// Using built-in fetch in Node.js

async function testExistingRepository() {
  console.log('🧪 Testing GitHub Integration with existing repository: donbmt92/project1');
  
  const testData = {
    projectId: 'test-existing-repo-001',
    repoName: 'project1', // Using the existing repository name
    description: 'Test project added to existing repository',
    private: false,
    projectFiles: {
      'package.json': JSON.stringify({
        name: 'theme-editor-project',
        version: '1.0.0',
        description: 'Project generated from Theme Editor',
        main: 'index.js',
        scripts: {
          start: 'node index.js',
          dev: 'npm run start'
        },
        dependencies: {
          'react': '^18.2.0',
          'react-dom': '^18.2.0'
        }
      }, null, 2),
      'README.md': `# Theme Editor Project

This project was generated from the Theme Editor and added to the existing repository [donbmt92/project1](https://github.com/donbmt92/project1).

## Features
- Generated from Theme Editor
- React components
- Responsive design
- Modern styling

## Getting Started
\`\`\`bash
npm install
npm start
\`\`\`

Generated on: ${new Date().toISOString()}`,
      'src/App.js': `import React from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Theme Editor Project</h1>
        <p>Generated from Theme Editor and added to existing repository</p>
      </header>
    </div>
  );
}

export default App;`,
      'src/index.js': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      'public/index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Theme Editor Project</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
    }
  };

  try {
    console.log('📤 Sending request to GitHub API...');
    console.log('📋 Test data:', {
      projectId: testData.projectId,
      repoName: testData.repoName,
      fileCount: Object.keys(testData.projectFiles).length
    });
    
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
      console.log(`📁 Repository Name: ${result.repoName}`);
      console.log(`🔒 Private: ${result.isPrivate}`);
      console.log(`⏱️ Creation time: ${result.creationTime}ms`);
      console.log(`💬 Message: ${result.message}`);
      
      console.log('\n🎯 Next steps:');
      console.log('1. Check the repository at: https://github.com/donbmt92/project1');
      console.log('2. Verify files were added correctly');
      console.log('3. Check commit history');
      console.log('4. Test with real GitHub token for actual file upload');
      
    } else {
      console.log('❌ Test failed!');
      console.log(`Error: ${result.error}`);
      if (result.details) {
        console.log(`Details: ${result.details}`);
      }
    }
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the development server is running (npm run dev)');
    console.log('2. Check if the API endpoint is accessible');
    console.log('3. Verify the repository donbmt92/project1 exists');
  }
}

// Run the test
testExistingRepository(); 