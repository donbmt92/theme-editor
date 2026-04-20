import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "About Us", href: "#about" },
    { name: "Our Products", href: "#products" },
    { name: "Export Services", href: "#services" },
    { name: "Quality Assurance", href: "#quality" },
    { name: "Contact", href: "#contact" }
  ];

  const resources = [
    { name: "Import/Export Guide", href: "#guide" },
    { name: "Market Reports", href: "#reports" },
    { name: "Documentation", href: "#docs" },
    { name: "FAQ", href: "#faq" },
    { name: "Blog", href: "#blog" }
  ];

  const legal = [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Cookie Policy", href: "#cookies" },
    { name: "Compliance", href: "#compliance" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-8 w-8 rounded-full bg-gradient-primary"></div>
                <span className="text-xl font-bold">VietCashew Export</span>
              </div>
              <p className="text-secondary-foreground/80 mb-6 leading-relaxed">
                Your trusted partner for premium Vietnamese cashew exports to the US market. Quality, reliability, and service excellence since 2009.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Vietnam Office</div>
                    <div className="text-sm text-secondary-foreground/70">
                      123 Export Street, Binh Phuoc Province, Vietnam
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">+1 (555) 123-4567</div>
                    <div className="text-sm text-secondary-foreground/70">US Business Hours</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">info@vietcashewexport.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div className="text-sm text-secondary-foreground/70">
                    Mon-Fri: 8AM-6PM (EST)
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-secondary-foreground/80 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-bold mb-6">Resources</h3>
              <ul className="space-y-3">
                {resources.map((resource, index) => (
                  <li key={index}>
                    <a
                      href={resource.href}
                      className="text-secondary-foreground/80 hover:text-primary transition-colors"
                    >
                      {resource.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h3 className="text-lg font-bold mb-6">Stay Connected</h3>
              <p className="text-secondary-foreground/80 mb-4">
                Get weekly market updates and import tips delivered to your inbox.
              </p>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/50"
                />
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Subscribe
                </Button>
              </div>
              
              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-secondary-foreground/10 flex items-center justify-center text-secondary-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-secondary-foreground/20" />

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-secondary-foreground/70">
              © 2025 VietCashew Export. All rights reserved.
            </div>
            
            <div className="flex flex-wrap gap-6">
              {legal.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;