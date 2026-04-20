import { Button } from "@/components/ui/button";
import { MessageSquare, FileText } from "lucide-react";
import { getTranslation, type Language } from "@/lib/translations";

interface StickyCTAProps {
  language?: Language;
}

const StickyCTA = ({ language = 'vietnamese' }: StickyCTAProps) => {
  const t = getTranslation(language);

  return (
    <div className="sticky-mobile-cta">
      <div className="flex gap-3">
        <Button variant="navyOutline" size="lg" className="flex-1" asChild>
          <a href="#catalog-form">
            <FileText className="h-4 w-4" />
            {t.getFreeCatalog}
          </a>
        </Button>
        <Button variant="cta" size="lg" className="flex-1" asChild>
          <a href="#rfq-form">
            <MessageSquare className="h-4 w-4" />
            {t.requestQuote}
          </a>
        </Button>
      </div>
    </div>
  );
};

export default StickyCTA;
