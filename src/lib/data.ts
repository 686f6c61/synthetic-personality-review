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

function extractDoiFromUrl(sourceUrl: string): string | null {
  const match = sourceUrl.match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i);
  if (!match) {
    return null;
  }
  return decodeURIComponent(match[0]).replace(/[).,;]+$/, '');
}

function doiLabel(doi: string): string | null {
  const normalized = doi.toLowerCase();
  if (normalized.startsWith('10.1093/pnasnexus/')) {
    return 'PNAS Nexus';
  }
  if (normalized.startsWith('10.1038/')) {
    return 'Nature / Scientific Reports';
  }
  if (normalized.startsWith('10.1109/')) {
    return 'IEEE';
  }
  if (normalized.startsWith('10.1145/')) {
    return 'ACM';
  }
  if (normalized.startsWith('10.1609/')) {
    return 'AAAI';
  }
  if (normalized.startsWith('10.18653/v1/')) {
    return 'ACL Anthology';
  }
  if (normalized.startsWith('10.3389/')) {
    return 'Frontiers';
  }
  if (normalized.startsWith('10.1016/')) {
    return 'Elsevier';
  }
  if (normalized.startsWith('10.1007/')) {
    return 'Springer';
  }
  if (normalized.startsWith('10.3390/')) {
    return 'MDPI';
  }
  if (normalized.startsWith('10.2196/')) {
    return 'JMIR';
  }
  if (normalized.startsWith('10.1080/')) {
    return 'Taylor & Francis';
  }
  if (normalized.startsWith('10.1162/')) {
    return 'MIT Press';
  }
  if (normalized.startsWith('10.1098/')) {
    return 'Royal Society';
  }
  return null;
}

function formatTitleToken(token: string): string {
  if (!token) {
    return token;
  }
  return token.charAt(0).toUpperCase() + token.slice(1);
}

export function getSourceLabel(sourceUrl: string, sourceType?: string): string {
  try {
    const parsed = new URL(sourceUrl);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    const path = parsed.pathname.toLowerCase();

    if (host.includes('arxiv.org')) {
      return 'arXiv';
    }
    if (host.includes('aclanthology.org')) {
      return 'ACL Anthology';
    }
    if (host.includes('ojs.aaai.org')) {
      return 'AAAI Proceedings';
    }
    if (host.includes('openreview.net')) {
      return 'OpenReview';
    }
    if (host.includes('proceedings.neurips.cc') || host === 'neurips.cc') {
      return 'NeurIPS Proceedings';
    }
    if (host === 'icml.cc') {
      return 'ICML Proceedings';
    }
    if (host.includes('ieeexplore.ieee.org')) {
      return 'IEEE Xplore';
    }
    if (host.includes('dl.acm.org')) {
      return 'ACM Digital Library';
    }
    if (host.includes('nature.com')) {
      if (path.includes('/s41598-')) {
        return 'Scientific Reports';
      }
      return 'Nature';
    }
    if (host.includes('frontiersin.org')) {
      const journalMatch = path.match(/\/journals\/([^/]+)/);
      if (journalMatch?.[1]) {
        const journal = journalMatch[1]
          .split('-')
          .map((token) => formatTitleToken(token))
          .join(' ');
        return `Frontiers (${journal})`;
      }
      return 'Frontiers';
    }
    if (host.includes('pmc.ncbi.nlm.nih.gov')) {
      return 'PubMed Central';
    }
    if (host.includes('pubmed.ncbi.nlm.nih.gov')) {
      return 'PubMed';
    }
    if (host.includes('jmir.org')) {
      return 'JMIR';
    }
    if (host.includes('medrxiv.org')) {
      return 'medRxiv';
    }
    if (host.includes('doi.org')) {
      const doi = extractDoiFromUrl(sourceUrl);
      if (doi) {
        return doiLabel(doi) || `DOI (${doi.split('/')[0]})`;
      }
      return 'DOI';
    }

    const doi = extractDoiFromUrl(sourceUrl);
    if (doi) {
      const mappedDoiLabel = doiLabel(doi);
      if (mappedDoiLabel) {
        return mappedDoiLabel;
      }
    }

    return host;
  } catch {
    if (sourceType === 'arxiv') {
      return 'arXiv';
    }
    if (sourceType === 'proceedings') {
      return 'Actas de conferencia';
    }
    if (sourceType === 'publisher') {
      return 'Editorial / revista';
    }
    if (sourceType === 'preprint_other') {
      return 'Preprint / otro';
    }
    return sourceUrl;
  }
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
