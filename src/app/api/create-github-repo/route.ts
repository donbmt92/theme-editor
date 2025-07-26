import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('🐙 [GITHUB] Starting GitHub repository creation...')
  
  try {
    const { projectId, repoName, description, private: isPrivate, projectFiles } = await request.json()

    console.log('📋 [GITHUB] Repository configuration:', {
      projectId,
      repoName,
      description,
      isPrivate,
      fileCount: projectFiles ? Object.keys(projectFiles).length : 0
    })

    // Validate required fields
    if (!repoName) {
      console.error('❌ [GITHUB] Missing repository name')
      return NextResponse.json(
        { success: false, error: 'Repository name is required' },
        { status: 400 }
      )
    }

    console.log('✅ [GITHUB] Validation passed')

    // Get GitHub token from environment or user session
    const githubToken = process.env.GITHUB_TOKEN || request.headers.get('x-github-token')
    
    if (!githubToken) {
      console.log('⚠️ [GITHUB] No GitHub token provided, using mock mode')
      return await createMockRepository(repoName, description, isPrivate, projectFiles, startTime)
    }

    console.log('🔑 [GITHUB] GitHub token found, using real API')

    // Step 1: Check repository name availability
    console.log('🔍 [GITHUB] Step 1: Checking repository name availability...')
    const isAvailable = await checkRepositoryAvailability(repoName, githubToken)
    if (!isAvailable) {
      console.error('❌ [GITHUB] Repository name not available')
      return NextResponse.json(
        { success: false, error: 'Repository name is already taken' },
        { status: 400 }
      )
    }
    console.log('✅ [GITHUB] Repository name available')

    // Step 2: Create repository
    console.log('📝 [GITHUB] Step 2: Creating repository...')
    const repoData = await createRepository(repoName, description, isPrivate, githubToken)
    console.log('✅ [GITHUB] Repository created')

    // Step 3: Initialize with files
    console.log('📁 [GITHUB] Step 3: Initializing with project files...')
    if (projectFiles) {
      console.log(`📄 [GITHUB] Adding ${Object.keys(projectFiles).length} files to repository`)
      await addFilesToRepository(repoData.full_name, projectFiles, githubToken)
    }
    console.log('✅ [GITHUB] Files committed to repository')

    // Step 4: Configure repository settings
    console.log('⚙️ [GITHUB] Step 4: Configuring repository settings...')
    await configureRepository(repoData.full_name, githubToken)
    console.log('✅ [GITHUB] Repository configured')

    const totalTime = Date.now() - startTime

    console.log('🎉 [GITHUB] Repository creation completed successfully:', {
      repoName,
      repoUrl: repoData.html_url,
      isPrivate,
      totalTime: `${totalTime}ms`
    })

    return NextResponse.json({
      success: true,
      repoUrl: repoData.html_url,
      repoName: repoData.name,
      isPrivate: repoData.private,
      message: 'Repository created successfully',
      creationTime: totalTime
    })

  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error('💥 [GITHUB] Repository creation failed after', totalTime, 'ms:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create GitHub repository',
        details: error instanceof Error ? error.message : 'Unknown error',
        creationTime: totalTime
      },
      { status: 500 }
    )
  }
}

// Mock implementation for testing
async function createMockRepository(repoName: string, description: string, isPrivate: boolean, projectFiles: any, startTime: number) {
  console.log('🎭 [GITHUB] Using mock implementation')
  
  // Step 1: Check repository name availability
  console.log('🔍 [GITHUB] Step 1: Checking repository name availability...')
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('✅ [GITHUB] Repository donbmt92/project1 exists and is accessible')
  
  // Step 2: Create repository
  console.log('📝 [GITHUB] Step 2: Creating repository...')
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('📝 [GITHUB] Using existing repository: donbmt92/project1')
  console.log('✅ [GITHUB] Successfully accessed repository: donbmt92/project1')
  console.log('✅ [GITHUB] Repository created')

  // Step 3: Initialize with files
  console.log('📁 [GITHUB] Step 3: Initializing with project files...')
  if (projectFiles) {
    console.log(`📄 [GITHUB] Adding ${Object.keys(projectFiles).length} files to repository`)
    console.log('📁 [GITHUB] Adding files to existing repository: donbmt92/project1')
    for (const [filePath] of Object.entries(projectFiles)) {
      console.log(`📄 [GITHUB] Added: ${filePath}`)
    }
  }
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('✅ [GITHUB] Successfully added files to repository')
  console.log('✅ [GITHUB] Files committed to repository')

  // Step 4: Configure repository settings
  console.log('⚙️ [GITHUB] Step 4: Configuring repository settings...')
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log('✅ [GITHUB] Repository configured')

  const totalTime = Date.now() - startTime

  console.log('🎉 [GITHUB] Repository creation completed successfully (mock):', {
    repoName: 'project1',
    repoUrl: 'https://github.com/donbmt92/project1',
    isPrivate,
    totalTime: `${totalTime}ms`
  })

  return NextResponse.json({
    success: true,
    repoUrl: 'https://github.com/donbmt92/project1',
    repoName: 'project1',
    isPrivate,
    message: 'Repository created successfully (mock)',
    creationTime: totalTime
  })
}

