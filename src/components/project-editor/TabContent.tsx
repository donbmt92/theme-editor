import { TabType } from './TabSelector'
import ColorsTab from './tabs/ColorsTab'
import TypographyTab from './tabs/TypographyTab'
import LayoutTab from './tabs/LayoutTab'
import HeaderTab from './tabs/HeaderTab'
import AboutTab from './tabs/AboutTab'
import HeroTab from './tabs/HeroTab'
import ProblemsTab from './tabs/ProblemsTab'
import SolutionsTab from './tabs/SolutionsTab'
import LeadMagnetTab from './tabs/LeadMagnetTab'
import ProductsTab from './tabs/ProductsTab'
import ProductPageTab from './tabs/ProductPageTab'
import WhyChooseUsTab from './tabs/WhyChooseUsTab'
import TestimonialsTab from './tabs/TestimonialsTab'
import FooterTab from './tabs/FooterTab'
import JSONTab from './tabs/JSONTab'
import { ThemeParams } from '@/types'

interface TabContentProps {
  activeTab: TabType
  themeParams: ThemeParams
  updateThemeParam: (path: string[], value: string | number | unknown) => void
  userTier?: 'FREE' | 'STANDARD' | 'PRO'
}

const TabContent = ({ activeTab, themeParams, updateThemeParam, userTier = 'FREE' }: TabContentProps) => {
  // Render tab content based on activeTab
  switch (activeTab) {
    case 'colors':
      return <ColorsTab themeParams={themeParams} updateThemeParam={updateThemeParam} />

    case 'typography':
      return <TypographyTab themeParams={themeParams} updateThemeParam={updateThemeParam} />

    case 'layout':
      return <LayoutTab themeParams={themeParams} updateThemeParam={updateThemeParam} />

    case 'header':
      return <HeaderTab themeParams={themeParams} updateThemeParam={updateThemeParam} />

    case 'about':
      return <AboutTab themeParams={themeParams} updateThemeParam={updateThemeParam} />

    case 'hero':
      return <HeroTab themeParams={themeParams} updateThemeParam={updateThemeParam} />

    case 'problems':
      return <ProblemsTab themeParams={themeParams} updateThemeParam={updateThemeParam} />

    case 'solutions':
      return <SolutionsTab themeParams={themeParams} updateThemeParam={updateThemeParam} />

    case 'leadMagnet':
      return <LeadMagnetTab themeParams={themeParams} updateThemeParam={updateThemeParam} />

    case 'products':
      return <ProductsTab themeParams={themeParams} updateThemeParam={updateThemeParam} />

    case 'productPage':
      return <ProductPageTab themeParams={themeParams} updateThemeParam={updateThemeParam} userTier={userTier} />

    case 'whyChooseUs':
      return <WhyChooseUsTab themeParams={themeParams} updateThemeParam={updateThemeParam} />

    case 'testimonials':
      return <TestimonialsTab themeParams={themeParams} updateThemeParam={updateThemeParam} />

    case 'footer':
      return <FooterTab themeParams={themeParams} updateThemeParam={updateThemeParam} />

    case 'json':
      return <JSONTab themeParams={themeParams} updateThemeParam={updateThemeParam} />

    default:
      return (
        <div className="space-y-6">
          <div className="text-center py-8 text-gray-500">
            <p>Chọn một tab để bắt đầu chỉnh sửa</p>
          </div>
        </div>
      )
  }
}

export default TabContent
