export interface DeployFromGitHubOptions {
    repoFullName: string
    projectName: string
}

export interface VercelDeploymentResponse {
    deploymentUrl: string
    projectUrl: string
    deploymentId: string
}

/**
 * Vercel API wrapper for deploying projects
 */
export class VercelAPI {
    private token: string
    private teamId?: string

    constructor(token: string, teamId?: string) {
        this.token = token
        this.teamId = teamId
    }

    /**
   * Deploy a GitHub repository to Vercel
   */
    async deployFromGitHub(options: DeployFromGitHubOptions): Promise<VercelDeploymentResponse> {
        try {
            console.log('🚀 [VERCEL] Starting deployment from GitHub:', options.repoFullName)

            const [owner, repo] = options.repoFullName.split('/')

            // Step 1: Get GitHub repo ID
            console.log('🔍 [VERCEL] Getting GitHub repo ID...')
            const githubResponse = await fetch(`https://api.github.com/repos/${options.repoFullName}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                },
            })

            if (!githubResponse.ok) {
                throw new Error(`Failed to get GitHub repo info: ${githubResponse.statusText}`)
            }

            const githubRepo = await githubResponse.json()
            const repoId = githubRepo.id
            console.log('✅ [VERCEL] Got repo ID:', repoId)

            // Step 2: Create or get existing Vercel project
            console.log('📦 [VERCEL] Creating Vercel project...')
            let project
            const projectResponse = await fetch('https://api.vercel.com/v9/projects', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                    ...(this.teamId && { 'X-Vercel-Team-Id': this.teamId }),
                },
                body: JSON.stringify({
                    name: options.projectName,
                    gitRepository: {
                        type: 'github',
                        repo: options.repoFullName,
                    },
                    framework: 'nextjs',
                }),
            })

            if (projectResponse.ok) {
                project = await projectResponse.json()
                console.log('✅ [VERCEL] Project created:', project.name)
            } else {
                const errorData = await projectResponse.json()

                // If project already exists, get it instead
                if (errorData.error?.code === 'conflict') {
                    console.log('ℹ️ [VERCEL] Project already exists, fetching...')
                    const getProjectResponse = await fetch(
                        `https://api.vercel.com/v9/projects/${options.projectName}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${this.token}`,
                                ...(this.teamId && { 'X-Vercel-Team-Id': this.teamId }),
                            },
                        }
                    )

                    if (!getProjectResponse.ok) {
                        throw new Error(`Failed to get existing project: ${getProjectResponse.statusText}`)
                    }

                    project = await getProjectResponse.json()
                    console.log('✅ [VERCEL] Got existing project:', project.name)
                } else {
                    throw new Error(`Failed to create Vercel project: ${JSON.stringify(errorData)}`)
                }
            }

            // Step 3: Trigger deployment using repoId
            console.log('🚀 [VERCEL] Triggering deployment...')
            const deploymentResponse = await fetch('https://api.vercel.com/v13/deployments', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                    ...(this.teamId && { 'X-Vercel-Team-Id': this.teamId }),
                },
                body: JSON.stringify({
                    name: options.projectName,
                    gitSource: {
                        type: 'github',
                        repoId: repoId,
                        ref: 'main',
                    },
                    target: 'production',
                }),
            })

            if (!deploymentResponse.ok) {
                const errorData = await deploymentResponse.json()
                throw new Error(`Failed to create deployment: ${JSON.stringify(errorData)}`)
            }

            const deployment = await deploymentResponse.json()
            console.log('✅ [VERCEL] Deployment created:', deployment.url)

            // Construct URLs
            const deploymentUrl = deployment.url.startsWith('http')
                ? deployment.url
                : `https://${deployment.url}`

            const projectUrl = `https://vercel.com/${this.teamId || 'account'}/${project.name}`

            return {
                deploymentUrl,
                projectUrl,
                deploymentId: deployment.id,
            }

        } catch (error: any) {
            console.error('❌ [VERCEL] Error deploying:', error.message)
            throw new Error(`Failed to deploy to Vercel: ${error.message}`)
        }
    }

    /**
     * Get deployment status
     */
    async getDeploymentStatus(deploymentId: string): Promise<{
        state: string
        url: string
    }> {
        try {
            const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    ...(this.teamId && { 'X-Vercel-Team-Id': this.teamId }),
                },
            })

            if (!response.ok) {
                throw new Error('Failed to get deployment status')
            }

            const deployment = await response.json()
            return {
                state: deployment.readyState,
                url: `https://${deployment.url}`,
            }

        } catch (error: any) {
            console.error('❌ [VERCEL] Error getting status:', error.message)
            throw new Error(`Failed to get deployment status: ${error.message}`)
        }
    }
}

/**
 * Get Vercel API instance from environment variables
 */
export function getVercelAPI(): VercelAPI {
    const token = process.env.VERCEL_TOKEN
    const teamId = process.env.VERCEL_TEAM_ID

    if (!token) {
        throw new Error('VERCEL_TOKEN must be set in environment variables')
    }

    return new VercelAPI(token, teamId)
}
