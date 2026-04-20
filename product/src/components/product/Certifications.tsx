import { Award, CheckCircle, Search, FileCheck, ShieldCheck } from "lucide-react";
import { getTranslation, type Language } from "@/lib/translations";

interface CertificationsProps {
  language?: Language;
}

const Certifications = ({ language = 'vietnamese' }: CertificationsProps) => {
  const t = getTranslation(language);
  const certifications = [
    { name: "ISO 9001:2015", description: "Quality Management System" },
    { name: "ISO 14001", description: "Environmental Management" },
    { name: "CE Marking", description: "European Conformity" },
    { name: "RoHS", description: "Hazardous Substances Restriction" },
    { name: "REACH", description: "EU Chemical Regulation" },
    { name: "[Other]", description: "[Add relevant certifications]" },
  ];

  const qcProcess = [
    { step: "01", title: "Incoming Material Inspection", description: "100% inspection of raw materials against specifications" },
    { step: "02", title: "In-Process Quality Control", description: "Multiple checkpoints during manufacturing process" },
    { step: "03", title: "Final Product Testing", description: "Comprehensive testing against quality standards" },
    { step: "04", title: "Pre-Shipment Inspection", description: "Final verification before dispatch" },
  ];

  return (
    <section className="bg-industrial-bg">
      <div className="section-container">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="section-title mb-0">{t.qualityCertifications}</h2>
            <p className="text-muted-foreground">International standards and rigorous quality processes</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Certifications */}
          <div>
            <h3 className="font-semibold text-lg mb-6">International Certifications</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-4 text-center shadow-sm hover:shadow-industrial transition-shadow"
                >
                  <div className="w-16 h-16 mx-auto mb-3 bg-secondary rounded-lg flex items-center justify-center">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-semibold text-sm">{cert.name}</p>
                  <p className="text-muted-foreground text-xs mt-1">{cert.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-lg">
              <Search className="h-5 w-5 text-success flex-shrink-0" />
              <p className="text-sm">
                <span className="font-medium">Third-party inspection available:</span>
                <span className="text-muted-foreground ml-1">SGS, Bureau Veritas, Intertek</span>
              </p>
            </div>
          </div>

          {/* QC Process */}
          <div>
            <h3 className="font-semibold text-lg mb-6">{t.qualityControlProcess}</h3>
            <div className="space-y-4">
              {qcProcess.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 bg-card rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
