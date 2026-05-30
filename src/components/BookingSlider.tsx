/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, User, Mail, Calendar, Clock, DollarSign, Command, CheckCircle2 } from "lucide-react";
import { Guide, Booking } from "../types";

interface BookingSliderProps {
  isOpen: boolean;
  onClose: () => void;
  guide: Guide | null;
  onBookingSuccess: (booking: Booking, apiResponseTimeMs: number) => void;
}

export default function BookingSlider({ isOpen, onClose, guide, onBookingSuccess }: BookingSliderProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [hours, setHours] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState<any>(null);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guide || isSubmitting) return;

    setIsSubmitting(true);
    const start = Date.now();

    try {
      const response = await fetch("/api/book-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          touristName: name,
          touristEmail: email,
          guideId: guide.id,
          bookingDate: date,
          hours: hours
        })
      });
      const durationMs = Date.now() - start;
      const data = await response.json();
      
      if (data.success) {
        setSuccessBooking(data.booking);
        onBookingSuccess(data.booking, durationMs);
      } else {
        alert(`Booking Error: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Network Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    setSuccessBooking(null);
    setName("");
    setEmail("");
    setDate("");
    setHours(4);
    onClose();
  };

  if (!guide) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={successBooking ? handleDone : onClose}
            className="fixed inset-0 bg-slate-950 z-50 backdrop-blur-sm"
          />

          {/* Slider panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-white/10 z-50 flex flex-col shadow-2xl overflow-hidden font-sans text-left"
          >
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-golden/15 border border-golden/30">
                  <Sparkles className="w-4 h-4 text-golden" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    {successBooking ? "Booking Confirmation" : "Rent Private Expert"}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {successBooking ? "Expedition Dispatched" : "Review Curator Schedules"}
                  </p>
                </div>
              </div>

              {!successBooking && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Main content */}
            <div className="flex-grow p-5 overflow-y-auto space-y-6">
              {successBooking ? (
                /* Exquisite Booking complete checklist card */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 py-6 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <CheckCircle2 className="w-16 h-16 text-golden animate-bounce" />
                    <h4 className="text-xl font-serif font-bold text-white tracking-wide">
                      Expedition Registered!
                    </h4>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      Your booking has been authenticated. Webhook alerts have fired to secure notification endpoints.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-white/5 font-mono text-[10px] text-left space-y-2">
                    <div className="text-slate-500 pb-1.5 border-b border-white/5 uppercase font-bold tracking-widest text-[9px] flex justify-between">
                      <span>Receipt Metadata</span>
                      <span>STATUS: SUCCESS</span>
                    </div>
                    <div><span className="text-slate-500">BOOKING ID:</span> <span className="text-amber-200">{successBooking.id}</span></div>
                    <div><span className="text-slate-500">EXPERT NOMINEE:</span> <span className="text-white">{successBooking.guideName}</span></div>
                    <div><span className="text-slate-500">CLIENT VISITOR:</span> <span className="text-white">{successBooking.touristName}</span></div>
                    <div><span className="text-slate-500">CONTACT ADDR:</span> <span className="text-white">{successBooking.touristEmail}</span></div>
                    <div><span className="text-slate-500">SCHEDULE:</span> <span className="text-white">{successBooking.bookingDate} ({successBooking.hours} Hours)</span></div>
                    <div><span className="text-slate-500">TOTAL COST:</span> <span className="text-golden font-bold">${successBooking.totalPrice} USD</span></div>
                  </div>

                  <div className="p-4 rounded-xl bg-golden/5 border border-golden/20 text-xs text-slate-300 leading-relaxed text-left">
                    💡 <span className="text-golden font-semibold">Inspector Check</span>: Slide open the <span className="text-white font-semibold">DevConsole Hub</span> from the top header navigation and head to the <span className="text-white font-semibold">Webhooks tab</span> to review the live post alerts that flew to slack!
                  </div>

                  <button
                    onClick={handleDone}
                    className="w-full py-3 rounded-xl bg-golden hover:bg-amber-500 text-midnight font-bold tracking-wide transition-all text-xs"
                  >
                    Done & Return
                  </button>
                </motion.div>
              ) : (
                /* Regular Booking Form */
                <form onSubmit={handleBookingSubmit} className="space-y-5 text-left">
                  {/* Selected Guide summary card */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-white/5 flex gap-4 items-center">
                    <img
                      src={guide.avatar || undefined}
                      alt={guide.name}
                      className="w-12 h-12 rounded-lg object-cover border-2 border-white/10"
                    />
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-golden block">
                        {guide.location} curator
                      </span>
                      <h4 className="text-sm font-serif font-bold text-white">{guide.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        ${guide.pricePerHour} USD / Hour · {guide.experienceLevel} Experience
                      </p>
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1.5 font-semibold">
                        Tourist full name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Lord Ceylon"
                          className="w-full bg-slate-950/80 border border-white/10 focus:border-golden/50 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none placeholder-slate-600 font-medium transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1.5 font-semibold">
                        Tourist email address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="explorer@lanka.io"
                          className="w-full bg-slate-950/80 border border-white/10 focus:border-golden/50 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none placeholder-slate-600 font-medium transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1.5 font-semibold">
                          Target Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                          <input
                            type="date"
                            required
                            min="2026-05-30"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-slate-950/80 border border-white/10 focus:border-golden/50 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none font-medium transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1.5 font-semibold">
                          Duration (Hours)
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                          <select
                            value={hours}
                            onChange={(e) => setHours(Number(e.target.value))}
                            className="w-full bg-slate-950/80 border border-white/10 focus:border-golden/50 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none font-medium transition-all appearance-none"
                          >
                            <option value={2}>2 Hours</option>
                            <option value={4}>4 Hours (Standard)</option>
                            <option value={6}>6 Hours</option>
                            <option value={8}>8 Hours (Full Day)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Pricing math block */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>Rent Math</span>
                      <span>Subtotal Estimate</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-300">
                      <span>Hourly Fee:</span>
                      <span>${guide.pricePerHour} USD / hr</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-300">
                      <span>Hours Requested:</span>
                      <span>x {hours} hr</span>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                      <span className="text-xs font-bold text-white uppercase font-mono">Gross Total:</span>
                      <div className="flex items-center text-golden font-bold text-lg font-mono">
                        <DollarSign className="w-4 h-4" />
                        <span>{guide.pricePerHour * hours} USD</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-jungle to-emerald-900 hover:opacity-100 border border-emerald-700/50 hover:border-golden/40 text-white font-semibold transition-all text-xs flex items-center justify-center gap-2 glow-green"
                  >
                    <Command className="w-4 h-4 text-golden" />
                    <span>{isSubmitting ? "Authenticating Webhooks..." : "Book and Transmit Alert"}</span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
