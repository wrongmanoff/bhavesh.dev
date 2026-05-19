export const PAGE_SIZE = 12;

export type FeedFilter =
  | "all"
  | "productive"
  | "wasted"
  | "review"
  | "thought"
  | "log";

export type HeatmapDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};
