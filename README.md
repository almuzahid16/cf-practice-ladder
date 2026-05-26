# CF Practice Ladder

A clean beginner-friendly Codeforces practice ladder app.

It takes:

1. your Codeforces handle
2. an expert Codeforces handle

Then it shows rated problems solved by the expert and marks whether you have already solved them or not.

## Features

- Compare your solved problems with an expert handle
- Show solved and unsolved status
- Filter by problem rating
- Filter by tags such as dp, greedy, math, graphs
- Search by problem name, tag or index
- Direct problem links
- Expert submission/code links
- Local storage for saved handles
- Clean responsive design

## Tech stack

- Next.js
- React
- Codeforces public API
- Plain CSS, no Tailwind setup needed

## How to run locally

First install Node.js from https://nodejs.org

Then open the project folder in VS Code and run:

```bash
npm install
npm run dev
```

Open this in your browser:

```text
http://localhost:3000
```

## Good handles to test

Try these expert handles:

- tourist
- jiangly
- Benq
- Errichto
- SecondThread

## Important note about Codeforces API

Codeforces allows public API access, but requests are rate-limited. This app waits about two seconds between user and expert requests so it does not hit the limit too easily.

## Deploy to Vercel

1. Push this folder to GitHub.
2. Go to https://vercel.com
3. Import the GitHub repository.
4. Keep the default Next.js settings.
5. Click Deploy.

## Project structure

```text
cf-practice-ladder/
├─ app/
│  ├─ api/
│  │  └─ ladder/
│  │     └─ route.js
│  ├─ globals.css
│  ├─ layout.jsx
│  └─ page.jsx
├─ .gitignore
├─ next.config.mjs
├─ package.json
└─ README.md
```

## What to improve later

- Add login
- Add saved ladders
- Add daily target problems
- Add recommended next rating level
- Add charts for rating-wise progress
- Add pagination for very large expert accounts


## Neon UI update

This version adds animated gradient borders to cards, inputs, selects, stat cards and secondary buttons. Use the Clear saved button if a previous handle is loaded from your browser storage.
