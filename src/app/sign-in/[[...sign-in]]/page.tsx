"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import {
  Brain,
  Sparkles,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import { ThemeToggleButton } from "@/src/components/theme-toggle-button";

export default function Page() {

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Theme toggle button */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggleButton/>
      </div>

      <div className="z-10 w-full max-w-6xl mx-auto px-4">
        <div className="bg-card/80 backdrop-blur-xl overflow-hidden rounded-2xl shadow-2xl border border-border">
          <div className="grid lg:grid-cols-2 gap-0">
            
            {/* Left side - Features */}
            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
              <div className="mb-8 flex items-center gap-3">
                <div className="size-12 md:size-14">
                  <Image src="/icon.png" alt="Lumo" width={56} height={56} className="w-full h-full object-contain" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">Lumo</h1>
              </div>

              <h2 className="mb-4 text-2xl md:text-3xl font-semibold">
                Your AI Science Tutor
              </h2>
              <p className="mb-8 text-lg opacity-90">
                Learn science with AI-powered conversations and interactive flashcards
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: <Brain className="w-5 h-5" />,
                    title: 'AI-Powered Learning',
                    desc: 'Get instant explanations on any science topic',
                  },
                  {
                    icon: <BookOpen className="w-5 h-5" />,
                    title: 'Smart Flashcards',
                    desc: 'Auto-generate flashcards from conversations',
                  },
                  {
                    icon: <Sparkles className="w-5 h-5" />,
                    title: 'Interactive Sessions',
                    desc: 'Engage in dynamic Q&A with your AI tutor',
                  },
                  {
                    icon: <Lightbulb className="w-5 h-5" />,
                    title: 'Personalized Help',
                    desc: 'Tailored explanations at your own pace',
                  },
                ].map(({ icon, title, desc }, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/20 backdrop-blur-sm">
                      {icon}
                    </div>
                    <div>
                      <div className="font-semibold text-lg mb-1">{title}</div>
                      <div className="text-sm opacity-80">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Sign In */}
            <div className="flex items-center justify-center p-8 md:p-12 lg:p-16 bg-card">
              <div className="w-full max-w-md">
                <div className="mb-8 text-center lg:text-left">
                  <h3 className="text-2xl font-semibold mb-2">Welcome Back</h3>
                  <p className="text-muted-foreground">
                    Sign in to continue your learning journey
                  </p>
                </div>
                <SignIn 
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none bg-transparent",
                    }
                  }}
                  redirectUrl="/" 
                  afterSignInUrl="/" 
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
