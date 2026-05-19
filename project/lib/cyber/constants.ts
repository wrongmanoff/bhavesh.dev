export type CyberCategory =
  | "all"
  | "ctf"
  | "writeup"
  | "lab"
  | "notes"
  | "tool"
  | "blog";

export type CyberDifficulty =
  | "beginner"
  | "easy"
  | "medium"
  | "hard"
  | "insane";

export const CYBER_CATEGORIES: { value: CyberCategory; label: string; desc: string }[] = [
  { value: "all", label: "All", desc: "Everything in the cyber hub" },
  { value: "ctf", label: "CTF", desc: "Capture the flag writeups & challenges" },
  { value: "writeup", label: "Walkthroughs", desc: "Step-by-step machine guides" },
  { value: "notes", label: "Learning Notes", desc: "Markdown notes by topic" },
  { value: "lab", label: "Labs", desc: "Home lab & environment setups" },
  { value: "tool", label: "Tools", desc: "Scripts and tools I built" },
  { value: "blog", label: "Blog", desc: "Longer technical posts" },
];

export const CYBER_DIFFICULTIES: CyberDifficulty[] = [
  "beginner",
  "easy",
  "medium",
  "hard",
  "insane",
];
