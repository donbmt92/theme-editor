import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, CheckCircle, FileText } from "lucide-react";
import { toast } from "sonner";

const LeadMagnetEarly = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    country: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Please fill in required fields");
      return;
    }
    toast.success("Thank you! Your catalog download link has been sent.");
    setFormData({ name: "", email: "", company: "", country: "" });
  };

  const benefits = [
    "Complete product specifications",
    "Technical datasheets & drawings",
    "Factory capability overview",
    "Price indication & MOQ details",
  ];

  return (
    <section className="bg-industrial-bg bg-industrial-pattern">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Side */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber/10 text-amber rounded-full text-sm font-medium">
              <FileText className="h-4 w-4" />
              Free Download
            </div>
            
            <h2 className="section-title">
              Download Free Product Catalog & Technical Datasheet
            </h2>
            
            <p className="text-muted-foreground text-lg">
              Get instant access to our complete product catalog with detailed specifications, 
              technical drawings, and factory capabilities.
            </p>

            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Form Side */}
          <div className="lead-form-card">
            <h3 className="text-xl font-semibold mb-6">Get Instant Access</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="catalog-name">Name *</Label>
                  <Input
                    id="catalog-name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="catalog-email">Email *</Label>
                  <Input
                    id="catalog-email"
                    type="email"
                    placeholder="your@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="catalog-company">Company</Label>
                  <Input
                    id="catalog-company"
                    placeholder="Company name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="catalog-country">Country</Label>
                  <Input
                    id="catalog-country"
                    placeholder="Your country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
              </div>

              <Button type="submit" variant="cta" size="lg" className="w-full mt-4">
                <Download className="h-5 w-5" />
                Download Free Catalog
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Instant access after submission. No spam, unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnetEarly;
