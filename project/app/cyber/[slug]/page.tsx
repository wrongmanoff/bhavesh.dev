import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { Badge } from "@/components/ui/Badge";
import { TableOfContents } from "@/components/cyber/TableOfContents";
import { RelatedPosts } from "@/components/cyber/RelatedPosts";
import { getCyberPostBySlug, getRelatedCyberPosts } from "@/lib/data/cyber";
import { extractHeadings } from "@/lib/markdown/toc";
import {
  CYBER_CATEGORY_CONFIG,
  DIFFICULTY_CONFIG,
  formatDate,
  estimateReadingTime,
} from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ArrowLeft, Clock } from "lucide-react";

interface CyberArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: CyberArticlePageProps): Promise<Metadata> {
  const post = await getCyberPostBySlug(params.slug);
  if (!post) return { title: "Not Found" };

  const description = post.content_md
    .replace(/[#*`\[\]]/g, "")
    .trim()
    .slice(0, 160);

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.created_at,
      tags: post.tags,
    },
  };
}

export default async function CyberArticlePage({ params }: CyberArticlePageProps) {
  const post = await getCyberPostBySlug(params.slug);
  if (!post) notFound();

  const [related, headings] = await Promise.all([
    getRelatedCyberPosts(post),
    Promise.resolve(extractHeadings(post.content_md)),
  ]);

  const category = CYBER_CATEGORY_CONFIG[post.category];
  const difficulty = DIFFICULTY_CONFIG[post.difficulty];
  const readTime = estimateReadingTime(post.content_md);

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <Link
        href="/cyber"
        className="inline-flex items-center gap-2 font-mono text-xs text-[#6b6b6b] hover:text-[#00ff88] mb-8 transition-colors"
      >
        <ArrowLeft size={14} />
        back to cyber hub
      </Link>

      <header className="max-w-3xl mb-10">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={cn("border", category.color)}>{category.label}</Badge>
          {post.platform && (
            <Badge className="border border-[#1e1e1e] text-[#a0a0a0] bg-[#1a1a1a]">
              {post.platform}
            </Badge>
          )}
          <Badge className={cn("border-0", difficulty.color)}>
            {difficulty.label}
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#6b6b6b]">
          <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {readTime} min read
          </span>
          {post.tags.map((tag) => (
            <span key={tag} className="text-[#00ff88]/70">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_220px] gap-10">
        <div className="min-w-0 max-w-3xl">
          <MarkdownRenderer
            content={post.content_md}
            highlight
            headingIds
          />
          <RelatedPosts posts={related} />
        </div>

        {headings.length > 0 && (
          <aside className="hidden lg:block">
            <TableOfContents headings={headings} />
          </aside>
        )}
      </div>
    </article>
  );
}