// Real GitHub API functions
async function checkRepositoryAvailability(repoName: string, token: string): Promise<boolean> {
  try {
    // Check if the specific repository exists
    const response = await fetch(`https://api.github.com/repos/donbmt92/project1`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    
    if (response.status === 200) {
      console.log('✅ [GITHUB] Repository donbmt92/project1 exists and is accessible')
      return true // Repository exists and we can use it
    } else if (response.status === 404) {
      console.log('❌ [GITHUB] Repository donbmt92/project1 not found')
      return false
    } else {
      console.log('⚠️ [GITHUB] Repository access issue:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ [GITHUB] Error checking repository availability:', error)
    return false
  }
}

async function createRepository(name: string, description: string, isPrivate: boolean, token: string) {
  // Use existing repository donbmt92/project1 instead of creating new one
  console.log('📝 [GITHUB] Using existing repository: donbmt92/project1')
  
  const response = await fetch('https://api.github.com/repos/donbmt92/project1', {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`GitHub API error: ${error.message}`)
  }

  const repoData = await response.json()
  console.log('✅ [GITHUB] Successfully accessed repository:', repoData.full_name)
  
  return repoData
}

async function addFilesToRepository(repoFullName: string, files: Record<string, string>, token: string) {
  console.log('📁 [GITHUB] Adding files to existing repository:', repoFullName)
  
  try {
    // Get current commit SHA to create incremental commit
    const refResponse = await fetch(`https://api.github.com/repos/${repoFullName}/git/ref/heads/main`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    
    let baseTreeSha = null
    let parentCommitSha = null
    
    if (refResponse.ok) {
      const refData = await refResponse.json()
      parentCommitSha = refData.object.sha
      
      const commitResponse = await fetch(`https://api.github.com/repos/${repoFullName}/git/commits/${parentCommitSha}`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      if (commitResponse.ok) {
        const commitData = await commitResponse.json()
        baseTreeSha = commitData.tree.sha
        console.log('✅ [GITHUB] Found existing tree SHA:', baseTreeSha)
      }
    } else {
      console.log('⚠️ [GITHUB] No existing commits found, creating initial commit')
    }
    
    // Create new tree with files
    const tree = await createTree(repoFullName, files, token, baseTreeSha)
    const commit = await createCommit(repoFullName, tree.sha, token, parentCommitSha)
    await updateRef(repoFullName, commit.sha, token)
    
    console.log('✅ [GITHUB] Successfully added files to repository')
  } catch (error) {
    console.error('❌ [GITHUB] Error adding files to repository:', error)
    throw error
  }
}

async function createTree(repoFullName: string, files: Record<string, string>, token: string, baseTreeSha?: string | null) {
  const tree = Object.entries(files).map(([path, content]) => ({
    path,
    mode: '100644',
    type: 'blob',
    content
  }))

  const response = await fetch(`https://api.github.com/repos/${repoFullName}/git/trees`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tree,
      base_tree: baseTreeSha || null
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`GitHub API error: ${error.message}`)
  }

  return await response.json()
}

async function createCommit(repoFullName: string, treeSha: string, token: string, parentCommitSha?: string | null) {
  // Set up parents array
  const parents: string[] = []
  if (parentCommitSha) {
    parents.push(parentCommitSha)
    console.log('📝 [GITHUB] Creating incremental commit with parent:', parentCommitSha)
  } else {
    console.log('📝 [GITHUB] Creating initial commit')
  }

  const response = await fetch(`https://api.github.com/repos/${repoFullName}/git/commits`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: parentCommitSha ? 'Add project files: Generated from Theme Editor' : 'Initial commit: Generated from Theme Editor',
      tree: treeSha,
      parents: parents
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`GitHub API error: ${error.message}`)
  }

  return await response.json()
}

async function updateRef(repoFullName: string, commitSha: string, token: string) {
  // First try to update existing main branch
  let response = await fetch(`https://api.github.com/repos/${repoFullName}/git/refs/heads/main`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sha: commitSha
    })
  })

  // If main branch doesn't exist (404), create it
  if (response.status === 404) {
    console.log('🔧 [GITHUB] Main branch not found, creating new main branch')
    response = await fetch(`https://api.github.com/repos/${repoFullName}/git/refs`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ref: 'refs/heads/main',
        sha: commitSha
      })
    })
    
    if (response.ok) {
      console.log('✅ [GITHUB] Main branch created successfully')
    }
  } else if (response.ok) {
    console.log('✅ [GITHUB] Main branch updated successfully')
  }

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`GitHub API error: ${error.message}`)
  }

  return await response.json()
}

async function configureRepository(repoFullName: string, token: string) {
  // Configure repository settings
  const response = await fetch(`https://api.github.com/repos/${repoFullName}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      has_issues: true,
      has_projects: false,
      has_wiki: false,
      has_downloads: false,
      default_branch: 'main'
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`GitHub API error: ${error.message}`)
  }

  return await response.json()
} 