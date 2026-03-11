import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";

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
      <body
        className={`${geist.variable} antialiased bg-slate-50 text-slate-900`}
      >
        {/* Header / Nav */}
        <header className="sticky top-0 z-50 bg-slate-800 shadow-md">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="text-white font-bold text-xl tracking-tight">
               Task Notes
            </span>
            <NavBar />
          </div>
        </header>

        {/*  Page Content */}
        <main className="min-h-screen max-w-5xl mx-auto px-6 py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-100 border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
          <p>&copy;Task Notes App. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
