# CF Practice Ladder

A focused Codeforces practice ladder. Enter your handle and a reference handle to see the unique accepted problems solved by the reference user, grouped by rating and marked with your solved/unsolved status.

## Highlights

- Rating-by-rating problem ladder
- Solved / remaining / progress summary
- Saved handle matchups in browser storage
- Last session (handles + selected rating) restored automatically
- Responsive desktop/mobile interface
- Light/dark and DaisyUI theme support
- Direct problem and reference-submission links

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

## Data & saving

Codeforces submission data is fetched through the public Codeforces API. Saved matchups and the last active session are kept only in the browser using `localStorage`; no database is required.

## Credit

Original project credit: [anirudtate](https://codeforces.com/profile/anirudtate)
