import React from "react";
import { ExternalLink, Star, GitCommitHorizontal, Clock } from "lucide-react";
const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useGitHubRepo, relativeDate, parseGitHubRepo } from "@/hooks/use-github";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

type Project = {
  title: string;
  description: string;
  image: string | null;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  isLive?: boolean;
};

const GitHubStatsStrip = ({ githubUrl }: { githubUrl: string }) => {
  const { stats, loading } = useGitHubRepo(githubUrl);

  if (loading) {
    return (
      <div className="flex gap-2 mt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-3 w-16 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground border-t border-border pt-2">
      {stats.language && (
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary" />
          {stats.language}
        </span>
      )}
      {stats.commits > 0 && (
        <span className="flex items-center gap-1">
          <GitCommitHorizontal className="h-3 w-3" />
          {stats.commits}
        </span>
      )}
      {stats.stars > 0 && (
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          {stats.stars}
        </span>
      )}
      {stats.lastPush && (
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {relativeDate(stats.lastPush)}
        </span>
      )}
    </div>
  );
};

const RevealCard = ({ children, featured }: { children: React.ReactNode; featured?: boolean }) => {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal overflow-hidden rounded-xl border border-border bg-card flex flex-col ${featured ? "shadow-glow border-primary/30" : ""}`}
    >
      {children}
    </div>
  );
};

const Projects = () => {
  const { t } = useLanguage();

  const [propinasStats, setPropinasStats] = useState({
    total: 1,
    media: 0,
    registros: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      let allData: { cantidad: any }[] = [];
      let page = 0;
      const pageSize = 1000;
      let keepFetching = true;
      let hasError = false;

      while (keepFetching) {
        const from = page * pageSize;
        const to = from + pageSize - 1;

        const { data, error } = await supabase.from("propinas").select("cantidad").range(from, to);

        if (error) {
          console.error("Error cargando lote de propinas:", error);
          hasError = true;
          keepFetching = false;
        } else if (data && data.length > 0) {
          allData = [...allData, ...data];
          if (data.length < pageSize) {
            keepFetching = false;
          } else {
            page++;
          }
        } else {
          keepFetching = false;
        }
      }

      if (!hasError && allData.length > 0) {
        const total = allData.reduce((sum, p) => sum + Number(p.cantidad || 0), 0);
        const registros = allData.length;
        setPropinasStats({
          total,
          media: registros > 0 ? total / registros : 0,
          registros,
        });
      }
    }
    fetchStats();
  }, []);

  const projects: Project[] = [
    {
      title: "Golden Bucket Movies",
      description:
        "Proyecto desde cero usando HTML, CSS y JavaScript. Catálogo de películas con búsqueda, filtros y detalles. Sin frameworks, solo puro JS.",
      image: "/photos/projects.avif",
      tags: ["HTML", "JavaScript", "CSS", "PostgreSQL"],
      liveUrl: "https://github.com/Anibalpaezz/Golden-Bucket-Movies",
      githubUrl: "https://github.com/Anibalpaezz/Golden-Bucket-Movies",
      featured: true,
    },
    {
      title: "Proyectos varios",
      description: "Diferentes proyectos personales y colaborativos en GitHub.",
      image: "/photos/projects.avif",
      tags: ["PHP", "JavaScript", "HTML", "CSS"],
      liveUrl: "https://github.com/Anibalpaezz/master-calendar-hub",
      githubUrl: "https://github.com/Anibalpaezz/master-calendar-hub",
      featured: true,
    },
    {
      title: t("myprojects.project1.title"),
      description: t("myprojects.project1.description"),
      image: "/photos/stock_stir_logo.avif",
      tags: ["React", "Node.js", "PostgreSQL", "Supabase"],
      liveUrl: "https://github.com/Anibalpaezz/Stock-Stir",
      githubUrl: "https://github.com/Anibalpaezz/Stock-Stir",
      featured: false,
    },
    {
      title: t("myprojects.project2.title"),
      description: t("myprojects.project2.description"),
      image: "/photos/PDFEditor.avif",
      tags: ["Python"],
      liveUrl: "https://github.com/Anibalpaezz/Automation-programs",
      githubUrl: "https://github.com/Anibalpaezz/Automation-programs",
      featured: false,
    },
    {
      title: "Tip Tracker",
      description: "App de seguimiento de propinas por turno. Registra cantidad, método de pago, clima y más. Datos en tiempo real desde Supabase.",
      image: null,
      tags: ["Supabase", "PostgreSQL"],
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
      isLive: true,
    },
    {
      title: "Master Calendar Hub",
      description: "Aplicación de calendario moderno.",
      image: "/photos/master_calendar_logo.avif",
      tags: ["React", "Supabase", "PostgreSQL"],
      liveUrl: "https://github.com/Anibalpaezz/master-calendar-hub",
      githubUrl: "https://github.com/Anibalpaezz/master-calendar-hub",
      featured: false,
    },
  ];

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">
            {t("projects.title")}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            {t("projects.subtitle")}
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <RevealCard key={index} featured={project.featured}>
              <div className="relative h-44 shrink-0">
                {project.isLive ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center gap-4 p-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold gradient-text">
                        {propinasStats.total.toFixed(2)} €
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Total acumulado</p>
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <p className="text-xl font-semibold">{propinasStats.media.toFixed(2)} €</p>
                        <p className="text-xs text-muted-foreground">Media / turno</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-semibold">{propinasStats.registros}</p>
                        <p className="text-xs text-muted-foreground">Turnos</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="animate-pulse bg-green-500 text-xs">● Live data</Badge>
                  </div>
                ) : (
                  <img
                    src={project.image!}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                )}

                {project.featured && (
                  <Badge className="absolute top-3 left-3 bg-gradient-accent text-xs">
                    {t("projects.featured")}
                  </Badge>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold mb-1.5 tracking-tight">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs px-2 py-0.5">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {parseGitHubRepo(project.githubUrl) && (
                  <GitHubStatsStrip githubUrl={project.githubUrl} />
                )}

                <div className="flex gap-3 mt-auto pt-4">
                  <Button asChild size="sm" className="flex-1 text-xs">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      {t("projects.viewProject")}
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="text-xs">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <GithubIcon className="mr-1.5 h-3.5 w-3.5" />
                      {t("projects.viewCode")}
                    </a>
                  </Button>
                </div>
              </div>
            </RevealCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
