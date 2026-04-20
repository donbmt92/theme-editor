// Deploy Job
export interface DeployJobData {
    projectId: string;
    userId: string;
    projectName: string;
    description: string;
    domain: string;
    themeParams: any;
    createUserFolder: boolean;
    generateDeployScript: boolean;
    serverType: 'nginx' | 'apache' | 'node' | 'docker';
    includeAssets: boolean;
}

export interface DeployJobResult {
    success: boolean;
    projectId: string;
    versionNumber: number;
    domain?: string;
    message?: string;
    error?: string;
}

// AI Generation Job
export interface AIJobData {
    userId: string;
    businessInfo: any;
    type: "theme" | "product-page";
    model?: string;
}

export interface AIJobResult {
    success: boolean;
    content: any;
    error?: string;
}

// Job Progress
export interface JobProgress {
    percentage: number;
    message: string;
    stage?: string;
}
