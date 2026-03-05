"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";

export default function DataPage() {
  const [hotelName, setHotelName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [keywords, setKeywords] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Save to Supabase
    console.log({
      hotelName,
      location,
      description,
      targetAudience,
      competitors,
      keywords,
    });

    setSaving(false);
    setSaved(true);

    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="p-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Data & Context</h1>
          <p className="text-slate-400">
            Add context about your hotel to help our AI generate better insights
          </p>
        </div>

        {/* Form */}
        <div className="glass rounded-xl p-6 border border-white/10 max-w-3xl">
          <div className="space-y-6">
            {/* Hotel Name */}
            <div>
              <label className="text-sm text-slate-300 font-medium block mb-2">
                Hotel Name
              </label>
              <input
                type="text"
                placeholder="Grand Pacific Hotel"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm text-slate-300 font-medium block mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-slate-300 font-medium block mb-2">
                Hotel Description
              </label>
              <textarea
                placeholder="Describe your hotel, unique features, amenities, and what makes it special..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 resize-none"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="text-sm text-slate-300 font-medium block mb-2">
                Target Audience
              </label>
              <input
                type="text"
                placeholder="Business travelers, families, luxury seekers..."
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* Competitors */}
            <div>
              <label className="text-sm text-slate-300 font-medium block mb-2">
                Main Competitors
              </label>
              <input
                type="text"
                placeholder="Competitor Hotel 1, Competitor Hotel 2..."
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              />
              <p className="text-xs text-slate-500 mt-1">
                Separate multiple competitors with commas
              </p>
            </div>

            {/* Target Keywords */}
            <div>
              <label className="text-sm text-slate-300 font-medium block mb-2">
                Target Keywords
              </label>
              <textarea
                placeholder="luxury hotel san francisco, boutique hotel downtown, business hotel..."
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Keywords you want to rank for, separated by commas
              </p>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/25"
              >
                {saving ? "Saving..." : "Save Context"}
              </button>

              {saved && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Saved successfully!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

