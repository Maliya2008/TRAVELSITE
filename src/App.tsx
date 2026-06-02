/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Hero from "./components/Hero";
import LandmarkCard from "./components/LandmarkCard";
import GuideCard from "./components/GuideCard";
import MapSection from "./components/MapSection";
import AdminPortal from "./components/AdminPortal";
import BookingSlider from "./components/BookingSlider";
import { Landmark, Guide, Booking, SiteSettings } from "./types";
import { Compass, Sparkles, Search, RotateCcw, AlertCircle } from "lucide-react";

const defaultSettings: SiteSettings = {
  heroTitle: "CEYLONTA",
  heroSubtitle: "RESPLENDENT TOURISM IN THE INDIAN OCEAN",
  heroDescription: "Experience majestic UNESCO world heritage locations, misty tea estate valleys, and pristine tropical beaches alongside extraordinary local curators who tell Sri Lanka's deepest secrets.",
  heroBgImage: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1600&auto=format&fit=crop",
  heroBgImage2: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=1600&auto=format&fit=crop",
  heroBgImage3: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=1600&auto=format&fit=crop",
  heroBgImage4: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1600&auto=format&fit=crop",
  heroBgImage5: "https://images.unsplash.com/photo-1547989453-11e67ffb3885?q=80&w=1600&auto=format&fit=crop",
  heroBgFadeDuration: 1.2,
  heroBgBlur: 0,
  sectionOrder: ["landmarks-explore", "waypoint-map", "guides-marketplace"],
  footerHeightClass: "py-16",
  footerCopyright: "© 2026 CEYLONTA. ALL RIGHTS SECURED BY ROYAL COVENANT.",
  theme: "dark",
  allowFadingAnimations: true,
  scenicWondersBgImage: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=1600&auto=format&fit=crop",
  scenicWondersBgFilter: "brightness-30 blur-[2px]",
  curatorMarketplaceBgImage: "https://images.unsplash.com/photo-1563212885-3bc67b36f7da?q=80&w=1600&auto=format&fit=crop",
  curatorMarketplaceBgFilter: "brightness-25 blur-[2px]"
};

