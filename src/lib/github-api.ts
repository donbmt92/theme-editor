import { Octokit } from '@octokit/rest'

export interface CreateRepoOptions {
    name: string
    description: string
    isPrivate: boolean
}

export interface PushFilesOptions {
    repoFullName: string
    files: Record<string, string>
    commitMessage: string
}

export interface GitHubRepoResponse {
    repoUrl: string
    repoFullName: string
    defaultBranch: string
}

/**
 * GitHub API wrapper for creating repos and pushing code
 */
export class GitHubAPI {
    private octokit: Octokit
    private owner: string

    constructor(token: string, owner: string) {
        this.octokit = new Octokit({ auth: token })
        this.owner = owner
    }

    /**
     * Check if repository already exists
     */
    async checkRepoExists(repoName: string): Promise<boolean> {
        try {
            await this.octokit.repos.get({
                owner: this.owner,
                repo: repoName,
            })
            return true
        } catch (error: any) {
            if (error.status === 404) {
                return false
            }
            throw error
        }
    }

    /**
     * Create a new GitHub repository
     */
    async createRepo(options: CreateRepoOptions): Promise<GitHubRepoResponse> {
        try {
            console.log('🐙 [GITHUB] Creating repository:', options.name)

            const { data: repo } = await this.octokit.repos.createForAuthenticatedUser({
                name: options.name,
                description: options.description,
                private: options.isPrivate,
                auto_init: true, // Initialize with README to create initial commit
            })

            console.log('✅ [GITHUB] Repository created:', repo.html_url)

            return {
                repoUrl: repo.html_url,
                repoFullName: repo.full_name,
                defaultBranch: repo.default_branch || 'main',
            }
        } catch (error: any) {
            console.error('❌ [GITHUB] Error creating repo:', error.message)
            throw new Error(`Failed to create GitHub repo: ${error.message}`)
        }
    }

    /**
   * Push multiple files to repository
   * Uses GitHub API to create/update files individually
   */
    async pushFiles(options: PushFilesOptions): Promise<void> {
        try {
            const [owner, repo] = options.repoFullName.split('/')
            console.log(`🐙 [GITHUB] Pushing ${Object.keys(options.files).length} files to ${options.repoFullName}`)

            // Get the default branch and latest commit
            const { data: repository } = await this.octokit.repos.get({
                owner,
                repo,
            })
            const defaultBranch = repository.default_branch || 'main'

            // Get the latest commit SHA
            const { data: ref } = await this.octokit.git.getRef({
                owner,
                repo,
                ref: `heads/${defaultBranch}`,
            })

            const { data: latestCommit } = await this.octokit.git.getCommit({
                owner,
                repo,
                commit_sha: ref.object.sha,
            })

            console.log('📝 [GITHUB] Got latest commit SHA:', latestCommit.sha)

            // Create blobs for all files
            console.log('📦 [GITHUB] Creating blobs...')
            const blobs = await Promise.all(
                Object.entries(options.files).map(async ([filePath, content]) => {
                    let encodedContent: string

                    // Images from public/uploads are already base64-encoded
                    if (filePath.startsWith('public/uploads/')) {
                        encodedContent = content // Already base64
                        console.log(`🖼️  [GITHUB] Binary file: ${filePath}`)
                    } else {
                        // Text files: encode to base64
                        encodedContent = Buffer.from(content).toString('base64')
                    }

                    const { data: blob } = await this.octokit.git.createBlob({
                        owner,
                        repo,
                        content: encodedContent,
                        encoding: 'base64',
                    })
                    return {
                        path: filePath,
                        mode: '100644' as const,
                        type: 'blob' as const,
                        sha: blob.sha,
                    }
                })
            )

            console.log('🌳 [GITHUB] Creating tree...')
            // Create tree with base from latest commit
            const { data: tree } = await this.octokit.git.createTree({
                owner,
                repo,
                tree: blobs,
                base_tree: latestCommit.tree.sha,
            })

            console.log('💾 [GITHUB] Creating commit...')
            // Create commit
            const { data: commit } = await this.octokit.git.createCommit({
                owner,
                repo,
                message: options.commitMessage,
                tree: tree.sha,
                parents: [latestCommit.sha],
            })

            console.log('🔄 [GITHUB] Updating branch reference...')
            // Update reference
            await this.octokit.git.updateRef({
                owner,
                repo,
                ref: `heads/${defaultBranch}`,
                sha: commit.sha,
            })

            console.log('✅ [GITHUB] Files pushed successfully')
        } catch (error: any) {
            console.error('❌ [GITHUB] Error pushing files:', error.message)
            throw new Error(`Failed to push files to GitHub: ${error.message}`)
        }
    }

    /**
     * Create repo and push files in one operation
     * If repo exists, updates files instead of creating new repo
     */
    async createRepoWithFiles(
        repoOptions: CreateRepoOptions,
        files: Record<string, string>,
        commitMessage: string = 'Update from Theme Editor'
    ): Promise<GitHubRepoResponse> {
        // Check if repo already exists
        const exists = await this.checkRepoExists(repoOptions.name)

        if (exists) {
            console.log('📝 [GITHUB] Repository already exists, updating files...')
            const repoFullName = `${this.owner}/${repoOptions.name}`

            // Update files with new commit
            await this.pushFiles({
                repoFullName,
                files,
                commitMessage,
            })

            return {
                repoUrl: `https://github.com/${repoFullName}`,
                repoFullName,
                defaultBranch: 'main',
            }
        }

        console.log('🆕 [GITHUB] Creating new repository...')
        // Create new repo
        const repo = await this.createRepo(repoOptions)

        // Push initial files
        await this.pushFiles({
            repoFullName: repo.repoFullName,
            files,
            commitMessage: 'Initial commit from Theme Editor',
        })

        return repo
    }
}

/**
 * Get GitHub API instance from environment variables
 */
export function getGitHubAPI(): GitHubAPI {
    const token = process.env.GITHUB_TOKEN
    const owner = process.env.GITHUB_OWNER

    if (!token || !owner) {
        throw new Error('GITHUB_TOKEN and GITHUB_OWNER must be set in environment variables')
    }

    return new GitHubAPI(token, owner)
}
