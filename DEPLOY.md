# Deployment Guide (Astro + Netlify)

## 1) Local verification before deploy

```bash
npm install
npm run build
```

Expected result:

- `data/articles.canonical.json` regenerated
- `data/articles.removed.json` regenerated
- `reports/verification/YYYY-MM-DD-full-audit.md` regenerated
- `dist/` generated without build errors

## 2) Netlify CLI workflow

This repository is configured for Netlify static deploys.

```bash
npx netlify status
```

If not authenticated:

```bash
npx netlify login
```

## 3) Link or create site

If repository is already linked, continue to deploy.
If not linked:

```bash
npx netlify init
```

## 4) Preview deploy

```bash
npx netlify deploy
```

## 5) Production deploy

```bash
npx netlify deploy --prod
```

Netlify uses:

- Build command: `npm run build`
- Publish directory: `dist`

## 6) Continuous deployment

On Netlify dashboard, set the Git provider and repository branch for automatic deploys. Keep `netlify.toml` as source of truth for build settings.
