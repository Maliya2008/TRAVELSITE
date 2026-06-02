/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Compass, Sparkles, Image as ImageIcon } from "lucide-react";
import { SiteSettings } from "../types";
import { animate } from "animejs";

interface HeroProps {
  settings: SiteSettings;
}

export default function Hero({ settings }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const [customImage, setCustomImage] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ceylonta_hero_hover_image");
    }
    return null;
  });

  const images = [
    customImage,
    settings.heroBgImage,
    settings.heroBgImage2,
    settings.heroBgImage3,
    settings.heroBgImage4,
    settings.heroBgImage5,
  ].filter((img): img is string => typeof img === "string" && img.trim() !== "");

  if (images.length === 0) {
    images.push("https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1600&auto=format&fit=crop");
  }

  const [hoverImage, setHoverImage] = useState<string>(() => {
    if (customImage) return customImage;
    return images[0] || "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1600&auto=format&fit=crop";
  });
  
  // Track scroll position of the Hero section for the zoom and parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Load custom image from localStorage with custom reactive event listening
  useEffect(() => {
    const loadStoredImage = () => {
      const stored = localStorage.getItem("ceylonta_hero_hover_image");
      if (stored) {
        setCustomImage(stored);
        setHoverImage(stored);
      } else {
        setCustomImage(null);
        if (images && images.length > 0) {
          setHoverImage(images[activeImageIndex] || images[0]);
        }
      }
    };

    loadStoredImage();

    window.addEventListener("storage", loadStoredImage);
    window.addEventListener("ceylonta_hover_image_updated", loadStoredImage);
    return () => {
      window.removeEventListener("storage", loadStoredImage);
      window.removeEventListener("ceylonta_hover_image_updated", loadStoredImage);
    };
  }, [settings, activeImageIndex]);

  // Continuous subtle rotating orbit ring animation underneath the image using anime.js
  useEffect(() => {
    if (ringRef.current) {
      animate(ringRef.current, {
        rotate: "360deg",
        duration: 25000,
        loop: true,
        easing: "linear"
      });
    }
  }, []);

  // Hover 3D interactive tilt handlers using anime.js
  const handleMouseEnter = () => {
    setIsCardHovered(true);
    if (imageRef.current) {
      animate(imageRef.current, {
        scale: 1.05,
        rotateY: 10,
        rotateX: -8,
        duration: 500,
        easing: "easeOutQuad"
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    animate(imageRef.current, {
      rotateY: (x / rect.width) * 24, // Up to 24deg rotation
      rotateX: -(y / rect.height) * 24,
      duration: 150,
      easing: "easeOutQuad"
    });
  };

  const handleMouseLeave = () => {
    setIsCardHovered(false);
    if (imageRef.current) {
      animate(imageRef.current, {
        scale: 1.0,
        rotateY: 0,
        rotateX: 0,
        duration: 800,
        easing: "easeOutElastic(1, 0.6)"
      });
    }
  };

  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const imageCaptions = [
    { title: "Sigiriya Ancient Citadel Heights", meta: "EXPEDITION HIGHLIGHT #01" },
    { title: "Ella Highland Rail Passage", meta: "EXPEDITION HIGHLIGHT #02" },
    { title: "Galle Fort Coastal Bastion", meta: "EXPEDITION HIGHLIGHT #03" },
    { title: "Kandy Sacred Lakeside Canopy", meta: "EXPEDITION HIGHLIGHT #04" },
    { title: "Yala Deep Jungle Expedition", meta: "EXPEDITION HIGHLIGHT #05" },
  ];

  const getCaption = (idx: number) => {
    if (customImage && idx === 0) {
      return { title: "Custom Curated Local Scene", meta: "UPLOADED PRIVATE HIGHLIGHT" };
    }
    const offsetIdx = customImage ? idx - 1 : idx;
    if (offsetIdx >= 0 && offsetIdx < imageCaptions.length) {
      return imageCaptions[offsetIdx];
    }
    return { title: `Expedition Scene Highlight`, meta: `LOCAL TREASURE #${idx + 1}` };
  };

  // Automatically fade between available backdrop images every 10 seconds if multiple exist and autoplay is running
  useEffect(() => {
    if (images.length > 1 && isAutoPlay) {
      const interval = setInterval(() => {
        setActiveImageIndex((prev) => (prev + 1) % images.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [images.length, isAutoPlay]);

  // Synchronize hoverImage with the active background slide
  useEffect(() => {
    if (images[activeImageIndex]) {
      setHoverImage(images[activeImageIndex]);
    }
  }, [activeImageIndex, settings]);

  // Calculate dynamic scale and translation values based on scroll progression
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.25]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);

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

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent px-6 py-20 lg:py-28 isolate"
      id="hero-expedition-viewport"
    >
      {/* Background Slides Dynamic Render Grid */}
      {images.map((imgUrl, idx) => (
        <motion.div 
          key={idx}
          className="absolute inset-0 bg-cover bg-center -z-20 scale-[1.02] transition-opacity duration-1000"
          style={{ 
            backgroundImage: `url('${imgUrl}')`,
            scale: smoothBgScale,
            opacity: activeImageIndex === idx ? bgOpacity : 0,
            filter: `blur(${settings.heroBgBlur || 0}px)`
          }}
        />
      ))}

      {/* Dynamic Hover Card Background Overlay */}
      {hoverImage && (
        <motion.div 
          className="absolute inset-0 bg-cover bg-center -z-18 scale-[1.02] pointer-events-none transition-opacity duration-700"
          style={{ 
            backgroundImage: `url('${hoverImage}')`,
            scale: smoothBgScale,
            opacity: isCardHovered ? bgOpacity : 0,
            filter: `blur(${settings.heroBgBlur || 0}px)`
          }}
        />
      )}

      {/* Luxury Cinematic Overlays for Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent -z-10" />
      <div className="absolute inset-0 bg-midnight/35 -z-10" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-midnight to-transparent -z-10" />

      {/* Grid Content Container */}
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full mt-4">
        
        {/* Left Column: Context Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{ y: smoothTextY }}
          className="lg:col-span-7 flex flex-col items-start text-left gap-6 md:pr-4"
        >
          {/* Dynamic Customizable Header */}
          <motion.h2 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-7xl font-serif text-white leading-tight tracking-tight font-normal drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
          >
            {settings.heroTitle || "CEYLONTA"}
            <span className="italic font-light text-golden block mt-1.5 font-serif font-light">
              {settings.heroSubtitle || "RESPLENDENT TOURISM IN THE INDIAN OCEAN"}
            </span>
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-slate-200 max-w-2xl text-sm sm:text-base leading-relaxed font-sans font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          >
            {settings.heroDescription || "Experience majestic UNESCO world heritage locations, misty tea estate valleys, and pristine tropical beaches alongside extraordinary local curators who tell Sri Lanka's deepest secrets."}
          </motion.p>

          {/* Button Shaded Container */}
          <motion.div 
            variants={itemVariants} 
            className="mt-2 p-2.5 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-white/10 flex flex-wrap gap-3.5 justify-start items-center shadow-2xl"
            style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)" }}
            id="hero-button-shading-container"
          >
            <a
              href="#landmarks-explore"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-jungle to-emerald-900 border border-emerald-700/40 text-white font-medium hover:from-emerald-900 hover:to-jungle transition-all text-sm flex items-center gap-2 glow-green group cursor-pointer shadow-lg"
            >
              <Compass className="w-4 h-4 text-golden group-hover:rotate-45 transition-transform duration-300" />
              <span>Embark On Expedition</span>
            </a>
            
            <a
              href="#guides-marketplace"
              className="px-5 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/10 hover:bg-white/20 hover:border-golden/40 text-white font-medium transition-all text-sm cursor-pointer shadow-lg"
            >
              Discover Private Curators
            </a>
          </motion.div>

          {/* Drag-to-Explore Celestial Slide Control */}
          <motion.div 
            variants={itemVariants}
            className="w-full max-w-md mt-4 p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md relative"
          >
            <div className="flex items-center justify-between text-[11px] font-mono mb-2">
              <span className="text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-golden" /> DRAG TO EXPLORE CELESTIAL SCENES
              </span>
              <span className="text-golden font-bold uppercase">
                Scene {activeImageIndex + 1} of {images.length}
              </span>
            </div>

            {/* Custom Interactive Track with Click & Interactive Draggability */}
            <div className="relative w-full h-8 flex items-center">
              {/* Slider track underlay line */}
              <div className="absolute left-1 right-1 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                {/* Visual fill track */}
                <div 
                  className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-golden rounded-full transition-all duration-300"
                  style={{ width: `${(activeImageIndex / (images.length - 1 || 1)) * 100}%` }}
                />
              </div>

              {/* Ticks representation on track */}
              <div className="absolute left-1 right-1 flex justify-between px-[3px] pointer-events-none">
                {images.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
                      idx <= activeImageIndex 
                        ? "bg-golden border-white scale-110 shadow-[0_0_8px_#fa0]" 
                        : "bg-slate-700 border-transparent scale-90"
                    }`}
                  />
                ))}
              </div>

              {/* Transparent input slider capturing natural click/drag anywhere */}
              <input
                type="range"
                min="0"
                max={images.length - 1}
                value={activeImageIndex}
                onChange={(e) => {
                  setActiveImageIndex(Number(e.target.value));
                  setIsAutoPlay(false); // Disable auto-play immediately when user manually interacts
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />

              {/* Glowing, premium circular dragging handle, perfectly synchronized with range value */}
              <div 
                className="absolute w-6 h-6 bg-gradient-to-br from-golden to-amber-500 rounded-full border-2 border-white shadow-2xl flex items-center justify-center pointer-events-none -translate-x-1/2 z-20 transition-all duration-300 active:scale-110 shadow-golden/30"
                style={{ 
                  left: `calc(4px + ${(activeImageIndex / (images.length - 1 || 1)) * 100}% - ${(activeImageIndex / (images.length - 1 || 1)) * 8}px)` 
                }}
              >
                <div className="w-1.5 h-1.5 bg-slate-950 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
              </div>
            </div>

            {/* Help guidelines */}
            <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">
              <span>01. Dawn</span>
              <span>03. Dusk</span>
              <span>05. Night</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Responsive Anime.js Interactive Card Image Container */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="lg:col-span-5 flex flex-col justify-center items-center w-full relative"
        >
          {/* Rotating ambient glow orbit element managed by anime.js */}
          <div 
            ref={ringRef}
            className="absolute w-[340px] sm:w-[420px] h-[340px] sm:h-[420px] rounded-full border border-dashed border-golden/20 opacity-40 -z-10"
            style={{ transformOrigin: "center center" }}
          />

          {/* Secondary glowing circle border */}
          <div className="absolute w-[290px] h-[290px] rounded-full bg-emerald-500/5 blur-3xl -z-10" />

          {/* Interactive Card */}
          <div
            ref={imageRef}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full max-w-[340px] sm:max-w-[370px] aspect-[4/5] bg-slate-900/90 border-2 border-white/10 rounded-3xl p-3.5 shadow-2xl relative cursor-pointer select-none group focus:outline-none transition-shadow duration-500 hover:shadow-emerald-500/10"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Inner Border Glow Lines */}
            <div className="absolute inset-2 border border-white/5 rounded-2xl pointer-events-none" />
            
            {/* The Actual Image layer */}
            <div className="w-full h-full rounded-2xl overflow-hidden relative bg-slate-950">
              {hoverImage ? (
                <img
                  src={hoverImage}
                  alt="Custom Expedition Curated Scene"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 font-sans"
                />
              ) : null}

              {/* Shaded bottom caption panel */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-5 pt-12 flex flex-col justify-end text-left">
                <span className="text-[10px] font-mono uppercase tracking-widest text-golden font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3" /> {getCaption(activeImageIndex).meta}
                </span>
                <p className="text-white text-sm font-serif font-medium mt-1 leading-tight tracking-tight drop-shadow-md min-h-[40px]">
                  {getCaption(activeImageIndex).title}
                </p>
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mt-2.5 pt-2 border-t border-white/5">
                  <span>SYSTEM: HEURISTIC 3D TILT</span>
                  <span className="text-emerald-400 font-bold">● ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Extra vintage design frame corner aesthetics */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-golden/50 rounded-tl-3xl translate-x-[-1px] translate-y-[-1px]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-golden/50 rounded-br-3xl translate-x-[1px] translate-y-[1px]" />
          </div>

          {/* Little subtitle guide badge under card */}
          <div className="mt-4 px-3 py-1.5 rounded-full bg-slate-950/80 border border-white/10 text-[9px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <ImageIcon className="w-3 text-golden" />
            <span>Hover card to engage 3D parallax</span>
          </div>

        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        variants={itemVariants}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40"
      >
        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">Scroll to Explore</span>
        <motion.div 
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.0 }}
          className="w-1 h-4 rounded-full bg-golden"
        />
      </motion.div>
    </div>
  );
}
