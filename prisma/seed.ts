import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@theme-editor.com' },
    update: {},
    create: {
      email: 'admin@theme-editor.com',
      passwordHash: await bcrypt.hash('admin123', 12),
      name: 'Admin User'
    }
  })

  // Create sample user
  const sampleUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash: await bcrypt.hash('password123', 12),
      name: 'Sample User'
    }
  })

  // Create sample themes
  const corporateTheme = await prisma.theme.upsert({
    where: { id: 'corporate-theme' },
    update: {},
    create: {
      id: 'corporate-theme',
      name: 'Corporate Professional',
      description: 'Clean and professional theme for corporate websites',
      previewUrl: '/previews/corporate.png',
      createdBy: adminUser.id,
      defaultParams: {
        colors: {
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#0ea5e9',
          background: '#ffffff',
          text: '#1e293b'
        },
        typography: {
          fontFamily: 'Inter',
          headingSize: '2xl',
          bodySize: 'base'
        },
        layout: {
          containerWidth: '1200px',
          spacing: 'comfortable',
          borderRadius: 'medium'
        },
        components: {
          button: {
            style: 'solid',
            size: 'medium'
          },
          card: {
            shadow: 'medium',
            border: true
          }
        }
      }
    }
  })

  const creativetTheme = await prisma.theme.upsert({
    where: { id: 'creative-theme' },
    update: {},
    create: {
      id: 'creative-theme',
      name: 'Creative Portfolio',
      description: 'Bold and artistic theme for creative professionals',
      previewUrl: '/previews/creative.png',
      createdBy: adminUser.id,
      defaultParams: {
        colors: {
          primary: '#ec4899',
          secondary: '#8b5cf6',
          accent: '#f59e0b',
          background: '#0f172a',
          text: '#f1f5f9'
        },
        typography: {
          fontFamily: 'Poppins',
          headingSize: '3xl',
          bodySize: 'lg'
        },
        layout: {
          containerWidth: '1400px',
          spacing: 'spacious',
          borderRadius: 'large'
        },
        components: {
          button: {
            style: 'gradient',
            size: 'large'
          },
          card: {
            shadow: 'large',
            border: false
          }
        }
      }
    }
  })

  const minimalistTheme = await prisma.theme.upsert({
    where: { id: 'minimalist-theme' },
    update: {},
    create: {
      id: 'minimalist-theme',
      name: 'Minimalist Clean',
      description: 'Simple and clean theme with focus on content',
      previewUrl: '/previews/minimalist.png',
      createdBy: adminUser.id,
      defaultParams: {
        colors: {
          primary: '#000000',
          secondary: '#6b7280',
          accent: '#059669',
          background: '#fafafa',
          text: '#374151'
        },
        typography: {
          fontFamily: 'Georgia',
          headingSize: 'xl',
          bodySize: 'base'
        },
        layout: {
          containerWidth: '800px',
          spacing: 'minimal',
          borderRadius: 'none'
        },
        components: {
          button: {
            style: 'outline',
            size: 'small'
          },
          card: {
            shadow: 'none',
            border: true
          }
        }
      }
    }
  })

  // Create a sample payment for the user
  await prisma.payment.create({
    data: {
      userId: sampleUser.id,
      amount: 299000, // 299,000 VND
      currency: 'VND',
      status: 'PAID',
      bankTxnId: 'TXN_2024_001',
      paidAt: new Date()
    }
  })

  // Create a sample project
  const sampleProject = await prisma.project.create({
    data: {
      userId: sampleUser.id,
      themeId: corporateTheme.id,
      name: 'My Corporate Website',
      status: 'EDITING'
    }
  })

  // Create a project version
  const projectVersion = await prisma.projectVersion.create({
    data: {
      projectId: sampleProject.id,
      versionNumber: 1,
      snapshot: {
        colors: {
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#0ea5e9',
          background: '#ffffff',
          text: '#1e293b'
        },
        typography: {
          fontFamily: 'Inter',
          headingSize: '2xl',
          bodySize: 'base'
        },
        layout: {
          containerWidth: '1200px',
          spacing: 'comfortable',
          borderRadius: 'medium'
        },
        components: {
          button: {
            style: 'solid',
            size: 'medium'
          },
          card: {
            shadow: 'medium',
            border: true
          }
        }
      }
    }
  })

  // Create version parameters
  await prisma.versionParam.createMany({
    data: [
      {
        projectVersionId: projectVersion.id,
        paramKey: 'colors.primary',
        paramValue: '#3b82f6'
      },
      {
        projectVersionId: projectVersion.id,
        paramKey: 'colors.secondary',
        paramValue: '#64748b'
      },
      {
        projectVersionId: projectVersion.id,
        paramKey: 'typography.fontFamily',
        paramValue: 'Inter'
      },
      {
        projectVersionId: projectVersion.id,
        paramKey: 'layout.containerWidth',
        paramValue: '1200px'
      }
    ]
  })

  console.log('✅ Database seeded successfully!')
  console.log(`📧 Admin email: admin@theme-editor.com (password: admin123)`)
  console.log(`📧 User email: user@example.com (password: password123)`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 