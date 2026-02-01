// Deploy Job
export interface DeployJobData {
    projectId: string;
    userId: string;
    projectName: string;
    domain?: string;
    themeParams: any;
    createUserFolder?: boolean;
    generateDeployScript?: boolean;
    serverType?: string;
    includeAssets?: boolean;
}

export interface DeployJobResult {
    success: boolean;
    projectId: string;
    projectName: string;
    folderPath: string;
    fileCount: number;
    deployTime: number;
    error?: string;
}

// AI Generation Job
export interface AIJobData {
    userId: string;
    prompt: string;
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
