import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, CheckCircle } from "lucide-react";
import { getTranslation, type Language } from "@/lib/translations";

interface FinalCTAProps {
  language?: Language;
}

const FinalCTA = ({ language = 'vietnamese' }: FinalCTAProps) => {
  const t = getTranslation(language);

  return (
    <section className="bg-primary bg-industrial-pattern">
      <div className="section-container text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
          {t.startCooperation}
        </h2>
        <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
          Whether you need a sample, custom quotation, or technical consultation,
          our professional team is ready to assist you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a href="#rfq-form">
            <Button variant="cta" size="xl">
              <MessageSquare className="h-5 w-5" />
              {t.contactUs}
            </Button>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <Clock className="h-4 w-4 text-amber" />
            <span className="text-sm">Professional team replies within 12 hours</span>
          </div>
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <CheckCircle className="h-4 w-4 text-amber" />
            <span className="text-sm">No obligation, free consultation</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
