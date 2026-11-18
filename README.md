# my-cv

Wellmmer Lucas's CV and portfolio, in English, Portuguese and Spanish, built as a toy-brick build manual.

Live: https://wellmmer.vercel.app

One typed content file (`content/cv.ts`) feeds the site and the PDFs. The PDFs are printed from the site's own print routes with headless Chrome.

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests (Vitest)
npm run e2e        # smoke tests (Playwright, builds and starts the site)
npm run pdf        # prints public/cv/*.pdf
npm run leak       # fails if a file that must stay private leaks
```

A gitignored local file can add extra entries to a local-only PDF (`npm run pdf:private`); it never reaches the repo or the site.
