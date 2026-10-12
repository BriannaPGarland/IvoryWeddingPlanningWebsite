import React, { useState } from "react";
import { DesignConcept, WeddingProfile } from "../types";
import {
  Sparkles,
  Image as ImageIcon,
  Heart,
  Plus,
  RefreshCw,
  Download,
  Flame,
  Palette,
  Flower2,
  Cake,
  Building2,
  Lightbulb,
  Check,
  Share2,
} from "lucide-react";

interface Props {
  concepts: DesignConcept[];
  profile: WeddingProfile;
  onAddConcept: (concept: DesignConcept) => void;
  onToggleFavorite: (id: string) => void;
}

const CATEGORY_PROMPTS = [
  {
    category: "Bouquet",
    icon: Flower2,
    prompt: "Lush organic bridal bouquet with garden roses, white ranunculus, eucalyptus branches, trailing silk ribbon, warm natural sunlight",
  },
  {
    category: "Tablescape",
    icon: Palette,
    prompt: "Long wooden farm table, sage linen runner, terracotta ceramic plates, gold cutlery, taper candles, olive branch garland",
  },
  {
    category: "Cake",
    icon: Cake,
    prompt: "3-tiered white semi-naked wedding cake decorated with fresh chamomile, garden roses, and delicate sprigs on a raw wooden block",
  },
  {
    category: "Arch",
    icon: Building2,
    prompt: "Wooden open-air wedding arch adorned with asymmetrical lush white blooms, sage leaves, and soft ground flower arrangements",
  },
  {
    category: "Lighting",
    icon: Lightbulb,
    prompt: "Warm festoon string lights suspended over outdoor vineyard reception under a twilight sunset sky with flickering pillar candles",
  },
];

