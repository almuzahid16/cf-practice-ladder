# CF Practice Ladder

A modern Codeforces practice ladder builder that compares a user's solved problems with an expert Codeforces handle and recommends unsolved rated problems for targeted practice.

## Live Demo

https://cf-practice-ladder.vercel.app

## Overview

CF Practice Ladder helps competitive programming learners create a personalized practice list from an expert Codeforces handle. The app checks which rated problems an expert has solved and then marks which of those problems the user has already solved or still needs to practice.

This project was built as a clean educational and portfolio project using public Codeforces API data.

## Features

- Compare your Codeforces submissions with an expert handle
- Generate a personalized unsolved problem ladder
- Filter problems by rating, tag and solved status
- Search problems by name, index or tag
- Direct links to Codeforces problems
- Direct links to expert submissions
- Saves handles in local storage
- Animated neon gradient UI
- Responsive design for desktop and mobile
- Deployed live on Vercel

## Tech Stack

- Next.js
- React
- CSS
- Codeforces Public API
- Vercel
- GitHub

## How It Works

The app takes two Codeforces handles:

1. A user handle
2. An expert handle

It fetches public submission data from Codeforces, finds the rated problems solved by the expert, and marks which of those problems the user has already solved or still needs to practice.

The final ladder is sorted by Codeforces rating, making it easier to move from easier problems to harder ones.

## Project Structure

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
├─ package-lock.json
├─ package.json
└─ README.md
```

## Run Locally

Clone the repository or download the project files, then run:

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Deployment

The project is deployed on Vercel.

Live: https://cf-practice-ladder.vercel.app

## Future Improvements

- Add problem difficulty recommendations based on user rating
- Add tag-based learning paths
- Add progress charts
- Add export option for unsolved problems
- Add user profile summary from Codeforces
- Add better error handling for invalid handles and API limits

## Author

**Muhammad Al-Muzahid**

- GitHub: https://github.com/almuzahid16
- LinkedIn: https://www.linkedin.com/in/almuzahid/
- Facebook: https://www.facebook.com/muhammadalmuzahid/

## License

This project is created for educational and portfolio purposes.