export default function App() {
  // Core CMS Settings & Domain States
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [selectedGuideForBooking, setSelectedGuideForBooking] = useState<Guide | null>(null);
  
  // Custom router state tracking path (e.g. / or /admin)
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // UI states
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingsCount, setBookingsCount] = useState(0);

  // Filter query parameters
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedTagFilter, setSelectedTagFilter] = useState("");

  // System latency metrics
  const [apiResponseTimeMs, setApiResponseTimeMs] = useState<number | null>(null);
  const [aiModelType, setAiModelType] = useState<"standard" | "gemini-3.5-flash">("gemini-3.5-flash");

  // Keep path synced with browser popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleNavigation = (path: string) => {
    window.history.pushState(null, "", path);
    setCurrentPath(path);
  };

  // Fetch Landmarks, Guides and Settings on component mount
  useEffect(() => {
    // 1. Fetch live CMS Settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setSettings(json.data);
        }
      })
      .catch((err) => console.error("Failed to load initial site settings:", err));

    // 2. Fetch standard landmarks
    fetch("/api/landmarks")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setLandmarks(json.data);
          // Focus first landmark as default
          if (json.data.length > 0) {
            setSelectedLandmark(json.data[0]);
          }
        }
      })
      .catch((err) => console.error("Failed to load Ceylon Landmarks:", err));

    // 3. Fetch Guides directory
    fetchGuides("", "");
    
    // 4. Fetch current bookings count on load
    fetch("/api/admin/bookings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setBookingsCount(json.data.length);
        }
      });
  }, []);

  // Set HTML theme class dynamically whenever settings change
  useEffect(() => {
    if (settings?.theme) {
      document.documentElement.classList.toggle("light", settings.theme === "light");
    }
  }, [settings?.theme]);

  // Whenever local filters change, fire API guides query
  useEffect(() => {
    fetchGuides(locationFilter, selectedTagFilter);
  }, [locationFilter, selectedTagFilter]);

  const fetchGuides = (loc: string, tag: string) => {
    const start = Date.now();
    let queryUrl = "/api/guides";
    const params = new URLSearchParams();
    
    if (loc) params.append("location", loc);
    if (tag) params.append("tag", tag);
    
    if (params.toString()) {
      queryUrl += `?${params.toString()}`;
    }

    fetch(queryUrl)
      .then((res) => res.json())
      .then((json) => {
        const responseDuration = Date.now() - start;
        setApiResponseTimeMs(responseDuration);

        if (json.success) {
          setGuides(json.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch guides proximity:", err);
      });
  };

  const handleLandmarkSelect = (landmark: Landmark) => {
    setSelectedLandmark(landmark);
    // Align map proximity filtering: automatically set location filter to match landmark location
    let mapLocName = "Colombo";
    if (landmark.id === "sigiriya") mapLocName = "Sigiriya";
    if (landmark.id === "nine-arch") mapLocName = "Ella";
    if (landmark.id === "kandy-temple") mapLocName = "Kandy";
    if (landmark.id === "galle-fort") mapLocName = "Galle Fort";
    
    setLocationFilter(mapLocName);
  };

  const handleRentTrigger = (guide: Guide) => {
    setSelectedGuideForBooking(guide);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = (booking: Booking, performanceMs: number) => {
    setApiResponseTimeMs(performanceMs);
    setBookingsCount((prev) => prev + 1);
  };

  const handleResetFilters = () => {
    setLocationFilter("");
    setSelectedTagFilter("");
  };

  const handleThemeToggle = () => {
    const nextTheme = settings.theme === "light" ? "dark" : "light";
    const updated = { ...settings, theme: nextTheme };
    
    // Toggle state immediately
    setSettings(updated);

    // Persist preferred theme to backend
    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    }).then(async (res) => {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (!data.success) {
          console.error("Failed to persist theme settings:", data.error);
        }
      }
    }).catch(err => console.error("Error setting custom theme preference:", err));
  };

  // Pre-compiled list of specialist tags for Ceylon guides
  const availableSpecialistTags = [
    "Wildlife Expert",
    "History Guide",
    "Hiking Specialist",
    "Cultural Expert",
    "Safari Specialist"
  ];

  if (currentPath.includes("/admin")) {
    return (
      <AdminPortal
        settings={settings || defaultSettings}
        onUpdateSettings={setSettings}
        landmarks={landmarks}
        onUpdateLandmarks={setLandmarks}
        guides={guides}
        onUpdateGuides={setGuides}
        selectedLandmark={selectedLandmark}
        apiResponseTimeMs={apiResponseTimeMs}
        aiModelType={aiModelType}
        onModelChange={setAiModelType}
        onNavigateHome={() => handleNavigation("/")}
      />
    );
  }

  return (
    <Layout
      onOpenConsole={() => handleNavigation("/admin")}
      bookingCount={bookingsCount}
      settings={settings || defaultSettings}
      onThemeToggle={handleThemeToggle}
    >
      {/* 1. Dynamic Hero Section */}
      <Hero settings={settings || defaultSettings} />

      {/* Main content bounds ordered dynamically via local settings configuration */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-24">

        {(settings.sectionOrder || defaultSettings.sectionOrder).map((sectionId) => {
          
          // Case A: Landmark Carousel Section
          if (sectionId === "landmarks-explore") {
            const bgImage = settings.scenicWondersBgImage || defaultSettings.scenicWondersBgImage;
            const filterClass = settings.scenicWondersBgFilter || defaultSettings.scenicWondersBgFilter;
            return (
              <section 
                key={sectionId} 
                id="landmarks-explore" 
                className="space-y-8 text-left scroll-mt-24 relative p-6 md:p-10 rounded-3xl border border-white/5 overflow-hidden group/scenic"
              >
                {/* Background Shaded Image Layer with dynamic effects */}
                {bgImage && (
                  <div className="absolute inset-0 -z-20 w-full h-full overflow-hidden">
                    <img 
                      src={bgImage} 
                      alt="Scenic Wonders Ambient Backdrop" 
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover transition-all duration-700 ${filterClass}`}
                    />
                    {/* Shadow Layer overlay representing high-end aesthetic styling */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/60" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-slate-950/90" />
                  </div>
                )}

                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-2 h-16 bg-gradient-to-b from-golden to-transparent rounded-r" />

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-golden font-mono font-semibold flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-golden" /> Majestic Havens of Ceylon
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif font-semibold text-white">
                      Scenic <span className="italic font-light text-golden">Wonders</span>
                    </h2>
                    <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
                      Unlock ancient palaces carved in stone, misty highlands, and tea elevations. Press the upper-right configuration icon to adjust parameters or add locations instantly.
                    </p>
                  </div>
                  
                  {selectedLandmark && (
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-[10px] text-slate-400 backdrop-blur-md">
                      <Compass className="w-3.5 h-3.5 text-golden" />
                      <span>Inspecting:</span>
                      <span className="text-white font-bold">{selectedLandmark.name}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                  {landmarks.map((l) => (
                    <LandmarkCard
                      key={l.id}
                      landmark={l}
                      isSelected={selectedLandmark?.id === l.id}
                      onSelect={handleLandmarkSelect}
                    />
                  ))}
                </div>
              </section>
            );
          }

          // Case B: Interactive projection map waypoint
          if (sectionId === "waypoint-map") {
            return (
              <section key={sectionId} id="waypoint-map" className="scroll-mt-24">
                <MapSection
                  landmarks={landmarks}
                  selectedLandmark={selectedLandmark}
                  onSelectLandmark={handleLandmarkSelect}
                  onLocationFilter={(loc) => setLocationFilter(loc)}
                />
              </section>
            );
          }

          // Case C: Tour Guide Curators Marketplace list
          if (sectionId === "guides-marketplace") {
            const bgImage = settings.curatorMarketplaceBgImage || defaultSettings.curatorMarketplaceBgImage;
            const filterClass = settings.curatorMarketplaceBgFilter || defaultSettings.curatorMarketplaceBgFilter;
            return (
              <section 
                key={sectionId} 
                id="guides-marketplace" 
                className="space-y-8 text-left scroll-mt-24 relative p-6 md:p-10 rounded-3xl border border-white/5 overflow-hidden group/curator"
              >
                {/* Background Shaded Image Layer with dynamic effects */}
                {bgImage && (
                  <div className="absolute inset-0 -z-20 w-full h-full overflow-hidden">
                    <img 
                      src={bgImage} 
                      alt="Curators Marketplace Ambient Backdrop" 
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover transition-all duration-700 ${filterClass}`}
                    />
                    {/* Shadow Layer overlay representing high-end aesthetic styling */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/60" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-slate-950/90" />
                  </div>
                )}

                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-2 h-16 bg-gradient-to-b from-emerald-500 to-transparent rounded-l" />

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6 relative z-10">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-golden font-mono font-semibold flex items-center gap-1.5 mb-1.5">
                      <Compass className="w-3.5 h-3.5 text-golden" /> Proximity Mapping & Expert Listings
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif font-semibold text-white">
                      Curator <span className="italic font-light text-golden">Marketplace</span>
                    </h2>
                    <p className="text-sm text-slate-405 mt-2 max-w-2xl leading-relaxed text-slate-300">
                      Connect with highly distinguished private tour specialists. Click on landmarks above or use custom localization tags below to verify precise guides matching regional parameters.
                    </p>
                  </div>

                  <div className="text-xs font-mono text-slate-400 flex items-center gap-2 relative z-10">
                    <span className="p-1.5 rounded bg-slate-950/60 border border-white/10 text-golden font-bold">{guides.length} matches</span>
                    <span>Available Specialists</span>
                  </div>
                </div>

                {/* Core filter row */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/60 backdrop-blur-md p-4 rounded-2xl border border-white/5 relative z-10">
                  <div className="flex flex-wrap items-center gap-4 flex-grow max-w-4xl">
                    
                    <div className="relative min-w-[200px] flex-grow md:flex-none">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Filter by city (e.g. Ella, Sigiriya...)"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="w-full bg-slate-900/95 border border-white/10 focus:border-golden/40 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mr-1.5 hidden sm:inline font-bold">
                        Specialty:
                      </span>
                      {availableSpecialistTags.map((tag) => {
                        const isActive = selectedTagFilter === tag;
                        return (
                          <button
                            key={tag}
                            onClick={() => setSelectedTagFilter(isActive ? "" : tag)}
                            className={`text-[10px] font-mono px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                              isActive
                                ? "bg-golden text-midnight border-golden font-bold"
                                : "bg-slate-900/80 border-white/5 text-slate-300 hover:border-white/10"
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {(locationFilter || selectedTagFilter) && (
                    <button
                      onClick={handleResetFilters}
                      className="text-xs text-golden hover:text-amber-300 font-mono flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/60 border border-white/10 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-golden" />
                      <span>Reset Parameters</span>
                    </button>
                  )}
                </div>

                {/* Guides displaying grid */}
                {guides.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {guides.map((g) => (
                      <GuideCard
                        key={g.id}
                        guide={g}
                        onRent={handleRentTrigger}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-slate-950/60 border border-dashed border-white/5 rounded-2xl max-w-lg mx-auto space-y-3 relative z-10">
                    <AlertCircle className="w-8 h-8 text-golden mx-auto animate-pulse" />
                    <h4 className="text-base font-bold text-white uppercase tracking-wide">
                      No Guides Match Filtering
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Currently, no curators match location <span className="text-white font-semibold">"{locationFilter || "Any"}"</span> and tag specialty <span className="text-white font-semibold">"{selectedTagFilter || "Any"}"</span>.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 rounded-lg bg-golden text-midnight text-xs font-semibold hover:bg-amber-500 transition-all cursor-pointer"
                    >
                      Restore Core Listings
                    </button>
                  </div>
                )}
              </section>
            );
          }

          return null;
        })}

      </div>

      {/* Sliding booking configuration slider */}
      <BookingSlider
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        guide={selectedGuideForBooking}
        onBookingSuccess={handleBookingSuccess}
      />

    </Layout>
  );
}
