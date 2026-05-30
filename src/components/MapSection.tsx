/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Landmark } from "../types";
import { MapPin, Compass, Navigation, Info, Layers } from "lucide-react";

interface MapSectionProps {
  landmarks: Landmark[];
  selectedLandmark: Landmark | null;
  onSelectLandmark: (landmark: Landmark) => void;
  onLocationFilter: (location: string) => void;
}

export default function MapSection({
  landmarks,
  selectedLandmark,
  onSelectLandmark,
  onLocationFilter
}: MapSectionProps) {

  // Coordinates mapping representing geographic points mapped to the SVG viewBox [0, 0, 440, 600]
  const mapNodes = [
    {
      id: "colombo",
      name: "Colombo",
      isMajorlandmark: false,
      tag: "Capital City",
      x: 105,
      y: 435, // West coast
      guidesLocationName: "Colombo"
    },
    {
      id: "sigiriya",
      name: "Sigiriya Lion Rock",
      isMajorlandmark: true,
      tag: "Monuments",
      x: 235,
      y: 310, // North-Central
      landmarkId: "sigiriya",
      guidesLocationName: "Sigiriya"
    },
    {
      id: "kandy-temple",
      name: "Kandy Temple",
      isMajorlandmark: true,
      tag: "Spiritual Holy",
      x: 220,
      y: 405, // Central Hills
      landmarkId: "kandy-temple",
      guidesLocationName: "Kandy"
    },
    {
      id: "nine-arch",
      name: "Ella Bridge",
      isMajorlandmark: true,
      tag: "Ella Tea Trails",
      x: 285,
      y: 450, // Southeast Hills
      landmarkId: "nine-arch",
      guidesLocationName: "Ella"
    },
    {
      id: "galle-fort",
      name: "Galle Fort",
      isMajorlandmark: true,
      tag: "Sea Ramparts",
      x: 145,
      y: 545, // South coast
      landmarkId: "galle-fort",
      guidesLocationName: "Galle Fort"
    }
  ];

  const handleNodeClick = (node: typeof mapNodes[0]) => {
    // If it maps to a landmark, trigger landmark selection
    if (node.isMajorlandmark && node.landmarkId) {
      const match = landmarks.find(l => l.id === node.landmarkId);
      if (match) {
        onSelectLandmark(match);
      }
    }
    // Filter guides marketplace
    onLocationFilter(node.guidesLocationName);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950/40 p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden" id="interactive-map-sec">
      {/* Absolute grid vector patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 -z-10" />

      {/* Map Control Console Details (Left Column) */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-golden font-mono font-semibold flex items-center gap-2">
            <Compass className="w-3.5 h-3.5" /> Cartesian Mapping
          </span>
          <h3 className="text-3xl md:text-4xl font-serif font-regular text-white mt-1.5">
            Interactive <span className="italic text-golden font-light">Expedition</span> Chart
          </h3>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Sri Lanka’s teardrop geometry charted inside a dark premium digital canvas. Click any waypoint to realign your GPS focusing, filter on-site private curators, and explore heritage metrics instantly.
          </p>
        </div>

        {/* Selected Landmark Snapshot details */}
        <div className="glass-card rounded-2xl p-5 border border-white/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-jungle/5 rounded-full blur-xl" />
          
          <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-golden" /> Expedient Context
          </h4>
          
          {selectedLandmark ? (
            <div className="space-y-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-golden tracking-wider font-semibold">
                  {selectedLandmark.tagline}
                </span>
                <h5 className="text-lg font-serif font-bold text-white mt-0.5">
                  {selectedLandmark.name}
                </h5>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {selectedLandmark.description}
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5 text-[10px] font-mono text-slate-400">
                <div>
                  <span className="text-slate-500 block">ALTITUDE</span>
                  <span className="text-white mt-0.5 font-medium block truncate">
                    {selectedLandmark.metadata.altitude}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">WEATHER</span>
                  <span className="text-white mt-0.5 font-medium block truncate">
                    {selectedLandmark.metadata.weather}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500 italic py-6 text-center">
              Tap any celestial coordinates or map pins to calibrate focal view.
            </div>
          )}
        </div>

        {/* Mapbox placeholder indicator disclaimer explicitly written */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-400">
          <Layers className="w-4 h-4 text-golden mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold text-white block mb-0.5">Premium Mapbox Overlay Configured</span>
            Sandbox uses our custom interactive responsive Vector-GPS projection rendering. Live Mapbox Studio layers bind directly with custom tokens (manageable inside setting environmental properties).
          </div>
        </div>
      </div>

      {/* Vector Responsive Animated Map of Sri Lanka (Right Column) */}
      <div className="lg:col-span-7 flex justify-center items-center">
        <div className="relative w-full max-w-[400px] h-full flex justify-center bg-slate-950/25 p-4 rounded-3xl border border-white/5">
          
          {/* Main Map SVG projection */}
          <svg
            viewBox="0 0 320 600"
            className="w-full h-auto text-slate-700 max-h-[500px]"
            style={{ filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.6))" }}
          >
            {/* Sri Lanka teardrop outline mesh representation paths */}
            <g id="srilanka-coastal-outline" className="opacity-80">
              <path
                d="M170,80 Q175,60 160,50 Q150,45 135,62 Q120,77 125,85 Q130,93 115,100 T100,120 Q95,145 105,170 T102,230 Q92,270 95,330 T105,430 Q110,470 120,510 T140,555 Q145,565 158,565 Q178,565 190,550 T220,515 Q240,490 248,460 T255,380 Q258,320 252,280 T240,200 Q235,160 215,130 T185,105 Z"
                fill="rgba(6, 78, 59, 0.08)"
                stroke="rgba(6, 78, 59, 0.4)"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="transition-all duration-700"
              />
              {/* Inner stylized filled contour */}
              <path
                d="M170,80 Q175,60 160,50 Q150,45 135,62 Q120,77 125,85 Q130,93 115,100 T100,120 Q95,145 105,170 T102,230 Q92,270 95,330 T105,430 Q110,470 120,510 T140,555 Q145,565 158,565 Q178,565 190,550 T220,515 Q240,490 248,460 T255,380 Q258,320 252,280 T240,200 Q235,160 215,130 T185,105 Z"
                fill="none"
                stroke="rgba(245, 158, 11, 0.1)"
                strokeWidth="1"
              />
            </g>

            {/* Connecting Trade Routes & Cultural Trails Lines */}
            <g id="cultural-connection-lines" className="opacity-40">
              {/* Colombo to Kandy */}
              <motion.line
                x1={105} y1={435} x2={220} y2={405}
                stroke="rgba(245, 158, 11, 0.3)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Kandy to Sigiriya */}
              <motion.line
                x1={220} y1={405} x2={235} y2={310}
                stroke="rgba(245, 158, 11, 0.3)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Kandy to Ella */}
              <motion.line
                x1={220} y1={405} x2={285} y2={450}
                stroke="rgba(245, 158, 11, 0.3)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Colombo to Galle */}
              <motion.line
                x1={105} y1={435} x2={145} y2={545}
                stroke="rgba(245, 158, 11, 0.3)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            </g>

            {/* Glowing Map Waypoint Nodes */}
            {mapNodes.map((node) => {
              const isSelectedNode = 
                (node.isMajorlandmark && selectedLandmark?.id === node.landmarkId) || 
                (!node.isMajorlandmark && node.id === "colombo");

              return (
                <g
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  className="cursor-pointer group"
                >
                  {/* Outer Pulsing Glow */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelectedNode ? 14 : 7}
                    fill={node.isMajorlandmark ? "rgba(245, 158, 11, 0.15)" : "rgba(6, 78, 59, 0.3)"}
                    className={isSelectedNode ? "animate-pulse" : "group-hover:scale-125 transition-transform"}
                  />
                  
                  {/* Outer Core point border */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelectedNode ? 7 : 4}
                    fill={node.isMajorlandmark ? "#F59E0B" : "#059669"}
                    stroke="#020617"
                    strokeWidth="1.5"
                    className="transition-all duration-300"
                  />

                  {/* Hotspot Hover Click Area */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={18}
                    fill="transparent"
                  />

                  {/* Node Label tooltip */}
                  <text
                    x={node.x + 10}
                    y={node.y + 4}
                    fill={isSelectedNode ? "#F59E0B" : "#e2e8f0"}
                    fontSize={isSelectedNode ? "11" : "9"}
                    fontWeight={isSelectedNode ? "bold" : "normal"}
                    fontFamily="var(--font-sans)"
                    className="select-none font-medium text-slate-200 pointer-events-none drop-shadow-md"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Compass Rose icon details */}
          <div className="absolute top-4 left-4 bg-slate-950/80 p-2.5 rounded-xl border border-white/5 text-[10px] font-mono flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-golden" />
            <div>
              <span className="text-white block font-bold">ORIENTAL PROJECTION</span>
              <span className="text-slate-500 block">SCALE 1 : 2,400,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
