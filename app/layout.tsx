import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'AgentWatch — AI Coding Agent Usage Intelligence',
  description: 'Observe developer ↔ AI coding-agent interactions, analyze interaction efficiency, and receive Gemini-powered coaching recommendations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-800/80 py-6 text-center text-xs text-gray-500 font-mono">
          AgentWatch Operations Intelligence &copy; 2026 &bull; Antigravity Agent Observer
        </footer>
      </body>
    </html>
  );
}
