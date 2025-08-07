import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown, Phone, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { 
      name: "Products & Services", 
      href: "#services",
      dropdown: [
        { name: "Cashew Products", href: "#products" },
        { name: "Export Services", href: "#export-services" },
        { name: "Quality Assurance", href: "#quality" },
        { name: "Logistics Solutions", href: "#logistics" }
      ]
    },
    {
      name: "Resources",
      href: "#resources",
      dropdown: [
        { name: "Import/Export Guide", href: "#guide" },
        { name: "Market Insights", href: "#insights" },
        { name: "Documentation", href: "#documentation" }
      ]
    },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-primary"></div>
            <span className="text-xl font-bold text-foreground">VietCashew Export</span>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="space-x-6">
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  {item.dropdown ? (
                    <>
                      <NavigationMenuTrigger className="text-foreground hover:text-primary transition-colors">
                        {item.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-48 p-2">
                          {item.dropdown.map((subItem) => (
                            <a
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                            >
                              {subItem.name}
                            </a>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <a
                      href={item.href}
                      className="text-foreground hover:text-primary transition-colors font-medium"
                    >
                      {item.name}
                    </a>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Download className="h-4 w-4 mr-2" />
              Download Guide
            </Button>
            <Button size="sm" className="bg-gradient-primary shadow-elegant">
              <Phone className="h-4 w-4 mr-2" />
              Free Consultation
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <a
                      href={item.href}
                      className="block py-2 text-lg font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </a>
                    {item.dropdown && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="border-t pt-4 space-y-3">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <Download className="h-4 w-4 mr-2" />
                    Download Guide
                  </Button>
                  <Button className="w-full bg-gradient-primary shadow-elegant">
                    <Phone className="h-4 w-4 mr-2" />
                    Free Consultation
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;