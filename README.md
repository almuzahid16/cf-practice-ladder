# CF Practice Ladder

A modern Codeforces practice ladder builder that compares a user's solved problems with an expert Codeforces handle and recommends unsolved rated problems for targeted practice.

## Live Demo

https://cf-practice-ladder.vercel.app

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

## Tech Stack

- Next.js
- React
- CSS
- Codeforces Public API
- Vercel

## How It Works

The app takes two Codeforces handles: a user handle and an expert handle. It fetches public submission data from Codeforces, finds the rated problems solved by the expert, and marks which of those problems the user has already solved or still needs to practice.

## Run Locally

```bash
npm install
npm run dev
