-- Sample projects for showcase
INSERT INTO projects (
  title,
  slug,
  description,
  why_built,
  problem_faced,
  lessons_learned,
  future_plans,
  tech_stack,
  screenshots,
  architecture_img,
  github_url,
  live_url,
  status
) VALUES
(
  'Bhavesh OS',
  'bhavesh-os',
  'Personal digital HQ — portfolio, journal, cyber hub, and life OS in one immersive site.',
  'I wanted a single place to document my cybersecurity journey, projects, and life in public — not scattered across Notion, GitHub READMEs, and random blogs.',
  'Balancing **scope** vs shipping incrementally was hard. Supabase RLS, Next.js App Router SSR cookies, and markdown pipelines each had their own learning curve.',
  '- Ship in phases — foundation first\n- Reuse components early (cards, badges, admin editors)\n- Match `.env` to the correct Supabase project',
  '- Phase 4: /now, reviews, vault\n- Phase 5: interactive terminal + gallery\n- RSS + sitemap',
  ARRAY['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'Vercel'],
  ARRAY[]::text[],
  '',
  'https://github.com/bhavesh',
  '',
  'active'
),
(
  'Network Scanner CLI',
  'network-scanner-cli',
  'A fast, minimal port scanner written in Python for CTF recon and lab practice.',
  'I kept reaching for bloated tools during CTFs when I only needed quick TCP checks on a handful of ports.',
  'Threading vs asyncio tradeoffs, and handling timeouts cleanly without hanging the whole scan.',
  'Start simple — a working 50-line script beats a half-finished async framework.',
  'Add service detection banners and JSON export for piping into other tools.',
  ARRAY['Python', 'asyncio', 'CLI'],
  ARRAY[]::text[],
  '',
  'https://github.com/bhavesh',
  '',
  'wip'
);
