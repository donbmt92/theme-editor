/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThemeParams } from '@/types'
import path from 'path'
import fs from 'fs/promises'

export interface ProjectFiles {
  [relativePath: string]: string
}

export interface ExportReactProjectOptions {
  themeName: string
  themeParams: ThemeParams
  projectName: string
  userId: string
}

/**
 * Generate complete Next.js project structure from theme components
 */
export async function generateReactProject(
  options: ExportReactProjectOptions
): Promise<ProjectFiles> {
  const { themeName, themeParams, projectName } = options

  const files: ProjectFiles = {}

  // 1. Generate package.json
  files['package.json'] = generatePackageJson(projectName, themeParams)

  // 2. Generate Next.js config
  files['next.config.js'] = generateNextConfig()

  // 3. Generate TypeScript config
  files['tsconfig.json'] = generateTsConfig()

  // 4. Generate Tailwind config
  files['tailwind.config.ts'] = generateTailwindConfig(themeParams)

  // 5. Generate postcss config
  files['postcss.config.mjs'] = generatePostCSSConfig()

  // 6. Generate theme data JSON
  files['src/data/theme-data.json'] = JSON.stringify(themeParams, null, 2)

  // 7. Copy lib/utils.ts
  const utilsPath = path.join(process.cwd(), 'src', 'lib', 'utils.ts')
  try {
    const utilsContent = await fs.readFile(utilsPath, 'utf-8')
    files['src/lib/utils.ts'] = utilsContent
  } catch (error) {
    console.warn('Warning: Could not find utils.ts')
  }

  // 7b. Copy types/index.ts
  const typesPath = path.join(process.cwd(), 'src', 'types', 'index.ts')
  try {
    const typesContent = await fs.readFile(typesPath, 'utf-8')
    files['src/types/index.ts'] = typesContent
  } catch (error) {
    console.warn('Warning: Could not find types/index.ts')
  }

  // 8. Copy required UI components
  const uiComponents = [
    'button.tsx',
    'navigation-menu.tsx',
    'sheet.tsx',
    'dialog.tsx',
    'input.tsx',
    'label.tsx',
    'separator.tsx',
    'card.tsx'
  ]
  for (const component of uiComponents) {
    const componentPath = path.join(process.cwd(), 'src', 'components', 'ui', component)
    try {
      const componentContent = await fs.readFile(componentPath, 'utf-8')
      files[`src/components/ui/${component}`] = componentContent
    } catch (error) {
      console.warn(`Warning: Could not find UI component: ${component}`)
    }
  }

  // 8b. Copy required hooks
  const hooks = ['use-unsplash-image.ts']
  for (const hook of hooks) {
    const hookPath = path.join(process.cwd(), 'src', 'hooks', hook)
    try {
      const hookContent = await fs.readFile(hookPath, 'utf-8')
      files[`src/hooks/${hook}`] = hookContent
    } catch (error) {
      console.warn(`Warning: Could not find hook: ${hook}`)
    }
  }

  // 9. Generate Next.js app files
  files['src/app/layout.tsx'] = generateLayoutFile(projectName, themeParams)
  files['src/app/page.tsx'] = generatePageFile(themeName, themeParams)
  files['src/app/globals.css'] = generateGlobalCSS(themeParams)

  // 10. Copy theme components
  const themeComponents = await copyThemeComponents(themeName)
  Object.assign(files, themeComponents)

  // 11. Generate README
  files['README.md'] = generateReadme(projectName)

  // 12. Generate .gitignore
  files['.gitignore'] = generateGitignore()

  // 13. Generate environment example
  files['.env.example'] = generateEnvExample()

  return files
}

/**
 * Generate package.json with all dependencies
 */
function generatePackageJson(projectName: string, themeParams: ThemeParams): string {
  const packageJson = {
    name: projectName.toLowerCase().replace(/\s+/g, '-'),
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint'
    },
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      'next': '^14.1.0',
      'lucide-react': '^0.344.0',
      '@radix-ui/react-slot': '^1.0.2',
      '@radix-ui/react-navigation-menu': '^1.1.4',
      '@radix-ui/react-dialog': '^1.0.5',
      '@radix-ui/react-label': '^2.0.2',
      '@radix-ui/react-separator': '^1.0.3',
      'class-variance-authority': '^0.7.0',
      'clsx': '^2.1.0',
      'tailwind-merge': '^2.2.1'
    },
    devDependencies: {
      'typescript': '^5.3.3',
      '@types/node': '^20.11.5',
      '@types/react': '^18.2.48',
      '@types/react-dom': '^18.2.18',
      'tailwindcss': '^3.4.1',
      'postcss': '^8.4.33',
      'autoprefixer': '^10.4.17',
      'eslint': '^8.56.0',
      'eslint-config-next': '^14.1.0'
    }
  }

  return JSON.stringify(packageJson, null, 2)
}

