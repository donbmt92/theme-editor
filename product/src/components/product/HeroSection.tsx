import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, FileText } from "lucide-react";
import productImage from "@/assets/product-placeholder.jpg";
import { getTranslation, type Language } from "@/lib/translations";

interface HeroSectionProps {
  language?: Language;
}

const HeroSection = ({ language = 'vietnamese' }: HeroSectionProps) => {
  const t = getTranslation(language);
  const usps = [
    "ISO 9001:2015 Certified Manufacturing",
    "MOQ as low as 500 units",
    "15+ years export experience to US, EU & Global markets",
  ];

  return (
    <section className="relative bg-primary overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-industrial-pattern opacity-30" />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px] py-8">
          {/* Content Side */}
          <div className="space-y-6 animate-fade-in">
            <Badge variant="secondary" className="bg-amber/20 text-amber border-amber/30">
              {t.exportReady} • {t.oemAvailable}
            </Badge>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight">
              [Product Name] Manufacturer & Exporter | Custom OEM Solutions
            </h1>

            <p className="text-lg text-primary-foreground/80 max-w-xl">
              Professional [product category] supplier with [X] years of manufacturing experience.
              Serving international buyers in [target markets].
            </p>

            {/* USPs */}
            <ul className="space-y-3 py-2">
              {usps.map((usp, index) => (
                <li key={index} className="usp-item">
                  <CheckCircle className="h-5 w-5 text-amber flex-shrink-0 mt-0.5" />
                  <span className="text-primary-foreground/90">{usp}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="cta" size="xl">
                <FileText className="h-5 w-5" />
                {t.requestQuote}
              </Button>
              <Button variant="ctaOutline" size="xl">
                <Download className="h-5 w-5" />
                {t.getFreeCatalog}
              </Button>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative animate-slide-in-right">
            <div className="relative bg-card rounded-xl shadow-industrial overflow-hidden">
              {/* Main Product Image */}
              <div className="aspect-square bg-muted">
                <img
                  src={productImage}
                  alt="[Product Name] - Industrial Component"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-2 p-3 bg-secondary">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted rounded border-2 border-transparent hover:border-amber cursor-pointer transition-colors overflow-hidden"
                  >
                    <img
                      src={productImage}
                      alt={`Product view ${i}`}
                      className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badge */}
            <div className="absolute -bottom-4 -right-4 bg-card rounded-lg shadow-industrial p-4 hidden lg:block">
              <div className="trust-badge">
                <CheckCircle className="h-4 w-4" />
                {t.verifiedManufacturer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
