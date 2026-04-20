import HeroSection from "@/components/product/HeroSection";
import QuickOverview from "@/components/product/QuickOverview";
import LeadMagnetEarly from "@/components/product/LeadMagnetEarly";
import TechnicalSpecs from "@/components/product/TechnicalSpecs";
import ProductFeatures from "@/components/product/ProductFeatures";
import Applications from "@/components/product/Applications";
import PackagingShipping from "@/components/product/PackagingShipping";
import LeadMagnetRFQ from "@/components/product/LeadMagnetRFQ";
import OEMCapability from "@/components/product/OEMCapability";
import Certifications from "@/components/product/Certifications";
import WhyChooseUs from "@/components/product/WhyChooseUs";
import FinalCTA from "@/components/product/FinalCTA";
import StickyCTA from "@/components/product/StickyCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Quick Product Overview */}
      <QuickOverview />

      {/* 3. Lead Magnet #1 - Catalog Download */}
      <div id="catalog-form">
        <LeadMagnetEarly />
      </div>

      {/* 4. Technical Specifications */}
      <TechnicalSpecs />

      {/* 5. Product Features & Advantages */}
      <ProductFeatures />

      {/* 6. Applications / Use Cases */}
      <Applications />

      {/* 7. Packaging & Shipping */}
      <PackagingShipping />

      {/* 8. Lead Magnet #2 - RFQ Form */}
      <LeadMagnetRFQ />

      {/* 9. OEM / ODM Capability */}
      <OEMCapability />

      {/* 10. Certifications & Quality Control */}
      <Certifications />

      {/* 11. Why Choose Us */}
      <WhyChooseUs />

      {/* 12. Final CTA */}
      <FinalCTA />

      {/* Mobile Sticky CTA */}
      <StickyCTA />
    </div>
  );
};

export default Index;
