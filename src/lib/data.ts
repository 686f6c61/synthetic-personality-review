import fs from 'node:fs';
import path from 'node:path';

export type VerificationStatus = 'verified' | 'needs_review' | 'removed';

export interface StructuredBlocks {
  key_points: string[];
  method_notes: string[];
  limitations: string[];
  mini_table: Array<{ field: string; value: string }>;
}

export interface Article {
  id: string;
  legacy_article_number: number;
  title_original: string;
  title_canonical: string;
  category: string;
  year: number;
  language: string;
  authors: string[];
  keywords: string[];
  source_url: string;
  source_type: 'publisher' | 'proceedings' | 'arxiv' | 'preprint_other';
  verification_status: VerificationStatus;
  verification_date: string;
  evidence: {
    checked_at: string;
    checks: string[];
    reason: string;
    http_status: number | null;
    final_url: string;
    fetched_title: string;
    title_similarity: number;
    author_overlap: number;
    year_match: boolean;
  };
  abstract_en_original: string;
  abstract_en_extended: string;
  resumen_es_extendido: string;
  structured_blocks: StructuredBlocks;
}

export interface RemovedArticle {
  id: string;
  legacy_article_number: number;
  title_original: string;
  year: number;
  category: string;
  source_url: string;
  source_type: string;
  verification_status: 'removed';
  verification_date: string;
  evidence: {
    reason: string;
    http_status: number | null;
    final_url: string;
    title_similarity: number;
  };
}

const ROOT = process.cwd();

function readJson<T>(relativePath: string): T {
  const absolutePath = path.join(ROOT, relativePath);
  const raw = fs.readFileSync(absolutePath, 'utf8');
  return JSON.parse(raw) as T;
}

export function loadCanonicalArticles(): Article[] {
  return readJson<Article[]>('data/articles.canonical.json').sort(
    (a, b) => a.legacy_article_number - b.legacy_article_number
  );
}

export function loadRemovedArticles(): RemovedArticle[] {
  return readJson<RemovedArticle[]>('data/articles.removed.json').sort(
    (a, b) => a.legacy_article_number - b.legacy_article_number
  );
}

export function loadLatestVerificationReport(): { fileName: string; content: string } | null {
  const reportDir = path.join(ROOT, 'reports', 'verification');
  if (!fs.existsSync(reportDir)) {
    return null;
  }
  const mdFiles = fs
    .readdirSync(reportDir)
    .filter((file) => file.endsWith('.md'))
    .sort();
  const fullAuditFiles = mdFiles.filter((file) => file.includes('full-audit'));
  const files = fullAuditFiles.length ? fullAuditFiles : mdFiles;
  if (!files.length) {
    return null;
  }
  const fileName = files[files.length - 1];
  const content = fs.readFileSync(path.join(reportDir, fileName), 'utf8');
  return { fileName, content };
}

export function collectStats(articles: Article[]) {
  const byCategory = new Map<string, number>();
  const byYear = new Map<number, number>();
  const bySourceType = new Map<string, number>();

  for (const article of articles) {
    byCategory.set(article.category, (byCategory.get(article.category) || 0) + 1);
    byYear.set(article.year, (byYear.get(article.year) || 0) + 1);
    bySourceType.set(article.source_type, (bySourceType.get(article.source_type) || 0) + 1);
  }

  return {
    total: articles.length,
    byCategory: [...byCategory.entries()].sort((a, b) => a[0].localeCompare(b[0])),
    byYear: [...byYear.entries()].sort((a, b) => a[0] - b[0]),
    bySourceType: [...bySourceType.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  };
}
