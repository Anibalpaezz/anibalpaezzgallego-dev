import { useEffect, useState } from "react";

export const GITHUB_USERNAME = "Anibalpaezz";

const GH_API = "https://api.github.com";
const CACHE_KEY = "gh_cache_";

function cacheGet<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function cacheSet(key: string, data: unknown) {
  try {
    sessionStorage.setItem(CACHE_KEY + key, JSON.stringify(data));
  } catch {
  }
}

export interface RepoStats {
  stars: number;
  language: string | null;
  lastPush: string;
  commits: number;
  forks: number;
}

export interface GitHubUserStats {
  publicRepos: number;
  followers: number;
  totalStars: number;
  avatarUrl: string;
}

export function parseGitHubRepo(
  url: string
): { owner: string; repo: string } | null {
  const m = url.match(/github\.com\/([^/]+)\/([^/?#]+)/);
  return m ? { owner: m[1], repo: m[2] } : null;
}

async function fetchRepoStats(owner: string, repo: string): Promise<RepoStats> {
  const key = `repo_${owner}_${repo}`;
  const cached = cacheGet<RepoStats>(key);
  if (cached) return cached;

  const [repoRes, commitsRes] = await Promise.all([
    fetch(`${GH_API}/repos/${owner}/${repo}`),
    fetch(`${GH_API}/repos/${owner}/${repo}/commits?per_page=1`),
  ]);

  if (!repoRes.ok) throw new Error("repo fetch failed");
  const repoData = await repoRes.json();

  let commits = 0;
  const link = commitsRes.headers.get("Link") || "";
  const m = link.match(/page=(\d+)>; rel="last"/);
  if (m) {
    commits = parseInt(m[1], 10);
  } else if (commitsRes.ok) {
    const data = await commitsRes.json();
    commits = Array.isArray(data) ? data.length : 0;
  }

  const stats: RepoStats = {
    stars:    repoData.stargazers_count ?? 0,
    language: repoData.language ?? null,
    lastPush: repoData.pushed_at ?? "",
    commits,
    forks:    repoData.forks_count ?? 0,
  };

  cacheSet(key, stats);
  return stats;
}

export function useGitHubRepo(githubUrl: string) {
  const [stats, setStats] = useState<RepoStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parsed = parseGitHubRepo(githubUrl);
    if (!parsed) { setLoading(false); return; }
    const { owner, repo } = parsed;
    setLoading(true);
    fetchRepoStats(owner, repo)
      .then((s) => setStats(s))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [githubUrl]);

  return { stats, loading };
}

export function relativeDate(iso: string, locale = "es"): string {
  if (!iso) return "";
  const diffMs   = Date.now() - new Date(iso).getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays === 0) return locale === "es" ? "hoy" : "today";
  if (diffDays === 1) return locale === "es" ? "ayer" : "yesterday";
  if (diffDays < 7) return locale === "es" ? `hace ${diffDays} días` : `${diffDays} days ago`;
  if (diffDays < 30) return locale === "es" ? `hace ${Math.floor(diffDays / 7)} sem.` : `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return locale === "es" ? `hace ${Math.floor(diffDays / 30)} meses` : `${Math.floor(diffDays / 30)}mo ago`;
  return locale === "es" ? `hace ${Math.floor(diffDays / 365)} años` : `${Math.floor(diffDays / 365)}y ago`;
}
