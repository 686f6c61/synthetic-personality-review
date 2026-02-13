# Synthetic Personality Review

Repositorio científico curado sobre «personalidad sintética» en modelos de lenguaje (LLMs), construido como una bitácora pública con verificación de fuentes, canonicalización y publicación web reproducible.

- Sitio objetivo: https://syntheticpersonality.com
- Repositorio: https://github.com/686f6c61/synthetic-personality-review

## Estado actual del corpus

- Corpus fuente procesado: **165 artículos**
- Corpus canónico publicado: **165 artículos**
- Entradas excluidas: **0**
- Fecha de auditoría automatizada más reciente: **2026-02-13**

### Distribución por línea de investigación

| Línea | Artículos |
|---|---:|
| Evaluación y validación psicométrica | 80 |
| Inducción y control de personalidad | 42 |
| Aplicaciones, sesgos y consecuencias sociales | 43 |
| **Total** | **165** |

### Distribución por año

| Año | Artículos |
|---|---:|
| 2022 | 7 |
| 2023 | 11 |
| 2024 | 62 |
| 2025 | 62 |
| 2026 | 23 |
| **Total** | **165** |

## Qué incluye el proyecto

1. Pipeline reproducible `markdown -> JSON canónico`.
2. Verificación automática de fuentes con evidencia por artículo.
3. Política canónica de una sola versión principal por paper.
4. Abstracts extendidos EN/ES validados automáticamente (regla 3 x 150).
5. Sitio Astro estático en español:
   - listado filtrable,
   - ficha por artículo,
   - SEO técnico (canonical, Open Graph, robots, llms).
6. Reportes de auditoría en `reports/verification/`.

## Estructura del repositorio

```text
.
├── archive/
├── data/
│   ├── articles.intermediate.json
│   ├── articles.canonical.json
│   ├── articles.removed.json
│   └── manual-verification-overrides.json
├── reports/verification/
├── scripts/
│   ├── build-dataset.mjs
│   └── validate-dataset.mjs
├── src/
│   ├── components/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   └── styles/
├── public/
├── astro.config.mjs
├── package.json
└── render.yaml
```

## Contrato de datos

Cada artículo canónico en `data/articles.canonical.json` incluye, entre otros:

- `id`, `legacy_article_number`
- `title_original`, `title_canonical`
- `category`, `year`, `language`
- `authors`, `keywords`
- `source_url`, `source_type`
- `verification_status`, `verification_date`, `evidence`
- `abstract_en_original`, `abstract_en_extended`, `resumen_es_extendido`
- `structured_blocks`

## Reglas editoriales

### Verificación

- `verified`: fuente recuperable y metadatos consistentes.
- `removed`: inconsistencia o duplicidad (actualmente sin removidos en el corpus activo).

### Abstracts extendidos obligatorios

Para cada artículo canónico:

- Inglés (`abstract_en_extended`):
  - minimo 3 parrafos,
  - minimo 150 palabras por parrafo.
- Español (`resumen_es_extendido`):
  - minimo 3 parrafos,
  - minimo 150 palabras por parrafo.

Si falla una regla, el pipeline falla.

## Flujo local

### Requisitos

- Node.js 20+
- npm 10+

### Comandos

```bash
npm install
npm run build:data
npm run validate:data
npm run build:site
npm run build
npm run dev
```

### Qué hace cada comando

- `npm run build:data`: parsea fuente, verifica, canonicaliza y genera datasets.
- `npm run validate:data`: valida contrato, integridad y reglas editoriales.
- `npm run build:site`: compila solo el sitio Astro.
- `npm run build`: ejecuta pipeline completo + compilación final.

## Sitio web

Rutas públicas actuales:

- `/`
- `/articles`
- `/articles/[id]`

## Deploy en Render

El proyecto está preparado con `render.yaml` para despliegue como static site.

- Servicio: `synthetic-personality-review`
- Runtime: `static`
- Build: `npm ci && npm run build:site`
- Publish: `dist`

### Pasos de despliegue

1. Asegurar que `main` está en GitHub.
2. Abrir Blueprint en Render:
   - https://dashboard.render.com/blueprint/new?repo=https://github.com/686f6c61/synthetic-personality-review
3. Revisar configuración y aplicar despliegue.

## Trazabilidad histórica

Los documentos originales se mantienen en `archive/` para comparación y auditoría.

## Limitaciones conocidas

1. Algunas fuentes académicas pueden restringir acceso automatizado.
2. La verificación automática no sustituye lectura crítica completa de PDFs.
3. Los abstracts extendidos son síntesis editoriales derivadas de metadatos y abstract original.
