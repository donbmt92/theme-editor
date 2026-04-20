import { Shield, Zap, Award, Wrench, Clock, Leaf } from "lucide-react";
import { getTranslation, type Language } from "@/lib/translations";

interface ProductFeaturesProps {
  language?: Language;
}

const ProductFeatures = ({ language = 'vietnamese' }: ProductFeaturesProps) => {
  const t = getTranslation(language);

  const features = [
    {
      icon: Shield,
      title: "Premium Material Quality",
      description: "[Manufactured from high-grade raw materials with strict incoming quality control]",
    },
    {
      icon: Zap,
      title: "High Precision Manufacturing",
      description: "[CNC machining with tolerance up to ±0.01mm, ensuring consistent quality]",
    },
    {
      icon: Award,
      title: "International Certifications",
      description: "[ISO 9001, CE, RoHS, REACH certified - meeting global export standards]",
    },
    {
      icon: Wrench,
      title: "Easy Installation & Maintenance",
      description: "[Designed for simple assembly with standard tools and minimal maintenance]",
    },
    {
      icon: Clock,
      title: "Extended Service Life",
      description: "[Engineered for durability with [X]+ years expected operational life]",
    },
    {
      icon: Leaf,
      title: "Environmentally Compliant",
      description: "[REACH and RoHS compliant, meeting environmental regulations worldwide]",
    },
  ];

  return (
    <section className="bg-industrial-bg">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title">{t.featuresAdvantages}</h2>
          <p className="section-subtitle">
            Key manufacturing and quality advantages that set our products apart
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="feature-card hover-lift group">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductFeatures;
