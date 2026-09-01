# Prince Dr K Vasudevan College — Website

Official website for **Prince Dr K Vasudevan College of Engineering & Technology**, Chennai.

Built with **Vite + React (JSX) + Tailwind CSS + React Router**, backed by **Supabase** for
notices, admissions, advertisements and the student/teacher portals.

---

## Getting started

```bash
npm install
cp .env.example .env      # fill in your Supabase credentials
npm run dev               # http://localhost:5173
```

| Script            | What it does                             |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Vite dev server with HMR                 |
| `npm run build`   | Production build into `dist/`            |
| `npm run preview` | Serve the production build locally       |

## Environment variables

Both variables are read in `src/services/supabase.js`. Vite only exposes variables
prefixed with `VITE_` to the browser.

| Variable                 | Description                                                        |
| ------------------------ | ------------------------------------------------------------------ |
| `VITE_SUPABASE_URL`      | Supabase project URL, e.g. `https://xxxx.supabase.co`               |
| `VITE_SUPABASE_ANON_KEY` | Supabase **anon / publishable** key (row level security applies)    |

> Never put a `service_role` key in this project — everything here runs in the browser.
> `.env` files are git-ignored; use `.env.example` as the template and configure the same
> two variables in your Vercel project settings.

## Project structure

```
src/
  assets/images/     College photograph bundled with the build
  components/        Shared UI (Navbar, Footer, Modal, PageHero, Reveal, CountUp, …)
  context/           ToastContext + AuthContext (passwordless e-mail OTP)
  data/              Static page content extracted out of the markup
  hooks/             useScrollReveal, useCountUp, useTypewriter, useTilt, …
  pages/             One file per route, all lazy-loaded
  sections/          Page-specific sections (home/, courses/, student/, teacher/)
  services/          supabase.js (client) and storage.js (image uploads)
  styles/            Dark-theme CSS for the student & teacher portals
  App.jsx            Route table
  main.jsx           App bootstrap (Router → Toast → Auth providers)
  index.css          Design tokens, resets, shared component classes, keyframes
legacy/              The original multi-page HTML/CSS/JS site, kept for reference
```

## Routes

| Path            | Page                                                        |
| --------------- | ----------------------------------------------------------- |
| `/`             | Home — hero, facts, gallery, placements, student support     |
| `/about`        | About Us — history, vision & mission, stats, contact, map    |
| `/courses`      | Courses — programme catalogue, admission form, status lookup |
| `/facilities`   | Facilities — clubs, hostel, canteen, sports, transport …     |
| `/notice-board` | Notice Board — live notices, search, filters, registration   |
| `/student`      | Student portal — profile, attendance, results, achievements  |
| `/teacher`      | Teacher portal — classrooms, attendance, exams, OD           |
| `/ads`          | Announcements — the active campaigns from the `ads` table    |
| anything else   | 404 page                                                     |

Legacy `.html` deep links (`/index.html`, `/Courses.html`, `/notices`, …) redirect to their
new routes so existing bookmarks and search results keep working.

## Supabase tables used

`login_information`, `notices_informations`, `admission_information`, `ads`,
`student_credentials`, `student_information`, `student_achievements`,
`teacher_credentials`, `teacher_information`, `classrooms`, `attendance_sessions`,
`attendance_records`, `attendance_information`, `exam_information`,
plus the `image_files` storage bucket.

## Deployment

`vercel.json` rewrites every path to `index.html` so client-side routing keeps working on
a hard refresh. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the Vercel
environment before deploying.
