import { ArrowRight, Database, Layers, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Home = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Database,
      title: t("features.cleanCode.title"),
      description: t("features.cleanCode.description"),
    },
    {
      icon: Layers,
      title: t("features.modernDesign.title"),
      description: t("features.modernDesign.description"),
    },
    {
      icon: GraduationCap,
      title: t("features.performance.title"),
      description: t("features.performance.description"),
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="hero-mesh-bg" />
        <div className="hero-grid-overlay" />
        <div className="relative z-10 w-full">
          <div className="container mx-auto px-4 md:px-8 py-24 md:py-32">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <div className="flex justify-center mb-8">
                <span
                  className="badge-open-to-work inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide"
                  style={{
                    backgroundColor: "#ffc1008c",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "#ffc100",
                    color: "rgb(255, 204, 0)",
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500" />
                  </span>
                  Currently working at{" "}
                  <span className="font-semibold">
                    <span
                      style={{
                        background: "linear-gradient(to right, #ffffff, #41C0CF)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Arktic
                    </span>
                    <span className="text-gray-400"> | </span>
                    <span
                      style={{
                        background: "linear-gradient(to right, #001391, #14549C)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      BBVA CIB
                    </span>
                  </span>
                </span>
              </div>

              <p className="text-base md:text-lg text-muted-foreground mb-3 tracking-widest uppercase font-medium">{t("hero.greeting")}</p>

              <h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tighter leading-none"
                style={{ letterSpacing: "-0.04em" }}
              >
                <span className="gradient-text">Anibal Paez</span>
                <br />
                <span className="gradient-text">Gallego</span>
              </h1>

              <h2 className="text-base sm:text-lg md:text-xl text-foreground/70 mb-10 font-normal tracking-tight max-w-lg mx-auto">
                {t("hero.subtitle")}
              </h2>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="/projects">
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-glow">
                    {t("hero.cta")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <a href="/contact">
                  <Button size="lg" variant="outline" className="border-border/60 hover:border-primary/50 transition-colors duration-200">
                    {t("hero.contact")}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up bg-card/60 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-6">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 tracking-tight">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card/40">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{t("work_together.title")}</h2>
          <p className="text-base text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">{t("work_together.description")}</p>
          <a href="/contact">
            <Button size="lg" className="bg-gradient-accent hover:opacity-90 transition-opacity">
              {t("work_together.button")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
