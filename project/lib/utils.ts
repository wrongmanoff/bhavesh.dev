import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatRelativeDate(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDateShort(date: string | Date) {
  return format(new Date(date), "MMM d");
}

export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export const FEED_TYPE_CONFIG = {
  productive: { label: "Productive", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" },
  wasted: { label: "Wasted", color: "bg-red-500/20 text-red-400 border-red-500/30", dot: "bg-red-400" },
  log: { label: "Log", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", dot: "bg-blue-400" },
  review: { label: "Review", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", dot: "bg-amber-400" },
  thought: { label: "Thought", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", dot: "bg-purple-400" },
} as const;

export const CYBER_CATEGORY_CONFIG = {
  ctf: { label: "CTF", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  writeup: { label: "Writeup", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  lab: { label: "Lab", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  notes: { label: "Notes", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  tool: { label: "Tool", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  blog: { label: "Blog", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
} as const;

export const DIFFICULTY_CONFIG = {
  beginner: { label: "Beginner", color: "bg-emerald-500/20 text-emerald-400" },
  easy: { label: "Easy", color: "bg-green-500/20 text-green-400" },
  medium: { label: "Medium", color: "bg-yellow-500/20 text-yellow-400" },
  hard: { label: "Hard", color: "bg-orange-500/20 text-orange-400" },
  insane: { label: "Insane", color: "bg-red-500/20 text-red-400" },
} as const;

export const PROJECT_STATUS_CONFIG = {
  active: { label: "Active", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  wip: { label: "WIP", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  archived: { label: "Archived", color: "bg-[#3a3a3a]/40 text-[#6b6b6b] border-[#2e2e2e]" },
} as const;

export const REVIEW_CATEGORY_CONFIG = {
  food: { label: "Food", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  cafe: { label: "Cafe", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  product: { label: "Product", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  place: { label: "Place", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  movie: { label: "Movie", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  book: { label: "Book", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
} as const;

export const ACHIEVEMENT_TYPE_CONFIG = {
  cert: { label: "Certificate", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  internship: { label: "Internship", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  hackathon: { label: "Hackathon", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  club: { label: "Club", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  ranking: { label: "Ranking", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  badge: { label: "Badge", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  streak: { label: "Streak", color: "bg-red-500/20 text-red-400 border-red-500/30" },
} as const;
