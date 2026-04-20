import { Building2, Car, Cpu, HardHat, Plane, Ship } from "lucide-react";
import productImage from "@/assets/product-placeholder.jpg";
import { getTranslation, type Language } from "@/lib/translations";

interface ApplicationsProps {
  language?: Language;
}

const Applications = ({ language = 'vietnamese' }: ApplicationsProps) => {
  const t = getTranslation(language);
  const applications = [
    {
      icon: Car,
      industry: "Automotive Industry",
      description: "[Automotive assembly, engine components, interior parts]",
      image: productImage,
    },
    {
      icon: Cpu,
      industry: "Electronics Manufacturing",
      description: "[PCB assemblies, enclosures, heat sinks, connectors]",
      image: productImage,
    },
    {
      icon: Building2,
      industry: "Construction & Building",
      description: "[Structural components, fixtures, hardware systems]",
      image: productImage,
    },
    {
      icon: HardHat,
      industry: "Industrial Equipment",
      description: "[Machine parts, tools, industrial automation components]",
      image: productImage,
    },
    {
      icon: Plane,
      industry: "Aerospace Applications",
      description: "[Precision parts meeting aerospace quality standards]",
      image: productImage,
    },
    {
      icon: Ship,
      industry: "Marine & Offshore",
      description: "[Corrosion-resistant components for marine environments]",
      image: productImage,
    },
  ];

  return (
    <section className="bg-card">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title">{t.applicationsUseCases}</h2>
          {/* <p className="section-subtitle">
            Industries and applications where our products are successfully deployed
          </p> */}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app, index) => (
            <div
              key={index}
              className="group bg-secondary rounded-xl overflow-hidden hover:shadow-industrial transition-shadow"
            >
              {/* Image Placeholder */}
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img
                  src={app.image}
                  alt={app.industry}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <div className="p-2 bg-card/90 rounded-lg">
                    <app.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2">{app.industry}</h3>
                <p className="text-muted-foreground text-sm">{app.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Applications;
