"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const { user, logout } = useAuth();

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

      {user ? (
        <div className="flex items-center gap-4">
          <Link
            href="/profile"
            className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            Profile
          </Link>
          <Button
            variant="ghost"
            className="text-slate-300 hover:text-white text-sm font-medium h-auto p-0"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            Register
          </Link>
        </div>
      )}

      <ThemeToggle />
    </nav>
  );
}

