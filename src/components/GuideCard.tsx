/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Guide } from "../types";
import { Award, Languages, DollarSign, Star, Calendar, ChevronDown, ChevronUp, Briefcase, ShieldCheck, Camera, MapPin } from "lucide-react";

interface GuideCardProps {
  key?: React.Key;
  guide: Guide;
  onRent: (guide: Guide) => void;
}

export default function GuideCard({ guide, onRent }: GuideCardProps) {
  const [showPortfolio, setShowPortfolio] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="glass-card rounded-2xl p-6 flex flex-col justify-between h-full relative overflow-hidden transition-all duration-300 border border-white/10 hover:border-golden/30 hover:bg-white/8 group"
    >
      {/* Decorative premium glow background effect on hover */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-golden/5 rounded-full blur-2xl group-hover:bg-golden/10 transition-all duration-300 pointer-events-none" />

      <div>
        {/* Profile and Active indicator */}
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <img
              src={guide.avatar}
              alt={guide.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10 group-hover:border-golden/40 transition-colors"
            />
            {/* Pulsing Active Now green dot or inactive dot */}
            {guide.isActiveNow ? (
              <span className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            ) : (
              <span className="absolute -bottom-1 -right-1 block h-3.5 w-3.5 rounded-full bg-slate-500 border-2 border-slate-950" />
            )}
          </div>

          <div className="text-right">
            {/* Pricing Tag */}
            <div className="flex items-baseline justify-end text-white">
              <span className="text-xs text-slate-400 font-mono mr-0.5">$</span>
              <span className="text-2xl font-bold text-golden tracking-tight">{guide.pricePerHour}</span>
              <span className="text-[10px] text-slate-400 font-mono ml-1">/ hr</span>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-1 justify-end text-xs text-amber-400 font-medium mt-1">
              <Star className="w-3.5 h-3.5 fill-golden text-golden" />
              <span>{guide.rating.toFixed(2)}</span>
              <span className="text-[10px] text-slate-500 font-normal">({guide.reviewCount} tours)</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2">
          {/* Location Badge */}
          <span className="inline-block text-[9px] font-mono tracking-widest uppercase text-golden bg-golden/10 border border-golden/20 px-2.5 py-0.5 rounded-md mb-1">
            {guide.location}
          </span>
          
          <h4 className="text-lg font-serif font-semibold text-white tracking-wide group-hover:text-golden transition-colors">
            {guide.name}
          </h4>
          
          <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-3">
            {guide.bio}
          </p>
        </div>

        {/* Tags Specialty */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {guide.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-sans font-medium text-slate-300 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer statistics and Action Call with premium shading layer */}
      <div className="mt-6 pt-4 border-t border-white/5 flex flex-col bg-slate-950/60 p-3.5 rounded-xl border border-white/5 shadow-inner">
        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono mb-3">
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-golden" />
            <span>{guide.experienceLevel} Exp</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-golden" />
            <span className="truncate">{guide.languages.slice(0, 2).join(", ")}</span>
          </div>
        </div>

        {/* Expand Portfolio Trigger button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowPortfolio(!showPortfolio);
          }}
          className="w-full py-1.5 mb-3 rounded-lg border border-white/5 bg-white/0 hover:bg-white/5 text-slate-400 hover:text-white transition-all text-[10px] font-mono flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>{showPortfolio ? "Hide Portfolio" : "Reveal Portfolio & Gear"}</span>
          {showPortfolio ? <ChevronUp className="w-3 h-3 text-golden" /> : <ChevronDown className="w-3 h-3 text-golden" />}
        </button>

        {/* Expandable portfolio block */}
        {showPortfolio && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="border-t border-white/5 pt-3 pb-2 space-y-3 text-left overflow-hidden text-xs"
          >
            {/* Portfolio Destinations */}
            {guide.portfolioDestinations && guide.portfolioDestinations.length > 0 && (
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-golden block flex items-center gap-1 font-semibold">
                  <MapPin className="w-3 h-3 text-golden" /> Historic Expedition Slates
                </span>
                <ul className="list-disc pl-4 text-[10px] text-slate-300 space-y-0.5">
                  {guide.portfolioDestinations.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            )}

            {/* Certifications */}
            {guide.certifications && guide.certifications.length > 0 && (
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-golden block flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified Credentials
                </span>
                <div className="text-[10px] text-slate-100 flex flex-wrap gap-1">
                  {guide.certifications.map((c, i) => (
                    <span key={i} className="bg-emerald-950/40 border border-emerald-500/25 px-1.5 py-0.5 rounded text-[9px] block">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specialty Equipment */}
            {guide.equipment && guide.equipment.length > 0 && (
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-golden block flex items-center gap-1 font-semibold">
                  <Briefcase className="w-3 h-3 text-golden" /> Special Gear Provided
                </span>
                <div className="space-y-1">
                  {guide.equipment.map((e, i) => (
                    <div key={i} className="text-[10px] leading-relaxed bg-slate-950/60 text-slate-300 p-1.5 rounded border border-white/5">
                      ⚙️ {e}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio Snaps Collage */}
            {guide.portfolioGallery && guide.portfolioGallery.length > 0 && (
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-golden block flex items-center gap-1 font-semibold">
                  <Camera className="w-3 h-3 text-golden" /> Expedition snaps gallery
                </span>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {guide.portfolioGallery.slice(0, 2).map((g, i) => (
                    <img
                      key={i}
                      src={g}
                      alt="Expedition snap"
                      className="w-full h-16 object-cover rounded-md border border-white/5 hover:border-golden/40 transition-all pointer-events-none"
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        <button
          onClick={() => onRent(guide)}
          className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:bg-gradient-to-r group-hover:from-jungle group-hover:to-emerald-950 group-hover:border-golden/50 text-white font-medium transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-golden" />
          <span>Rent This Curator</span>
        </button>
      </div>
    </motion.div>
  );
}
