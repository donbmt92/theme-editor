import React from 'react'

export default function VietnamCoffeeTheme({ themeParams }: { themeParams: any }) {
  const colors = themeParams?.colors || {}
  const content = themeParams?.content || {}
  
  return (
    <div className="vietnam-coffee-theme">
      {/* Header */}
      <header style={{ backgroundColor: colors.secondary || '#D2691E' }}>
        <div className="container">
          <h1>{content?.header?.title || 'Cà Phê Việt'}</h1>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="hero" style={{ 
        background: `linear-gradient(135deg, ${colors.primary || '#8B4513'}, ${colors.secondary || '#D2691E'})`
      }}>
        <div className="container">
          <h1>{content?.hero?.title || 'Cà Phê Việt Nam - Chất Lượng Quốc Tế'}</h1>
          <p>{content?.hero?.description || 'Xuất khẩu cà phê chất lượng cao'}</p>
        </div>
      </section>
      
      {/* Content sections can be added here */}
    </div>
  )
}