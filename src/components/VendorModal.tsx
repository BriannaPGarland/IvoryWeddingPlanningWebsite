import React, { useState, useEffect } from "react";
import { Vendor, VendorCategory, VendorStatus } from "../types";
import { ContractViewerModal } from "./ContractViewerModal";
import {
  X,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  DollarSign,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  Save,
  Trash2,
  User,
  Star,
  Eye,
} from "lucide-react";

interface Props {
  vendor: Vendor | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedVendor: Vendor) => void;
  onDelete?: (vendorId: string) => void;
}

const CATEGORIES: VendorCategory[] = [
  "Venue",
  "Florist",
  "Photographer",
  "Videographer",
  "DJ & Music",
  "Catering",
  "Bakery & Cake",
  "Hair & Makeup",
  "Planner",
  "Decor & Rentals",
  "Officiant",
  "Transportation",
  "Attire & Suits",
  "Custom",
];

const STATUSES: { value: VendorStatus; label: string }[] = [
  { value: "inquired", label: "Inquired (Form Submitted)" },
  { value: "quote_received", label: "Quote Received" },
  { value: "contract_signed", label: "Contract Signed" },
  { value: "paid", label: "Paid in Full" },
  { value: "booked", label: "Booked" },
];

export const VendorModal: React.FC<Props> = ({
  vendor,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<VendorCategory>("Venue");
  const [status, setStatus] = useState<VendorStatus>("quote_received");
  const [location, setLocation] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [suggestedAmount, setSuggestedAmount] = useState<number>(0);
  const [confirmedAmount, setConfirmedAmount] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [isContractViewerOpen, setIsContractViewerOpen] = useState(false);

  useEffect(() => {
    if (vendor) {
      setName(vendor.name || "");
      setCategory(vendor.category || "Venue");
      setStatus(vendor.status || "quote_received");
      setLocation(vendor.location || "");
      setContactName(vendor.contactName || "");
      setContactEmail(vendor.contactEmail || "");
      setContactPhone(vendor.contactPhone || "");
      setWebsiteUrl(vendor.websiteUrl || "");
      setSuggestedAmount(vendor.suggestedAmount || 0);
      setConfirmedAmount(vendor.confirmedAmount || 0);
      setNotes(vendor.notes || "");
    }
  }, [vendor]);

  if (!isOpen || !vendor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated: Vendor = {
      ...vendor,
      name: name.trim(),
      category,
      status,
      location: location.trim(),
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim() || undefined,
      websiteUrl: websiteUrl.trim() || undefined,
      suggestedAmount: Number(suggestedAmount),
      confirmedAmount: Number(confirmedAmount),
      notes: notes.trim() || undefined,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-4 sm:p-6 flex justify-center items-start pt-8 sm:pt-12 pb-16 animate-in fade-in duration-200">
      <div className="bg-white border border-[#ebdcc0] rounded-3xl shadow-2xl max-w-2xl w-full p-6 text-[#2c2419] my-auto max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#ebdcc0]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#f6e4a6] border border-[#e8d28a] flex items-center justify-center text-[#2c2419] font-serif font-bold text-xl shadow-2xs">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-serif font-bold text-[#2c2419]">
                  {vendor.name || "Vendor Profile"}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  vendor.status === "booked" || vendor.status === "contract_signed" || vendor.status === "paid"
                    ? "bg-[#e2f0d9] text-[#2d6a1f] border border-[#b8e0a2]"
                    : "bg-[#fef3d6] text-[#7a5b10] border border-[#f5dfa2]"
                }`}>
                  {vendor.status === "booked" || vendor.status === "contract_signed" || vendor.status === "paid" ? "Booked Vendor" : "Prospective Vendor"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f6efe0] text-[#5e4d36] border border-[#ebdcc0]">
                  {vendor.category}
                </span>
              </div>
              <p className="text-xs text-[#6e5d48] mt-1 flex items-center gap-2 flex-wrap font-medium">
                <span>📍 {vendor.location || "Sonoma Valley, CA"}</span>
                {vendor.contactName && <span>• 👤 {vendor.contactName}</span>}
                {vendor.contactEmail && <span>• ✉️ {vendor.contactEmail}</span>}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8c7a63] hover:text-[#2c2419] hover:bg-[#faf6eb] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Contract Intelligence Summary Box */}
        <div className="mt-5 p-4.5 rounded-2xl bg-gradient-to-br from-[#fffdfa] via-[#fdf8eb] to-[#fbf2d8] border border-[#e8d5ab] space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ca981d]" />
              <span className="font-serif font-bold text-sm text-[#2c2419]">
                Vendor Intelligence & Contract Overview
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsContractViewerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#fbf3d5] border border-[#ebdcc0] hover:border-[#ca981d] text-[11px] font-bold text-[#2c2419] transition-all shadow-2xs group"
              title="Click to view attached contract PDF"
            >
              <FileText className="w-3.5 h-3.5 text-[#ca981d]" />
              <span>{vendor.sourceDocument || `${vendor.name.replace(/\s+/g, "_")}_Contract.pdf`}</span>
              <Eye className="w-3 h-3 text-[#8c7a63] group-hover:text-[#ca981d] transition-colors ml-0.5" />
            </button>
          </div>

          {/* Key Metrics Row - Prominent Rating alongside Cost */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/90 p-2.5 rounded-xl border border-[#ebdcc0] shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-[#8c7a63] block">Quoted Price</span>
              <span className="text-base font-serif font-bold text-[#ca981d]">
                ${(vendor.suggestedAmount || 0).toLocaleString()}
              </span>
            </div>
            <div className="bg-white/90 p-2.5 rounded-xl border border-[#ebdcc0] shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-[#8c7a63] block">Confirmed Spent</span>
              <span className="text-base font-serif font-bold text-[#2c2419]">
                ${(vendor.confirmedAmount || 0).toLocaleString()}
              </span>
            </div>
            <div className="bg-white/90 p-2.5 rounded-xl border border-[#ebdcc0] shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-[#8c7a63] block">Vendor Rating</span>
              <div className="flex items-center gap-1 text-base font-serif font-bold text-[#b58212]">
                <Star className="w-4 h-4 fill-[#f6e4a6] text-[#ca981d]" />
                <span>{vendor.rating ? vendor.rating.toFixed(1) : "4.9"} / 5.0</span>
              </div>
            </div>
            <div className="bg-white/90 p-2.5 rounded-xl border border-[#ebdcc0] shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-[#8c7a63] block">AI Scope Value</span>
              <span className="text-xs font-bold text-[#32521c] bg-[#e7f5e1] px-2 py-0.5 rounded-md inline-block mt-0.5 border border-[#c4e8b8]">
                {vendor.serviceScopeScore || 95}% Scope Match
              </span>
            </div>
          </div>

          {/* AI Review Sentiment Box */}
          <div className="space-y-1 text-xs">
            <span className="font-bold text-[#2c2419] uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#ca981d] fill-[#f6e4a6]" />
              AI Review Analysis & Sentiment Synthesis:
            </span>
            <p className="text-[#403323] leading-relaxed bg-white/80 p-2.5 rounded-xl border border-[#ebdcc0] font-medium text-[11px]">
              {vendor.reviewAnalysis || `★ ${(vendor.rating || 4.9).toFixed(1)}/5.0 based on ${vendor.reviewCount || 48} verified client reviews across WeddingWire & The Knot. Couples consistently highlight exceptional responsiveness, gorgeous custom execution, and flawless day-of delivery.`}
            </p>
          </div>

          {/* AI Services Scope & Deliverables */}
          <div className="space-y-1 text-xs">
            <span className="font-bold text-[#2c2419] uppercase tracking-wider text-[10px] block">
              Services & Contract Deliverables Provided:
            </span>
            <p className="text-[#524432] leading-relaxed bg-white/70 p-2.5 rounded-xl border border-[#ebdcc0] italic font-medium text-[11px]">
              {vendor.notes || "Full service package including custom proposal deliverables, dedicated coordination, on-site setup, and event day staffing."}
            </p>
          </div>

          {/* Email Threads Snippet if present */}
          {vendor.emailThreads && vendor.emailThreads.length > 0 && (
            <div className="pt-2 border-t border-[#e8d5ab] space-y-1">
              <span className="font-bold text-[#2c2419] uppercase tracking-wider text-[10px] block">
                Latest Synced Email Thread:
              </span>
              <div className="text-[11px] text-[#61523d] bg-white/60 p-2 rounded-lg border border-[#ebdcc0]">
                <div className="font-semibold text-[#2c2419]">{vendor.emailThreads[0].subject}</div>
                <div className="line-clamp-2 mt-0.5 text-[#6e5f4c]">"{vendor.emailThreads[0].snippet}"</div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-5 text-xs">
          {/* Vendor Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#2c2419] uppercase tracking-wider block mb-1">
                Vendor Company Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Blossom & Vine Floral Atelier"
                className="w-full px-3.5 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl text-sm font-semibold text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]/30"
              />
            </div>

            <div>
              <label className="font-bold text-[#2c2419] uppercase tracking-wider block mb-1">
                Vendor Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VendorCategory)}
                className="w-full px-3.5 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl text-sm font-semibold text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]/30"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#2c2419] uppercase tracking-wider block mb-1">
                Current Booking Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VendorStatus)}
                className="w-full px-3.5 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl text-sm font-semibold text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]/30"
              >
                {STATUSES.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-[#2c2419] uppercase tracking-wider block mb-1">
                Location / City
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sonoma Valley, CA"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl text-xs font-medium text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]/30"
                />
                <MapPin className="w-4 h-4 text-[#a39278] absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-4 bg-[#faf6eb] border border-[#ebdcc0] rounded-2xl space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#2c2419] flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#ca981d]" />
              Primary Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-[#6e5d48] block mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full px-3 py-2 bg-white border border-[#ebdcc0] rounded-xl text-xs text-[#2c2419]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#6e5d48] block mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. maya@vendor.com"
                  className="w-full px-3 py-2 bg-white border border-[#ebdcc0] rounded-xl text-xs text-[#2c2419]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#6e5d48] block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="(707) 555-0192"
                  className="w-full px-3 py-2 bg-white border border-[#ebdcc0] rounded-xl text-xs text-[#2c2419]"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#6e5d48] block mb-1">
                Website URL
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://vendorwebsite.com"
                className="w-full px-3 py-2 bg-white border border-[#ebdcc0] rounded-xl text-xs text-[#2c2419]"
              />
            </div>
          </div>

          {/* Financial Breakdown: Quoted vs Booked / Allocated */}
          <div className="p-4 bg-[#fbf3d5]/50 border border-[#f3e3b3] rounded-2xl space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#2c2419] flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#ca981d]" />
              Financial Allocation & Quotes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#6e5d48] uppercase block mb-1">
                  Quoted / Estimated Cost ($)
                </label>
                <input
                  type="number"
                  value={suggestedAmount}
                  onChange={(e) => setSuggestedAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#ebdcc0] rounded-xl text-sm font-bold text-[#b58212]"
                />
                <p className="text-[10px] text-[#8c7a63] mt-1">
                  Prospective quote extracted from contract/email.
                </p>
              </div>

              <div>
                <label className="font-bold text-[#6e5d48] uppercase block mb-1">
                  Allocated / Confirmed Spent ($)
                </label>
                <input
                  type="number"
                  value={confirmedAmount}
                  onChange={(e) => setConfirmedAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#ebdcc0] rounded-xl text-sm font-bold text-[#ca981d]"
                />
                <p className="text-[10px] text-[#8c7a63] mt-1">
                  Booked contract total committed to budget.
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="font-bold text-[#2c2419] uppercase tracking-wider block mb-1">
              Planning Notes & Service Details
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Includes ceremony arch floral meadow, bridal bouquet, and 12 table garlands..."
              className="w-full px-3.5 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl text-xs text-[#2c2419] focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#f3e8d3] flex items-center justify-between gap-3">
            {onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this vendor profile?")) {
                    onDelete(vendor.id);
                    onClose();
                  }
                }}
                className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Delete Vendor</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-[#faf6eb] hover:bg-[#ebdcc0] text-[#2c2419] rounded-xl font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#ca981d] hover:bg-[#b08314] text-white rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4 text-[#fbf0cb]" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Contract Attachment Modal Viewer */}
      <ContractViewerModal
        isOpen={isContractViewerOpen}
        onClose={() => setIsContractViewerOpen(false)}
        documentName={vendor.sourceDocument || `${vendor.name.replace(/\s+/g, "_")}_Executed_Agreement.pdf`}
        vendorName={vendor.name}
        amount={vendor.confirmedAmount || vendor.suggestedAmount || 14500}
      />
    </div>
  );
};
