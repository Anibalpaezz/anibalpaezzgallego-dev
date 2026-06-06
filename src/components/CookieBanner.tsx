import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const COOKIE_KEY = "cookiesAccepted";

const CookieBanner = () => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(COOKIE_KEY);
    return !stored;
  });

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, "true");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_KEY, "false");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="max-w-3xl mx-auto bg-card border border-border rounded-xl shadow-lg px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
          {t("cookieBanner.text")}
        </p>
        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDecline}
            className="text-xs"
          >
            {t("cookieBanner.decline")}
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
            className="text-xs bg-gradient-primary hover:opacity-90"
          >
            {t("cookieBanner.accept")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
