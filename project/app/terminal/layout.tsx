import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terminal",
  description: "Interactive terminal interface for navigating Bhavesh OS.",
};

export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
