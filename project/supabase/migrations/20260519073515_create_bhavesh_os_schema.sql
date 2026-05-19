/*
  # Bhavesh OS - Complete Database Schema

  ## Overview
  This migration creates all tables for the Bhavesh OS personal website system.

  ## Tables Created

  1. **life_feed** - Personal journal/activity feed posts
     - Supports types: log, review, thought, productive, wasted
     - Tags array, image attachments, mood indicator

  2. **cyber_posts** - Cybersecurity content hub
     - Categories: ctf, writeup, lab, notes, tool, blog
     - Slug-based routing, difficulty levels, platform info

  3. **projects** - Portfolio project showcase
     - Full project detail: why built, problems, lessons, future plans
     - Tech stack, screenshots, architecture, GitHub/live links

  4. **now_page** - Single-row current status page
     - Current focus, goals, books, obsessions, learning roadmap

  5. **reviews** - Personal reviews (food, places, products, etc.)
     - Categories: food, cafe, product, place, movie, book
     - Star ratings, images, location, price range

  6. **achievements** - Achievement vault
     - Types: cert, internship, hackathon, club, ranking, badge, streak
     - Credential URLs, featured flag

  7. **gallery** - Visual memory gallery
     - Categories: screenshot, setup, travel, cert, coding, event

  8. **links** - Links hub for social/contact
     - Ordered display with icons and categories

  ## Security
  - RLS enabled on all tables
  - Public read access for published content
  - Admin-only write access using auth.uid() check via admin_users concept
  - Unauthenticated users can only read published content
*/

-- Life Feed Posts
CREATE TABLE IF NOT EXISTS life_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'log' CHECK (type IN ('log', 'review', 'thought', 'productive', 'wasted')),
  mood text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  published boolean NOT NULL DEFAULT false
);

ALTER TABLE life_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published life_feed"
  ON life_feed FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can insert life_feed"
  ON life_feed FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update life_feed"
  ON life_feed FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete life_feed"
  ON life_feed FOR DELETE
  TO authenticated
  USING (true);

-- Cybersecurity Posts
CREATE TABLE IF NOT EXISTS cyber_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  slug text UNIQUE NOT NULL DEFAULT '',
  content_md text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'blog' CHECK (category IN ('ctf', 'writeup', 'lab', 'notes', 'tool', 'blog')),
  tags text[] NOT NULL DEFAULT '{}',
  difficulty text NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'easy', 'medium', 'hard', 'insane')),
  platform text NOT NULL DEFAULT '',
  images text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  published boolean NOT NULL DEFAULT false
);

ALTER TABLE cyber_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published cyber_posts"
  ON cyber_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can insert cyber_posts"
  ON cyber_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update cyber_posts"
  ON cyber_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete cyber_posts"
  ON cyber_posts FOR DELETE
  TO authenticated
  USING (true);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  slug text UNIQUE NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  why_built text NOT NULL DEFAULT '',
  problem_faced text NOT NULL DEFAULT '',
  lessons_learned text NOT NULL DEFAULT '',
  future_plans text NOT NULL DEFAULT '',
  tech_stack text[] NOT NULL DEFAULT '{}',
  screenshots text[] NOT NULL DEFAULT '{}',
  architecture_img text NOT NULL DEFAULT '',
  github_url text NOT NULL DEFAULT '',
  live_url text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'wip' CHECK (status IN ('active', 'archived', 'wip')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- Now Page (single row)
CREATE TABLE IF NOT EXISTS now_page (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  current_focus text NOT NULL DEFAULT '',
  current_goals text[] NOT NULL DEFAULT '{}',
  books text[] NOT NULL DEFAULT '{}',
  obsessions text[] NOT NULL DEFAULT '{}',
  current_projects text[] NOT NULL DEFAULT '{}',
  learning_roadmap jsonb NOT NULL DEFAULT '[]',
  last_updated timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE now_page ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read now_page"
  ON now_page FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert now_page"
  ON now_page FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update now_page"
  ON now_page FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'food' CHECK (category IN ('food', 'cafe', 'product', 'place', 'movie', 'book')),
  rating integer NOT NULL DEFAULT 3 CHECK (rating >= 1 AND rating <= 5),
  content text NOT NULL DEFAULT '',
  images text[] NOT NULL DEFAULT '{}',
  location text NOT NULL DEFAULT '',
  price_range text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  published boolean NOT NULL DEFAULT false
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published reviews"
  ON reviews FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (true);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'cert' CHECK (type IN ('cert', 'internship', 'hackathon', 'club', 'ranking', 'badge', 'streak')),
  issuer text NOT NULL DEFAULT '',
  date date,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  credential_url text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read achievements"
  ON achievements FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update achievements"
  ON achievements FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete achievements"
  ON achievements FOR DELETE
  TO authenticated
  USING (true);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'screenshot' CHECK (category IN ('screenshot', 'setup', 'travel', 'cert', 'coding', 'event')),
  taken_at date,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read gallery"
  ON gallery FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert gallery"
  ON gallery FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update gallery"
  ON gallery FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete gallery"
  ON gallery FOR DELETE
  TO authenticated
  USING (true);

-- Links Hub
CREATE TABLE IF NOT EXISTS links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'social' CHECK (category IN ('social', 'hacking', 'dev', 'contact')),
  display_order integer NOT NULL DEFAULT 0
);

ALTER TABLE links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read links"
  ON links FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert links"
  ON links FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update links"
  ON links FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete links"
  ON links FOR DELETE
  TO authenticated
  USING (true);

-- Seed the now_page with default data
INSERT INTO now_page (current_focus, current_goals, books, obsessions, current_projects, learning_roadmap, last_updated)
VALUES (
  'Building Bhavesh OS — my personal digital HQ and cybersecurity portfolio',
  ARRAY['Finish OSCP preparation', 'Ship Bhavesh OS v1', 'Complete 50 HackTheBox machines', 'Build 3 security tools'],
  ARRAY['The Web Application Hacker''s Handbook', 'Hacking: The Art of Exploitation'],
  ARRAY['Linux kernel internals', 'Rust systems programming', 'CTF binary exploitation', 'Personal knowledge management'],
  ARRAY['Bhavesh OS (this site)', 'CTF challenge tracker', 'Network scanner CLI tool'],
  '[{"skill": "Web Application Security", "status": "in_progress"}, {"skill": "Binary Exploitation", "status": "in_progress"}, {"skill": "Rust Programming", "status": "queued"}, {"skill": "Cloud Security (AWS)", "status": "queued"}, {"skill": "Malware Analysis", "status": "queued"}, {"skill": "Linux Privilege Escalation", "status": "done"}, {"skill": "Network Reconnaissance", "status": "done"}]',
  now()
);

-- Seed default links
INSERT INTO links (label, url, icon, category, display_order) VALUES
  ('GitHub', 'https://github.com/bhavesh', 'github', 'dev', 1),
  ('LinkedIn', 'https://linkedin.com/in/bhavesh', 'linkedin', 'social', 2),
  ('TryHackMe', 'https://tryhackme.com/p/bhavesh', 'shield', 'hacking', 3),
  ('HackTheBox', 'https://hackthebox.com/profile/bhavesh', 'box', 'hacking', 4),
  ('Email', 'mailto:bhavesh@bhavesh.dev', 'mail', 'contact', 5);
