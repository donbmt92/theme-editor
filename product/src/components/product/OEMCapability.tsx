import { Palette, Package, Tag, Pencil, Shield, FileCheck } from "lucide-react";
import { getTranslation, type Language } from "@/lib/translations";

interface OEMCapabilityProps {
  language?: Language;
}

const OEMCapability = ({ language = 'vietnamese' }: OEMCapabilityProps) => {
  const t = getTranslation(language);
  const capabilities = [
    { icon: Palette, title: "Custom Logo", description: "Laser engraving, printing, or embossing your brand logo" },
    { icon: Package, title: "Custom Packaging", description: "Branded packaging with your company design and specifications" },
    { icon: Tag, title: "Private Label", description: "Complete private labeling for your brand identity" },
    { icon: Pencil, title: "Design Support", description: "Engineering support for custom product development" },
    { icon: Shield, title: "NDA Protection", description: "Full confidentiality agreement for all custom projects" },
    { icon: FileCheck, title: "Sample Approval", description: "Pre-production samples for your approval before mass production" },
  ];

  return (
    <section className="bg-card">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title">{t.oemOdmCapabilities}</h2>
          <p className="section-subtitle">
            Comprehensive customization services to meet your specific brand and product requirements
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, index) => (
            <div key={index} className="flex items-start gap-4 p-5 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors">
              <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                <cap.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{cap.title}</h3>
                <p className="text-muted-foreground text-sm">{cap.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-amber/10 border border-amber/20 rounded-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">Ready to Start Your OEM/ODM Project?</h3>
              <p className="text-muted-foreground">
                Contact our engineering team for a confidential discussion about your requirements.
              </p>
            </div>
            <a
              href="#rfq-form"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber text-accent-foreground font-semibold rounded-lg hover:bg-amber-hover transition-colors"
            >
              Start OEM Project
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OEMCapability;