/**
 * Generate next.config.js
 */
function generateNextConfig(): string {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig
`
}

/**
 * Generate tsconfig.json
 */
function generateTsConfig(): string {
  const tsConfig = {
    compilerOptions: {
      target: 'ES2017',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [
        {
          name: 'next'
        }
      ],
      paths: {
        '@/*': ['./src/*']
      }
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules']
  }

  return JSON.stringify(tsConfig, null, 2)
}

/**
 * Generate tailwind.config.ts with theme colors
 */
function generateTailwindConfig(themeParams: ThemeParams): string {
  return `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '${themeParams.colors.primary}',
        secondary: '${themeParams.colors.secondary}',
        accent: '${themeParams.colors.accent}',
      },
    },
  },
  plugins: [],
}

export default config
`
}

/**
 * Generate postcss.config.mjs
 */
function generatePostCSSConfig(): string {
  return `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

export default config
`
}

/**
 * Generate src/app/layout.tsx
 */
function generateLayoutFile(projectName: string, themeParams: ThemeParams): string {
  const title = themeParams.content?.meta?.title || projectName
  const description = themeParams.content?.meta?.description || `${projectName} - Built with Theme Editor`

  return `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '${title}',
  description: '${description}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
`
}

/**
 * Generate src/app/page.tsx
 */
function generatePageFile(themeName: string, themeParams: ThemeParams): string {
  // Convert theme name to component name (vietnam-coffee -> VietnamCoffeeTheme)
  const componentName = themeName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Theme'

  return `import ${componentName} from '@/components/themes/${componentName}'
import themeData from '@/data/theme-data.json'

export default function Home() {
  return (
    <main>
      <${componentName} theme={themeData as any} />
    </main>
  )
}
`
}

/**
 * Generate globals.css
 */
function generateGlobalCSS(themeParams: ThemeParams): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: ${themeParams.colors.primary};
  --color-secondary: ${themeParams.colors.secondary};
  --color-accent: ${themeParams.colors.accent};
  --color-background: ${themeParams.colors.background};
  --color-text: ${themeParams.colors.text};
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  color: var(--color-text);
  background: var(--color-background);
}
`
}

/**
 * Copy theme components from src/components/themes/{themeName}
 */
async function copyThemeComponents(themeName: string): Promise<ProjectFiles> {
  const files: ProjectFiles = {}

  try {
    const themePath = path.join(process.cwd(), 'src', 'components', 'themes', themeName)
    const themeFiles = await fs.readdir(themePath)

    // Read all component files
    for (const file of themeFiles) {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const filePath = path.join(themePath, file)
        const content = await fs.readFile(filePath, 'utf-8')
        files[`src/components/themes/${themeName}/${file}`] = content
      }
    }

    // Also copy the main theme component
    const mainThemeFile = themeName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('') + 'Theme.tsx'

    const mainThemePath = path.join(process.cwd(), 'src', 'components', 'themes', mainThemeFile)

    try {
      const mainContent = await fs.readFile(mainThemePath, 'utf-8')
      files[`src/components/themes/${mainThemeFile}`] = mainContent
    } catch (err) {
      console.warn(`Warning: Could not find main theme file: ${mainThemePath}`)
    }

  } catch (error) {
    console.error('Error copying theme components:', error)
    throw new Error(`Failed to copy theme components for ${themeName}`)
  }

  return files
}

/**
 * Generate README.md
 */
function generateReadme(projectName: string): string {
  return `# ${projectName}

This project was generated using the Theme Editor.

## Getting Started

First, install dependencies:

\`\`\`bash
npm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Deploy

You can deploy this Next.js app to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Customize

Edit \`src/data/theme-data.json\` to customize the theme colors, content, and layout.
`
}

/**
 * Generate .gitignore
 */
function generateGitignore(): string {
  return `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`
}

/**
 * Generate .env.example
 */
function generateEnvExample(): string {
  return `# Add your environment variables here
# NEXT_PUBLIC_API_URL=https://api.example.com
`
}
