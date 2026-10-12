import React, { useState } from "react";
import {
  WeddingProfile,
  ExtrapolatedFormFields,
  VisionCategory,
  VisionCategoryData,
  VisionInspoPhoto,
  DesignConcept,
} from "../types";
import {
  Palette,
  Sparkles,
  Link2,
  Flower2,
  Heart,
  Users,
  DollarSign,
  Calendar,
  Check,
  RefreshCw,
  Copy,
  Info,
  Building2,
  Camera,
  Image as ImageIcon,
  Cake,
  Plus,
  Trash2,
  ExternalLink,
  Download,
  CheckCircle2,
  Mail,
  Key,
  ShieldCheck,
} from "lucide-react";
import { GoogleAccountModal } from "./GoogleAccountModal";

interface Props {
  profile: WeddingProfile;
  onUpdateProfile: (updated: Partial<WeddingProfile>) => void;
  savedDesignConcepts?: DesignConcept[];
  onTriggerScan?: (targetEmail: string) => void;
}

const PALETTE_PRESETS = [
  { name: "Butter Yellow & Warm Ivory", colors: ["#ca981d", "#fbf3d5", "#fdfcfa", "#e5b331", "#2c2419"] },
  { name: "Sonoma Champagne & Blush", colors: ["#c28e1d", "#fbf8f3", "#f8ecbf", "#e8c89b", "#4a3c31"] },
  { name: "Whipped Cream & Lemon Gold", colors: ["#d9a123", "#fef3d6", "#e8d28a", "#a38228", "#332612"] },
  { name: "Cashmere Ivory & Soft Amber", colors: ["#b58212", "#faf4e6", "#ecd889", "#d2be8c", "#282015"] },
];

const CATEGORY_TAB_CONFIG: { id: VisionCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: "overall", label: "Overall Vision", icon: Sparkles },
  { id: "flowers", label: "Flowers & Florals", icon: Flower2 },
  { id: "dress", label: "Dress & Attire", icon: Heart },
  { id: "venue", label: "Venue & Decor", icon: Building2 },
  { id: "photos", label: "Photography", icon: Camera },
  { id: "engagement_photos", label: "Engagement Photos", icon: ImageIcon },
  { id: "catering", label: "Catering & Cake", icon: Cake },
  { id: "signage", label: "Signage & Stationery", icon: Palette },
  { id: "hair_makeup", label: "Hair & Makeup", icon: Sparkles },
];

