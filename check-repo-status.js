// Check repository status for donbmt92/project1
async function checkRepositoryStatus() {
  console.log('🔍 Checking repository status: donbmt92/project1');
  
  try {
    // Check repository info
    const repoResponse = await fetch('https://api.github.com/repos/donbmt92/project1');
    
    if (repoResponse.status === 200) {
      const repoData = await repoResponse.json();
      console.log('✅ Repository exists and is accessible');
      console.log('📋 Repository Info:');
      console.log(`   Name: ${repoData.name}`);
      console.log(`   Full Name: ${repoData.full_name}`);
      console.log(`   URL: ${repoData.html_url}`);
      console.log(`   Private: ${repoData.private}`);
      console.log(`   Created: ${repoData.created_at}`);
      console.log(`   Updated: ${repoData.updated_at}`);
      console.log(`   Default Branch: ${repoData.default_branch}`);
      console.log(`   Size: ${repoData.size} KB`);
      console.log(`   Language: ${repoData.language || 'Not specified'}`);
      console.log(`   Has Issues: ${repoData.has_issues}`);
      console.log(`   Has Projects: ${repoData.has_projects}`);
      console.log(`   Has Downloads: ${repoData.has_downloads}`);
      console.log(`   Has Wiki: ${repoData.has_wiki}`);
      console.log(`   Has Pages: ${repoData.has_pages}`);
      console.log(`   Has Discussions: ${repoData.has_discussions}`);
      console.log(`   Forks Count: ${repoData.forks_count}`);
      console.log(`   Open Issues Count: ${repoData.open_issues_count}`);
      console.log(`   Watchers Count: ${repoData.watchers_count}`);
      console.log(`   Subscribers Count: ${repoData.subscribers_count}`);
      console.log(`   Network Count: ${repoData.network_count}`);
      console.log(`   License: ${repoData.license?.name || 'Not specified'}`);
      console.log(`   Allow Forking: ${repoData.allow_forking}`);
      console.log(`   Web Commit Signoff Required: ${repoData.web_commit_signoff_required}`);
      console.log(`   Security and Analysis:`, repoData.security_and_analysis);
      
      // Check if main branch exists
      const branchResponse = await fetch('https://api.github.com/repos/donbmt92/project1/branches/main');
      if (branchResponse.status === 200) {
        const branchData = await branchResponse.json();
        console.log('\n✅ Main branch exists');
        console.log(`   Branch Name: ${branchData.name}`);
        console.log(`   Commit SHA: ${branchData.commit.sha}`);
        console.log(`   Commit URL: ${branchData.commit.url}`);
        console.log(`   Protected: ${branchData.protected}`);
      } else {
        console.log('\n❌ Main branch does not exist');
      }
      
      // Check commits
      let commitsData = [];
      const commitsResponse = await fetch('https://api.github.com/repos/donbmt92/project1/commits');
      if (commitsResponse.status === 200) {
        commitsData = await commitsResponse.json();
        console.log(`\n📝 Commits found: ${commitsData.length}`);
        if (commitsData.length > 0) {
          console.log('   Recent commits:');
          commitsData.slice(0, 5).forEach((commit, index) => {
            console.log(`   ${index + 1}. ${commit.commit.message} (${commit.sha.substring(0, 7)})`);
          });
        } else {
          console.log('   No commits found - repository is empty');
        }
      } else {
        console.log('\n❌ Could not fetch commits');
      }
      
      // Check contents
      const contentsResponse = await fetch('https://api.github.com/repos/donbmt92/project1/contents');
      if (contentsResponse.status === 200) {
        const contentsData = await contentsResponse.json();
        console.log(`\n📁 Files found: ${contentsData.length}`);
        if (contentsData.length > 0) {
          console.log('   Files:');
          contentsData.forEach(file => {
            console.log(`   - ${file.name} (${file.type})`);
          });
        } else {
          console.log('   No files found - repository is empty');
        }
      } else if (contentsResponse.status === 404) {
        console.log('\n📁 Repository is empty (no files)');
      } else {
        console.log('\n❌ Could not fetch contents');
      }
      
      // Check if Git initialization steps were completed
      console.log('\n🔍 Git Initialization Status:');
      
      // Check for README.md
      const readmeResponse = await fetch('https://api.github.com/repos/donbmt92/project1/contents/README.md');
      if (readmeResponse.status === 200) {
        console.log('✅ README.md exists');
      } else {
        console.log('❌ README.md does not exist');
      }
      
      // Check for .gitignore
      const gitignoreResponse = await fetch('https://api.github.com/repos/donbmt92/project1/contents/.gitignore');
      if (gitignoreResponse.status === 200) {
        console.log('✅ .gitignore exists');
      } else {
        console.log('❌ .gitignore does not exist');
      }
      
      // Check for LICENSE
      const licenseResponse = await fetch('https://api.github.com/repos/donbmt92/project1/contents/LICENSE');
      if (licenseResponse.status === 200) {
        console.log('✅ LICENSE exists');
      } else {
        console.log('❌ LICENSE does not exist');
      }
      
      console.log('\n📊 Summary:');
      if (commitsData && commitsData.length > 0) {
        console.log('✅ Repository has been initialized with Git');
        console.log('✅ Main branch exists');
        console.log('✅ At least one commit has been made');
      } else {
        console.log('❌ Repository has NOT been initialized with Git');
        console.log('❌ No commits found');
        console.log('❌ Repository is completely empty');
      }
      
    } else if (repoResponse.status === 404) {
      console.log('❌ Repository not found');
    } else {
      console.log(`❌ Error accessing repository: ${repoResponse.status}`);
    }
    
  } catch (error) {
    console.error('💥 Error checking repository status:', error.message);
  }
}

// Run the check
checkRepositoryStatus(); 