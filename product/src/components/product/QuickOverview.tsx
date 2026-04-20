import { Factory, Globe, Package, Target } from "lucide-react";
import { getTranslation, type Language } from "@/lib/translations";

interface QuickOverviewProps {
  language?: Language;
}

const QuickOverview = ({ language = 'vietnamese' }: QuickOverviewProps) => {
  const t = getTranslation(language);

  const highlights = [
    { icon: Target, label: "Application", value: "[Industrial, Commercial, Consumer]" },
    { icon: Factory, label: "Target Industries", value: "[Automotive, Electronics, Construction]" },
    { icon: Globe, label: "Export Markets", value: "[USA, Europe, Middle East, Asia]" },
    { icon: Package, label: "MOQ", value: "[500 Units]" },
  ];

  return (
    <section className="bg-card border-b border-border">
      <div className="section-container">
        <div className="max-w-4xl">
          <h2 className="section-title">{t.productOverview}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            [Insert 3-5 lines of product description here. Focus on the core value proposition,
            main application, and what makes this product suitable for international buyers.
            Keep it factual and professional, avoiding marketing hype.]
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map((item, index) => (
              <div key={index} className="feature-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                </div>
                <p className="text-foreground font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickOverview;
