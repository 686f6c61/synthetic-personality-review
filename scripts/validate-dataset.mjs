import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CANONICAL_FILE = path.join(ROOT, 'data', 'articles.canonical.json');

function readJson(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing file: ${file}`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function normalizeText(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function paragraphWordCounts(text) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const counts = paragraphs.map((paragraph) =>
    paragraph
      .split(/\s+/)
      .map((w) => w.trim())
      .filter(Boolean).length
  );
  return { paragraphs, counts };
}

function ensure(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  const canonical = readJson(CANONICAL_FILE);
  ensure(Array.isArray(canonical), 'Canonical dataset must be an array');
  ensure(canonical.length > 0, 'Canonical dataset is empty');

  const requiredFields = [
    'id',
    'legacy_article_number',
    'title_original',
    'title_canonical',
    'category',
    'year',
    'authors',
    'keywords',
    'source_url',
    'source_type',
    'verification_status',
    'verification_date',
    'evidence',
    'abstract_en_original',
    'abstract_en_extended',
    'resumen_es_extendido',
    'structured_blocks'
  ];

  const titleYearSet = new Set();
  const urlSet = new Set();

  canonical.forEach((article, idx) => {
    for (const field of requiredFields) {
      ensure(field in article, `Missing field '${field}' in article index ${idx}`);
    }

    ensure(article.verification_status === 'verified', `Article ${article.id} is not verified`);

    const en = paragraphWordCounts(article.abstract_en_extended || '');
    const es = paragraphWordCounts(article.resumen_es_extendido || '');

    ensure(
      en.paragraphs.length >= 3,
      `Article ${article.id} EN extended abstract has fewer than 3 paragraphs`
    );
    ensure(
      es.paragraphs.length >= 3,
      `Article ${article.id} ES extended abstract has fewer than 3 paragraphs`
    );

    en.counts.forEach((count, pIdx) => {
      ensure(
        count >= 150,
        `Article ${article.id} EN paragraph ${pIdx + 1} has ${count} words (minimum 150)`
      );
    });

    es.counts.forEach((count, pIdx) => {
      ensure(
        count >= 150,
        `Article ${article.id} ES paragraph ${pIdx + 1} has ${count} words (minimum 150)`
      );
    });

    const dedupKey = `${normalizeText(article.title_canonical)}|${article.year}`;
    ensure(!titleYearSet.has(dedupKey), `Duplicate canonical title+year key found: ${dedupKey}`);
    titleYearSet.add(dedupKey);

    const normUrl = normalizeText(article.source_url);
    ensure(!urlSet.has(normUrl), `Duplicate source_url found: ${article.source_url}`);
    urlSet.add(normUrl);
  });

  process.stdout.write(`Validation passed for ${canonical.length} canonical articles.\n`);
}

main();
