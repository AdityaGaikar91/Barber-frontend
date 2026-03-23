"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-14 w-full" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className={`flex flex-col gap-2 w-full ${className ?? 'px-2 py-2'}`}>
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`
          relative flex h-[38px] w-full items-center rounded-full p-1 transition-colors duration-500 hover:cursor-pointer
          shadow-[inset_0_4px_8px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.8)]
          dark:shadow-[inset_0_4px_8px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.05)]
          border border-gray-200/50 dark:border-gray-800
        `}
        style={{
            backgroundColor: isDark ? "#0f172a" : "#f1f5f9",
        }}
        role="switch"
        aria-checked={isDark}
      >
        <span className="sr-only">Toggle theme</span>
        
        {/* Track Text Placeholder */}
        <div className="absolute inset-0 flex justify-between items-center px-3 pointer-events-none">
            <span className={`text-[10px] sm:text-[11px] uppercase tracking-wider font-bold ${!isDark ? 'opacity-0' : 'text-slate-400'} transition-opacity duration-300`}>Light</span>
            <span className={`text-[10px] sm:text-[11px] uppercase tracking-wider font-bold ${isDark ? 'opacity-0' : 'text-slate-500'} transition-opacity duration-300`}>Dark</span>
        </div>

        {/* 3D Animated Knob */}
        <motion.div
            className={`
                relative flex h-full w-1/2 items-center justify-center rounded-full z-10
                shadow-[0_4px_10px_rgba(0,0,0,0.2),inset_0_2px_3px_rgba(255,255,255,1),inset_0_-2px_2px_rgba(0,0,0,0.05)]
                dark:shadow-[0_4px_10px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.4)]
                border border-gray-200/80 dark:border-gray-700
            `}
            style={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
            }}
            animate={{
                x: isDark ? "100%" : "0%",
            }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
            }}
        >
            <motion.div
                initial={false}
                animate={{ rotate: isDark ? 360 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex items-center justify-center"
            >
                {isDark ? (
                    <Moon className="h-[14px] w-[14px] text-sky-400 opacity-90" />
                ) : (
                    <Sun className="h-[14px] w-[14px] text-amber-500 opacity-90" />
                )}
            </motion.div>
        </motion.div>
      </button>
    </div>
  );
}
