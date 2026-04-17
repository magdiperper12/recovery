# 120-Day Daily Checklist System

Production-ready Next.js mini app for daily execution, discipline tracking, and 120-day transformation planning, now with full Arabic i18n + RTL support.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Local storage persistence

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Core Features

- 16-task daily checklist grouped by routine blocks
- Arabic-only interface
- Fixed RTL document direction
- Progress percentage and colored status cues
- Daily reset when date changes
- Streak logic (`>=80%` completion and no relapse)
- Discipline score (`0-100`) with relapse penalties
- Sprint tracker (15-day work cycles)
- Recovery-day logic (3 days after each sprint cycle)
- Honesty controls (relapse + bad day)
- Notes for each day
- Motivational message based on score
- Built-in 8-sprint operating system table

## Project Structure

- `app/page.tsx`: Main dashboard, tracker state, and rendering
- `app/layout.tsx`: Root layout with fixed Arabic `lang`/`dir`
- `app/globals.css`: Global styles + Tailwind directives
- `components/ChecklistSection.tsx`: Reusable checklist card
- `components/ProgressBar.tsx`: Progress component
- `components/SprintGrid.tsx`: Day 1-15 sprint board
- `components/OperatingSystemPlan.tsx`: 8-sprint transformation view
- `data/plan.ts`: Example tasks, sprint definitions, motivational data
- `lib/logic.ts`: Progress, scoring, streak, cycle and reset logic
- `lib/types.ts`: Shared TypeScript models
- `lib/translations.ts`: Arabic text lookup and interpolation helper
- `lib/storage.ts`: Versioned local storage read/write/import/reset
- `lib/migration.ts`: Storage schema migration and validation guards
- `lib/backup.ts`: Export/import helpers and last valid snapshot
- `lib/supabase.ts`: Supabase client and data access functions
- `hooks/useStorage.ts`: Safe storage hook for state lifecycle
- `hooks/useSync.ts`: Debounced cloud sync + offline queue
- `supabase/schema.sql`: SQL schema and RLS policies
- `locales/ar/common.json`: Arabic translations

## Data Safety (Phase 1)

- Versioned local storage envelope: `{ version, data }`
- Migration entrypoint (`migrateToLatest`) for future schema changes
- Export/Import JSON with structure validation
- Safe reset flow (UI confirmation + clean default state)
- Auto-recovery from corrupted storage using last valid snapshot

## Cloud Sync (Phase 2)

- Supabase auth support (Email + Password)
- `user_progress` table sync with debounce
- Last-write-wins conflict behavior using `updated_at`
- Offline-first: queue writes locally and flush on reconnect

Create `.env.local` from `.env.example` before enabling cloud sync.

## Auth + Protected Routes

- Login page: `/login`
- Middleware guards all app routes and redirects guests to `/login`
- Authenticated users are redirected away from `/login` to `/`

## Logic Rules

- Progress: `(completed / total) * 100`
- Streak increments only if:
  - No relapse
  - Progress is at least `80%`
- New day auto-rollover:
  - Moves current day to history
  - Resets checklist values
  - Recomputes day number from start date
