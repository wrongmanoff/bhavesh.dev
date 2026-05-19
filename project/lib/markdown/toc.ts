export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/** Extract h2/h3 headings from markdown for table of contents */
export function extractHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    const h2 = /^##\s+(.+)$/.exec(line.trim());
    if (h2) {
      const text = h2[1].replace(/[#*`]/g, "").trim();
      headings.push({ id: slugifyHeading(text), text, level: 2 });
      continue;
    }
    const h3 = /^###\s+(.+)$/.exec(line.trim());
    if (h3) {
      const text = h3[1].replace(/[#*`]/g, "").trim();
      headings.push({ id: slugifyHeading(text), text, level: 3 });
    }
  }

  return headings;
}
