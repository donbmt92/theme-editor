import { Settings, CheckCircle } from "lucide-react";
import { getTranslation, type Language } from "@/lib/translations";

interface TechnicalSpecsProps {
  language?: Language;
}

const TechnicalSpecs = ({ language = 'vietnamese' }: TechnicalSpecsProps) => {
  const t = getTranslation(language);
  const specifications = [
    { label: "Material", value: "[Stainless Steel 304 / Aluminum 6061 / ABS Plastic]" },
    { label: "Size / Dimensions", value: "[L x W x H: 100mm x 50mm x 25mm]" },
    { label: "Weight", value: "[0.5 kg / unit]" },
    { label: "Color Options", value: "[Silver, Black, Custom RAL colors available]" },
    { label: "MOQ", value: "[500 units]" },
    { label: "Certifications", value: "[ISO 9001, CE, RoHS, REACH]" },
    { label: "Standards", value: "[DIN, ANSI, JIS compatible]" },
    { label: "OEM/ODM", value: "[Available - Custom specifications accepted]" },
    { label: "Sample Available", value: "[Yes - Free samples for qualified buyers]" },
    { label: "Lead Time", value: "[15-30 days depending on order quantity]" },
  ];

  return (
    <section className="bg-card">
      <div className="section-container">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="section-title mb-0">{t.technicalSpecs}</h2>
            <p className="text-muted-foreground">Detailed product specifications and standards</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Specifications Table */}
          <div className="overflow-x-auto">
            <table className="spec-table">
              <thead>
                <tr>
                  <th className="w-1/3">Specification</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {specifications.map((spec, index) => (
                  <tr key={index}>
                    <td className="font-medium text-foreground">{spec.label}</td>
                    <td className="text-muted-foreground">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Additional Info Box */}
          <div className="space-y-6">
            <div className="bg-secondary rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4">{t.customizationOptions}</h3>
              <ul className="space-y-3">
                {[
                  "Custom dimensions available",
                  "Material alternatives on request",
                  "Surface treatment options",
                  "Custom packaging solutions",
                  "Private labeling available",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-foreground">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber/10 border border-amber/20 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Need Custom Specifications?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Our engineering team can work with you to develop products
                meeting your exact requirements.
              </p>
              <a href="#rfq-form" className="text-amber font-medium hover:underline">
                Contact Our Engineering Team →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalSpecs;
