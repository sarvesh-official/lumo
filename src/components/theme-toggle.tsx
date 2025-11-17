'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useSyncExternalStore } from 'react';

import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/dropdown-menu';
import { cn } from '../lib/utils';

export function ThemeToggle({ variant = "default" }: { variant?: "default" | "animated" }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Track mounted state using useSyncExternalStore to avoid hydration issues
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  
  // Use a safe theme value that won't cause hydration mismatch
  const currentTheme = mounted ? resolvedTheme : undefined;

  const toggleTheme = () => {
    setIsAnimating(true);
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setTimeout(() => setIsAnimating(false), 1000);
  };

  if (variant === "animated") {
    return (
      <div className="relative">
        <button
          onClick={toggleTheme}
          className="relative z-20 overflow-hidden rounded-full p-1 ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
          aria-label="Toggle theme"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            {!mounted ? (
              <div className="h-5 w-5" />
            ) : currentTheme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-slate-700" />
            )}
          </div>
        </button>
        {isAnimating && (
          <div
            className={cn(
              "absolute z-10 rounded-full bg-slate-100 dark:bg-slate-800",
              "top-0 right-0",
              "animate-ripple-blur",
              "pointer-events-none"
            )}
          />
        )}
      </div>
    );
  }

  // Show a simplified version during server rendering
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <div className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
