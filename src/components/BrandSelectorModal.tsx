import React, { useState } from "react";
import { BrandConfig } from "../types";
import { BRAND_PRESETS } from "../data/initialData";
import { Sparkles, Check, X, Tag, Palette } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentBrand: BrandConfig;
  onSelectBrand: (brand: BrandConfig) => void;
}

export const BrandSelectorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentBrand,
  onSelectBrand,
}) => {
  const [customName, setCustomName] = useState("");

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onSelectBrand({
      name: customName.trim(),
      tagline: "Custom Calming AI Wedding Companion",
      primaryColor: currentBrand.primaryColor || "#2b4c7e",
      accentColor: currentBrand.accentColor || "#e3a857",
      bgTone: "#f5f7fa",
    });
    setCustomName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-[#fdfcfa] border border-[#ebdcc0] rounded-3xl shadow-2xl max-w-xl w-full p-6 text-[#2c2419] animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#ebdcc0]">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#ca981d]" />
            <h2 className="text-lg font-serif font-bold text-[#2c2419]">Design Themes & Brand Identity</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8c7a63] hover:text-[#2c2419] rounded-xl hover:bg-[#f6efe0]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#6e5d48] my-3 leading-relaxed">
          Select a sleek butter yellow and warm ivory theme to personalize your app's color palette:
        </p>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {BRAND_PRESETS.map((preset) => {
            const isSelected = preset.name === currentBrand.name;
            return (
              <div
                key={preset.name}
                onClick={() => {
                  onSelectBrand(preset);
                  onClose();
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? "border-[#ca981d] bg-white ring-2 ring-[#f3e3b3] shadow-xs"
                    : "border-[#ebdcc0] bg-white hover:border-[#ca981d]/50"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-ivory-script text-2xl font-normal italic text-[#2c2419]">
                      {preset.name}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] bg-[#ca981d] text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 text-[#fbf0cb]" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6e5d48] font-medium">{preset.tagline}</p>
                </div>

                {/* Color Swatch Circles */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center -space-x-1">
                    <span
                      className="w-6 h-6 rounded-full border-2 border-white shadow-2xs"
                      style={{ backgroundColor: preset.primaryColor }}
                      title={`Primary: ${preset.primaryColor}`}
                    />
                    <span
                      className="w-6 h-6 rounded-full border-2 border-white shadow-2xs"
                      style={{ backgroundColor: preset.accentColor }}
                      title={`Accent: ${preset.accentColor}`}
                    />
                    <span
                      className="w-6 h-6 rounded-full border-2 border-white shadow-2xs"
                      style={{ backgroundColor: preset.bgTone || "#f5f7fa" }}
                      title="Background tone"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleCustomSubmit} className="mt-5 pt-4 border-t border-[#e8e2d8]">
          <label className="block text-xs font-bold text-[#4a5a50] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#2b4c7e]" /> Or Rename Application:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Blossom & Vow, Solene AI, Weddly"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs bg-white border border-[#d8cfc4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4c7e]/30"
            />
            <button
              type="submit"
              disabled={!customName.trim()}
              className="px-4 py-2 bg-[#2b4c7e] hover:bg-[#1f3a63] disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs"
            >
              Apply Custom Name
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
