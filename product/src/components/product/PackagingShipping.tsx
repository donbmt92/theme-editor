import { Package, Truck, Ship, Plane } from "lucide-react";
import { getTranslation, type Language } from "@/lib/translations";

interface PackagingShippingProps {
  language?: Language;
}

const PackagingShipping = ({ language = 'vietnamese' }: PackagingShippingProps) => {
  const t = getTranslation(language);
  const packagingSpecs = [
    { label: "Individual Packaging", value: "[PE bag + foam protection + inner box]" },
    { label: "Carton Size", value: "[40 x 30 x 25 cm (L x W x H)]" },
    { label: "Units per Carton", value: "[50 pcs / carton]" },
    { label: "Carton Weight", value: "[25 kg / carton (gross)]" },
    { label: "Pallet Configuration", value: "[20 cartons / pallet]" },
    { label: "20ft Container", value: "[Approx. 10,000 units]" },
    { label: "40ft Container", value: "[Approx. 22,000 units]" },
  ];

  const shippingMethods = [
    { icon: Ship, method: "Sea Freight", description: "FOB, CIF, CFR available" },
    { icon: Plane, method: "Air Freight", description: "Express delivery for urgent orders" },
    { icon: Truck, method: "Land Transport", description: "Available for neighboring countries" },
  ];

  const incoterms = ["EXW", "FOB", "CIF", "CFR", "DDP", "DAP"];

  return (
    <section className="bg-industrial-bg">
      <div className="section-container">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="section-title mb-0">{t.packagingShipping}</h2>
            <p className="text-muted-foreground">Safe packaging and flexible delivery options</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Packaging Table */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-lg mb-4">Packaging Details</h3>
            <table className="spec-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {packagingSpecs.map((spec, index) => (
                  <tr key={index}>
                    <td className="font-medium text-foreground">{spec.label}</td>
                    <td className="text-muted-foreground">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Shipping Methods & Incoterms */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">{t.shippingMethods}</h3>
              <div className="space-y-4">
                {shippingMethods.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.method}</p>
                      <p className="text-muted-foreground text-xs">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">{t.supportedIncoterms}</h3>
              <div className="flex flex-wrap gap-2">
                {incoterms.map((term, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagingShipping;
