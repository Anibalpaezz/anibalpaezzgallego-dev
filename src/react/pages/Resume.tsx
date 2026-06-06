import { useState, useCallback } from "react";
import {
  Download,
  Briefcase,
  GraduationCap,
  X,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

type Challenge = { question: string; answer: number };

const MAX_ATTEMPTS = 5;

function generateChallenge(): Challenge {
  const ops = ["+", "-", "*"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;

  switch (op) {
    case "+":
      a = Math.floor(Math.random() * 20) + 1;
      b = Math.floor(Math.random() * 20) + 1;
      answer = a + b;
      break;
    case "-":
      a = Math.floor(Math.random() * 20) + 10;
      b = Math.floor(Math.random() * 10) + 1;
      answer = a - b;
      break;
    case "*":
      a = Math.floor(Math.random() * 9) + 2;
      b = Math.floor(Math.random() * 9) + 2;
      answer = a * b;
      break;
  }

  const symbols: Record<typeof op, string> = { "+": "+", "-": "\u2212", "*": "\u00d7" };
  return { question: `${a} ${symbols[op]} ${b}`, answer };
}

interface CaptchaModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

const CaptchaModal = ({ onSuccess, onClose }: CaptchaModalProps) => {
  const [challenge, setChallenge] = useState<Challenge>(generateChallenge);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  const refresh = useCallback(() => {
    setChallenge(generateChallenge());
    setInput("");
    setError(false);
  }, []);

  const handleVerify = () => {
    if (locked) return;

    if (parseInt(input, 10) === challenge.answer) {
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(true);
      setInput("");

      if (newAttempts >= MAX_ATTEMPTS) {
        setLocked(true);
        return;
      }

      if (newAttempts >= 2) refresh();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-background border rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 bg-primary/10 rounded-full mb-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Verificaci\u00f3n r\u00e1pida</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Resuelve el siguiente c\u00e1lculo para descargar el CV
          </p>
        </div>

        {locked ? (
          <div className="text-center py-4">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
            <p className="text-sm text-destructive font-medium">
              Demasiados intentos fallidos.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Recarga la p\u00e1gina para volver a intentarlo.
            </p>
            <Button variant="outline" className="mt-4 w-full" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-secondary rounded-xl py-5 text-center mb-5">
              <span className="text-4xl font-mono font-bold tracking-widest">
                {challenge.question} = ?
              </span>
            </div>

            <input
              type="number"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              placeholder="Tu respuesta\u2026"
              autoFocus
              className={`w-full rounded-lg border px-4 py-3 text-center text-lg font-semibold bg-background outline-none transition-colors
                ${error
                  ? "border-destructive focus:ring-destructive/40"
                  : "border-input focus:border-primary focus:ring-2 focus:ring-primary/30"
                }`}
            />

            {error && (
              <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>
                  Respuesta incorrecta. Int\u00e9ntalo de nuevo.
                  {attempts > 0 && (
                    <> ({MAX_ATTEMPTS - attempts} intento{MAX_ATTEMPTS - attempts !== 1 ? "s" : ""} restante{MAX_ATTEMPTS - attempts !== 1 ? "s" : ""})</>
                  )}
                </span>
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <Button variant="outline" className="flex-1" onClick={refresh}>
                Otro c\u00e1lculo
              </Button>
              <Button
                className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
                onClick={handleVerify}
                disabled={input === ""}
              >
                Verificar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Resume = () => {
  const { t } = useLanguage();
  const [showCaptcha, setShowCaptcha] = useState(false);

  const triggerDownload = async () => {
    try {
      const response = await fetch("/CV_Anibal_Paez_Gallego.pdf");
      if (!response.ok) throw new Error("fetch failed");

      const blob    = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href     = blobUrl;
      link.download = "CV_Anibal_Paez_Gallego.pdf";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
    } catch {
      window.open("/CV_Anibal_Paez_Gallego.pdf", "_blank");
    }
  };

  const handleDownloadClick = () => setShowCaptcha(true);

  const handleCaptchaSuccess = () => {
    setShowCaptcha(false);
    void triggerDownload();
  };

  const workExperience = [
    {
      title:       t("work_experience1.title"),
      company:     "Telepizza",
      period:      "2023 - Presente",
      description: t("work_experience1.description"),
      achievements: [],
    },
    {
      title:       t("work_experience2.title"),
      company:     "Aytec S.L",
      period:      "2024",
      description: t("work_experience2.description"),
      achievements: [],
    },
  ];

  const education = [
    {
      title:       t("education.degree1.title"),
      institution: t("education.degree1.institution"),
      period:      t("education.degree1.period"),
      description: t("education.degree1.description"),
    },
    {
      title:       t("education.degree2.title"),
      institution: t("education.degree2.institution"),
      period:      t("education.degree2.period"),
      description: t("education.degree2.description"),
    },
  ];

  return (
    <div className="min-h-screen py-24">
      {showCaptcha && (
        <CaptchaModal
          onSuccess={handleCaptchaSuccess}
          onClose={() => setShowCaptcha(false)}
        />
      )}

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("resume.title")}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {t("resume.subtitle")}
          </p>
          <Button
            size="lg"
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
            onClick={handleDownloadClick}
          >
            <Download className="mr-2 h-5 w-5" />
            {t("resume.download")}
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          <section className="animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary rounded-lg">
                <Briefcase className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold">{t("resume.experience")}</h2>
            </div>
            <div className="space-y-6">
              {workExperience.map((job, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <span className="text-sm text-muted-foreground">
                        {job.period}
                      </span>
                    </div>
                    <p className="text-primary font-semibold">{job.company}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {job.description}
                    </p>
                    <ul className="space-y-2">
                      {job.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2 text-primary">&bull;</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section
            className="animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold">{t("resume.education")}</h2>
            </div>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <Card key={index} className="border-l-4 border-l-accent">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <CardTitle className="text-xl">{edu.title}</CardTitle>
                      <span className="text-sm text-muted-foreground">
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-accent font-semibold">
                      {edu.institution}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{edu.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Resume;
