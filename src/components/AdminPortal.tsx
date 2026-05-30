/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sliders, Compass, Mail, Lock, Server, Bot, Send, CheckCircle, 
  Trash2, Plus, ArrowUp, ArrowDown, Image, MapPin, 
  UserPlus, ShieldCheck, LogOut, ArrowLeft, Loader2, AlertCircle, Sparkles
} from "lucide-react";
import { Landmark, Guide, SiteSettings } from "../types";

interface AdminPortalProps {
  settings: SiteSettings;
  onUpdateSettings: (newSettings: SiteSettings) => void;
  landmarks: Landmark[];
  onUpdateLandmarks: (newList: Landmark[]) => void;
  guides: Guide[];
  onUpdateGuides: (newList: Guide[]) => void;
  selectedLandmark: Landmark | null;
  apiResponseTimeMs: number | null;
  aiModelType: "standard" | "gemini-3.5-flash";
  onModelChange: (model: "standard" | "gemini-3.5-flash") => void;
  onNavigateHome: () => void;
}

export default function AdminPortal({
  settings,
  onUpdateSettings,
  landmarks,
  onUpdateLandmarks,
  guides,
  onUpdateGuides,
  selectedLandmark,
  apiResponseTimeMs,
  aiModelType,
  onModelChange,
  onNavigateHome
}: AdminPortalProps) {
  // Authentication states
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Dashboard Tab states
  const [activeTab, setActiveTab] = useState<"settings" | "landmarks" | "curators" | "gemini">("settings");

  // AI chatbot
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; content: string }>>([
    { sender: "ai", content: "Ayubowan! I am Ariya, your AI Guide Companion. Feel free to ask me anything about Ceylon's cultural landmarks and curation settings inside your admin space." }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Local state forms for Landmark creation
  const [placeName, setPlaceName] = useState("");
  const [placeTagline, setPlaceTagline] = useState("");
  const [placeDesc, setPlaceDesc] = useState("");
  const [placeLat, setPlaceLat] = useState("7.2906");
  const [placeLng, setPlaceLng] = useState("80.6337");
  const [placeImage, setPlaceImage] = useState("");
  const [placeAltitude, setPlaceAltitude] = useState("450m above sea level");
  const [placeHours, setPlaceHours] = useState("6:00 AM for sunrise climb");
  const [placeFee, setPlaceFee] = useState("$15 USD");
  const [placeWeather, setPlaceWeather] = useState("Warm & Tropical, 26°C");

  // Local state forms for Guide Curator creation
  const [guideName, setGuideName] = useState("");
  const [guideBio, setGuideBio] = useState("");
  const [guideRate, setGuideRate] = useState("25");
  const [guideLocation, setGuideLocation] = useState("Sigiriya");
  const [guideExp, setGuideExp] = useState("5 Years");
  const [guideAvatar, setGuideAvatar] = useState("");
  const [guideLanguages, setGuideLanguages] = useState("English, Sinhala");
  const [guideTags, setGuideTags] = useState("Wildlife Expert, Safari Specialist");
  const [guidePortfolioPlaces, setGuidePortfolioPlaces] = useState("Yala National Park, Sinharaja");
  const [guideLicenses, setGuideLicenses] = useState("SLTDA Registered Guide Code: 20120");
  const [guideGear, setGuideGear] = useState("Safety GPS locator, Emergency shelter");
  const [guidePortfolioGallery, setGuidePortfolioGallery] = useState("");

  // Load webhook logs on mount/auth success and tab transition
  useEffect(() => {
    // Session token check
    const token = localStorage.getItem("ceylon_admin_token");
    if (token === "ceylon-immerse-royal-secure-session-v1") {
      setIsAuthorized(true);
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setAuthLoading(true);
    setAuthError("");

    try {
      const resp = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await resp.json();

      if (resp.ok && data.success) {
        localStorage.setItem("ceylon_admin_token", data.token);
        setIsAuthorized(true);
      } else {
        setAuthError(data.error || "Login Failed. Invalid Credentials.");
      }
    } catch (err: any) {
      setAuthError("Failed to connect to the ceylonta auth server.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ceylon_admin_token");
    setIsAuthorized(false);
    setEmail("");
    setPassword("");
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiLoading) return;

    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", content: userMsg }]);
    setChatInput("");
    setIsAiLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMsg }],
          landmarkContext: selectedLandmark
        })
      });
      const data = await response.json();
      if (data.success) {
        setChatMessages((prev) => [...prev, { sender: "ai", content: data.text }]);
      } else {
        setChatMessages((prev) => [...prev, { sender: "ai", content: `Companion error: ${data.error}` }]);
      }
    } catch (err: any) {
      setChatMessages((prev) => [...prev, { sender: "ai", content: `Connection lost: ${err.message}` }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const saveSettings = async (updated: SiteSettings) => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      const json = await res.json();
      if (json.success) {
        onUpdateSettings(json.data);
      }
    } catch (err) {
      console.error("Failed to persist site settings:", err);
    }
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const arr = [...(settings.sectionOrder || ["landmarks-explore", "waypoint-map", "guides-marketplace"])];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= arr.length) return;

    const temp = arr[index];
    arr[index] = arr[targetIdx];
    arr[targetIdx] = temp;

    saveSettings({ ...settings, sectionOrder: arr });
  };

  const handleAddLandmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeName || !placeDesc) return;

    try {
      const resp = await fetch("/api/landmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: placeName,
          tagline: placeTagline,
          description: placeDesc,
          coordinates: { lat: parseFloat(placeLat), lng: parseFloat(placeLng) },
          mainImage: placeImage || "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=600",
          metadata: {
            altitude: placeAltitude,
            bestTimeToVisit: placeHours,
            entranceFee: placeFee,
            weather: placeWeather,
            rating: 4.9
          }
        })
      });
      const data = await resp.json();
      if (data.success) {
        const fresh = await fetch("/api/landmarks").then(r => r.json());
        if (fresh.success) onUpdateLandmarks(fresh.data);
        
        setPlaceName("");
        setPlaceTagline("");
        setPlaceDesc("");
        setPlaceImage("");
      }
    } catch (err) {
      alert("Failed to insert landmark destination.");
    }
  };

  const handleDeleteLandmark = async (id: string) => {
    try {
      const resp = await fetch(`/api/landmarks/${id}`, { method: "DELETE" });
      const data = await resp.json();
      if (data.success) {
        const fresh = await fetch("/api/landmarks").then(r => r.json());
        if (fresh.success) onUpdateLandmarks(fresh.data);
      }
    } catch (err) {
      console.error("Failed to erase landmark:", err);
    }
  };

  const handleAddGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideName || !guideBio || !guideRate) return;

    try {
      const resp = await fetch("/api/guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: guideName,
          bio: guideBio,
          pricePerHour: parseFloat(guideRate),
          location: guideLocation,
          experienceLevel: guideExp,
          avatar: guideAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400",
          languages: guideLanguages.split(",").map(itm => itm.trim()),
          tags: guideTags.split(",").map(itm => itm.trim()),
          portfolioDestinations: guidePortfolioPlaces.split(",").map(itm => itm.trim()),
          certifications: guideLicenses.split(",").map(itm => itm.trim()),
          equipment: guideGear.split(",").map(itm => itm.trim()),
          portfolioGallery: guidePortfolioGallery ? guidePortfolioGallery.split(",").map(itm => itm.trim()) : [
            "https://images.unsplash.com/photo-1456926631375-92c8ce872def?q=80&w=400"
          ]
        })
      });
      const data = await resp.json();
      if (data.success) {
        const fresh = await fetch("/api/guides").then(r => r.json());
        if (fresh.success) onUpdateGuides(fresh.data);

        setGuideName("");
        setGuideBio("");
        setGuideRate("25");
        setGuideAvatar("");
        setGuidePortfolioGallery("");
      }
    } catch (err) {
      alert("Error saving curator record.");
    }
  };

  const handleDeleteGuide = async (id: string) => {
    try {
      const resp = await fetch(`/api/guides/${id}`, { method: "DELETE" });
      const data = await resp.json();
      if (data.success) {
        const fresh = await fetch("/api/guides").then(r => r.json());
        if (fresh.success) onUpdateGuides(fresh.data);
      }
    } catch (err) {
      console.error("Retirement transaction failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* RENDER STAGE 1: LOGIN PORTAL */}
      {!isAuthorized ? (
        <div className="flex-grow flex items-center justify-center p-6 md:p-12">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden text-left"
          >
            {/* Elegant corner motif */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-golden/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex flex-col items-center mb-8">
              <div 
                onClick={onNavigateHome}
                className="mb-4 p-3 rounded-2xl bg-gradient-to-br from-emerald-950 to-slate-900 border border-white/10 text-golden hover:border-golden/40 transition-colors duration-300 cursor-pointer flex items-center justify-center group"
                title="Go Back Home"
                id="login-home-btn"
              >
                <Compass className="w-8 h-8 text-golden group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <h1 className="text-xl md:text-2xl font-serif text-white uppercase tracking-widest text-center font-bold">
                CEYLON IMMERSE
              </h1>
              <span className="text-[10px] font-mono tracking-[0.25em] text-golden uppercase mt-1">
                Royal Admin Portal
              </span>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {authError && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3.5 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </motion.div>
              )}

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5 font-bold">
                  Credentials Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 focus:border-golden/60 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5 font-bold">
                  Security Passcode
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 focus:border-golden/60 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 rounded-xl bg-golden hover:bg-amber-500 text-midnight font-bold tracking-widest text-xs uppercase transition-all shadow-[0_4px_20px_rgba(245,158,11,0.15)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  id="auth-submit-btn"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-midnight" />
                      <span>Verifying Seal...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-midnight" />
                      <span>Request Entry</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 border-t border-white/5 pt-5 text-center">
              <button 
                onClick={onNavigateHome}
                className="text-xs text-slate-400 hover:text-golden transition-colors inline-flex items-center gap-1.5 font-mono cursor-pointer"
                id="back-home-anchor"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Isle</span>
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        /* RENDER STAGE 2: ADMINISTRATIVE WIDESCREEN CMS WORKSPACE */
        <div className="flex-grow flex flex-col p-4 md:p-8">
          
          {/* Header Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-slate-900 border border-white/10 rounded-2xl mb-6 shadow-md text-left">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-golden/10 border border-golden/30">
                <Sliders className="w-5 h-5 text-golden" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-white uppercase tracking-widest font-mono">
                    Ceylon Royal Workspace
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    Secure Connected
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Widescreen Content CMS & Digital Expedition Controls
                </p>
              </div>
            </div>

            {/* Micro Latencies */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10px]">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 border border-white/5 rounded-xl">
                <Server className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-slate-500 block text-[8px] leading-none">NODE STACK</span>
                  <span className="text-emerald-400 font-bold block mt-0.5">ceylon.mm/admin</span>
                </div>
              </div>

              {apiResponseTimeMs !== null && (
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 border border-white/5 rounded-xl">
                  <Sliders className="w-3.5 h-3.5 text-golden shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[8px] leading-none">LATENCY</span>
                    <span className="text-white font-bold block mt-0.5">{apiResponseTimeMs}ms (Live)</span>
                  </div>
                </div>
              )}

              <button
                onClick={onNavigateHome}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-white/10 rounded-xl transition-all text-xs font-sans font-medium cursor-pointer"
                id="workspace-home-btn"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>View Public Site</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-950/20 hover:bg-rose-950/50 text-rose-300 hover:text-rose-250 border border-rose-900/30 hover:border-rose-500/40 rounded-xl transition-all text-xs font-sans font-medium cursor-pointer"
                id="workspace-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Portal</span>
              </button>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-900 border border-white/10 rounded-xl p-1 mb-6 font-mono text-[11px] text-slate-400 gap-1 text-center">
            {[
              { id: "settings", label: "Global Settings" },
              { id: "landmarks", label: "Places & Landmarks" },
              { id: "curators", label: "Tour Curators" },
              { id: "gemini", label: "AI Travel Companion" }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2.5 px-2 rounded-lg transition-all cursor-pointer font-bold ${
                    isActive 
                      ? "bg-golden text-midnight shadow-[0_2px_8px_rgba(245,158,11,0.2)] font-bold text-midnight" 
                      : "hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Workspace Panels Grid */}
          <div className="flex-grow text-left">
            
            {/* 1. SECTOR: GLOBAL CMS */}
            {activeTab === "settings" && (
              <div className="grid grid-cols-1 gap-6">
                
                {/* Cover & Titles Column */}
                <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-golden)] block border-b border-white/5 pb-2 font-bold text-golden">
                    Main Hero Cover Config
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 block mb-1 font-bold uppercase">Display Title Text</label>
                        <input
                          type="text"
                          value={settings.heroTitle}
                          onChange={(e) => saveSettings({ ...settings, heroTitle: e.target.value })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-golden transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-slate-400 block mb-1 font-bold uppercase">Golden Subtitle Caption</label>
                        <input
                          type="text"
                          value={settings.heroSubtitle}
                          onChange={(e) => saveSettings({ ...settings, heroSubtitle: e.target.value })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-golden transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-slate-400 block mb-1 font-bold uppercase">Cover Backdrop Image 1 URL</label>
                          <input
                            type="text"
                            value={settings.heroBgImage}
                            onChange={(e) => saveSettings({ ...settings, heroBgImage: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-[11px] text-slate-300 focus:outline-none focus:border-golden font-mono transition-all"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-slate-400 block mb-1 font-bold uppercase">Cover Backdrop Image 2 URL</label>
                          <input
                            type="text"
                            value={settings.heroBgImage2 || ""}
                            onChange={(e) => saveSettings({ ...settings, heroBgImage2: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-[11px] text-slate-300 focus:outline-none focus:border-golden font-mono transition-all"
                            placeholder="Optional second scenic slide"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 block mb-1">Atmosphere Narrative Block</label>
                        <textarea
                          rows={4}
                          value={settings.heroDescription}
                          onChange={(e) => saveSettings({ ...settings, heroDescription: e.target.value })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-golden block resize-none transition-all leading-normal"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-slate-400 block mb-1">Fade (Sec)</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="5"
                            value={settings.heroBgFadeDuration}
                            onChange={(e) => saveSettings({ ...settings, heroBgFadeDuration: parseFloat(e.target.value) })}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-slate-400 block mb-1">Blur Pixels</label>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={settings.heroBgBlur}
                            onChange={(e) => saveSettings({ ...settings, heroBgBlur: parseInt(e.target.value) })}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Arrange and Footer Settings */}
                <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl lg:col-span-2 space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block border-b border-white/5 pb-2 font-bold">
                    Ceylon Layout Navigation Structure
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Arrangement Flow: Shift relative weights to swap segment grids instantly.
                      </p>
                      <div className="space-y-2">
                        {(settings.sectionOrder || ["landmarks-explore", "waypoint-map", "guides-marketplace"]).map((sectionId, index) => (
                          <div 
                            key={sectionId} 
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-white/5 font-mono text-xs"
                          >
                            <span className="text-white capitalize font-medium">{sectionId.replace("-", " ")}</span>
                            <div className="flex gap-1">
                              <button
                                disabled={index === 0}
                                onClick={() => handleMoveSection(index, "up")}
                                className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={index === (settings.sectionOrder || []).length - 1}
                                onClick={() => handleMoveSection(index, "down")}
                                className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 block mb-1">Footer Height Class</label>
                        <select
                          value={settings.footerHeightClass}
                          onChange={(e) => saveSettings({ ...settings, footerHeightClass: e.target.value })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
                        >
                          <option value="py-12">py-12 (Compact Height)</option>
                          <option value="py-16">py-16 (Standard Height)</option>
                          <option value="py-24">py-24 (Generous Height)</option>
                          <option value="py-32">py-32 (Cathedral Height)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-slate-400 block mb-1">Active Visual Theme Mode</label>
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                          <button
                            onClick={() => saveSettings({ ...settings, theme: "light" })}
                            className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                              settings.theme === "light" 
                                ? "bg-white text-slate-950 border-white" 
                                : "bg-white/5 text-slate-400 border-transparent hover:border-white/10"
                            }`}
                          >
                            Royal Light
                          </button>
                          <button
                            onClick={() => saveSettings({ ...settings, theme: "dark" })}
                            className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                              settings.theme === "dark" 
                                ? "bg-white text-slate-950 border-white" 
                                : "bg-white/5 text-slate-400 border-transparent hover:border-white/10"
                            }`}
                          >
                            Cosmic Dark
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl lg:col-span-3 space-y-3">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    Footer Copyright Covenant Seal
                  </label>
                  <input
                    type="text"
                    value={settings.footerCopyright}
                    onChange={(e) => saveSettings({ ...settings, footerCopyright: e.target.value })}
                    className="w-full max-w-4xl bg-slate-950 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-golden text-white"
                  />
                </div>

              </div>
            )}

            {/* 2. SECTOR: LANDMARKS LIST & CRUD */}
            {activeTab === "landmarks" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Destinations registry list */}
                <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl lg:col-span-1 space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block border-b border-white/5 pb-2 font-bold">
                    Active Regional Places ({landmarks.length})
                  </span>

                  <div className="divide-y divide-white/5 space-y-3 overflow-y-auto max-h-[500px] pr-2">
                    {landmarks.map((landmark) => (
                      <div key={landmark.id} className="flex items-center justify-between pt-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={landmark.mainImage} 
                            alt={landmark.name} 
                            className="w-10 h-10 rounded-xl object-cover border border-white/15 shrink-0" 
                          />
                          <div className="text-left">
                            <span className="text-xs text-white font-bold block">{landmark.name}</span>
                            <span className="text-[9px] font-mono text-slate-500 uppercase block mt-0.5">
                              {landmark.id} · {landmark.metadata.altitude}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteLandmark(landmark.id)}
                          className="p-2 rounded-xl hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Remove Destination"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Create form card */}
                <form onSubmit={handleAddLandmark} className="bg-slate-900 border border-white/10 p-6 rounded-2xl lg:col-span-2 space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block border-b border-white/5 pb-2 font-bold flex items-center gap-1.5 text-golden">
                    <Plus className="w-3.5 h-3.5 text-golden animate-pulse" /> Provision New Destination Landmark
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">Destinations Place Name</label>
                        <input
                          type="text"
                          required
                          value={placeName}
                          onChange={(e) => setPlaceName(e.target.value)}
                          placeholder="Knuckles Range Ridge"
                          className="w-full bg-slate-950 border border-white/10 focus:border-golden/40 p-3 rounded-xl focus:outline-none text-white transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">Scenic Display Tagline</label>
                        <input
                          type="text"
                          value={placeTagline}
                          onChange={(e) => setPlaceTagline(e.target.value)}
                          placeholder="Misty valleys in the clouds"
                          className="w-full bg-slate-950 border border-white/10 focus:border-golden/40 p-3 rounded-xl focus:outline-none text-white transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">Main Banner Landscape Photo URL</label>
                        <input
                          type="text"
                          value={placeImage}
                          onChange={(e) => setPlaceImage(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-slate-950 border border-white/10 focus:border-golden/40 p-3 rounded-xl focus:outline-none text-white font-mono text-[11px] transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">GPS Map Lat</label>
                          <input
                            type="text"
                            value={placeLat}
                            onChange={(e) => setPlaceLat(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-xl text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">GPS Map Lng</label>
                          <input
                            type="text"
                            value={placeLng}
                            onChange={(e) => setPlaceLng(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-xl text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">Historical / Landscape Narrative</label>
                        <textarea
                          rows={4}
                          required
                          value={placeDesc}
                          onChange={(e) => setPlaceDesc(e.target.value)}
                          placeholder="Spanning tea valley borders, the majestic Knuckles hills represent..."
                          className="w-full bg-slate-950 border border-white/10 focus:border-golden/40 p-3 rounded-xl focus:outline-none text-white resize-none leading-relaxed transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                        <div>
                          <label className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">Altitude Elevation</label>
                          <input
                            type="text"
                            value={placeAltitude}
                            onChange={(e) => setPlaceAltitude(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-xl text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">Entrance Fee Code</label>
                          <input
                            type="text"
                            value={placeFee}
                            onChange={(e) => setPlaceFee(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-xl text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">Best visiting hours</label>
                          <input
                            type="text"
                            value={placeHours}
                            onChange={(e) => setPlaceHours(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-xl text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">Micro-climate notes</label>
                          <input
                            type="text"
                            value={placeWeather}
                            onChange={(e) => setPlaceWeather(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-xl text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-golden hover:bg-amber-500 text-midnight font-bold transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <CheckCircle className="w-4 h-4 text-midnight" />
                      <span>Seal & Deploy Landmark Place</span>
                    </button>
                  </div>
                </form>

              </div>
            )}

            {/* 3. SECTOR: CURATORS */}
            {activeTab === "curators" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Active curator list */}
                <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl lg:col-span-1 space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block border-b border-white/5 pb-2 font-bold">
                    Active Registries Curators ({guides.length})
                  </span>

                  <div className="divide-y divide-white/5 space-y-3 overflow-y-auto max-h-[500px] pr-2">
                    {guides.map((g) => (
                      <div key={g.id} className="flex items-center justify-between pt-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={g.avatar} 
                            alt={g.name} 
                            className="w-10 h-10 rounded-full object-cover border border-white/15 shrink-0" 
                          />
                          <div className="text-left">
                            <span className="text-xs text-white font-bold block">{g.name}</span>
                            <span className="text-[9px] font-mono text-slate-500 uppercase block mt-0.5">
                              {g.location} · ${g.pricePerHour} USD/hr · {g.experienceLevel}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteGuide(g.id)}
                          className="p-2 rounded-xl hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Retire Curator"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Provision curator profile */}
                <form onSubmit={handleAddGuide} className="bg-slate-900 border border-white/10 p-6 rounded-2xl lg:col-span-2 space-y-4 text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block border-b border-white/5 pb-2 font-bold flex items-center gap-1 text-golden">
                    <UserPlus className="w-4 h-4 text-golden" /> Recruit Private Expert Curator
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">Full Name of specialist</label>
                        <input
                          type="text"
                          required
                          value={guideName}
                          onChange={(e) => setGuideName(e.target.value)}
                          placeholder="Manoj Chandrasiri"
                          className="w-full bg-slate-950 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-golden/40"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">Exp rate ($ usd/hr)</label>
                          <input
                            type="number"
                            required
                            value={guideRate}
                            onChange={(e) => setGuideRate(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-xl text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">Regional location base</label>
                          <select
                            value={guideLocation}
                            onChange={(e) => setGuideLocation(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-xl text-white font-sans"
                          >
                            <option value="Sigiriya">Sigiriya</option>
                            <option value="Ella">Ella</option>
                            <option value="Galle Fort">Galle Fort</option>
                            <option value="Kandy">Kandy</option>
                            <option value="Colombo">Colombo</option>
                            <option value="Nuwara Eliya">Nuwara Eliya</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">Experience years</label>
                          <input
                            type="text"
                            required
                            value={guideExp}
                            onChange={(e) => setGuideExp(e.target.value)}
                            placeholder="7 Years"
                            className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-xl text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">Avatar photo URL</label>
                          <input
                            type="text"
                            value={guideAvatar}
                            onChange={(e) => setGuideAvatar(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-xl text-white text-[11px] font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">Expert biography & summary</label>
                        <textarea
                          rows={3}
                          required
                          value={guideBio}
                          onChange={(e) => setGuideBio(e.target.value)}
                          placeholder="Experienced mountaineer specializing in high-altitude tea trail climbs..."
                          className="w-full bg-slate-950 border border-white/10 p-3 rounded-xl text-white resize-none leading-relaxed focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">Languages spoken</label>
                          <input
                            type="text"
                            value={guideLanguages}
                            onChange={(e) => setGuideLanguages(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">Specialist tags</label>
                          <input
                            type="text"
                            value={guideTags}
                            onChange={(e) => setGuideTags(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-xl"
                          />
                        </div>
                      </div>

                      {/* Portfolio & Safety Gears */}
                      <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl space-y-3">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-golden block font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-golden" /> Portfolio credentials & safety equipment
                        </span>

                        <div>
                          <label className="text-[9px] font-mono text-slate-500 block mb-0.5">Expeditions Undertaken</label>
                          <input
                            type="text"
                            value={guidePortfolioPlaces}
                            onChange={(e) => setGuidePortfolioPlaces(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 p-2.5 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] font-mono text-slate-500 block mb-0.5">SLTDA / Professional Licenses</label>
                          <input
                            type="text"
                            value={guideLicenses}
                            onChange={(e) => setGuideLicenses(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 p-2.5 rounded-lg text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 animate-none">
                          <div>
                            <label className="text-[9px] font-mono text-slate-500 block mb-0.5">Guest Gear Provided</label>
                            <input
                              type="text"
                              value={guideGear}
                              onChange={(e) => setGuideGear(e.target.value)}
                              className="w-full bg-slate-900 border border-white/10 p-2 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-mono text-slate-500 block mb-0.5 font-bold uppercase">Photos portfolio comma-list</label>
                            <input
                              type="text"
                              value={guidePortfolioGallery}
                              onChange={(e) => setGuidePortfolioGallery(e.target.value)}
                              placeholder="https://..."
                              className="w-full bg-slate-900 border border-white/10 p-2 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-golden hover:bg-amber-500 text-midnight font-bold transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <UserPlus className="w-4 h-4 text-midnight" />
                      <span>Authorize & Deploy Specialist Profile</span>
                    </button>
                  </div>
                </form>

              </div>
            )}

            {/* 4. SECTOR: AI COMPANION TESTING */}
            {activeTab === "gemini" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Side instruction */}
                <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-golden block font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-golden" /> AI Oracle Companion Node
                    </span>
                    <h2 className="text-xl md:text-2xl font-serif text-white font-medium">
                      Ariya <span className="italic font-light text-golden">Oracle</span> Testing
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Optimize, toggle, and trigger user-facing chatbot models directly from your admin seat. Select between standard core blueprints or a live server-side Google Gemini node.
                    </p>
                  </div>

                  {/* Architecture selector */}
                  <div className="p-4 bg-slate-950 border border-white/5 rounded-xl space-y-3">
                    <label className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                      LLM Model Node
                    </label>
                    <div className="grid grid-cols-2 gap-2 col-span-2">
                      <button
                        onClick={() => onModelChange("standard")}
                        className={`py-2 px-3 rounded-lg border text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          aiModelType === "standard"
                            ? "bg-slate-800 text-white border-slate-600 font-bold"
                            : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
                        }`}
                      >
                        <Server className="w-3.5 h-3.5 text-slate-500" />
                        <span>Offline Core</span>
                      </button>
                      <button
                        onClick={() => onModelChange("gemini-3.5-flash")}
                        className={`py-2 px-3 rounded-lg border text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          aiModelType === "gemini-3.5-flash"
                            ? "bg-golden/10 text-golden border-golden/45 font-bold shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                            : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
                        }`}
                      >
                        <Bot className="w-3.5 h-3.5 text-golden" />
                        <span>Gemini 3.5</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono leading-normal pt-1">
                      {aiModelType === "gemini-3.5-flash"
                        ? "Active: Live high-fidelity Gemini 3.5 node delivers customized natural replies with historic Sri Lanka references."
                        : "Active: Fast simulated travel response triggers based on client message keywords."}
                    </p>
                  </div>
                </div>

                {/* Chat window */}
                <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl lg:col-span-2 flex flex-col h-[520px] justify-between overflow-hidden">
                  <div className="flex-grow p-4 bg-slate-950/60 border border-white/5 rounded-xl overflow-y-auto space-y-4 text-xs font-sans max-h-[380px] mb-4">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`max-w-[80%] p-3.5 rounded-2xl leading-relaxed ${
                          msg.sender === "ai"
                            ? "bg-white/5 text-slate-200 mr-auto rounded-tl-none border border-white/5"
                            : "bg-jungle text-white ml-auto rounded-tr-none border border-emerald-950"
                        }`}
                      >
                        <span className="text-[9px] block font-mono text-slate-500 uppercase tracking-widest mb-1 font-bold">
                          {msg.sender === "ai" ? "Travel Oracle" : "Administrator"}
                        </span>
                        <p className="whitespace-pre-line">{msg.content}</p>
                      </div>
                    ))}
                    {isAiLoading && (
                      <div className="bg-white/5 text-slate-400 mr-auto p-3.5 rounded-xl rounded-tl-none border border-white/5 max-w-[80%] flex items-center gap-2 font-mono">
                        <Loader2 className="w-3.5 h-3.5 text-golden animate-spin" />
                        <span className="text-[10px]">Calling Sri Lanka oracle models...</span>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSendChat} className="p-2.5 bg-slate-950 border border-white/10 rounded-xl flex gap-2">
                    <input
                      type="text"
                      placeholder="Trigger testing prompts about Ella train routes or Galle Fort history..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      disabled={isAiLoading}
                      className="flex-grow bg-slate-900 border border-slate-800 focus:border-golden/50 rounded-lg px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isAiLoading || !chatInput.trim()}
                      className="p-3 rounded-lg bg-golden hover:bg-amber-500 text-midnight transition-all disabled:opacity-40 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>

              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
}
