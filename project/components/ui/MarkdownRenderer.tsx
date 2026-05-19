"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { slugifyHeading } from "@/lib/markdown/toc";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  /** Enable syntax highlighting (for cyber articles) */
  highlight?: boolean;
  /** Add id anchors to h2/h3 for table of contents */
  headingIds?: boolean;
}

export function MarkdownRenderer({
  content,
  className,
  highlight = false,
  headingIds = false,
}: MarkdownRendererProps) {
  const rehypePlugins = highlight
    ? [rehypeRaw, rehypeHighlight]
    : [rehypeRaw];

  return (
    <div className={`prose prose-invert max-w-none ${className ?? ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={rehypePlugins}
        components={{
          code({ className: codeClass, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClass || "");
            const isBlock = match || String(children).includes("\n");
            if (isBlock) {
              return (
                <pre className="!bg-[#0d0d0d] !border !border-[#1e1e1e] rounded-lg overflow-x-auto my-4">
                  <code className={`${codeClass ?? ""} font-mono text-sm`} {...props}>
                    {children}
                  </code>
                </pre>
              );
            }
            return (
              <code
                className="bg-[#1a1a1a] text-[#00ff88] px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre({ children }) {
            return <>{children}</>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-[#00ff88] hover:underline"
              >
                {children}
              </a>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-2 border-[#00ff88] pl-4 text-[#a0a0a0] italic my-4">
                {children}
              </blockquote>
            );
          },
          h1({ children }) {
            return (
              <h1 className="text-2xl font-bold text-white mt-8 mb-4">{children}</h1>
            );
          },
          h2({ children }) {
            const text = String(children);
            const id = headingIds ? slugifyHeading(text) : undefined;
            return (
              <h2
                id={id}
                className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24 flex items-center gap-2 group"
              >
                <span className="text-[#00ff88] font-mono text-sm opacity-60">##</span>
                {children}
              </h2>
            );
          },
          h3({ children }) {
            const text = String(children);
            const id = headingIds ? slugifyHeading(text) : undefined;
            return (
              <h3
                id={id}
                className="text-lg font-semibold text-white mt-6 mb-2 scroll-mt-24"
              >
                {children}
              </h3>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
