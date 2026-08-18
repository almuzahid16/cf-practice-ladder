# CF Ladder v1.0.0 — UI + Saving Upgrade

## What changed

- Rebuilt the main page into a cleaner two-column practice dashboard.
- Added responsive mobile layout.
- Added solved / remaining / progress stats for each rating.
- Added horizontal rating navigation with per-rating solved counts.
- Added a clearer problem queue with contest ID, status, problem link, and reference submission link.
- Added problem tags to help understand the topic at a glance.
- Added browser-based saved matchups (up to 8 handle pairs).
- Added automatic restore of the previous handles and selected rating.
- Preserved original project credit to `anirudtate`.
- Improved solved-problem matching to use `contestId + problem index` instead of problem name alone.
- Replaced the generic Create T3 App README with project-specific instructions.
- Added `live-preview.html` as a dependency-free interactive preview/fallback.

## Saving behavior

Saved data is stored in browser `localStorage` only. No server/database is required.

Keys used:

- `cf-ladder:last-session`
- `cf-ladder:saved-matchups`

## Preview

Open `live-preview.html` directly in a browser. It contains sample data initially and can fetch from the public Codeforces API when the browser has internet access.
