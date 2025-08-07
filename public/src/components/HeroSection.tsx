import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Download, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-cashew-export.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-warm">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Premium Vietnamese
                <span className="text-transparent bg-gradient-primary bg-clip-text"> Cashews</span>
                <br />
                to US Markets
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Your trusted partner for seamless cashew export operations. We handle everything from sourcing premium Vietnamese cashews to delivering them to your US warehouse.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="flex flex-wrap gap-4">
              {[
                "FDA Compliant",
                "Premium Quality",
                "Competitive Pricing",
                "Reliable Delivery"
              ].map((benefit) => (
                <div key={benefit} className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success-green" />
                  <span className="text-foreground font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-primary shadow-elegant hover:shadow-glow transition-all duration-300">
                Explore Our Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Download className="mr-2 h-5 w-5" />
                Free Import Guide
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Successful Shipments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">US Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <Card className="overflow-hidden shadow-elegant border-0">
              <img
                src={typeof heroImage === "string" ? heroImage : (heroImage as any).src}
                alt="Vietnamese Cashew Export"
                className="w-full h-[600px] object-cover"
              />
            </Card>
            
            {/* Floating Stats Card */}
            <Card className="absolute -bottom-6 -left-6 p-6 bg-card/95 backdrop-blur border shadow-card">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-foreground">100% Quality Assured</div>
                  <div className="text-sm text-muted-foreground">FDA & HACCP Certified</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-cashew-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-trust-blue/10 rounded-full blur-2xl"></div>
    </section>
  );
};

export default HeroSection;