import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle, Clock, Package, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const LeadMagnetRFQ = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    quantity: "",
    requirements: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company.trim() || !formData.email.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Thank you! We'll contact you within 12-24 hours with a customized quotation.");
    setFormData({ name: "", company: "", email: "", phone: "", quantity: "", requirements: "" });
  };

  const benefits = [
    { icon: Package, text: "Free samples for qualified buyers" },
    { icon: Clock, text: "Custom quotation within 12-24 hours" },
    { icon: MessageSquare, text: "Direct communication with sales engineer" },
  ];

  return (
    <section id="rfq-form" className="bg-primary">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Side */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">
              Get Free Sample & Customized Quotation
            </h2>
            
            <p className="text-primary-foreground/80 text-lg">
              Ready to discuss your project requirements? Our team provides 
              personalized quotations based on your specific needs.
            </p>

            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="p-2 bg-amber/20 rounded-lg">
                    <benefit.icon className="h-5 w-5 text-amber" />
                  </div>
                  <span className="text-primary-foreground/90">{benefit.text}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 pt-4">
              <div className="trust-badge bg-success/20 text-success">
                <CheckCircle className="h-4 w-4" />
                Response guaranteed
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lead-form-card">
            <h3 className="text-xl font-semibold mb-6">Request for Quotation</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rfq-name">Name *</Label>
                  <Input
                    id="rfq-name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rfq-company">Company *</Label>
                  <Input
                    id="rfq-company"
                    placeholder="Company name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rfq-email">Email *</Label>
                  <Input
                    id="rfq-email"
                    type="email"
                    placeholder="your@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rfq-phone">WhatsApp / Phone</Label>
                  <Input
                    id="rfq-phone"
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rfq-quantity">Estimated Order Quantity</Label>
                <Input
                  id="rfq-quantity"
                  placeholder="e.g., 1,000 units / month"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rfq-requirements">Custom Requirements (Optional)</Label>
                <Textarea
                  id="rfq-requirements"
                  placeholder="Describe any specific requirements, customizations, or questions..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={4}
                />
              </div>

              <Button type="submit" variant="cta" size="lg" className="w-full mt-4">
                <Send className="h-5 w-5" />
                Submit RFQ
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Your information is kept confidential. We respond to all inquiries.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnetRFQ;
