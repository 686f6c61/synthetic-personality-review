# Synthetic Personality Review: Corpus Canónico Verificado sobre Personalidad en LLMs

Repositorio científico curado sobre «personalidad sintética» en modelos de lenguaje, reconstruido como un pipeline reproducible de verificación, canonicalización y publicación web.

## Estado actual del corpus

- Entrada original procesada: **150 artículos** (fuente histórica).
- Corpus canónico verificado publicado: **119 artículos**.
- Entradas excluidas: **31** (no verificables, inconsistentes o duplicadas).
- Pendientes de verificación manual adicional: **17** (no duplicados).
- Fecha de auditoría automatizada: **2026-02-12**.

### Distribución del corpus canónico (actual)

| Categoría | Artículos |
|---|---:|
| Evaluación y validación psicométrica | 40 |
| Inducción y control de personalidad | 39 |
| Aplicaciones, sesgos y consecuencias sociales | 40 |
| **Total** | **119** |

| Año | Artículos |
|---|---:|
| 2022 | 7 |
| 2023 | 11 |
| 2024 | 61 |
| 2025 | 40 |
| **Total** | **119** |

## Qué se implementó en esta versión

1. **Pipeline reproducible de datos** desde markdown fuente a JSON canónico.
2. **Verificación de fuentes 150/150** con evidencia por artículo.
3. **Política canónica**: una versión principal por paper.
4. **Ledger de exclusiones** con razones explícitas (`data/articles.removed.json`).
5. **Abstracts extendidos EN/ES obligatorios**:
   - mínimo 3 párrafos por idioma,
   - mínimo 150 palabras por párrafo,
   - validación automática en build.
6. **Sitio Astro estático** con:
   - listado filtrable,
   - detalle por artículo,
   - metodología,
   - panel de calidad de datos.
7. **Reportes de auditoría** en `reports/verification/`.
8. **Configuración de CI + Netlify** para build reproducible.

## Estructura del repositorio

```text
.
├── archive/
│   ├── README.original.md
│   └── state-of-the-art-synthetic-personality-llms.original.md
├── data/
│   ├── articles.intermediate.json
│   ├── articles.canonical.json
│   └── articles.removed.json
│   └── manual-verification-overrides.json
├── reports/verification/
│   └── YYYY-MM-DD-full-audit.md
│   └── manual-assisted-YYYY-MM-DD.md
├── scripts/
│   ├── build-dataset.mjs
│   └── validate-dataset.mjs
├── src/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   └── styles/
├── netlify.toml
├── astro.config.mjs
└── package.json
```

## Contrato de datos público

Cada entrada canónica en `data/articles.canonical.json` incluye:

- `id`
- `legacy_article_number`
- `title_original`
- `title_canonical`
- `category`
- `year`
- `language`
- `authors`
- `keywords`
- `source_url`
- `source_type`
- `verification_status`
- `verification_date`
- `evidence`
- `abstract_en_original`
- `abstract_en_extended`
- `resumen_es_extendido`
- `structured_blocks`

Cada entrada excluida en `data/articles.removed.json` conserva:

- identificador,
- metadatos base,
- razón de exclusión,
- evidencia de verificación fallida.

## Reglas editoriales y de calidad

### 1) Política de verificación

- `verified`: fuente recuperable y metadatos/título consistentes.
- `removed`: error HTTP, inconsistencia de metadatos, o descarte por duplicado canónico.

### 2) Política de versiones

- Se conserva **una sola versión principal** por paper.
- Preprints y variantes quedan en ledger de exclusión cuando procede.

### 3) Política de abstracts extendidos

Para cada artículo canónico:

- Inglés extendido (`abstract_en_extended`):
  - >= 3 párrafos,
  - cada párrafo >= 150 palabras.
- Español extendido (`resumen_es_extendido`):
  - >= 3 párrafos,
  - cada párrafo >= 150 palabras.

Estas reglas se validan automáticamente y fallan el pipeline si no se cumplen.

## Flujo reproducible local

### Requisitos

- Node.js 20+ (probado con Node 25)
- npm 10+

### Comandos

```bash
npm install
npm run build:data
npm run validate:data
npm run build
npm run dev
```

### Qué hace cada comando

- `npm run build:data`
  - parsea el markdown fuente,
  - ejecuta verificación de fuentes,
  - canonicaliza,
  - genera abstracts extendidos,
  - produce datasets y reporte.
- `npm run validate:data`
  - valida contrato de datos,
  - valida reglas de longitud de abstracts,
  - valida ausencia de duplicados canónicos.
- `npm run build`
  - reconstruye datos,
  - ejecuta validaciones,
  - compila sitio Astro.

## Sitio web (Astro)

Rutas publicadas:

- `/` resumen general y métricas
- `/articles` explorador con filtros y buscador
- `/articles/[id]` ficha de artículo con abstracts largos EN/ES
- `/methodology` documentación metodológica

## CI y despliegue

- CI (GitHub Actions): instala dependencias y ejecuta build completo.
- Netlify: configuración en `netlify.toml` (`npm run build`, publish `dist`).

Ver detalles operativos en `DEPLOY.md`.

## Trazabilidad histórica

Los documentos originales se conservaron sin alterar en:

- `archive/README.original.md`
- `archive/state-of-the-art-synthetic-personality-llms.original.md`

## Limitaciones conocidas

1. Parte de los dominios académicos aplica anti-bot o acceso restringido, lo que puede generar exclusiones automatizadas aun cuando el paper exista.
2. La validación es fuerte en accesibilidad y consistencia de metadatos, pero no sustituye lectura manual completa del PDF para síntesis crítica.
3. Los abstracts extendidos son análisis editoriales derivados de metadatos + abstract original, no una reproducción textual del paper completo.

## Licencia y uso

Este repositorio organiza y normaliza metadatos académicos con fines de revisión científica. Asegura revisar licencias y términos de uso de cada fuente antes de redistribución amplia.
