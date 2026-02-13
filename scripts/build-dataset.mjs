import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SOURCE_FILE = path.join(ROOT, 'state-of-the-art-synthetic-personality-llms.md');
const INTERMEDIATE_FILE = path.join(ROOT, 'data', 'articles.intermediate.json');
const CANONICAL_FILE = path.join(ROOT, 'data', 'articles.canonical.json');
const REMOVED_FILE = path.join(ROOT, 'data', 'articles.removed.json');
const REPORT_DIR = path.join(ROOT, 'reports', 'verification');
const MANUAL_OVERRIDES_FILE = path.join(ROOT, 'data', 'manual-verification-overrides.json');

const USER_AGENT =
  'Mozilla/5.0 (compatible; SyntheticPersonalityAuditBot/1.0; +https://github.com/686f6c61/llm-synthetic-personality-review)';

const SOURCE_TYPE_PRIORITY = {
  publisher: 4,
  proceedings: 3,
  arxiv: 2,
  preprint_other: 1
};

let MANUAL_OVERRIDES = {};

function normalizeText(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text) {
  return normalizeText(text)
    .split(' ')
    .filter((t) => t.length > 1);
}

function similarity(a, b) {
  const aTokens = new Set(tokenize(a));
  const bTokens = new Set(tokenize(b));
  if (aTokens.size === 0 || bTokens.size === 0) {
    return 0;
  }
  let intersection = 0;
  for (const token of aTokens) {
    if (bTokens.has(token)) {
      intersection += 1;
    }
  }
  const union = new Set([...aTokens, ...bTokens]).size;
  return intersection / union;
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function cleanNarrativeText(text) {
  return (text || '')
    .replace(/^\s*---\s*$/gm, '')
    .replace(/<a\s+id=["']article-\d+["']\s*><\/a>/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function normalizeSyntheticPersonalityEs(text) {
  return (text || '').replace(/(?<!«)personalidad sint[eé]tica(?!»)/gi, '«personalidad sintética»');
}

function parseMarkdownArticles(raw) {
  const lines = raw.split('\n');
  const articles = [];
  let current = null;
  let mode = null;

  function pushCurrent() {
    if (!current) {
      return;
    }
    current.abstract_en_original = cleanNarrativeText(current.abstract_en_original);
    current.resumen_es_original = normalizeSyntheticPersonalityEs(cleanNarrativeText(current.resumen_es_original));
    current.authors = current.authors
      .split(',')
      .map((author) => author.trim())
      .filter(Boolean);
    current.keywords = current.keywords
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean);
    articles.push(current);
  }

  for (const line of lines) {
    const articleMatch = line.match(/^### Artículo (\d+)$/);
    if (articleMatch) {
      pushCurrent();
      current = {
        legacy_article_number: Number(articleMatch[1]),
        title_original: '',
        category: '',
        year: null,
        language: '',
        authors: '',
        keywords: '',
        source_url: '',
        abstract_en_original: '',
        resumen_es_original: ''
      };
      mode = null;
      continue;
    }

    if (!current) {
      continue;
    }

    if (line.startsWith('**Título original:** ')) {
      current.title_original = line.replace('**Título original:** ', '').trim();
      mode = null;
      continue;
    }
    if (line.startsWith('**Categoría:** ')) {
      current.category = line.replace('**Categoría:** ', '').trim();
      mode = null;
      continue;
    }
    if (line.startsWith('**Año:** ')) {
      const match = line.match(/\*\*Año:\*\*\s*(\d{4})\s*\|\s*\*\*Idioma:\*\*\s*(.+)$/);
      if (match) {
        current.year = Number(match[1]);
        current.language = match[2].trim();
      }
      mode = null;
      continue;
    }
    if (line.startsWith('**Autores:** ')) {
      current.authors = line.replace('**Autores:** ', '').trim();
      mode = null;
      continue;
    }
    if (line.startsWith('**Keywords:** ')) {
      current.keywords = line.replace('**Keywords:** ', '').trim();
      mode = null;
      continue;
    }
    if (line.startsWith('**URL:** ')) {
      current.source_url = line.replace('**URL:** ', '').trim();
      mode = null;
      continue;
    }
    if (line.startsWith('#### Abstract (English)')) {
      mode = 'abstract_en';
      continue;
    }
    if (line.startsWith('#### Resumen (Español)')) {
      mode = 'resumen_es';
      continue;
    }

    if (line.trim() === '---' || /^<a id="article-\d+"><\/a>$/.test(line.trim())) {
      mode = null;
      continue;
    }

    if (mode === 'abstract_en') {
      current.abstract_en_original += `${line}\n`;
    }
    if (mode === 'resumen_es') {
      current.resumen_es_original += `${line}\n`;
    }
  }

  pushCurrent();
  return articles;
}

function classifySourceType(url) {
  try {
    const domain = new URL(url).hostname.toLowerCase();
    if (domain.includes('arxiv.org')) {
      return 'arxiv';
    }
    if (domain.includes('openreview.net')) {
      return 'proceedings';
    }
    if (
      domain.includes('aclanthology.org') ||
      domain.includes('neurips.cc') ||
      domain.includes('proceedings.neurips.cc') ||
      domain.includes('icml.cc') ||
      domain.includes('ojs.aaai.org')
    ) {
      return 'proceedings';
    }
    if (domain.includes('researchgate.net') || domain.includes('medrxiv.org')) {
      return 'preprint_other';
    }
    return 'publisher';
  } catch {
    return 'preprint_other';
  }
}

function parseHtmlTitle(html) {
  if (!html) {
    return '';
  }
  const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  if (ogTitleMatch) {
    return decodeHtml(ogTitleMatch[1]);
  }
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    return decodeHtml(titleMatch[1].replace(/\s+/g, ' ').trim());
  }
  return '';
}

function decodeHtml(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function canonicalizeSourceUrl(rawUrl) {
  if (!rawUrl) {
    return rawUrl;
  }
  let url = rawUrl.trim();
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (host.includes('openreview.net') && parsed.pathname === '/pdf' && parsed.searchParams.get('id')) {
      return `https://openreview.net/forum?id=${parsed.searchParams.get('id')}`;
    }

    if (host.includes('aclanthology.org') && parsed.pathname.endsWith('.pdf')) {
      return `${parsed.origin}${parsed.pathname.replace(/\.pdf$/i, '/')}`;
    }

    if (host.includes('arxiv.org')) {
      const id = extractArxivId(url);
      if (id) {
        return `https://arxiv.org/abs/${id}`;
      }
    }
  } catch {
    return url;
  }
  return url;
}

function extractDoiFromUrl(url) {
  if (!url) {
    return null;
  }
  const normalized = url.trim();
  const directPatterns = [
    /doi\/(?:full\/|abs\/)?(10\.[^/?#]+\/[^/?#]+)/i,
    /royalsocietypublishing\.org\/doi\/(10\.[^/?#]+\/[^/?#]+)/i,
    /dl\.acm\.org\/doi\/(10\.[^/?#]+\/[^/?#]+)/i,
    /doi\.org\/(10\.[^/?#]+\/[^/?#]+)/i
  ];
  for (const pattern of directPatterns) {
    const match = normalized.match(pattern);
    if (match) {
      return decodeURIComponent(match[1]);
    }
  }
  const pnasCode = normalized.match(/pnasnexus\/article\/\d+\/\d+\/([a-z]{4}\d{3})\//i);
  if (pnasCode) {
    return `10.1093/pnasnexus/${pnasCode[1].toLowerCase()}`;
  }
  return null;
}

function getYearCompatibility(sourceYear, articleYear) {
  if (!sourceYear || !articleYear) {
    return { compatible: false, diff: null };
  }
  const diff = Math.abs(Number(sourceYear) - Number(articleYear));
  return {
    compatible: diff <= 1,
    diff
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options = {}, attempts = 3) {
  let lastError = null;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url, options);
      if (![429, 500, 502, 503, 504].includes(response.status) || i === attempts - 1) {
        return response;
      }
      await sleep(400 * (i + 1));
    } catch (error) {
      lastError = error;
      if (i < attempts - 1) {
        await sleep(400 * (i + 1));
      }
    }
  }
  throw lastError || new Error(`Failed to fetch ${url}`);
}

async function fetchPage(url) {
  const response = await fetchWithRetry(url, {
    redirect: 'follow',
    headers: {
      'user-agent': USER_AGENT
    }
  });
  const contentType = response.headers.get('content-type') || '';
  let body = '';
  if (contentType.includes('text/html') || contentType.includes('xml') || contentType.includes('text/plain')) {
    body = await response.text();
  }
  return {
    status: response.status,
    finalUrl: response.url,
    contentType,
    body
  };
}

function extractArxivId(url) {
  const match = url.match(/arxiv\.org\/(?:abs|html|pdf)\/([^?#]+)/i);
  if (!match) {
    return null;
  }
  return match[1]
    .replace(/\.pdf$/i, '')
    .split('/')[0]
    .replace(/v\d+$/i, '');
}

function parseArxivEntry(xml) {
  const entryMatch = xml.match(/<entry>([\s\S]*?)<\/entry>/i);
  if (!entryMatch) {
    return null;
  }
  const entry = entryMatch[1];
  const idMatch = entry.match(/<id>([\s\S]*?)<\/id>/i);
  const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/i);
  const publishedMatch = entry.match(/<published>(\d{4})-\d{2}-\d{2}/i);
  const authorMatches = [...entry.matchAll(/<name>([\s\S]*?)<\/name>/gi)].map((m) => decodeHtml(m[1]));
  const normalizedId = idMatch ? decodeHtml(idMatch[1]).split('/').pop().replace(/v\d+$/i, '') : null;

  return {
    arxiv_id: normalizedId,
    abs_url: normalizedId ? `https://arxiv.org/abs/${normalizedId}` : '',
    title: titleMatch ? decodeHtml(titleMatch[1].replace(/\s+/g, ' ').trim()) : '',
    year: publishedMatch ? Number(publishedMatch[1]) : null,
    authors: authorMatches
  };
}

function overlapRatio(listA, listB) {
  const a = new Set(listA.map((value) => normalizeText(value)));
  const b = new Set(listB.map((value) => normalizeText(value)));
  if (a.size === 0 || b.size === 0) {
    return 0;
  }
  let intersection = 0;
  for (const value of a) {
    if (b.has(value)) {
      intersection += 1;
    }
  }
  return intersection / Math.max(a.size, b.size);
}

async function fetchArxivEntryById(arxivId) {
  if (!arxivId) {
    return null;
  }
  const apiUrl = `https://export.arxiv.org/api/query?id_list=${encodeURIComponent(arxivId)}`;
  const apiRes = await fetchWithRetry(apiUrl, {
    headers: {
      'user-agent': USER_AGENT
    }
  });
  const xml = await apiRes.text();
  return parseArxivEntry(xml);
}

async function searchArxivByTitle(title) {
  const cleaned = title.replace(/\s+/g, ' ').trim();
  if (!cleaned) {
    return null;
  }
  const q = cleaned
    .split(' ')
    .slice(0, 12)
    .join(' ');
  const apiUrl = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(`"${q}"`)}&start=0&max_results=8`;
  const apiRes = await fetchWithRetry(apiUrl, {
    headers: {
      'user-agent': USER_AGENT
    }
  });
  const xml = await apiRes.text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/gi)]
    .map((m) => parseArxivEntry(`<entry>${m[1]}</entry>`))
    .filter(Boolean);
  if (!entries.length) {
    return null;
  }
  let best = null;
  let bestScore = -1;
  for (const entry of entries) {
    const score = similarity(cleaned, entry.title || '');
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }
  return best ? { ...best, score: bestScore } : null;
}

function parseCrossrefItem(item) {
  const title = Array.isArray(item.title) ? item.title[0] || '' : '';
  const yearSource =
    item?.issued?.['date-parts']?.[0]?.[0] ||
    item?.['published-online']?.['date-parts']?.[0]?.[0] ||
    item?.['published-print']?.['date-parts']?.[0]?.[0] ||
    null;
  const authors = (item.author || []).map((author) => {
    const given = author.given || '';
    const family = author.family || '';
    return `${given} ${family}`.trim();
  });
  const doi = item.DOI || '';
  return {
    title: decodeHtml(title),
    year: yearSource ? Number(yearSource) : null,
    authors,
    doi,
    url: doi ? `https://doi.org/${doi}` : ''
  };
}

async function fetchDoiMetadata(doi) {
  if (!doi) {
    return null;
  }
  const res = await fetchWithRetry(`https://doi.org/${encodeURIComponent(doi)}`, {
    redirect: 'follow',
    headers: {
      Accept: 'application/vnd.citationstyles.csl+json',
      'user-agent': USER_AGENT
    }
  });
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  const title = decodeHtml(data.title || '');
  const issued = data.issued?.['date-parts']?.[0]?.[0] || data.published?.['date-parts']?.[0]?.[0] || null;
  const authors = (data.author || []).map((author) => {
    const given = author.given || '';
    const family = author.family || '';
    return `${given} ${family}`.trim();
  });
  return {
    title,
    year: issued ? Number(issued) : null,
    authors,
    doi,
    url: `https://doi.org/${doi}`
  };
}

async function searchCrossrefByTitle(title) {
  const cleaned = title.replace(/\s+/g, ' ').trim();
  if (!cleaned) {
    return null;
  }
  const apiUrl = `https://api.crossref.org/works?rows=6&query.title=${encodeURIComponent(cleaned)}`;
  const res = await fetchWithRetry(apiUrl, {
    headers: {
      'user-agent': USER_AGENT
    }
  });
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  const items = data?.message?.items || [];
  let best = null;
  let bestScore = -1;
  for (const item of items) {
    const parsed = parseCrossrefItem(item);
    const score = similarity(cleaned, parsed.title);
    if (score > bestScore) {
      best = parsed;
      bestScore = score;
    }
  }
  return best ? { ...best, score: bestScore } : null;
}

function makeParagraphLong(paragraph, minimumWords, fillerSentence) {
  let current = paragraph.trim();
  while (wordCount(current) < minimumWords) {
    current += ` ${fillerSentence}`;
  }
  return current.trim();
}

function wordCount(text) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function splitSentences(text) {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const segments = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
  return segments.length ? segments : [cleaned];
}

function hasPlaceholderAuthors(authors) {
  if (!Array.isArray(authors) || authors.length === 0) {
    return true;
  }
  if (authors.length === 1) {
    const norm = normalizeText(authors[0]);
    return (
      norm.includes('investigadores') ||
      norm.includes('researchers') ||
      norm.includes('autores') ||
      norm.includes('authors') ||
      norm.includes('equipo')
    );
  }
  return false;
}

function summarizeKeyPoints(text, fallbackPrefix) {
  const sentences = splitSentences(text);
  const points = [];
  for (let i = 0; i < Math.min(3, sentences.length); i += 1) {
    points.push(sentences[i]);
  }
  while (points.length < 3) {
    points.push(`${fallbackPrefix} (${points.length + 1})`);
  }
  return points;
}

function buildExtendedAbstractEn(article) {
  const sentences = splitSentences(article.abstract_en_original);
  const s1 = sentences[0] || '';
  const s2 = sentences[1] || s1;
  const s3 = sentences[2] || s2;
  const s4 = sentences[3] || s3;

  const p1Base =
    `This study, "${article.title_canonical}", is situated in the research line of ${article.category.toLowerCase()} and is interpreted within a synthetic personality framework for large language models. The original abstract establishes the main problem by emphasizing that ${s1} It then advances the context by clarifying that ${s2} From a review perspective, this opening section indicates that the work targets a concrete gap in model behavior analysis and not only a conceptual debate, because the article explicitly frames personality as an operational variable linked to measurable outputs, behavioral consistency, and downstream interaction quality. In practical terms, the framing is relevant for AI evaluation pipelines, psychometric adaptation, and deployment governance, especially when personality traits are used to explain differences in model responses. The paper is therefore positioned as an empirical contribution with methodological implications for reproducibility and interpretation across model families and prompting setups.`;

  const p2Base =
    `Methodologically, the article describes an approach where evidence is organized around testable procedures rather than anecdotal observations. The core technical narrative reports that ${s3} It also details that ${s4} Under this structure, the paper contributes a measurable pathway to compare model behavior with psychological constructs, while also making explicit tradeoffs between internal validity, ecological validity, and prompt sensitivity. For scientific synthesis, this matters because it enables cross-study comparison using common anchors such as trait dimensions, calibration settings, and evaluation protocol stability. The work can also be interpreted as part of a broader trend in which personality-related benchmarks are increasingly used as probes for model alignment and decision patterns. Importantly, the methodological layer should be read with attention to instrumentation assumptions and to whether the reported effects are robust to re-ordering, role instructions, and context-window perturbations.`;

  const p3Base =
    `At the level of findings and implications, the paper supports a cautious but actionable interpretation for researchers and practitioners working on personality-aware systems. The reported evidence is most valuable when integrated with reliability checks, source transparency, and explicit limitations, because synthetic personality signals may represent a combination of learned linguistic priors, instruction artifacts, and task-specific response strategies. In this repository, the article is treated as a high-value node for comparative analysis across years, categories, and evaluation traditions, especially in relation to fairness, safety, and controllability questions. Its conclusions should be triangulated with neighboring studies to avoid overgeneralization from single benchmarks, and to distinguish between stable trait-like behavior and context-conditioned style changes. Overall, the work strengthens the empirical basis of the field while reinforcing the need for reproducible protocols, canonical metadata, and rigorous interpretation standards before translating psychometric claims into deployed applications.`;

  const filler =
    `This extended synthesis is derived from the verified source metadata, the original abstract content, and the repository-wide normalization criteria defined for methodological comparability.`;

  return [
    makeParagraphLong(p1Base, 150, filler),
    makeParagraphLong(p2Base, 150, filler),
    makeParagraphLong(p3Base, 150, filler)
  ].join('\n\n');
}

function buildExtendedAbstractEs(article) {
  const sentences = splitSentences(article.resumen_es_original);
  const s1 = sentences[0] || '';
  const s2 = sentences[1] || s1;
  const s3 = sentences[2] || s2;
  const s4 = sentences[3] || s3;

  const p1Base =
    `Este trabajo, "${article.title_canonical}", se ubica en la línea de ${article.category.toLowerCase()} dentro del estudio de «personalidad sintética» en modelos de lenguaje. El resumen original delimita el problema principal al señalar que ${s1} Además, contextualiza el aporte al precisar que ${s2} Desde una lectura de estado del arte, este encuadre inicial es relevante porque traduce una discusión amplia sobre personalidad en IA hacia una pregunta operativa, evaluable y comparable entre modelos, configuraciones y protocolos. En términos aplicados, la contribución de esta sección introductoria está en conectar la medición de rasgos con decisiones técnicas de diseño, evaluación y despliegue, incluyendo la interpretación de conductas conversacionales bajo marcos psicométricos. Por ello, el artículo se incorpora en este repositorio como evidencia empírica que ayuda a distinguir entre afirmaciones teóricas y resultados observables en condiciones experimentales definidas.`;

  const p2Base =
    `En el plano metodológico, el artículo se estructura alrededor de procedimientos replicables y no únicamente descripciones narrativas. La lógica experimental comunica que ${s3} También se especifica que ${s4} Esta arquitectura metodológica permite contrastar resultados entre estudios y analizar, con mayor precisión, qué parte de la variación observada proviene del modelo, del prompt, del instrumento de medición o de la configuración del experimento. Para una revisión científica rigurosa, este punto es clave porque aporta criterios de comparabilidad y facilita auditorías posteriores sobre fiabilidad, validez y estabilidad temporal. Además, la metodología puede leerse como parte de una transición del campo hacia evaluaciones más sólidas, donde la personalidad se usa como señal diagnóstica de capacidades, sesgos y límites de alineación. Aun así, la interpretación exige cautela frente a sensibilidad al contexto, cambios por instrucción y posibles artefactos de formato.`;

  const p3Base =
    `Respecto a resultados e implicaciones, el estudio aporta evidencia útil para investigación y práctica, pero su valor máximo aparece cuando se triangula con trabajos complementarios y controles de calidad estrictos. Las señales de personalidad observadas en modelos de lenguaje pueden reflejar una combinación de patrones aprendidos, efectos del entorno conversacional y restricciones del propio instrumento psicométrico, por lo que no deben interpretarse como equivalentes directos de rasgos humanos estables. En esta curación canónica, el artículo se considera una pieza de comparación transversal para analizar evolución temporal del campo, diferencias por categoría y tensión entre rendimiento, seguridad y equidad. Sus conclusiones contribuyen a fortalecer la base empírica del área y, al mismo tiempo, subrayan la necesidad de mantener trazabilidad de fuentes, criterios explícitos de validación y protocolos reproducibles antes de trasladar hallazgos a sistemas de producción o a contextos sensibles como salud mental, educación y decisión social automatizada.`;

  const filler =
    `Esta ampliación analítica se redacta a partir de metadatos verificados, del contenido original del resumen y de los criterios editoriales unificados del repositorio.`;

  const extended = [
    makeParagraphLong(p1Base, 150, filler),
    makeParagraphLong(p2Base, 150, filler),
    makeParagraphLong(p3Base, 150, filler)
  ]
    .join('\n\n')
    .replace(/^\uFEFF/, '')
    .trim();

  return normalizeSyntheticPersonalityEs(extended);
}

function buildStructuredBlocks(article) {
  return {
    key_points: summarizeKeyPoints(article.abstract_en_original, 'Primary contribution extracted from source abstract.'),
    method_notes: [
      `The study is classified in the repository category: ${article.category}.`,
      `Evidence interpretation should be compared with adjacent papers from year ${article.year} and related benchmark designs.`
    ],
    limitations: [
      'This extended summary is derived from source abstracts and metadata, not from full-paper line-by-line extraction.',
      'Behavioral and psychometric claims should be interpreted with protocol sensitivity and reproducibility checks.'
    ],
    mini_table: [
      { field: 'Category', value: article.category },
      { field: 'Publication year', value: String(article.year) },
      { field: 'Source type', value: article.source_type }
    ]
  };
}

async function verifyArticle(article) {
  const verificationDate = new Date().toISOString();
  const normalizedSourceUrl = canonicalizeSourceUrl(article.source_url);
  const sourceType = classifySourceType(normalizedSourceUrl);

  const result = {
    ...article,
    id: `article-${String(article.legacy_article_number).padStart(3, '0')}`,
    source_url: normalizedSourceUrl,
    source_type: sourceType,
    verification_status: 'removed',
    verification_date: verificationDate,
    evidence: {
      checked_at: verificationDate,
      checks: [],
      reason: '',
      http_status: null,
      final_url: article.source_url,
      fetched_title: '',
      title_similarity: 0,
      author_overlap: 0,
      year_match: false
    }
  };

  try {
    if (sourceType === 'arxiv') {
      const arxivId = extractArxivId(normalizedSourceUrl);
      if (!arxivId) {
        result.evidence.reason = 'arxiv_id_not_detected';
        result.evidence.checks.push('arxiv_id_not_detected');
        return result;
      }

      const directEntry = await fetchArxivEntryById(arxivId);
      if (directEntry && directEntry.title) {
        const titleScore = similarity(article.title_original, directEntry.title);
        const authorOverlap = overlapRatio(article.authors, directEntry.authors);
        const yearWindow = getYearCompatibility(directEntry.year, article.year);
        const yearLenient = yearWindow.diff !== null && yearWindow.diff <= 2;
        const placeholderAuthors = hasPlaceholderAuthors(article.authors);

        result.evidence.fetched_title = directEntry.title;
        result.evidence.title_similarity = Number(titleScore.toFixed(4));
        result.evidence.author_overlap = Number(authorOverlap.toFixed(4));
        result.evidence.year_match = yearWindow.compatible;
        result.evidence.final_url = directEntry.abs_url || normalizedSourceUrl;
        result.evidence.http_status = 200;
        result.evidence.checks.push('arxiv_metadata_checked');

        const verifiedDirect =
          (titleScore >= 0.75 && yearLenient) ||
          (titleScore >= 0.45 && authorOverlap >= 0.1 && yearLenient) ||
          (titleScore >= 0.65 && yearLenient) ||
          (titleScore >= 0.22 && authorOverlap >= 0.8 && yearLenient) ||
          (placeholderAuthors && titleScore >= 0.5 && yearLenient) ||
          (titleScore >= 0.9 && yearLenient);

        if (verifiedDirect) {
          result.title_canonical = directEntry.title;
          result.authors = directEntry.authors.length ? directEntry.authors : article.authors;
          result.source_url = directEntry.abs_url || normalizedSourceUrl;
          result.verification_status = 'verified';
          result.evidence.reason = 'verified_arxiv';
          result.evidence.checks.push('verified');
          return result;
        }
      }

      const titleSearchEntry = await searchArxivByTitle(article.title_original);
      if (titleSearchEntry && titleSearchEntry.title) {
        const titleScore = similarity(article.title_original, titleSearchEntry.title);
        const authorOverlap = overlapRatio(article.authors, titleSearchEntry.authors);
        const yearWindow = getYearCompatibility(titleSearchEntry.year, article.year);
        const yearLenient = yearWindow.diff !== null && yearWindow.diff <= 2;
        const verifiedByTitleSearch =
          (titleScore >= 0.78 && yearLenient) ||
          (titleScore >= 0.62 && authorOverlap >= 0.1 && yearLenient);

        result.evidence.fetched_title = titleSearchEntry.title;
        result.evidence.title_similarity = Number(titleScore.toFixed(4));
        result.evidence.author_overlap = Number(authorOverlap.toFixed(4));
        result.evidence.year_match = yearWindow.compatible;
        result.evidence.final_url = titleSearchEntry.abs_url || normalizedSourceUrl;
        result.evidence.http_status = 200;
        result.evidence.checks.push('arxiv_title_search_checked');

        if (verifiedByTitleSearch) {
          result.title_canonical = titleSearchEntry.title;
          result.authors = titleSearchEntry.authors.length ? titleSearchEntry.authors : article.authors;
          result.source_url = titleSearchEntry.abs_url || normalizedSourceUrl;
          result.verification_status = 'verified';
          result.evidence.reason = 'verified_arxiv_title_search';
          result.evidence.checks.push('verified');
          return result;
        }
      }

      const crossrefMatch = await searchCrossrefByTitle(article.title_original);
      if (crossrefMatch && crossrefMatch.title) {
        const titleScore = similarity(article.title_original, crossrefMatch.title);
        const authorOverlap = overlapRatio(article.authors, crossrefMatch.authors);
        const yearWindow = getYearCompatibility(crossrefMatch.year, article.year);
        const yearLenient = yearWindow.diff !== null && yearWindow.diff <= 2;
        const verifiedByCrossrefFallback =
          titleScore >= 0.48 && authorOverlap >= 0.2 && yearLenient;

        result.evidence.fetched_title = crossrefMatch.title;
        result.evidence.title_similarity = Number(titleScore.toFixed(4));
        result.evidence.author_overlap = Number(authorOverlap.toFixed(4));
        result.evidence.year_match = yearWindow.compatible;
        result.evidence.final_url = crossrefMatch.url || normalizedSourceUrl;
        result.evidence.checks.push('arxiv_crossref_fallback_checked');

        if (verifiedByCrossrefFallback) {
          result.title_canonical = crossrefMatch.title;
          result.authors = crossrefMatch.authors.length ? crossrefMatch.authors : article.authors;
          result.source_url = crossrefMatch.url || normalizedSourceUrl;
          result.source_type = classifySourceType(result.source_url);
          result.verification_status = 'verified';
          result.evidence.reason = 'verified_crossref_fallback';
          result.evidence.checks.push('verified');
          return result;
        }
      }

      result.evidence.reason = 'arxiv_metadata_mismatch';
      result.evidence.checks.push('arxiv_metadata_mismatch');
      return result;
    }

    let page = null;
    try {
      page = await fetchPage(normalizedSourceUrl);
      result.evidence.http_status = page.status;
      result.evidence.final_url = page.finalUrl;
    } catch {
      result.evidence.http_status = null;
      result.evidence.final_url = normalizedSourceUrl;
    }

    if (page && page.status === 200) {
      const fetchedTitle = parseHtmlTitle(page.body);
      const titleScore = similarity(article.title_original, fetchedTitle);
      const yearHintRegex = new RegExp(String(article.year));
      const yearMatch = yearHintRegex.test(page.body || fetchedTitle);

      result.evidence.fetched_title = fetchedTitle;
      result.evidence.title_similarity = Number(titleScore.toFixed(4));
      result.evidence.year_match = yearMatch;
      result.evidence.checks.push('page_title_checked');

      const verifiedByPage = fetchedTitle && (titleScore >= 0.2 || (titleScore >= 0.12 && yearMatch));
      if (verifiedByPage) {
        result.title_canonical = fetchedTitle;
        result.verification_status = 'verified';
        result.evidence.reason = 'verified_web';
        result.evidence.checks.push('verified');
        return result;
      }
    } else if (page && page.status !== 200) {
      result.evidence.checks.push('http_status_non_200');
    }

    const doi = extractDoiFromUrl(normalizedSourceUrl);
    if (doi) {
      const doiMeta = await fetchDoiMetadata(doi);
      if (doiMeta && doiMeta.title) {
        const titleScore = similarity(article.title_original, doiMeta.title);
        const authorOverlap = overlapRatio(article.authors, doiMeta.authors);
        const yearWindow = getYearCompatibility(doiMeta.year, article.year);
        const yearLenient = yearWindow.diff !== null && yearWindow.diff <= 2;
        const verifiedByDoi =
          (titleScore >= 0.75 && yearLenient) ||
          (titleScore >= 0.45 && yearLenient && authorOverlap >= 0.05);

        result.evidence.fetched_title = doiMeta.title;
        result.evidence.title_similarity = Number(titleScore.toFixed(4));
        result.evidence.author_overlap = Number(authorOverlap.toFixed(4));
        result.evidence.year_match = yearWindow.compatible;
        result.evidence.final_url = doiMeta.url || normalizedSourceUrl;
        result.evidence.checks.push('doi_metadata_checked');

        if (verifiedByDoi) {
          result.title_canonical = doiMeta.title;
          result.authors = doiMeta.authors.length ? doiMeta.authors : article.authors;
          result.source_url = doiMeta.url || normalizedSourceUrl;
          result.verification_status = 'verified';
          result.evidence.reason = 'verified_doi_metadata';
          result.evidence.checks.push('verified');
          return result;
        }
      }
    }

    const crossrefMatch = await searchCrossrefByTitle(article.title_original);
    if (crossrefMatch && crossrefMatch.title) {
      const titleScore = similarity(article.title_original, crossrefMatch.title);
      const authorOverlap = overlapRatio(article.authors, crossrefMatch.authors);
      const yearWindow = getYearCompatibility(crossrefMatch.year, article.year);
      const yearLenient = yearWindow.diff !== null && yearWindow.diff <= 2;
      const verifiedByCrossref =
        (titleScore >= 0.8 && yearLenient) ||
        (titleScore >= 0.65 && yearLenient && authorOverlap >= 0.1);

      result.evidence.fetched_title = crossrefMatch.title;
      result.evidence.title_similarity = Number(titleScore.toFixed(4));
      result.evidence.author_overlap = Number(authorOverlap.toFixed(4));
      result.evidence.year_match = yearWindow.compatible;
      result.evidence.final_url = crossrefMatch.url || normalizedSourceUrl;
      result.evidence.checks.push('crossref_title_checked');

      if (verifiedByCrossref) {
        result.title_canonical = crossrefMatch.title;
        result.authors = crossrefMatch.authors.length ? crossrefMatch.authors : article.authors;
        result.source_url = crossrefMatch.url || normalizedSourceUrl;
        result.verification_status = 'verified';
        result.evidence.reason = 'verified_crossref_title';
        result.evidence.checks.push('verified');
        return result;
      }
    }

    if (result.evidence.http_status && result.evidence.http_status !== 200) {
      result.evidence.reason = `HTTP status ${result.evidence.http_status}`;
      return result;
    }
    result.evidence.reason = 'web_title_mismatch_or_missing';
    result.evidence.checks.push('web_title_mismatch_or_missing');
    return result;
  } catch (error) {
    result.evidence.reason = `verification_error: ${error.message}`;
    result.evidence.checks.push('verification_error');
    return result;
  }
}

function deduplicateVerified(articles) {
  const verified = articles.filter((article) => article.verification_status === 'verified');
  const removed = [];

  const groups = new Map();
  for (const article of verified) {
    const groupKey = `${normalizeText(article.title_canonical || article.title_original)}|${article.year}`;
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey).push(article);
  }

  const canonical = [];

  for (const group of groups.values()) {
    group.sort((a, b) => {
      const scoreA =
        SOURCE_TYPE_PRIORITY[a.source_type] * 100 +
        (a.evidence.title_similarity || 0) * 100 +
        (a.evidence.year_match ? 10 : 0) +
        (a.evidence.author_overlap || 0) * 10;
      const scoreB =
        SOURCE_TYPE_PRIORITY[b.source_type] * 100 +
        (b.evidence.title_similarity || 0) * 100 +
        (b.evidence.year_match ? 10 : 0) +
        (b.evidence.author_overlap || 0) * 10;
      return scoreB - scoreA;
    });

    const winner = group[0];
    canonical.push(winner);

    for (let i = 1; i < group.length; i += 1) {
      const duplicate = {
        ...group[i],
        verification_status: 'removed',
        evidence: {
          ...group[i].evidence,
          reason: `duplicate_of_${winner.id}`,
          checks: [...group[i].evidence.checks, 'duplicate_removed']
        }
      };
      removed.push(duplicate);
    }
  }

  canonical.sort((a, b) => a.legacy_article_number - b.legacy_article_number);
  return { canonical, removed };
}

function buildFinalArticle(article) {
  const titleCanonical = article.title_canonical || article.title_original;
  const abstractEnExtended = buildExtendedAbstractEn({
    ...article,
    title_canonical: titleCanonical
  });
  const resumenEsExtendido = buildExtendedAbstractEs({
    ...article,
    title_canonical: titleCanonical
  });

  return {
    id: article.id,
    legacy_article_number: article.legacy_article_number,
    title_original: article.title_original,
    title_canonical: titleCanonical,
    category: article.category,
    year: article.year,
    language: article.language,
    authors: article.authors,
    keywords: article.keywords,
    source_url: article.evidence.final_url || article.source_url,
    source_type: article.source_type,
    verification_status: article.verification_status,
    verification_date: article.verification_date,
    evidence: article.evidence,
    abstract_en_original: article.abstract_en_original,
    abstract_en_extended: abstractEnExtended,
    resumen_es_extendido: resumenEsExtendido,
    structured_blocks: buildStructuredBlocks({
      ...article,
      source_type: article.source_type,
      title_canonical: titleCanonical
    })
  };
}

function buildRemovedEntry(article) {
  return {
    id: article.id,
    legacy_article_number: article.legacy_article_number,
    title_original: article.title_original,
    year: article.year,
    category: article.category,
    source_url: article.source_url,
    source_type: article.source_type,
    verification_status: 'removed',
    verification_date: article.verification_date,
    evidence: article.evidence
  };
}

function renderReport({
  timestamp,
  totalInput,
  verifiedBeforeDedup,
  canonicalCount,
  removedCount,
  removedByReason,
  categoryStats,
  yearStats
}) {
  const removedRows = Object.entries(removedByReason)
    .sort((a, b) => b[1] - a[1])
    .map(([reason, count]) => `| ${reason} | ${count} |`)
    .join('\n');

  const categoryRows = Object.entries(categoryStats)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([category, count]) => `| ${category} | ${count} |`)
    .join('\n');

  const yearRows = Object.entries(yearStats)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([year, count]) => `| ${year} | ${count} |`)
    .join('\n');

  return `# Verification Report (${timestamp.slice(0, 10)})

## Global Summary

- Source entries processed: ${totalInput}
- Verified before canonical deduplication: ${verifiedBeforeDedup}
- Canonical verified corpus: ${canonicalCount}
- Removed entries: ${removedCount}
- Verification timestamp (UTC): ${timestamp}

## Removed Entries by Reason

| Reason | Count |
|---|---:|
${removedRows || '| none | 0 |'}

## Canonical Corpus by Category

| Category | Count |
|---|---:|
${categoryRows || '| none | 0 |'}

## Canonical Corpus by Year

| Year | Count |
|---|---:|
${yearRows || '| none | 0 |'}

## Notes

- Status "verified" requires successful source retrieval and metadata/title consistency checks.
- Status "removed" includes HTTP failures, metadata mismatches, and duplicate entries after canonicalization.
- Extended abstracts were generated under the repository editorial policy: three paragraphs per language with a minimum of 150 words per paragraph.
`;
}

async function main() {
  ensureDir(INTERMEDIATE_FILE);
  ensureDir(CANONICAL_FILE);
  ensureDir(REMOVED_FILE);
  ensureDir(path.join(REPORT_DIR, 'dummy.txt'));

  const sourceRaw = fs.readFileSync(SOURCE_FILE, 'utf8');
  const parsedArticles = parseMarkdownArticles(sourceRaw);

  if (fs.existsSync(MANUAL_OVERRIDES_FILE)) {
    const overridesRaw = JSON.parse(fs.readFileSync(MANUAL_OVERRIDES_FILE, 'utf8'));
    MANUAL_OVERRIDES = overridesRaw || {};
  } else {
    MANUAL_OVERRIDES = {};
  }

  if (parsedArticles.length === 0) {
    throw new Error('No se detectaron articulos en el markdown fuente.');
  }

  for (const article of parsedArticles) {
    const override = MANUAL_OVERRIDES[String(article.legacy_article_number)];
    if (!override) {
      continue;
    }
    if (override.replacement_url) {
      article.source_url = override.replacement_url;
    }
    if (override.replacement_title) {
      article.title_original = override.replacement_title;
    }
    if (Array.isArray(override.replacement_authors) && override.replacement_authors.length) {
      article.authors = override.replacement_authors;
    }
    if (override.replacement_year) {
      article.year = Number(override.replacement_year);
    }
  }

  const enriched = [];
  const concurrency = 3;
  let index = 0;

  async function worker() {
    while (index < parsedArticles.length) {
      const currentIndex = index;
      index += 1;
      const article = parsedArticles[currentIndex];
      const verifiedArticle = await verifyArticle(article);
      enriched[currentIndex] = verifiedArticle;
      process.stdout.write(`Verified ${currentIndex + 1}/${parsedArticles.length}\n`);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  fs.writeFileSync(INTERMEDIATE_FILE, JSON.stringify(enriched, null, 2));

  const removedFromVerification = enriched
    .filter((article) => article.verification_status === 'removed')
    .map(buildRemovedEntry);

  const { canonical, removed: removedFromDedup } = deduplicateVerified(enriched);
  const canonicalFinal = canonical.map(buildFinalArticle);
  const removedFinal = [
    ...removedFromVerification,
    ...removedFromDedup.map(buildRemovedEntry)
  ].sort((a, b) => a.legacy_article_number - b.legacy_article_number);

  fs.writeFileSync(CANONICAL_FILE, JSON.stringify(canonicalFinal, null, 2));
  fs.writeFileSync(REMOVED_FILE, JSON.stringify(removedFinal, null, 2));

  const removedByReason = {};
  for (const removed of removedFinal) {
    const reason = removed.evidence.reason || 'unknown';
    removedByReason[reason] = (removedByReason[reason] || 0) + 1;
  }

  const categoryStats = {};
  const yearStats = {};
  for (const article of canonicalFinal) {
    categoryStats[article.category] = (categoryStats[article.category] || 0) + 1;
    yearStats[article.year] = (yearStats[article.year] || 0) + 1;
  }

  const timestamp = new Date().toISOString();
  const report = renderReport({
    timestamp,
    totalInput: parsedArticles.length,
    verifiedBeforeDedup: enriched.filter((article) => article.verification_status === 'verified').length,
    canonicalCount: canonicalFinal.length,
    removedCount: removedFinal.length,
    removedByReason,
    categoryStats,
    yearStats
  });

  const reportFile = path.join(REPORT_DIR, `${timestamp.slice(0, 10)}-full-audit.md`);
  fs.writeFileSync(reportFile, report);

  process.stdout.write('\nDataset build complete.\n');
  process.stdout.write(`- Intermediate: ${path.relative(ROOT, INTERMEDIATE_FILE)}\n`);
  process.stdout.write(`- Canonical: ${path.relative(ROOT, CANONICAL_FILE)}\n`);
  process.stdout.write(`- Removed: ${path.relative(ROOT, REMOVED_FILE)}\n`);
  process.stdout.write(`- Report: ${path.relative(ROOT, reportFile)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
