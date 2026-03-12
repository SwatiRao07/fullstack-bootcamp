import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Notes App",
  description: "Personal task management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased`}>
        <AuthProvider>
          {/* Header / Nav */}
          <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md dark:bg-black border-b dark:border-slate-800">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
              <span className="font-bold text-xl tracking-tight">Task Notes</span>
              <NavBar />
            </div>
          </header>

          {/*  Page Content */}
          <main className="min-h-screen max-w-5xl mx-auto px-6 py-10">{children}</main>

          {/* Footer */}
          <footer className="bg-muted/30 border-t border-border py-8 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} Task Notes App. All rights reserved.</p>
          </footer>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

