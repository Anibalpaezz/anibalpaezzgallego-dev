import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Code2, BookOpen, Server } from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { GITHUB_USERNAME } from "@/hooks/use-github";

const About = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [graphError, setGraphError] = useState(false);

  const skills = [
    { name: "React",        url: "https://react.dev/" },
    { name: "TypeScript",   url: "https://www.typescriptlang.org/" },
    { name: "Node.js",      url: "https://nodejs.org/" },
    { name: "Next.js",      url: "https://nextjs.org/" },
    { name: "Tailwind CSS", url: "https://tailwindcss.com/" },
    { name: "PostgreSQL",   url: "https://www.postgresql.org/" },
    { name: "Supabase",     url: "https://supabase.com/" },
    { name: "Git",          url: "https://git-scm.com/" },
    { name: "Python",       url: "https://www.python.org/" },
    { name: "PHP",          url: "https://www.php.net/" },
    { name: "HTML",         url: "https://developer.mozilla.org/docs/Web/HTML" },
    { name: "Linux",        url: "https://www.kernel.org/" },
    { name: "CSS",          url: "https://developer.mozilla.org/docs/Web/CSS" },
    { name: "JavaScript",   url: "https://developer.mozilla.org/docs/Web/JavaScript" },
    { name: "C++",          url: "https://isocpp.org/" },
    { name: "Java",         url: "https://www.oracle.com/java/" },
    { name: "MySQL",        url: "https://www.mysql.com/" },
    { name: "MongoDB",      url: "https://www.mongodb.com/" },
  ];

  const graphTheme = theme === "dark" ? "react-dark" : "github-compact";
  const graphUrl =
    `https://github-readme-activity-graph.vercel.app/graph` +
    `?username=${GITHUB_USERNAME}` +
    `&theme=${graphTheme}` +
    `&hide_border=true` +
    `&area=true` +
    `&custom_title=Actividad+en+GitHub`;

  const profileStats = [
    {
      icon: <Code2 className="h-5 w-5 text-primary" />,
      value: `${skills.length}+`,
      label: t("about.statsTech"),
    },
    {
      icon: <Server className="h-5 w-5 text-primary" />,
      value: "SQL · Backend",
      label: t("about.statsFocus"),
    },
    {
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      value: "DAW + Ing.",
      label: t("about.statsFormation"),
    },
  ];

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            {t("about.title")}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{t("about.subtitle")}</p>
        </div>

        <div className="max-w-4xl mx-auto mb-10">
          <Card
            className="animate-slide-up border-2 border-primary/40 bg-gradient-to-br from-primary/5 to-accent/5"
            style={{ animationDelay: "0.05s" }}
          >
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary rounded-lg">
                  <Database className="h-6 w-6 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold">{t("about.dbTitle")}</h2>
              </div>
              <p className="text-muted-foreground mb-5 leading-relaxed">
                {t("about.dbDescription")}
              </p>
              <div className="flex flex-wrap gap-2">
                {["SQL", "PostgreSQL", "MySQL", "MongoDB"].map((tech) => (
                  <Badge
                    key={tech}
                    className="px-4 py-1.5 text-sm bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {profileStats.map((item, i) => (
              <Card
                key={i}
                className="animate-slide-up text-center"
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              >
                <CardContent className="pt-6 pb-4">
                  <div className="flex justify-center mb-2">{item.icon}</div>
                  <p className="text-2xl font-bold gradient-text">{item.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center tracking-tight">
            {t("about.skills")}
          </h2>
          <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-4 md:p-8">
              <div className="flex flex-wrap gap-3 justify-center">
                {skills.map((skill) => (
                  <a
                    key={skill.name}
                    href={skill.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${skill.name} — abrir en nueva pestaña`}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded"
                  >
                    <Badge
                      variant="secondary"
                      className="px-4 py-2 text-base transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-primary hover:text-primary-foreground"
                    >
                      {skill.name}
                    </Badge>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-foreground rounded-lg">
              <GithubIcon className="h-6 w-6 text-background" />
            </div>
            <h2 className="text-3xl font-bold">{t("about.githubTitle")}</h2>
          </div>

          {!graphError && (
            <Card
              className="animate-slide-up overflow-hidden"
              style={{ animationDelay: "0.2s" }}
            >
              <CardContent className="p-2 sm:p-4">
                <img
                  src={graphUrl}
                  alt="GitHub contribution graph"
                  className="w-full rounded-lg"
                  loading="lazy"
                  onError={() => setGraphError(true)}
                />
              </CardContent>
            </Card>
          )}

          <div className="text-center mt-6">
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <GithubIcon className="h-4 w-4" />
              github.com/{GITHUB_USERNAME}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
