import { Factory, Calendar, Users, Globe, Wrench, TrendingUp } from "lucide-react";
import factoryImage from "@/assets/hero-factory.jpg";
import { getTranslation, type Language } from "@/lib/translations";

interface WhyChooseUsProps {
  language?: Language;
}

const WhyChooseUs = ({ language = 'vietnamese' }: WhyChooseUsProps) => {
  const t = getTranslation(language);
  const metrics = [
    { icon: Calendar, value: "[15+]", label: "Years Experience" },
    { icon: Factory, value: "[10,000] m²", label: "Factory Size" },
    { icon: Wrench, value: "[20+]", label: "Production Lines" },
    { icon: TrendingUp, value: "[500,000+]", label: "Monthly Capacity" },
    { icon: Globe, value: "[50+]", label: "Export Countries" },
    { icon: Users, value: "[200+]", label: "Team Members" },
  ];

  const strengths = [
    "Direct factory with no middlemen - competitive pricing",
    "Dedicated export team with 10+ years international experience",
    "Advanced manufacturing equipment from Germany and Japan",
    "Flexible MOQ for new customers and trial orders",
    "Multi-language support (English, Spanish, Arabic, French)",
    "Long-term partnerships with global Fortune 500 companies",
  ];

  return (
    <section className="bg-card">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title">{t.whyChooseUs}</h2>
          <p className="section-subtitle">
            Factory strength and capabilities that make us your reliable manufacturing partner
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Factory Image & Metrics */}
          <div>
            <div className="relative rounded-xl overflow-hidden shadow-industrial mb-6">
              <img
                src={factoryImage}
                alt="Manufacturing facility"
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-primary-foreground font-semibold text-lg">
                  [Your Company Name] Manufacturing Facility
                </p>
                <p className="text-primary-foreground/80 text-sm">
                  [City, Country] - Established [Year]
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-secondary rounded-xl p-4 text-center">
                  <metric.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="font-bold text-lg text-foreground">{metric.value}</p>
                  <p className="text-muted-foreground text-xs">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths List */}
          <div className="space-y-6">
            <h3 className="font-semibold text-xl">{t.ourCompetitiveAdvantages}</h3>

            <ul className="space-y-4">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-success rounded-full" />
                  </div>
                  <span className="text-foreground">{strength}</span>
                </li>
              ))}
            </ul>

            <div className="p-5 bg-primary/5 border border-primary/10 rounded-xl">
              <p className="text-sm italic text-muted-foreground">
                "[Insert testimonial or trust statement from a satisfied international buyer]"
              </p>
              <p className="text-sm font-medium mt-2">
                — [Buyer Name], [Company], [Country]
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
