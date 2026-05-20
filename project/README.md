# Bhavesh OS — Personal Life OS

> Cybersecurity Student • Builder • Linux Enthusiast • Documenting the Journey

A personal website that is part portfolio, part journal, part cybersecurity blog, and part memory vault. Built with a hacker aesthetic — dark by default, terminal-inspired, and fully dynamic.

**Live:** [bhavesh.dev](https://bhavesh.dev) &nbsp;|&nbsp; **Admin:** `/admin/login`

---

## Sections

| Route | Description |
|---|---|
| `/` | Hero with typewriter effect + quick-access grid |
| `/feed` | Life log — daily thoughts, reviews, productive/wasted days + activity heatmap |
| `/cyber` | CTF writeups, walkthroughs, learning notes, linux setups, tools, blog |
| `/projects` | Project showcase with architecture, screenshots, lessons learned |
| `/now` | What I'm currently focused on, reading, building |
| `/reviews` | Personal reviews of food, cafes, products, places |
| `/vault` | Achievement vault — certs, hackathons, badges, rankings |
| `/terminal` | Interactive fake terminal — type `help` to start |
| `/links` | Resume + all links hub |
| `/gallery` | Visual memory gallery — screenshots, travel, setup, events |
| `/feed.xml` | RSS feed |
| `/sitemap.xml` | Sitemap for search engines |

---

## Tech Stack

- **Framework** — Next.js 14 (App Router)
- **Styling** — Tailwind CSS + shadcn/ui
- **Database** — Supabase (PostgreSQL)
- **Auth** — Supabase Auth (admin only)
- **Storage** — Supabase Storage (images, resume)
- **Animations** — Framer Motion
- **Markdown** — rehype-highlight with syntax highlighting
- **Deployment** — Vercel

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/bhavesh-os.git
cd bhavesh-os
npm install
```

### 2. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

### 3. Run migrations

In your Supabase SQL editor, run these files in order:

```
supabase/migrations/20260519073515_create_bhavesh_os_schema.sql
supabase/migrations/20260519120000_admin_read_policies.sql
supabase/migrations/20260519120100_seed_sample_feed.sql   ← optional demo data
supabase/migrations/20260519130000_seed_cyber_posts.sql   ← optional demo data
supabase/migrations/20260519140000_seed_projects.sql      ← optional demo data
supabase/migrations/20260519150000_seed_phase4.sql        ← optional demo data
```

### 4. Create admin user

In Supabase → Authentication → Users → Add User (email + password).

### 5. Set environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_RESUME_URL=https://your-project.supabase.co/storage/v1/object/public/assets/resume.pdf
```

### 6. Run dev server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Adding Your Content

All content is managed through the admin panel — no direct database edits needed.

1. Go to `localhost:3000/admin/login`
2. Sign in with your Supabase auth credentials
3. Use the dashboard to add content to each section

**Note:** The terminal page (`/app/terminal/page.tsx`) has hardcoded responses for `whoami`, `skills`, and `contact` — update those directly with your real info.

---

## Deployment (Vercel)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add environment variables in Vercel project settings
4. Deploy

Vercel auto-detects Next.js and handles everything including SSL.

---

## Security

- Admin routes protected by Supabase Auth middleware
- Row Level Security (RLS) enabled on all tables
- Recommended: enable CAPTCHA in Supabase → Authentication → Security

---

## License

Personal project — not open for redistribution. Feel free to use as inspiration.

---

*Built with Next.js, Supabase, and a lot of caffeine.*