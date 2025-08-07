import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemSolutionSection from "@/components/ProblemSolutionSection";
import LeadMagnetSection from "@/components/LeadMagnetSection";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ProblemSolutionSection />
      <LeadMagnetSection />
      <ServicesSection />
      <TestimonialsSection />
      <WhyChooseUsSection />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default Index;
