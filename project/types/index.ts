export interface LifeFeedPost {
  id: string;
  title: string;
  content: string;
  type: "log" | "review" | "thought" | "productive" | "wasted";
  mood: string;
  tags: string[];
  images: string[];
  created_at: string;
  published: boolean;
}

export interface CyberPost {
  id: string;
  title: string;
  slug: string;
  content_md: string;
  category: "ctf" | "writeup" | "lab" | "notes" | "tool" | "blog";
  tags: string[];
  difficulty: "beginner" | "easy" | "medium" | "hard" | "insane";
  platform: string;
  images: string[];
  created_at: string;
  published: boolean;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  why_built: string;
  problem_faced: string;
  lessons_learned: string;
  future_plans: string;
  tech_stack: string[];
  screenshots: string[];
  architecture_img: string;
  github_url: string;
  live_url: string;
  status: "active" | "archived" | "wip";
  created_at: string;
}

export interface NowPage {
  id: string;
  current_focus: string;
  current_goals: string[];
  books: string[];
  obsessions: string[];
  current_projects: string[];
  learning_roadmap: LearningItem[];
  last_updated: string;
}

export interface LearningItem {
  skill: string;
  status: "done" | "in_progress" | "queued";
}

export interface Review {
  id: string;
  title: string;
  category: "food" | "cafe" | "product" | "place" | "movie" | "book";
  rating: number;
  content: string;
  images: string[];
  location: string;
  price_range: string;
  created_at: string;
  published: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  type: "cert" | "internship" | "hackathon" | "club" | "ranking" | "badge" | "streak";
  issuer: string;
  date: string | null;
  description: string;
  image_url: string;
  credential_url: string;
  featured: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  image_url: string;
  category: "screenshot" | "setup" | "travel" | "cert" | "coding" | "event";
  taken_at: string | null;
  created_at: string;
}

export interface Link {
  id: string;
  label: string;
  url: string;
  icon: string;
  category: "social" | "hacking" | "dev" | "contact";
  display_order: number;
}
