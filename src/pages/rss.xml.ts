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

function toRfc2822(value?: string): string {
  const parsed = value ? new Date(value) : new Date();
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toUTCString();
  }
  return parsed.toUTCString();
}

function compact(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function GET() {
  const articles = loadCanonicalArticles();
  const items = [...articles]
    .sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year;
      }
      return b.legacy_article_number - a.legacy_article_number;
    })
    .slice(0, 120);

  const feed = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0">\n` +
    `  <channel>\n` +
    `    <title>Synthetic Personality Review</title>\n` +
    `    <link>${SITE}/</link>\n` +
    `    <description>Actualizaciones de artículos sobre «personalidad sintética» en modelos de lenguaje (LLMs).</description>\n` +
    `    <language>es-es</language>\n` +
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n` +
    items
      .map((article) => {
        const link = `${SITE}/articles/${article.id}`;
        const summarySource =
          article.resumen_es_extendido?.split(/\n\s*\n/).find(Boolean) ||
          article.abstract_en_original ||
          article.title_canonical;
        const summary = compact(summarySource);
        const description = summary.length > 600 ? `${summary.slice(0, 597).trimEnd()}...` : summary;
        return (
          `    <item>\n` +
          `      <title>${escapeXml(article.title_canonical)}</title>\n` +
          `      <link>${escapeXml(link)}</link>\n` +
          `      <guid>${escapeXml(link)}</guid>\n` +
          `      <pubDate>${toRfc2822(article.verification_date)}</pubDate>\n` +
          `      <category>${escapeXml(article.category)}</category>\n` +
          `      <description>${escapeXml(description)}</description>\n` +
          `    </item>`
        );
      })
      .join('\n') +
    `\n  </channel>\n` +
    `</rss>\n`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8'
    }
  });
}
