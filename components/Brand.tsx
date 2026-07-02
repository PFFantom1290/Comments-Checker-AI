import Link from "next/link";

/**
 * The ReviewX wordmark — single source of truth for the brand across headers,
 * heroes, and the footer. `hero` renders the big gradient version; otherwise
 * it's the compact header mark. Pass `asLink={false}` where a link to "/"
 * would be redundant (e.g. inside the hero of the home page itself).
 */
export default function Brand({
  hero = false,
  asLink = true,
  className = "",
}: {
  hero?: boolean;
  asLink?: boolean;
  className?: string;
}) {
  const mark = hero ? (
    <span className={`font-bold tracking-tight ${className}`}>
      <span className="text-glow bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
        Review
      </span>
      <span className="text-indigo-400">X</span>
    </span>
  ) : (
    <span className={`font-semibold tracking-tight text-gray-100 ${className}`}>
      Review<span className="text-indigo-400">X</span>
    </span>
  );

  if (!asLink) return mark;
  return (
    <Link href="/" aria-label="ReviewX home" className="hover:opacity-90 transition-opacity">
      {mark}
    </Link>
  );
}
