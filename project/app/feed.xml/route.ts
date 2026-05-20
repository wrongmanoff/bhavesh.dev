import { createClient } from "@/lib/supabase/server";
import { getSiteUrl, siteName } from "@/lib/site";

export const revalidate = 3600;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripMarkdown(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, " ")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[#>*_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET() {
  const supabase = await createClient();
  const siteUrl = getSiteUrl();

  const [{ data: feedPosts, error: feedError }, { data: cyberPosts, error: cyberError }] =
    await Promise.all([
      supabase
        .from("life_feed")
        .select("id, title, content, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("cyber_posts")
        .select("id, title, slug, content_md, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false }),
    ]);

  if (feedError || cyberError) {
    return new Response("Unable to generate RSS feed", { status: 500 });
  }

  const items = [
    ...(feedPosts ?? []).map((post) => ({
      title: post.title || "Life Feed Post",
      description: stripMarkdown(post.content || ""),
      link: `${siteUrl}/feed`,
      guid: `${siteUrl}/feed#${post.id}`,
      pubDate: post.created_at,
    })),
    ...(cyberPosts ?? []).map((post) => ({
      title: post.title || "Cyber Post",
      description: stripMarkdown(post.content_md || ""),
      link: `${siteUrl}/cyber/${post.slug}`,
      guid: `${siteUrl}/cyber/${post.slug}`,
      pubDate: post.created_at,
    })),
  ]
    .sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    )
    .map(
      (item) => `<item>
  <title>${escapeXml(item.title)}</title>
  <description>${escapeXml(item.description)}</description>
  <link>${item.link}</link>
  <guid>${item.guid}</guid>
  <pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>
</item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${siteName}</title>
  <link>${siteUrl}</link>
  <description>Published posts from Bhavesh OS across the life feed and cyber hub.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
