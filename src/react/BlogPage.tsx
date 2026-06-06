import { LanguageProvider } from "@/contexts/LanguageContext";
import Blog from "@/react/pages/Blog";

export default function BlogPage() {
  return (
    <LanguageProvider>
      <Blog />
    </LanguageProvider>
  );
}
