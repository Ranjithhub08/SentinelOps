'use client';

import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en" className="dark">
      <head>
        <title>SentinelOps | Premium AI Observability</title>
      </head>
      <body className={cn(
        inter.variable, 
        outfit.variable, 
        "font-sans flex h-screen overflow-hidden bg-[#020617]"
      )}>
        {/* Decorative Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        </div>

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <TopNav />
          
          <main className="flex-1 overflow-hidden px-8 pb-8">
            <AnimatePresence mode="wait">
              <motion.div 
                key={pathname}
                initial={{ opacity: 0, y: 15, scale: 0.99, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -15, scale: 0.99, filter: 'blur(10px)' }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.22, 1, 0.36, 1],
                  opacity: { duration: 0.3 }
                }}
                className="w-full h-full glass-panel p-8 overflow-y-auto custom-scrollbar relative"
              >
                {/* Content Overlay Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/[0.03] blur-[100px] -z-10 rounded-full pointer-events-none" />
                
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </body>
    </html>
  );
}
