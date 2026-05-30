/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { Landmark } from "../types";
import { MapPin, DollarSign, Clock, Code, ChevronRight } from "lucide-react";

interface LandmarkCardProps {
  key?: React.Key;
  landmark: Landmark;
  isSelected: boolean;
  onSelect: (landmark: Landmark) => void;
}

export default function LandmarkCard({ landmark, isSelected, onSelect }: LandmarkCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Mouse hover tilt tracking properties using motion values
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useTransform(y, [0, 1], [10, -10]);
  const rotateY = useTransform(x, [0, 1], [-10, 10]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Convert offsets to percentage between 0 and 1
    x.set(mouseX / width);
    y.set(mouseY / height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  const toggleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleCardClick = () => {
    onSelect(landmark);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isFlipped ? 0 : rotateX,
        rotateY: isFlipped ? 0 : rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={`relative w-full h-[460px] rounded-2xl cursor-pointer glass-card glass-card-hover overflow-hidden select-none transition-all duration-300 ${
        isSelected ? "ring-2 ring-golden shadow-[0_0_25px_rgba(245,158,11,0.2)]" : "border-white/10"
      }`}
    >
      <div className="absolute inset-0 p-5 flex flex-col justify-between h-full z-10">
        
        {/* Top bar with location name */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1 bg-midnight/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
            <MapPin className="w-3.5 h-3.5 text-golden" />
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-300">
              {landmark.coordinates.lat.toFixed(3)}, {landmark.coordinates.lng.toFixed(3)}
            </span>
          </div>
          
          <button
            onClick={toggleDetails}
            className={`p-2 rounded-xl border transition-all ${
              isFlipped 
                ? "bg-golden text-midnight border-golden font-bold" 
                : "bg-white/5 border-white/10 hover:border-golden/50 text-golden"
            }`}
            title="Inspect Tech details"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* Center overlay details: Flipped view vs standard view */}
        <div className="flex-grow flex items-center justify-center py-4">
          {isFlipped ? (
            /* Developer technical JSON schema card overlay panel */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full p-4 rounded-xl bg-slate-950/90 border border-golden/20 overflow-y-auto font-mono text-left select-text"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <span className="text-[10px] uppercase tracking-widest text-golden font-bold">Metadata Schema</span>
                <span className="text-[9px] text-slate-500">PRISMA MODEL: LANDMARK</span>
              </div>
              <div className="text-[10px] leading-relaxed text-slate-300 space-y-1.5">
                <div><span className="text-pink-400">id:</span> <span className="text-emerald-400">"{landmark.id}"</span></div>
                <div><span className="text-pink-400">name:</span> <span className="text-emerald-400">"{landmark.name}"</span></div>
                <div><span className="text-pink-400">altitude:</span> <span className="text-amber-400">"{landmark.metadata.altitude}"</span></div>
                <div><span className="text-pink-400">best_season:</span> <span className="text-slate-400">"{landmark.metadata.bestTimeToVisit}"</span></div>
                <div><span className="text-pink-400">entrance_fee:</span> <span className="text-orange-300">"{landmark.metadata.entranceFee}"</span></div>
                <div><span className="text-pink-400">weather:</span> <span className="text-blue-400">"{landmark.metadata.weather}"</span></div>
                <div><span className="text-pink-400">rating:</span> <span className="text-yellow-400">{landmark.metadata.rating}</span></div>
                <div className="pt-2 border-t border-white/5 text-[9px] text-slate-500">
                  {"{"}
                  <div className="pl-4">"gps": {"{"}</div>
                  <div className="pl-8">"lat": {landmark.coordinates.lat},</div>
                  <div className="pl-8">"lng": {landmark.coordinates.lng}</div>
                  <div className="pl-4">{"}"}</div>
                  {"}"}
                </div>
              </div>
            </motion.div>
          ) : (
            // Simple visual Spacer to keep content centered
            <div className="h-full w-full pointer-events-none" />
          )}
        </div>

        {/* Bottom Area - Title & Tagline & Description */}
        {!isFlipped && (
          <div className="space-y-2 mt-auto">
            <div className="text-slate-400 text-xs tracking-wider uppercase font-sans font-semibold">
              {landmark.tagline}
            </div>
            <h3 className="text-2xl font-serif font-bold text-white tracking-wide group-hover:text-golden transition-colors">
              {landmark.name}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {landmark.description}
            </p>
            
            {/* Direct visual checklist row */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[10px] text-slate-400 font-mono">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-golden" />
                <span className="truncate">{landmark.metadata.bestTimeToVisit.split('(')[0]}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-golden" />
                <span className="truncate">{landmark.metadata.entranceFee.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        )}

        {isFlipped && (
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2 border-t border-white/15">
            <span>Schema verification: PASS</span>
            <button 
              onClick={toggleDetails}
              className="text-golden flex items-center gap-1 hover:underline"
            >
              Back to photo <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

      </div>

      {/* Main card background image (Ken Burns expand effect on hover) */}
      {!isFlipped && (
        <motion.div
          className="absolute inset-0 bg-cover bg-center -z-10 brightness-75 transition-transform duration-700"
          style={{
            backgroundImage: `url('${landmark.mainImage}')`,
          }}
          whileHover={{ scale: 1.08 }}
        />
      )}
      
      {/* Dark tint gradient covers to ensure extreme text legibility */}
      <div className={`absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20 transition-opacity duration-300 ${
        isFlipped ? "opacity-100" : "opacity-90"
      }`} />
    </motion.div>
  );
}
