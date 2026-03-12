import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function NavBar() {
  return (
    <nav className="flex items-center gap-6">
      <Link
        href="/"
        className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium"
      >
        Home
      </Link>
      <Link
        href="/tasks"
        className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium"
      >
        Tasks
      </Link>
      <Link
        href="/about"
        className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium"
      >
        About
      </Link>

      <ThemeToggle />
    </nav>
  );
}

