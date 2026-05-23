import { z } from "zod";

const MAX_SHORT_TEXT = 160;
const MAX_TEXT = 10_000;
const MAX_MARKDOWN = 40_000;
const MAX_URL = 2_048;

function stripHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?[^>]+>/g, "")
    .trim();
}

function sanitizedString(options: { max: number; required?: boolean }) {
  const base = z
    .string()
    .transform((value) => stripHtml(value));

  return options.required
    ? base.pipe(
        z
          .string()
          .min(1, "This field is required")
          .max(options.max, `Must be ${options.max} characters or fewer`)
      )
    : base.pipe(
        z
          .string()
          .max(options.max, `Must be ${options.max} characters or fewer`)
      );
}

function sanitizedMarkdown(options: { max: number; required?: boolean }) {
  const base = z
    .string()
    .transform((value) => stripHtml(value));

  return options.required
    ? base.pipe(
        z
          .string()
          .min(1, "This field is required")
          .max(options.max, `Must be ${options.max} characters or fewer`)
      )
    : base.pipe(
        z
          .string()
          .max(options.max, `Must be ${options.max} characters or fewer`)
      );
}

function optionalUrlString(required = false) {
  const schema = z
    .string()
    .trim()
    .max(MAX_URL, `Must be ${MAX_URL} characters or fewer`)
    .refine(
      (value) => !value || isSafeUrl(value),
      "Enter a valid URL"
    );

  return required ? schema.min(1, "This field is required") : schema;
}

function multilineUrlString() {
  return z
    .string()
    .max(MAX_TEXT, `Must be ${MAX_TEXT} characters or fewer`)
    .superRefine((value, ctx) => {
      const items = toLineArray(value);
      if (items.length > 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "No more than 20 URLs allowed",
        });
      }
      for (const item of items) {
        if (!isSafeUrl(item)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Each image URL must be valid",
          });
          break;
        }
      }
    });
}

function commaSeparatedString(maxItems = 20) {
  return z
    .string()
    .max(MAX_TEXT, `Must be ${MAX_TEXT} characters or fewer`)
    .superRefine((value, ctx) => {
      if (toCommaArray(value).length > maxItems) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `No more than ${maxItems} items allowed`,
        });
      }
    });
}

function multilineString(maxItems = 20) {
  return z
    .string()
    .max(MAX_TEXT, `Must be ${MAX_TEXT} characters or fewer`)
    .superRefine((value, ctx) => {
      if (toLineArray(value).length > maxItems) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `No more than ${maxItems} items allowed`,
        });
      }
    });
}

function dateString() {
  return z
    .string()
    .trim()
    .refine(
      (value) => !value || !Number.isNaN(Date.parse(value)),
      "Enter a valid date"
    );
}

function integerString() {
  return z.coerce.number().int("Must be a whole number");
}

function isSafeUrl(value: string) {
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
}

export function toCommaArray(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toLineArray(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const path = issue.path[0];
    if (typeof path === "string" && !fieldErrors[path]) {
      fieldErrors[path] = issue.message;
    }
  }

  return fieldErrors;
}

const learningItemSchema = z.object({
  skill: sanitizedString({ max: MAX_SHORT_TEXT, required: true }),
  status: z.enum(["done", "in_progress", "queued"]),
});

export const feedAdminSchema = z.object({
  title: sanitizedString({ max: MAX_SHORT_TEXT }),
  content: sanitizedMarkdown({ max: MAX_MARKDOWN, required: true }),
  type: z.enum(["log", "review", "thought", "productive", "wasted"]),
  mood: sanitizedString({ max: 32 }),
  tags: commaSeparatedString(),
  images: multilineUrlString(),
  published: z.boolean(),
});

export const cyberAdminSchema = z.object({
  title: sanitizedString({ max: MAX_SHORT_TEXT, required: true }),
  slug: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(MAX_SHORT_TEXT, `Must be ${MAX_SHORT_TEXT} characters or fewer`)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  contentMd: sanitizedMarkdown({ max: MAX_MARKDOWN, required: true }),
  category: z.enum(["ctf", "writeup", "lab", "notes", "tool", "blog"]),
  difficulty: z.enum(["beginner", "easy", "medium", "hard", "insane"]),
  platform: sanitizedString({ max: MAX_SHORT_TEXT }),
  tags: commaSeparatedString(),
  published: z.boolean(),
});

