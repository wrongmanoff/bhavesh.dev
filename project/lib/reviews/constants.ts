export type ReviewCategoryFilter =
  | "all"
  | "food"
  | "cafe"
  | "product"
  | "place"
  | "movie"
  | "book";

export const REVIEW_CATEGORIES: { value: ReviewCategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "food", label: "Food" },
  { value: "cafe", label: "Cafes" },
  { value: "product", label: "Products" },
  { value: "place", label: "Places" },
  { value: "movie", label: "Movies" },
  { value: "book", label: "Books" },
];
