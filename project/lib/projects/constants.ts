export type ProjectStatusFilter = "all" | "active" | "wip" | "archived";

export const PROJECT_STATUS_FILTERS: {
  value: ProjectStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "wip", label: "WIP" },
  { value: "archived", label: "Archived" },
];
