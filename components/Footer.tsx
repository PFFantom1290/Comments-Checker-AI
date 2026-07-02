import Link from "next/link";
import Brand from "@/components/Brand";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-800/50 py-6 px-4 text-center text-xs text-gray-600">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <span className="inline-flex items-center gap-1.5">
          © {new Date().getFullYear()} <Brand className="text-xs" asLink={false} />
        </span>
        <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
        <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
        <Link href="/refund" className="hover:text-gray-400 transition-colors">Refunds</Link>
        <a href="mailto:ivanhavrylenko13@gmail.com" className="hover:text-gray-400 transition-colors">
          Contact
        </a>
      </div>
    </footer>
  );
}
