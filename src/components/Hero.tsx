/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Compass, Sparkles } from "lucide-react";
import { SiteSettings } from "../types";

interface HeroProps {
  settings: SiteSettings;
}

export default function Hero({ settings }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Track scroll position of the Hero section for the zoom and parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Automatically fade between BgImage 1 and BgImage 2 every 6 seconds if BgImage 2 exists
  useEffect(() => {
    if (settings.heroBgImage2) {
      const interval = setInterval(() => {
        setActiveImageIndex((prev) => (prev === 0 ? 1 : 0));
      }, 6000);
      return () => clearInterval(interval);
    } else {
      setActiveImageIndex(0);
    }
  }, [settings.heroBgImage2]);

  // Calculate dynamic scale and translation values based on scroll progression
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const smoothBgScale = useSpring(bgScale, { stiffness: 60, damping: 25 });
  const smoothTextY = useSpring(textY, { stiffness: 60, damping: 25 });

  // Framer Motion variants for stagger reveal animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: `blur(${settings.heroBgBlur > 0 ? settings.heroBgBlur : 4}px)` },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        duration: settings.heroBgFadeDuration || 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    }
  };

  const primaryImage = settings.heroBgImage || "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1600&auto=format&fit=crop";
  const secondaryImage = settings.heroBgImage2 || "";

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 px-6 py-24"
      id="hero-expedition-viewport"
    >
      {/* Background Image 1 */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center -z-20 scale-[1.02] transition-opacity duration-1500"
        style={{ 
          backgroundImage: `url('${primaryImage}')`,
          scale: smoothBgScale,
          opacity: activeImageIndex === 0 ? bgOpacity : 0,
          filter: `blur(${settings.heroBgBlur || 0}px)`
        }}
      />

      {/* Background Image 2 (crossfading) */}
      {secondaryImage && (
        <motion.div 
          className="absolute inset-0 bg-cover bg-center -z-20 scale-[1.02] transition-opacity duration-1500"
          style={{ 
            backgroundImage: `url('${secondaryImage}')`,
            scale: smoothBgScale,
            opacity: activeImageIndex === 1 ? bgOpacity : 0,
            filter: `blur(${settings.heroBgBlur || 0}px)`
          }}
        />
      )}

      {/* Luxury Cinematic Overlays for Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent -z-10" />
      <div className="absolute inset-0 bg-midnight/35 -z-10" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-midnight to-transparent -z-10" />

      {/* Content Container with reveal alignments */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ y: smoothTextY }}
        className="max-w-4xl text-center relative z-10 flex flex-col items-center gap-6"
      >
        {/* Dynamic Customizable Header */}
        <motion.h2 
          variants={itemVariants}
          className="text-4xl sm:text-6xl md:text-8xl font-serif text-white leading-tight tracking-tight px-2 font-normal drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
        >
          {settings.heroTitle || "CEYLON IMMERSE"}
          <span className="italic font-light text-golden block mt-2 md:inline md:mt-0 font-serif md:ml-3">
            {settings.heroSubtitle || "RESPLENDENT TOURISM IN THE INDIAN OCEAN"}
          </span>
        </motion.h2>

        <motion.p 
          variants={itemVariants}
          className="text-slate-300 max-w-2xl text-base sm:text-lg leading-relaxed font-sans font-light px-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          {settings.heroDescription || "Experience majestic UNESCO world heritage locations, misty tea estate valleys, and pristine tropical beaches alongside extraordinary local curators who tell Sri Lanka's deepest secrets."}
        </motion.p>

        {/* Shaded Button Container Area to prevent image color conflicts */}
        <motion.div 
          variants={itemVariants} 
          className="mt-6 p-3 bg-slate-950/70 backdrop-blur-md rounded-2xl border border-white/10 flex flex-wrap gap-4 justify-center items-center shadow-2xl"
          style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)" }}
          id="hero-button-shading-container"
        >
          <a
            href="#landmarks-explore"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-jungle to-emerald-900 border border-emerald-700/40 text-white font-medium hover:from-emerald-900 hover:to-jungle transition-all text-sm flex items-center gap-2 glow-green group cursor-pointer shadow-lg"
          >
            <Compass className="w-4 h-4 text-golden group-hover:rotate-45 transition-transform duration-300" />
            <span>Embark On Expedition</span>
          </a>
          
          <a
            href="#guides-marketplace"
            className="px-6 py-3.5 rounded-xl bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 hover:border-golden/40 text-white font-medium transition-all text-sm cursor-pointer shadow-lg"
          >
            Discover Private Curators
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          variants={itemVariants}
          className="absolute -bottom-36 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-50"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Scroll to Explore</span>
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-6 rounded-full bg-golden"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