export const projectAdminSchema = z.object({
  title: sanitizedString({ max: MAX_SHORT_TEXT, required: true }),
  slug: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(MAX_SHORT_TEXT, `Must be ${MAX_SHORT_TEXT} characters or fewer`)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  description: sanitizedMarkdown({ max: MAX_TEXT, required: true }),
  whyBuilt: sanitizedMarkdown({ max: MAX_MARKDOWN }),
  problemFaced: sanitizedMarkdown({ max: MAX_MARKDOWN }),
  lessonsLearned: sanitizedMarkdown({ max: MAX_MARKDOWN }),
  futurePlans: sanitizedMarkdown({ max: MAX_MARKDOWN }),
  techStack: commaSeparatedString(),
  screenshots: multilineUrlString(),
  architectureImg: optionalUrlString(),
  githubUrl: optionalUrlString(),
  liveUrl: optionalUrlString(),
  status: z.enum(["active", "wip", "archived"]),
});

export const reviewAdminSchema = z.object({
  title: sanitizedString({ max: MAX_SHORT_TEXT, required: true }),
  content: sanitizedMarkdown({ max: MAX_MARKDOWN, required: true }),
  category: z.enum(["food", "cafe", "product", "place", "movie", "book"]),
  rating: integerString().min(1, "Minimum rating is 1").max(5, "Maximum rating is 5"),
  location: sanitizedString({ max: MAX_SHORT_TEXT }),
  priceRange: sanitizedString({ max: 32 }),
  images: multilineUrlString(),
  published: z.boolean(),
});

export const achievementAdminSchema = z.object({
  title: sanitizedString({ max: MAX_SHORT_TEXT, required: true }),
  type: z.enum(["cert", "internship", "hackathon", "club", "ranking", "badge", "streak"]),
  issuer: sanitizedString({ max: MAX_SHORT_TEXT }),
  date: dateString(),
  description: sanitizedMarkdown({ max: MAX_TEXT }),
  imageUrl: optionalUrlString(),
  credentialUrl: optionalUrlString(),
  featured: z.boolean(),
});

export const galleryAdminSchema = z.object({
  title: sanitizedString({ max: MAX_SHORT_TEXT, required: true }),
  caption: sanitizedMarkdown({ max: MAX_TEXT }),
  category: z.enum(["screenshot", "setup", "travel", "cert", "coding", "event"]),
  takenAt: dateString(),
  imageUrl: optionalUrlString(true),
});

export const linkAdminSchema = z.object({
  label: sanitizedString({ max: MAX_SHORT_TEXT, required: true }),
  url: optionalUrlString(true),
  icon: sanitizedString({ max: 64 }),
  category: z.enum(["social", "hacking", "dev", "contact"]),
  displayOrder: integerString(),
});

export const nowPageAdminSchema = z.object({
  currentFocus: sanitizedMarkdown({ max: MAX_TEXT, required: true }),
  goals: multilineString(),
  books: multilineString(),
  obsessions: multilineString(),
  projects: multilineString(),
  roadmapJson: z
    .string()
    .trim()
    .min(1, "This field is required")
    .superRefine((value, ctx) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(learningItemSchema).safeParse(parsed);
        if (!result.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Learning roadmap JSON is invalid",
          });
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Learning roadmap JSON is invalid",
        });
      }
    }),
});

export function parseLearningRoadmap(value: string) {
  return z.array(learningItemSchema).parse(JSON.parse(value));
}

export type FeedAdminInput = z.input<typeof feedAdminSchema>;
export type CyberAdminInput = z.input<typeof cyberAdminSchema>;
export type ProjectAdminInput = z.input<typeof projectAdminSchema>;
export type ReviewAdminInput = z.input<typeof reviewAdminSchema>;
export type AchievementAdminInput = z.input<typeof achievementAdminSchema>;
export type GalleryAdminInput = z.input<typeof galleryAdminSchema>;
export type LinkAdminInput = z.input<typeof linkAdminSchema>;
export type NowPageAdminInput = z.input<typeof nowPageAdminSchema>;