export const VisionProfileTab: React.FC<Props> = ({
  profile,
  onUpdateProfile,
  savedDesignConcepts = [],
  onTriggerScan,
}) => {
  // Active Category Sub-tab
  const [activeCategory, setActiveCategory] = useState<VisionCategory>("overall");

  // Overall Fields
  const [pinterestUrl, setPinterestUrl] = useState(profile?.pinterestBoardUrl || "");
  const [florals, setFlorals] = useState(profile?.florals || "");
  const [vibe, setVibe] = useState(profile?.vibe || "");
  const [notes, setNotes] = useState(profile?.notes || "");
  const [colors, setColors] = useState<string[]>(profile?.colors || []);
  const [guestCount, setGuestCount] = useState(profile?.guestCount || 100);
  const [budget, setBudget] = useState(profile?.budget || 30000);
  const [weddingDate, setWeddingDate] = useState(profile?.weddingDate || "2026-09-18");

  // Category Boards State
  const [categoryBoards, setCategoryBoards] = useState<Record<string, VisionCategoryData>>(
    profile?.categoryBoards || {}
  );

  // States for UI
  const [isSyncingPinterest, setIsSyncingPinterest] = useState(false);
  const [isExtrapolating, setIsExtrapolating] = useState(false);
  const [extrapolatedResult, setExtrapolatedResult] = useState<ExtrapolatedFormFields | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Add Custom Info Photo Modal / Form
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoTitle, setNewPhotoTitle] = useState("");

  // Design Canvas Import Modal
  const [isCanvasPickerOpen, setIsCanvasPickerOpen] = useState(false);

  // Google Account Setup Modal State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Save changes handler
  const handleSave = () => {
    onUpdateProfile({
      pinterestBoardUrl: pinterestUrl,
      florals,
      vibe,
      notes,
      colors,
      guestCount,
      budget,
      weddingDate,
      categoryBoards,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Sync Overall Pinterest Board
  const handleSyncPinterest = () => {
    if (!pinterestUrl.trim()) return;
    setIsSyncingPinterest(true);
    setTimeout(() => {
      setIsSyncingPinterest(false);
      onUpdateProfile({
        isPinterestSynced: true,
        syncedPinsCount: 52,
      });
    }, 1200);
  };

  // Sync Category Specific Pinterest Board
  const handleSyncCategoryBoard = (catKey: string) => {
    const current = categoryBoards[catKey] || {
      pinterestBoardUrl: "",
      isSynced: false,
      syncedCount: 0,
      notes: "",
      photos: [],
    };

    setIsSyncingPinterest(true);
    setTimeout(() => {
      setIsSyncingPinterest(false);
      const updatedCat: VisionCategoryData = {
        ...current,
        isSynced: true,
        syncedCount: (current.syncedCount || 10) + 5,
      };
      const newMap = { ...categoryBoards, [catKey]: updatedCat };
      setCategoryBoards(newMap);
      onUpdateProfile({ categoryBoards: newMap });
    }, 1000);
  };

  // Update Category Fields
  const updateCategoryField = (catKey: string, updates: Partial<VisionCategoryData>) => {
    const current = categoryBoards[catKey] || {
      pinterestBoardUrl: "",
      isSynced: false,
      syncedCount: 0,
      notes: "",
      photos: [],
    };
    const updated = { ...current, ...updates };
    const newMap = { ...categoryBoards, [catKey]: updated };
    setCategoryBoards(newMap);
    onUpdateProfile({ categoryBoards: newMap });
  };

  // Add Custom Info Photo to active category
  const handleAddCustomPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoTitle.trim()) return;

    const catKey = activeCategory;
    const current = categoryBoards[catKey] || {
      pinterestBoardUrl: "",
      isSynced: false,
      syncedCount: 0,
      notes: "",
      photos: [],
    };

    const photoItem: VisionInspoPhoto = {
      id: "photo_" + Date.now(),
      url: newPhotoUrl.trim() || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      title: newPhotoTitle,
      source: "Uploaded Info Photo",
      category: catKey as VisionCategory,
    };

    updateCategoryField(catKey, {
      photos: [...(current.photos || []), photoItem],
    });

    setNewPhotoUrl("");
    setNewPhotoTitle("");
    setIsAddPhotoOpen(false);
  };

  // Import from Design Canvas
  const handleImportConcept = (concept: DesignConcept) => {
    const catKey = activeCategory;
    const current = categoryBoards[catKey] || {
      pinterestBoardUrl: "",
      isSynced: false,
      syncedCount: 0,
      notes: "",
      photos: [],
    };

    const photoItem: VisionInspoPhoto = {
      id: "canvas_photo_" + Date.now(),
      url: concept.imageUrl,
      title: `${concept.title} (${concept.category})`,
      source: "Design Canvas",
      category: catKey as VisionCategory,
    };

    updateCategoryField(catKey, {
      photos: [...(current.photos || []), photoItem],
    });

    setIsCanvasPickerOpen(false);
  };

  // Delete Info Photo
  const handleDeletePhoto = (catKey: string, photoId: string) => {
    const current = categoryBoards[catKey];
    if (!current) return;
    updateCategoryField(catKey, {
      photos: (current.photos || []).filter((p) => p.id !== photoId),
    });
  };

  // AI Extrapolation Test
  const handleTestExtrapolation = async () => {
    setIsExtrapolating(true);
    try {
      const currentVal = {
        coupleNames: profile.coupleNames,
        weddingDate,
        guestCount,
        budget,
        vibe,
        florals,
        colors,
        notes,
      };

      const res = await fetch("/api/gemini/extrapolate-vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: currentVal,
          formContext: "High-end Wedding Floral & Venue Inquiry Form",
        }),
      });

      const data = await res.json();
      setExtrapolatedResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExtrapolating(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const currentCategoryData = categoryBoards[activeCategory] || {
    pinterestBoardUrl: "",
    isSynced: false,
    syncedCount: 0,
    notes: "",
    photos: [],
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ebdcc0] pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2c2419]">Wedding Vision Profile</h1>
          <p className="text-sm text-[#6e5d48] mt-1">
            Organize overall wedding vision & category boards (Flowers, Dress, Venue, Catering, Signage, Photos) with Pinterest sync & Design Canvas assets.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#ca981d] hover:bg-[#b08314] text-white rounded-xl text-sm font-semibold shadow-2xs transition-colors flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          {isSaved ? <Check className="w-4 h-4 text-[#fbf0cb]" /> : <Sparkles className="w-4 h-4 text-[#fbf0cb]" />}
          <span>{isSaved ? "Vision Saved!" : "Save Vision Changes"}</span>
        </button>
      </div>

      {/* Category Navigation Bar - Stacked wrapped rows so all tabs stay visible on screen */}
      <div className="bg-white border border-[#ebdcc0] p-3 rounded-2xl shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 w-full">
          {CATEGORY_TAB_CONFIG.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            const catData = categoryBoards[tab.id];
            const photoCount = catData?.photos?.length || 0;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-[#ca981d] text-white shadow-2xs"
                    : "bg-[#faf6eb] text-[#6e5d48] hover:bg-[#f3e3b3] hover:text-[#2c2419] border border-[#ebdcc0]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id !== "overall" && photoCount > 0 && (
                  <span
                    className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-[#fbf3d5] text-[#5e470e]"
                    }`}
                  >
                    {photoCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* OVERALL VISION SUB-TAB */}
      {/* ========================================================================= */}
      {activeCategory === "overall" && (
        <div className="space-y-8">
          {/* Key Event Details Summary Box at Top */}
          <div className="bg-[#faf6eb] border border-[#ebdcc0] rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#e8d7b3] pb-3">
              <h2 className="font-serif font-bold text-lg text-[#2c2419] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ca981d]" />
                <span>{profile.coupleNames} — Key Event Details</span>
              </h2>
              <span className="text-xs text-[#8c7a63] font-semibold">
                {profile.location || "Sonoma Valley, CA"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-white rounded-2xl border border-[#ebdcc0]">
                <span className="text-[10px] uppercase font-bold text-[#8c7a63] block">Wedding Date</span>
                <span className="font-serif font-bold text-sm text-[#2c2419]">{weddingDate}</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-[#ebdcc0]">
                <span className="text-[10px] uppercase font-bold text-[#8c7a63] block">Guest Count</span>
                <span className="font-serif font-bold text-sm text-[#2c2419]">{guestCount} Guests</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-[#ebdcc0]">
                <span className="text-[10px] uppercase font-bold text-[#8c7a63] block">Total Target Budget</span>
                <span className="font-serif font-bold text-sm text-[#b58212]">${budget.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-[#ebdcc0]">
                <span className="text-[10px] uppercase font-bold text-[#8c7a63] block mb-1">Color Palette</span>
                <div className="flex items-center gap-1">
                  {colors.map((c, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Google Email Setup Integration Card in Vision Profile */}
            <div className="p-4 bg-white rounded-2xl border border-[#ebdcc0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#fbf3d5] text-[#ca981d] border border-[#f3e3b3] flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#ca981d]" />
                </div>
                <div>
                  <span className="font-bold text-[#2c2419] block">
                    Active Email Account: {profile.gmailAddress}
                  </span>
                  <span className="text-[11px] text-[#6e5d48]">
                    {profile.isGoogleAccountLinked
                      ? "✓ Google Account Linked via OAuth (Gmail Read & Send Authorized)"
                      : "Dedicated Wedding Email (Auto-Monitored by Ivory AI)"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(true)}
                className="px-3.5 py-2 bg-[#faf6eb] hover:bg-[#f3e3b3] text-[#2c2419] border border-[#ebdcc0] rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Key className="w-3.5 h-3.5 text-[#ca981d]" />
                <span>Prompt / Switch Google Account</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Pinterest URL & Core Prompts */}
            <div className="lg:col-span-7 space-y-6">
              {/* Overall Pinterest Board Link Box */}
              <div className="bg-white border border-[#ebdcc0] rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#8c7a63] flex items-center gap-1.5">
                    <Link2 className="w-4 h-4 text-[#ca981d]" /> Overall Wedding Vision Board URL
                  </label>
                  {profile.isPinterestSynced && (
                    <span className="text-[11px] bg-[#fbf3d5] text-[#5e470e] px-2.5 py-0.5 rounded-full font-semibold border border-[#f3e3b3]">
                      ✓ Synced ({profile.syncedPinsCount} pins)
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={pinterestUrl}
                    onChange={(e) => setPinterestUrl(e.target.value)}
                    placeholder="https://pinterest.com/yourname/organic-wedding-vision"
                    className="flex-1 px-3.5 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl text-sm text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]/30"
                  />
                  <button
                    onClick={handleSyncPinterest}
                    disabled={isSyncingPinterest}
                    className="px-4 py-2.5 bg-[#faf6eb] hover:bg-[#ebdcc0] text-[#2c2419] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingPinterest ? "animate-spin text-[#ca981d]" : ""}`} />
                    <span>{isSyncingPinterest ? "Syncing..." : "Sync Board"}</span>
                  </button>
                </div>

                {/* Pinterest Board Synced Preview Card & Top Pins */}
                {(profile.isPinterestSynced || pinterestUrl) && (
                  <div className="mt-4 pt-4 border-t border-[#ebdcc0] space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
                          P
                        </div>
                        <span className="font-serif font-bold text-xs text-[#2c2419]">
                          Pinterest Board Cover: <span className="italic text-[#ca981d]">Organic Sonoman Wedding Vision</span>
                        </span>
                      </div>
                      <span className="text-[10px] text-[#8c7a63] font-bold bg-[#faf6eb] px-2 py-0.5 rounded-full border border-[#ebdcc0]">
                        52 Active Pins • Synced Cover
                      </span>
                    </div>

                    <p className="text-[11px] text-[#6e5d48]">Top pinned visual inspirations pulled from your connected Pinterest board:</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="group relative rounded-xl overflow-hidden border border-[#ebdcc0] bg-black/5 aspect-4/3 shadow-2xs hover:border-[#ca981d] transition-all">
                        <img
                          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80"
                          alt="Blush Garden Roses"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex flex-col justify-end">
                          <span className="text-[10px] font-bold text-white truncate">Blush Rose & Olive Canopy</span>
                          <span className="text-[9px] text-amber-200/90 font-medium">Top Saved Pin</span>
                        </div>
                      </div>

                      <div className="group relative rounded-xl overflow-hidden border border-[#ebdcc0] bg-black/5 aspect-4/3 shadow-2xs hover:border-[#ca981d] transition-all">
                        <img
                          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                          alt="Terracotta Setting"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex flex-col justify-end">
                          <span className="text-[10px] font-bold text-white truncate">Terracotta & Linen Tables</span>
                          <span className="text-[9px] text-amber-200/90 font-medium">Table Decor</span>
                        </div>
                      </div>

                      <div className="group relative rounded-xl overflow-hidden border border-[#ebdcc0] bg-black/5 aspect-4/3 shadow-2xs hover:border-[#ca981d] transition-all">
                        <img
                          src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80"
                          alt="Festoon Canopy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex flex-col justify-end">
                          <span className="text-[10px] font-bold text-white truncate">Festoon Sunset Canopy</span>
                          <span className="text-[9px] text-amber-200/90 font-medium">Lighting</span>
                        </div>
                      </div>

                      <div className="group relative rounded-xl overflow-hidden border border-[#ebdcc0] bg-black/5 aspect-4/3 shadow-2xs hover:border-[#ca981d] transition-all">
                        <img
                          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80"
                          alt="Signage Board"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex flex-col justify-end">
                          <span className="text-[10px] font-bold text-white truncate">Acrylic Welcome Sign</span>
                          <span className="text-[9px] text-amber-200/90 font-medium">Stationery</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Prompts Section */}
              <div className="bg-white border border-[#ebdcc0] rounded-2xl p-6 shadow-2xs space-y-5">
                <h2 className="text-base font-serif font-bold text-[#2c2419] flex items-center gap-2">
                  <Flower2 className="w-5 h-5 text-[#ca981d]" />
                  <span>Vision Prompts & Specific Requests</span>
                </h2>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#8c7a63]">
                    What type of flowers & foliage do you want?
                  </label>
                  <textarea
                    rows={3}
                    value={florals}
                    onChange={(e) => setFlorals(e.target.value)}
                    placeholder="e.g. Eucalyptus, garden roses, blush peonies, olive branches..."
                    className="w-full px-3.5 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl text-sm text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#8c7a63]">
                    Overall Aesthetic & Vibe
                  </label>
                  <textarea
                    rows={2}
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    placeholder="e.g. Organic ethereal minimalist with warm festoon lighting and relaxed outdoor luxury..."
                    className="w-full px-3.5 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl text-sm text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#8c7a63]">
                    Special Vendor Instructions / Must-Haves
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Need acoustic ceremony music, farm-to-table dinner menu, artisan pizza truck..."
                    className="w-full px-3.5 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl text-sm text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]/30"
                  />
                </div>
              </div>

              {/* Color Palette Selector */}
              <div className="bg-white border border-[#ebdcc0] rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#8c7a63] flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-[#ca981d]" /> Color Palette Swatches
                  </label>
                  <span className="text-xs text-[#8c7a63] font-medium">{colors.length} Colors Active</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#faf6eb] rounded-xl border border-[#ebdcc0]">
                  {colors.map((color, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const newC = [...colors];
                          newC[index] = e.target.value;
                          setColors(newC);
                        }}
                        className="w-9 h-9 rounded-full border border-black/10 cursor-pointer p-0 bg-transparent"
                      />
                      <span className="text-[10px] font-mono text-[#6e5d48]">{color}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-[#8c7a63] font-semibold">Or Pick Comforting Preset Theme:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PALETTE_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setColors(preset.colors)}
                        className="p-2.5 rounded-xl border border-[#ebdcc0] bg-white hover:border-[#ca981d] transition-colors flex items-center justify-between gap-2 text-left"
                      >
                        <span className="text-xs font-medium text-[#2c2419] truncate">{preset.name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {preset.colors.map((c, i) => (
                            <span key={i} className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: AI Extrapolation Tool */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gradient-to-br from-[#faf6eb] to-[#f5edd8] border border-[#ebdcc0] rounded-2xl p-6 shadow-2xs space-y-5 sticky top-24">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#ca981d]" />
                    <h2 className="text-lg font-serif font-bold text-[#2c2419]">
                      AI Vision Extrapolator Test
                    </h2>
                  </div>
                </div>

                <p className="text-xs text-[#6e5d48] leading-relaxed">
                  Test how Gemini takes all your vision inputs and automatically generates tailored answers for vendor forms. This is what our Chrome Extension feeds into vendor websites!
                </p>

                <button
                  onClick={handleTestExtrapolation}
                  disabled={isExtrapolating}
                  className="w-full py-3 bg-[#ca981d] hover:bg-[#b08314] text-white rounded-xl font-semibold text-xs transition-colors shadow-2xs flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 text-[#fbf0cb] ${isExtrapolating ? "animate-spin" : ""}`} />
                  <span>{isExtrapolating ? "Extrapolating Vision with Gemini..." : "Run AI Form Extrapolation"}</span>
                </button>

                {extrapolatedResult ? (
                  <div className="space-y-3 pt-2 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-[#ebdcc0] space-y-1">
                      <div className="flex items-center justify-between text-[#8c7a63] font-semibold text-[10px] uppercase">
                        <span>Generated Vendor Inquiry Message</span>
                        <button
                          onClick={() => copyToClipboard(extrapolatedResult.messageToVendor, "message")}
                          className="hover:text-[#ca981d] flex items-center gap-1"
                        >
                          {copiedField === "message" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <p className="text-[#2c2419] leading-relaxed text-xs italic">
                        "{extrapolatedResult.messageToVendor}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 bg-white rounded-xl border border-[#ebdcc0]">
                        <span className="text-[#8c7a63] text-[10px] uppercase font-semibold block">Event Date</span>
                        <span className="text-[#2c2419] font-medium text-xs">{extrapolatedResult.eventDate}</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-[#ebdcc0]">
                        <span className="text-[#8c7a63] text-[10px] uppercase font-semibold block">Guest Count</span>
                        <span className="text-[#2c2419] font-medium text-xs">{extrapolatedResult.guestCount}</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-[#ebdcc0] space-y-0.5">
                      <span className="text-[#8c7a63] text-[10px] uppercase font-semibold block">Floral Vision</span>
                      <p className="text-[#2c2419] font-medium text-xs">{extrapolatedResult.floralVision}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border border-dashed border-[#d2c8b8] rounded-xl text-center space-y-2 bg-white/50">
                    <Info className="w-6 h-6 text-[#ca981d] mx-auto" />
                    <p className="text-xs text-[#6e5d48] font-medium">
                      Click above to see Gemini generate exact form content from your saved vision.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY SPECIFIC SUB-TABS (FLOWERS, DRESS, VENUE, PHOTOS, ETC.) */}
      {/* ========================================================================= */}
      {activeCategory !== "overall" && (
        <div className="space-y-6">
          {/* Category Header & Pinterest Sync */}
          <div className="bg-white border border-[#ebdcc0] rounded-3xl p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f3e3b3] pb-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#2c2419] capitalize flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#ca981d]" />
                  <span>{CATEGORY_TAB_CONFIG.find((c) => c.id === activeCategory)?.label} Vision Board</span>
                </h2>
                <p className="text-xs text-[#6e5d48] mt-1">
                  Manage Pinterest board URL, specific styling notes, and info photos for {CATEGORY_TAB_CONFIG.find((c) => c.id === activeCategory)?.label}.
                </p>
              </div>

              {currentCategoryData.isSynced && (
                <span className="text-xs bg-[#fbf3d5] text-[#5e470e] px-3 py-1 rounded-full font-bold border border-[#f3e3b3] flex items-center gap-1 self-start sm:self-auto">
                  <CheckCircle2 className="w-4 h-4 text-[#ca981d]" /> Synced ({currentCategoryData.syncedCount || 12} Pins)
                </span>
              )}
            </div>

            {/* Category Pinterest Board URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#8c7a63] flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-[#ca981d]" /> Category Pinterest Board URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={currentCategoryData.pinterestBoardUrl || ""}
                  onChange={(e) => updateCategoryField(activeCategory, { pinterestBoardUrl: e.target.value })}
                  placeholder={`https://pinterest.com/yourname/wedding-${activeCategory}-inspiration`}
                  className="flex-1 px-3.5 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl text-sm text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]/30"
                />
                <button
                  type="button"
                  onClick={() => handleSyncCategoryBoard(activeCategory)}
                  disabled={isSyncingPinterest}
                  className="px-4 py-2.5 bg-[#ca981d] hover:bg-[#b08314] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingPinterest ? "animate-spin text-[#fbf0cb]" : ""}`} />
                  <span>{isSyncingPinterest ? "Syncing..." : "Sync Board"}</span>
                </button>
              </div>

              {/* Pinterest Category Board Top Pins Preview */}
              {(currentCategoryData.isSynced || currentCategoryData.pinterestBoardUrl) && (
                <div className="mt-3 pt-3 border-t border-[#ebdcc0] space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-[9px] shadow-2xs">
                        P
                      </div>
                      <span className="font-serif font-bold text-[#2c2419]">
                        Pinterest Board Cover: <span className="text-[#ca981d]">{CATEGORY_TAB_CONFIG.find((c) => c.id === activeCategory)?.label} Pins</span>
                      </span>
                    </div>
                    <span className="text-[10px] text-[#6e5d48] font-semibold bg-[#faf6eb] px-2 py-0.5 rounded-full border border-[#ebdcc0]">
                      {currentCategoryData.syncedCount || 12} Pins Synced
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="group relative rounded-xl overflow-hidden border border-[#ebdcc0] aspect-4/3 shadow-2xs bg-black/5">
                      <img
                        src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=500&q=80"
                        alt="Pin 1"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex items-end">
                        <span className="text-[10px] font-bold text-white truncate">Primary Style Inspiration</span>
                      </div>
                    </div>
                    <div className="group relative rounded-xl overflow-hidden border border-[#ebdcc0] aspect-4/3 shadow-2xs bg-black/5">
                      <img
                        src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80"
                        alt="Pin 2"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex items-end">
                        <span className="text-[10px] font-bold text-white truncate">Accent Palette & Details</span>
                      </div>
                    </div>
                    <div className="group relative rounded-xl overflow-hidden border border-[#ebdcc0] aspect-4/3 shadow-2xs bg-black/5 hidden sm:block">
                      <img
                        src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=500&q=80"
                        alt="Pin 3"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex items-end">
                        <span className="text-[10px] font-bold text-white truncate">Atmosphere & Mood</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Category Specific Vision Notes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#8c7a63]">
                Specific {CATEGORY_TAB_CONFIG.find((c) => c.id === activeCategory)?.label} Notes & Instructions
              </label>
              <textarea
                rows={3}
                value={currentCategoryData.notes || ""}
                onChange={(e) => updateCategoryField(activeCategory, { notes: e.target.value })}
                placeholder={`Specific instructions, preferences, fabric choices, colors, or vendor notes for ${CATEGORY_TAB_CONFIG.find((c) => c.id === activeCategory)?.label}...`}
                className="w-full px-3.5 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl text-sm text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]/30"
              />
            </div>
          </div>

          {/* Info Photos Section */}
          <div className="bg-white border border-[#ebdcc0] rounded-3xl p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f3e3b3] pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-[#2c2419]">
                  Category Info Photos & Visual Inspirations ({currentCategoryData.photos?.length || 0})
                </h3>
                <p className="text-xs text-[#6e5d48]">
                  Attach photos from Pinterest, computer uploads, or import generated assets directly from the Design Canvas.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsCanvasPickerOpen(true)}
                  className="px-3 py-2 bg-[#fbf3d5] hover:bg-[#f3db78] text-[#5e470e] border border-[#f3e3b3] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#ca981d]" />
                  <span>Import from Design Canvas</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddPhotoOpen(true)}
                  className="px-3.5 py-2 bg-[#ca981d] hover:bg-[#b08314] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Info Photo</span>
                </button>
              </div>
            </div>

            {/* Photos Grid */}
            {!currentCategoryData.photos || currentCategoryData.photos.length === 0 ? (
              <div className="p-10 border-2 border-dashed border-[#ebdcc0] rounded-2xl text-center space-y-3 bg-[#fffdfa]">
                <ImageIcon className="w-10 h-10 text-[#ca981d] mx-auto opacity-70" />
                <h4 className="font-serif font-bold text-base text-[#2c2419]">No info photos added yet</h4>
                <p className="text-xs text-[#6e5d48] max-w-md mx-auto">
                  Add photos directly via URL / upload or click "Import from Design Canvas" to pull in AI-generated designs!
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCanvasPickerOpen(true)}
                    className="px-4 py-2 bg-[#fbf3d5] hover:bg-[#f3db78] text-[#5e470e] border border-[#f3e3b3] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#ca981d]" />
                    <span>Import from Design Canvas</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentCategoryData.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative bg-[#fffdfa] border border-[#ebdcc0] rounded-2xl overflow-hidden shadow-2xs hover:border-[#ca981d] transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-4/3 relative overflow-hidden bg-black/5">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-md">
                        {photo.source || "Inspo Photo"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(activeCategory, photo.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-3">
                      <h5 className="font-serif font-bold text-xs text-[#2c2419] line-clamp-1">{photo.title}</h5>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD CUSTOM INFO PHOTO */}
      {/* ========================================================================= */}
      {isAddPhotoOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-[#ebdcc0] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#f3e3b3] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#2c2419]">Add Info Photo</h3>
              <button
                type="button"
                onClick={() => setIsAddPhotoOpen(false)}
                className="text-[#8c7a63] hover:text-[#2c2419] font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomPhoto} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#6e5d48]">Photo Title / Description</label>
                <input
                  type="text"
                  required
                  value={newPhotoTitle}
                  onChange={(e) => setNewPhotoTitle(e.target.value)}
                  placeholder="e.g. Sage Green Table Runner & Garden Roses"
                  className="w-full px-3.5 py-2.5 bg-[#faf6eb] border border-[#ebdcc0] rounded-xl text-sm text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#6e5d48]">Image URL</label>
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 bg-[#faf6eb] border border-[#ebdcc0] rounded-xl text-sm text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]"
                />
                <p className="text-[11px] text-[#8c7a63]">
                  Leave empty to auto-use a relevant high quality aesthetic image.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPhotoOpen(false)}
                  className="px-4 py-2.5 bg-[#faf6eb] hover:bg-[#f3e3b3] text-[#2c2419] font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#ca981d] hover:bg-[#b08314] text-white font-bold rounded-xl text-xs transition-colors shadow-2xs"
                >
                  Add Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: IMPORT FROM DESIGN CANVAS */}
      {/* ========================================================================= */}
      {isCanvasPickerOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-[#ebdcc0] rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f3e3b3] pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#2c2419] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#ca981d]" />
                  <span>Import from Design Canvas</span>
                </h3>
                <p className="text-xs text-[#6e5d48]">
                  Select a generated design concept to add as an info photo in {CATEGORY_TAB_CONFIG.find((c) => c.id === activeCategory)?.label}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCanvasPickerOpen(false)}
                className="text-[#8c7a63] hover:text-[#2c2419] font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {savedDesignConcepts.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-[#ca981d] mx-auto" />
                <p className="font-serif font-bold text-sm text-[#2c2419]">No generated designs in canvas yet</p>
                <p className="text-xs text-[#6e5d48]">
                  Generate AI design renderings on the Design Canvas tab to import them here!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedDesignConcepts.map((concept) => (
                  <div
                    key={concept.id}
                    className="bg-[#faf6eb] border border-[#ebdcc0] rounded-2xl overflow-hidden p-3 flex flex-col justify-between space-y-3 hover:border-[#ca981d] transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="aspect-16/9 rounded-xl overflow-hidden bg-black/5">
                        <img src={concept.imageUrl} alt={concept.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[#ca981d] px-2 py-0.5 bg-[#fbf3d5] rounded-md inline-block">
                        {concept.category}
                      </span>
                      <h4 className="font-serif font-bold text-xs text-[#2c2419]">{concept.title}</h4>
                      <p className="text-[11px] text-[#6e5d48] line-clamp-2">{concept.prompt}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleImportConcept(concept)}
                      className="w-full py-2 bg-[#ca981d] hover:bg-[#b08314] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to {CATEGORY_TAB_CONFIG.find((c) => c.id === activeCategory)?.label}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Google Account Modal */}
      <GoogleAccountModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        profile={profile}
        onUpdateProfile={onUpdateProfile}
        onTriggerScan={onTriggerScan}
      />
    </div>
  );
};