export const DesignCanvasTab: React.FC<Props> = ({
  concepts,
  profile,
  onAddConcept,
  onToggleFavorite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedCatForGen, setSelectedCatForGen] = useState<any>("Bouquet");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeConceptModal, setActiveConceptModal] = useState<DesignConcept | null>(null);

  const handleGenerateDesign = async () => {
    const promptToUse = customPrompt.trim() ||
      CATEGORY_PROMPTS.find(p => p.category === selectedCatForGen)?.prompt ||
      "Organic minimalist wedding decoration with sage greenery and warm terracotta accents";

    setIsGenerating(true);
    try {
      const res = await fetch("/api/gemini/render-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToUse,
          category: selectedCatForGen,
          style: profile.vibe,
          colorPalette: profile.colors.join(", "),
        }),
      });

      const data = await res.json();

      const newConcept: DesignConcept = {
        id: "c_" + Date.now(),
        title: `${selectedCatForGen} Render - ${profile.coupleNames}`,
        category: selectedCatForGen,
        prompt: promptToUse,
        imageUrl: data.imageUrl || `https://picsum.photos/seed/${Date.now()}/800/800`,
        dateCreated: new Date().toISOString().split("T")[0],
        likes: 1,
        isFavorite: true,
      };

      onAddConcept(newConcept);
      setActiveConceptModal(newConcept);
      setCustomPrompt("");
    } catch (e) {
      console.error("Error rendering design:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredConcepts = concepts.filter(
    (c) => selectedCategory === "All" || c.category === selectedCategory
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ebdcc0] pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2c2419]">
            AI Wedding Design Planning Canvas
          </h1>
          <p className="text-sm text-[#6e5d48] mt-1">
            Render high-fidelity design photos with Gemini AI inspired by your Pinterest database and color palette.
          </p>
        </div>

        {/* Pinterest Sync Badge */}
        <div className="flex items-center gap-2 bg-white border border-[#ebdcc0] px-3.5 py-2 rounded-xl text-xs font-semibold text-[#ca981d]">
          <Sparkles className="w-4 h-4 text-[#e5b331]" />
          <span>Pinterest Synced ({profile.syncedPinsCount} Pins Active)</span>
        </div>
      </div>

      {/* AI Render Studio Section */}
      <div className="bg-gradient-to-br from-[#2c2419] via-[#423321] to-[#604b30] text-white p-6 md:p-8 rounded-3xl shadow-sm space-y-6 border border-[#e5b331]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ca981d]/30 flex items-center justify-center border border-[#e5b331]/30">
              <Sparkles className="w-5 h-5 text-[#fbf0cb]" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-white">Gemini AI Image Render Studio</h2>
              <p className="text-xs text-[#e8dac1]">
                Describe your dream decor, floral arch, or cake to render a photo using your saved vision palette.
              </p>
            </div>
          </div>
        </div>

        {/* Category Picker for Generation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_PROMPTS.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedCatForGen === item.category;

            return (
              <button
                key={item.category}
                type="button"
                onClick={() => {
                  setSelectedCatForGen(item.category);
                  setCustomPrompt(item.prompt);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#ca981d] text-white shadow-xs"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.category}</span>
              </button>
            );
          })}
        </div>

        {/* Prompt Input Box */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Type your design prompt e.g., 'Ethereal wooden ceremony arch with butter yellow roses under Sonoma sunlight'..."
            className="flex-1 px-4 py-3 bg-white/95 border border-white/20 rounded-xl text-sm text-[#2c2419] placeholder-[#8c7a63] focus:outline-none focus:ring-2 focus:ring-[#ca981d]"
          />

          <button
            onClick={handleGenerateDesign}
            disabled={isGenerating}
            className="px-6 py-3 bg-[#ca981d] hover:bg-[#b08314] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin text-[#fbf0cb]" : ""}`} />
            <span>{isGenerating ? "Rendering AI Photo..." : "Render Design Photo"}</span>
          </button>
        </div>
      </div>

      {/* Design Concept Collection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-[#2d3732]">
            Rendered Vision Concepts ({filteredConcepts.length})
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                selectedCategory === "All"
                  ? "bg-[#0e6251] text-white"
                  : "bg-white text-[#526357] border border-[#e8e2d8]"
              }`}
            >
              All
            </button>
            {["Bouquet", "Tablescape", "Cake", "Arch", "Lighting"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  selectedCategory === cat
                    ? "bg-[#0e6251] text-white"
                    : "bg-white text-[#526357] border border-[#e8e2d8]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredConcepts.map((concept) => (
            <div
              key={concept.id}
              onClick={() => setActiveConceptModal(concept)}
              className="group bg-white border border-[#e8e2d8] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-[#faf9f5]">
                <img
                  src={concept.imageUrl}
                  alt={concept.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(concept.id);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                    concept.isFavorite
                      ? "bg-white text-[#e76f51] shadow-xs"
                      : "bg-black/30 text-white hover:bg-white hover:text-[#e76f51]"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${concept.isFavorite ? "fill-current" : ""}`} />
                </button>

                <span className="absolute bottom-3 left-3 text-[10px] bg-black/60 text-white backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">
                  {concept.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <h3 className="font-serif font-bold text-sm text-[#2d3732] line-clamp-1">
                  {concept.title}
                </h3>
                <p className="text-xs text-[#6e8073] line-clamp-2 italic">"{concept.prompt}"</p>
                <div className="pt-2 border-t border-[#f0eae0] flex items-center justify-between text-[11px] text-[#809286]">
                  <span>Created {concept.dateCreated}</span>
                  <span className="flex items-center gap-1 font-semibold text-[#0e6251]">
                    <Flame className="w-3 h-3 text-[#f4a261]" /> {concept.likes} Inspiration Likes
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Lightbox Modal for Design Concept */}
      {activeConceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#faf8f5] border border-[#e8e2d8] rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden text-[#2d3732] animate-in fade-in zoom-in duration-200">
            <div className="relative aspect-video bg-black">
              <img
                src={activeConceptModal.imageUrl}
                alt={activeConceptModal.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveConceptModal(null)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] bg-[#0e6251] text-white px-2.5 py-0.5 rounded-full font-bold uppercase">
                    {activeConceptModal.category}
                  </span>
                  <h2 className="text-xl font-serif font-bold text-[#2d3732] mt-1">
                    {activeConceptModal.title}
                  </h2>
                </div>

                <button
                  onClick={() => onToggleFavorite(activeConceptModal.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    activeConceptModal.isFavorite
                      ? "bg-[#e76f51] text-white"
                      : "bg-[#f0eae0] text-[#2d3732]"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${activeConceptModal.isFavorite ? "fill-current" : ""}`} />
                  <span>{activeConceptModal.isFavorite ? "Saved to Vision" : "Save Concept"}</span>
                </button>
              </div>

              <div className="bg-[#f0eae0] p-3.5 rounded-xl text-xs text-[#2d3732]">
                <span className="font-semibold text-[#0e6251] block uppercase text-[10px] mb-0.5">
                  Gemini Prompt Used:
                </span>
                <p className="italic">"{activeConceptModal.prompt}"</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#6e8073]">Inspired by Sonoma Wedding Vision Profile</span>
                <a
                  href={activeConceptModal.imageUrl}
                  download="Sereno_Wedding_Design.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#0e6251] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#f4a261]" /> Download High Res
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
