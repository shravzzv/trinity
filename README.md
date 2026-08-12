# Trinity

Trinity is an offline-first intermittent fasting tracker designed to be simple, reliable, and free from unnecessary complexity.

The project started as an attempt to solve frustrations with existing fasting apps, including ads, promotional content, poor data ownership, limited web support, and unreliable offline experiences.

Trinity is built around a simple idea: provide the features needed to track fasting progress without turning the app into a collection of unnecessary features or distractions.

## Features

- Fasting timer
- Fasting plans including 16:8, 18:6, 20:4, OMAD, and more
- Fasting history
- Streak tracking
- Gamification with XP, levels, achievements, and Anchors
- Fasting progress visualization and analytics
- Weight tracking
- Target weight tracking
- Google and GitHub account linking
- Password and email management
- Offline-first data storage and synchronization
- Installable Progressive Web App (PWA)
- Responsive interface for mobile and desktop
- Data reset controls
- Account deletion
- End-to-end tests for core user flows

## Goals

- Track fasting sessions
- Visualize fasting progress
- Work across devices as a Progressive Web App
- Function reliably without an internet connection
- Give users ownership of their data
- Remain focused and lightweight
- Avoid unnecessary advertising and promotional content

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- IndexedDB
- Serwist
- Jest
- Playwright
- GitHub Actions

## Development

Install dependencies:

```bash
npm install
````

Start the development server:

```bash
npm run dev
```

Run linting:

```bash
npm run lint
```

Run formatting checks:

```bash
npm run format:check
```

Run unit tests:

```bash
npm run test
```

Run end-to-end tests:

```bash
npm run e2e
```

## Project Status

Trinity has reached a complete first release as a focused, functional fasting tracker.

The application is available as an installable Progressive Web App and is designed to work across devices while remaining usable offline.

Further development will be driven primarily by real-world usage and feedback rather than a fixed feature roadmap.
