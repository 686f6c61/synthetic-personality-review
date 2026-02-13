import { loadCanonicalArticles } from '../lib/data';

const SITE = 'https://syntheticpersonality.com';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toIsoDate(value?: string): string {
  if (!value) {
    return new Date().toISOString();
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }
  return parsed.toISOString();
}

export function GET() {
  const articles = loadCanonicalArticles();
  const nowIso = new Date().toISOString();

  const staticEntries = [
    { loc: `${SITE}/`, lastmod: nowIso, changefreq: 'daily', priority: '1.0' },
    { loc: `${SITE}/articles`, lastmod: nowIso, changefreq: 'daily', priority: '0.9' }
  ];

  const articleEntries = articles.map((article) => ({
    loc: `${SITE}/articles/${article.id}`,
    lastmod: toIsoDate(article.verification_date),
    changefreq: 'weekly',
    priority: '0.8'
  }));

  const allEntries = [...staticEntries, ...articleEntries];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    allEntries
      .map(
        (entry) =>
          `  <url>\n` +
          `    <loc>${escapeXml(entry.loc)}</loc>\n` +
          `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>\n` +
          `    <changefreq>${entry.changefreq}</changefreq>\n` +
          `    <priority>${entry.priority}</priority>\n` +
          `  </url>`
      )
      .join('\n') +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
