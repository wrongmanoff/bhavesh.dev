const FALLBACK_SITE_URL = "https://bhavesh.dev";

export function getSiteUrl() {
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
  const normalizedVercelUrl = vercelUrl
    ? vercelUrl.startsWith("http")
      ? vercelUrl
      : `https://${vercelUrl}`
    : undefined;

  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    normalizedVercelUrl ||
    FALLBACK_SITE_URL
  ).replace(/\/$/, "");
}

export const siteName = "Bhavesh OS";
