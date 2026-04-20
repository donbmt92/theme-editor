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
      defaultParams: JSON.stringify({
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
      })
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
      defaultParams: JSON.stringify({
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
      })
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
      defaultParams: JSON.stringify({
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
      })
    }
  })

  // Create Vietnam Coffee theme
  const vietnamCoffeeTheme = await prisma.theme.upsert({
    where: { id: 'vietnam-coffee-theme' },
    update: {},
    create: {
      id: 'vietnam-coffee-theme',
      name: 'Vietnam Coffee Export',
      description: 'Professional business theme for coffee export companies with warm coffee colors',
      previewUrl: '/previews/vietnam-coffee.png',
      createdBy: adminUser.id,
      defaultParams: JSON.stringify({
        colors: {
          primary: '#8B4513',
          secondary: '#D2691E',
          accent: '#FFD700',
          background: '#F5F5DC',
          text: '#2D3748',
          muted: '#718096',
          destructive: '#E53E3E',
          border: '#E2E8F0'
        },
        typography: {
          fontFamily: 'Inter',
          headingSize: '2xl',
          bodySize: 'base',
          lineHeight: 'relaxed'
        },
        layout: {
          containerWidth: '1200px',
          spacing: 'comfortable',
          borderRadius: 'medium'
        },
        components: {
          button: {
            style: 'solid',
            size: 'medium',
            rounded: true
          },
          card: {
            shadow: 'medium',
            border: true,
            padding: 'large'
          },
          hero: {
            overlayColor: 'rgba(139, 69, 19, 0.7)',
            textAlign: 'center',
            minHeight: '500px'
          }
        },
        sections: {
          header: {
            backgroundColor: '#D2691E',
            textColor: '#2D3748',
            sticky: true
          },
          hero: {
            backgroundColor: '#2D3748',
            textColor: '#FFFFFF',
            backgroundImage: 'gradient-coffee'
          },
          about: {
            backgroundColor: '#F5F5DC',
            textColor: '#2D3748'
          },
          problems: {
            backgroundColor: '#FFF8DC',
            textColor: '#2D3748'
          },
          solutions: {
            backgroundColor: '#F0F8FF',
            textColor: '#2D3748'
          },
          products: {
            backgroundColor: '#F0F4F8',
            textColor: '#2D3748'
          },
          testimonials: {
            backgroundColor: '#FDF5E6',
            textColor: '#2D3748'
          },
          cta: {
            backgroundColor: '#8B4513',
            textColor: '#FFFFFF'
          },
          footer: {
            backgroundColor: '#D2691E',
            textColor: '#F9FAFB'
          }
        }
      })
    }
  })

  // Create a sample payment for the user
  await prisma.payment.upsert({
    where: { bankTxnId: 'TXN_2025_001' },
    update: {},
    create: {
      userId: sampleUser.id,
      amount: 299000, // 299,000 VND
      currency: 'VND',
      status: 'PAID',
      bankTxnId: 'TXN_2025_001',
      paidAt: new Date()
    }
  })

  // Create sample projects
  const sampleProject1 = await prisma.project.create({
    data: {
      userId: sampleUser.id,
      themeId: corporateTheme.id,
      name: 'My Corporate Website',
      status: 'EDITING'
    }
  })

  const sampleProject2 = await prisma.project.create({
    data: {
      userId: sampleUser.id,
      themeId: creativetTheme.id,
      name: 'Creative Portfolio',
      status: 'EDITING'
    }
  })

  const adminProject = await prisma.project.create({
    data: {
      userId: adminUser.id,
      themeId: corporateTheme.id,
      name: 'Admin Demo Project',
      status: 'EDITING'
    }
  })

  // Create project versions
  const projectVersion1 = await prisma.projectVersion.create({
    data: {
      projectId: sampleProject1.id,
      versionNumber: 1,
      snapshot: JSON.stringify({
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
      })
    }
  })

  // Create version parameters
  await prisma.versionParam.createMany({
    data: [
      {
        projectVersionId: projectVersion1.id,
        paramKey: 'colors.primary',
        paramValue: '#3b82f6'
      },
      {
        projectVersionId: projectVersion1.id,
        paramKey: 'colors.secondary',
        paramValue: '#64748b'
      },
      {
        projectVersionId: projectVersion1.id,
        paramKey: 'typography.fontFamily',
        paramValue: 'Inter'
      },
      {
        projectVersionId: projectVersion1.id,
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