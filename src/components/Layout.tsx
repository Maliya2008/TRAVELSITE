/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Compass, Sparkles, Sliders, MapPin, Sun, Moon } from "lucide-react";
import { SiteSettings } from "../types";

interface LayoutProps {
  children: React.ReactNode;
  onOpenConsole: () => void;
  bookingCount: number;
  settings: SiteSettings;
  onThemeToggle: () => void;
}

export default function Layout({ children, onOpenConsole, bookingCount, settings, onThemeToggle }: LayoutProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-midnight font-sans text-slate-100 selection:bg-golden selection:text-midnight flex flex-col relative overflow-hidden">
      {/* Cinematic scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-jungle via-golden to-emerald-500 origin-left z-50 shadow-lg"
        style={{ scaleX }}
      />

      {/* Floating subtle background ambient decorations */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-jungle/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-1/4 w-[35rem] h-[35rem] bg-golden/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-midnight/60 backdrop-blur-md border-b border-white/5 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Name */}
          <div className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-jungle to-emerald-950 border border-white/10 group-hover:border-golden/40 transition-colors duration-350">
              <Compass className="w-5 h-5 text-golden animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-serif text-white tracking-widest leading-none font-bold uppercase">
                ceylon<span className="text-golden font-sans font-normal text-xs tracking-widest uppercase ml-0.5 block md:inline font-semibold">ta</span>
              </h1>
            </div>
          </div>

          {/* Quick Stats or Navigation Highlights */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Direct Booking Badge indicator */}
            {bookingCount > 0 && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-golden/10 border border-golden/20 text-xs text-golden font-medium"
              >
                <Sparkles className="w-3.5 h-3.5 text-golden" />
                <span>{bookingCount} Curator Active</span>
              </motion.div>
            )}

            {/* Custom Theme Switch button */}
            <button
              onClick={onThemeToggle}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-golden/40 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              title={`Switch to ${settings.theme === "dark" ? "Royal Light" : "Cosmic Dark"} theme`}
              id="theme-switch-header"
            >
              {settings.theme === "light" ? (
                <Moon className="w-4 h-4 text-amber-500" />
              ) : (
                <Sun className="w-4 h-4 text-golden animate-pulse" />
              )}
            </button>

            {/* Developer options floating console button */}
            <button
              onClick={onOpenConsole}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-golden/40 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-mono font-medium"
              id="dev-console-trigger"
            >
              <Sliders className="w-3.5 h-3.5 text-golden" />
              <span className="hidden sm:inline">Luxury Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Primary Scroll Container Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Immersive Footer */}
      <footer className={`bg-midnight/90 border-t border-white/5 ${settings.footerHeightClass || "py-12"} px-6 mt-16 text-slate-500 text-xs transition-all duration-300`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-golden/60" />
            <span>Colombo · Galle · Kandy · Ella · Sigiriya</span>
          </div>
          <div className="text-center md:text-right">
            <p className="font-serif tracking-wider text-slate-400 mb-1 font-bold uppercase">
              {settings.footerCopyright}
            </p>
            <p className="text-[10px]">
              Curated luxury travel blueprints & private guided expeditions under the Resplendent Island.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
