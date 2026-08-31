# Prince Dr K Vasudevan College of Engineering and Technology

Official website for **Prince Dr K Vasudevan College of Engineering and Technology**, Ponmar, Chennai — rebuilt as a modern single-page React application.

Anna University affiliated (TNEA Code **4116**) · AICTE approved · NAAC **A+** accredited until 2029 · ISO 9001:2015 certified.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Build | Vite 6 |
| UI | React 18 + React Router DOM 6 |
| Styling | Tailwind CSS 3 (custom brand design tokens) |
| Icons | Lucide React |
| Animation | Framer Motion 11 |
| Backend | Supabase (notices, gallery, admissions, portals) |
| Analytics | Vercel Speed Insights |

## Getting Started

```bash
npm install
cp .env.example .env      # fill in your Supabase values
npm run dev               # http://localhost:5173
```

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint over the whole project |

### Environment Variables

Only browser-safe, `VITE_`-prefixed public values belong here. **Never** commit service-role keys, database passwords or admin secrets.

```ini
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-public-key>
```

If these are unset the app still runs: Supabase-backed features (notice board, live gallery, admissions submission, portals) degrade gracefully to static fallback content.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home — hero, stats, about, programs, gallery, placements, campus life, news, contact |
| `/about` | History, vision & mission, accreditations |
| `/academics` | UG/PG programme levels and supporting departments |
| `/departments` | Department directory |
| `/admissions` | Timeline, eligibility, documents, 4-step application form, status lookup |
| `/placements` | Placement stats, support programmes, recruiters |
| `/facilities` | Clubs, hostel, canteen, sports, auditorium, classrooms, transport |
| `/campus-life` | Campus highlights, clubs, welfare committees, gallery |
| `/news` | Notice board with search, filters and event registration |
| `/gallery` | Filterable photo/video gallery with lightbox |
| `/contact` | Contact cards, enquiry form, map |
| `/student` | Student portal — profile, attendance, results, achievements |
| `/teacher` | Faculty portal — classrooms, attendance, exam marks, on-duty |
| `*` | Custom 404 |

## Project Structure

```
src/
├── assets/       Campus imagery (responsive variants)
├── components/   Reusable UI; portal/ holds the student & faculty dashboards
├── context/      Theme (dark mode) and toast providers
├── data/         All college content — the single source of truth
├── hooks/        usePageMeta, useNotices, useGalleryMedia, useReducedMotion
├── lib/          Supabase client, SEO helpers, portal domain logic
├── pages/        One component per route
├── App.jsx       Shell, routing, lazy loading, page transitions
└── main.jsx      Entry point and providers
```

Content lives in `src/data/*.js` and components map over it, so updating college
information means editing data — not JSX.

## Notable Behaviour

- **Admissions** — 4-step form (personal → academic → course preference → review) with per-step validation and automatic Anna University cutoff calculation (PCM: `maths/2 + physics/4 + chemistry/4`; PCB uses biology in place of maths). Submissions land in `admission_information`.
- **Attendance engine** — a day is weighted as `presentPeriods / totalPeriods`, and `Present% = Σ(daily values) / workingDays × 100`, matching the previous system exactly. Falls back to the stored `attendance_information` summary when no per-period records exist.
- **Exams** — pass marks are ≥40% for CIAT I/II and ≥50% for the final examination.
- **Live data** — the notice board and gallery subscribe to Supabase realtime updates.

## Accessibility & Performance

- Semantic landmarks, skip-to-content link, one `<h1>` per page, labelled form controls, `aria-label` on all icon-only buttons, and ≥44×44px touch targets.
- Animations honour `prefers-reduced-motion` through both a CSS media query and Framer Motion's `MotionConfig reducedMotion="user"`.
- Routes are code-split with `React.lazy`; vendor chunks are split for React, Framer Motion and Supabase; images are lazy-loaded with a shared fallback.
- Per-page SEO titles, descriptions, keywords, canonical URLs and Open Graph tags.
- Dark mode with `localStorage` persistence and system-preference detection.

## Deployment

Configured for Vercel. `vercel.json` rewrites all paths to `/index.html` for
client-side routing and sets immutable caching on hashed build assets.

```bash
npm run build   # outputs dist/
```
