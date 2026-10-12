import React, { useState } from "react";
import { DirectoryVendor, EmailMessage, Vendor, VendorCategory, VendorStatus, WeddingProfile } from "../types";
import {
  Users,
  Plus,
  Search,
  Sparkles,
  FileText,
  Mail,
  Check,
  Edit2,
  DollarSign,
  ExternalLink,
  Music,
  Flower2,
  Scissors,
  Building2,
  CalendarCheck,
  Camera,
  Video,
  Utensils,
  Cake,
  Palette,
  Scroll,
  Truck,
  Shirt,
  Star,
  MapPin,
  CheckCircle2,
  Clock,
  X,
  AlertCircle,
  FileSearch,
  Sliders,
  Send,
  ShieldCheck,
  ChevronRight,
  Info,
} from "lucide-react";
import { INITIAL_DIRECTORY_VENDORS } from "../data/initialData";

interface Props {
  vendors: Vendor[];
  profile: WeddingProfile;
  emails: EmailMessage[];
  onAddVendor: (vendor: Vendor) => void;
  onUpdateVendor: (vendorId: string, updated: Partial<Vendor>) => void;
  onNavigateTab: (tab: string) => void;
  onAddEmailThread?: (email: EmailMessage) => void;
  onOpenVendorProfile?: (vendor: Vendor) => void;
  brandPrimaryColor?: string;
  subTab?: "booked" | "prospective" | "search";
  onSubTabChange?: (tab: "booked" | "prospective" | "search") => void;
}

export const CATEGORY_ICONS: Record<VendorCategory, React.ElementType> = {
  "DJ & Music": Music,
  Florist: Flower2,
  "Hair & Makeup": Scissors,
  Venue: Building2,
  Planner: CalendarCheck,
  Photographer: Camera,
  Videographer: Video,
  Catering: Utensils,
  "Bakery & Cake": Cake,
  "Decor & Rentals": Palette,
  Officiant: Scroll,
  Transportation: Truck,
  "Attire & Suits": Shirt,
  Custom: Sparkles,
};

export const CATEGORY_LIST: VendorCategory[] = [
  "Venue",
  "Florist",
  "DJ & Music",
  "Hair & Makeup",
  "Photographer",
  "Videographer",
  "Planner",
  "Catering",
  "Bakery & Cake",
  "Decor & Rentals",
  "Officiant",
  "Transportation",
  "Attire & Suits",
  "Custom",
];

export const VendorsTab: React.FC<Props> = ({
  vendors,
  profile,
  emails,
  onAddVendor,
  onUpdateVendor,
  onNavigateTab,
  onAddEmailThread,
  onOpenVendorProfile,
  brandPrimaryColor = "#2b4c7e",
  subTab,
  onSubTabChange,
}) => {
  // Inner Sub-Tab State: 'booked' | 'prospective' | 'search'
  const [activeSubTab, setActiveSubTab] = useState<"booked" | "prospective" | "search">(subTab || "booked");

  React.useEffect(() => {
    if (subTab) {
      setActiveSubTab(subTab);
    }
  }, [subTab]);

  const handleSubTabClick = (tab: "booked" | "prospective" | "search") => {
    setActiveSubTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [radiusMiles, setRadiusMiles] = useState<number>(35);

  // Prospective Vendors Filter & Sort State
  const [prospectiveCategory, setProspectiveCategory] = useState<string>("All");
  const [prospectiveSort, setProspectiveSort] = useState<"cheapest" | "highest_price" | "rating" | "scope">("rating");

  // Directory Search Vendor Data State
  const [directoryVendors, setDirectoryVendors] = useState<DirectoryVendor[]>(INITIAL_DIRECTORY_VENDORS);

  // Selected Vendor State for Details/Drawer
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(
    vendors.find((v) => v.status === "booked" || v.status === "contract_signed") || vendors[0] || null
  );

  // Modals State
  const [isBookConfirmModalOpen, setIsBookConfirmModalOpen] = useState(false);
  const [bookingVendorTarget, setBookingVendorTarget] = useState<Vendor | null>(null);
  const [confirmedBookingPrice, setConfirmedBookingPrice] = useState<number>(0);

  // Inquire Modal State for Directory Vendor Search
  const [selectedDirectoryInquiry, setSelectedDirectoryInquiry] = useState<DirectoryVendor | null>(null);
  const [inquiryFormData, setInquiryFormData] = useState({
    fullName: `${profile.partner1} & ${profile.partner2}`,
    email: profile.gmailAddress,
    eventDate: profile.weddingDate,
    guestCount: profile.guestCount,
    venueLocation: profile.location || "Sonoma / Napa, CA",
    styleVision: profile.vibe || "Organic Botanical Ethereal with warm neutral accents",
    budgetRange: `$${Math.round(profile.budget * 0.1).toLocaleString()} - $${Math.round(profile.budget * 0.25).toLocaleString()}`,
    specialRequests: "Requesting date availability, pricing breakdown, and sample portfolio.",
  });
  const [inquirySuccessMsg, setInquirySuccessMsg] = useState<string | null>(null);

  // Filtered Booked Vendors
  const bookedVendors = vendors.filter(
    (v) => v.status === "booked" || v.status === "contract_signed"
  );

  // Filtered Prospective Vendors
  const rawProspectiveVendors = vendors.filter(
    (v) => v.status === "inquired" || v.status === "quote_received"
  );

  const prospectiveVendors = [...rawProspectiveVendors]
    .filter((v) => prospectiveCategory === "All" || v.category === prospectiveCategory)
    .sort((a, b) => {
      if (prospectiveSort === "cheapest") {
        const diff = (a.suggestedAmount || 0) - (b.suggestedAmount || 0);
        if (diff !== 0) return diff;
        return (b.rating || 0) - (a.rating || 0);
      }
      if (prospectiveSort === "highest_price") {
        const diff = (b.suggestedAmount || 0) - (a.suggestedAmount || 0);
        if (diff !== 0) return diff;
        return (b.rating || 0) - (a.rating || 0);
      }
      if (prospectiveSort === "rating") {
        const diff = (b.rating || 0) - (a.rating || 0);
        if (diff !== 0) return diff;
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
      if (prospectiveSort === "scope") {
        const scoreA = a.serviceScopeScore || (a.notes?.length || 0);
        const scoreB = b.serviceScopeScore || (b.notes?.length || 0);
        const diff = scoreB - scoreA;
        if (diff !== 0) return diff;
        return (a.suggestedAmount || 0) - (b.suggestedAmount || 0);
      }
      return 0;
    });

  // Calculate Average Quoted Cost for Selected Category or All
  const avgQuotedCost = prospectiveVendors.length > 0
    ? Math.round(prospectiveVendors.reduce((acc, v) => acc + (v.suggestedAmount || 0), 0) / prospectiveVendors.length)
    : 0;

  // Trigger Booking Price Confirmation
  const handleOpenBookConfirmModal = (vendor: Vendor) => {
    setBookingVendorTarget(vendor);
    setConfirmedBookingPrice(vendor.confirmedAmount || vendor.suggestedAmount || 2500);
    setIsBookConfirmModalOpen(true);
  };

  const handleConfirmBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingVendorTarget) return;

    onUpdateVendor(bookingVendorTarget.id, {
      status: "booked",
      confirmedAmount: Number(confirmedBookingPrice),
      notes: (bookingVendorTarget.notes || "") + " [Contract confirmed & booked!]",
    });

    setIsBookConfirmModalOpen(false);
    setActiveSubTab("booked");
  };

  // Trigger Inquire with AI Submission
  const handleSendAIInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDirectoryInquiry) return;

    // Create new prospective vendor in user state
    const newVendor: Vendor = {
      id: "v_" + Date.now(),
      name: selectedDirectoryInquiry.name,
      category: selectedDirectoryInquiry.category,
      status: "inquired",
      location: selectedDirectoryInquiry.location,
      contactName: "Primary Coordinator",
      contactEmail: `inquiries@${selectedDirectoryInquiry.name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
      websiteUrl: selectedDirectoryInquiry.websiteUrl,
      suggestedAmount: parseInt(selectedDirectoryInquiry.estimatedPriceRange.replace(/[^0-9]/g, "")) || 3500,
      confirmedAmount: 0,
      notes: `AI-Inquired via website form. Vision: ${inquiryFormData.styleVision}`,
      rating: selectedDirectoryInquiry.rating,
      dateAdded: new Date().toISOString().split("T")[0],
      emailThreads: [
        {
          id: "em_" + Date.now(),
          sender: selectedDirectoryInquiry.name,
          email: `inquiries@${selectedDirectoryInquiry.name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
          subject: `Automated Receipt: Wedding Inquiry for ${inquiryFormData.fullName}`,
          snippet: `Thank you for inquiring with ${selectedDirectoryInquiry.name}! We received your request for ${inquiryFormData.eventDate}.`,
          date: "Just now",
        },
      ],
    };

    onAddVendor(newVendor);

    setInquirySuccessMsg(`Inquiry successfully submitted to ${selectedDirectoryInquiry.name}! Form auto-filled via Chrome Extension.`);
    setTimeout(() => {
      setInquirySuccessMsg(null);
      setSelectedDirectoryInquiry(null);
      setActiveSubTab("prospective");
    }, 1800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e6e0d4] pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2d3732]">Vendors & Contracts Hub</h1>
          <p className="text-sm text-[#5c6d62] mt-1">
            Separated view of booked contracted partners, prospective quotes received, and AI vendor search.
          </p>
        </div>

        {/* Sub-Navigation Tabs Switcher */}
        <div className="flex items-center gap-1 bg-[#faf6eb] p-1.5 rounded-2xl border border-[#ebdcc0] self-start md:self-auto">
          <button
            onClick={() => handleSubTabClick("booked")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "booked"
                ? "bg-[#ca981d] text-white shadow-2xs"
                : "text-[#6e5d48] hover:text-[#2c2419]"
            }`}
          >
            Booked Vendors ({bookedVendors.length})
          </button>

          <button
            onClick={() => handleSubTabClick("prospective")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "prospective"
                ? "bg-[#ca981d] text-white shadow-2xs"
                : "text-[#6e5d48] hover:text-[#2c2419]"
            }`}
          >
            Prospective Vendors ({prospectiveVendors.length})
          </button>

          <button
            onClick={() => handleSubTabClick("search")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "search"
                ? "bg-[#ca981d] text-white shadow-2xs"
                : "text-[#6e5d48] hover:text-[#2c2419]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#fbf0cb]" />
            <span>Vendor Search</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: BOOKED VENDORS */}
      {/* ========================================================================= */}
      {activeSubTab === "booked" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#fffdfa] border border-[#ebdcc0] p-4 rounded-2xl flex items-center justify-between text-xs shadow-2xs">
            <div className="flex items-center gap-2 text-[#2c2419]">
              <ShieldCheck className="w-5 h-5 text-[#ca981d]" />
              <span className="font-bold">
                Contracted Partners ({bookedVendors.length})
              </span>
            </div>
            <span className="text-[#6e5d48]">
              Total Booked Spent:{" "}
              <strong className="text-[#b58212] text-sm font-bold">
                ${bookedVendors.reduce((acc, v) => acc + (v.confirmedAmount || 0), 0).toLocaleString()}
              </strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {bookedVendors.map((vendor) => {
              const Icon = CATEGORY_ICONS[vendor.category] || Sparkles;

              return (
                <div
                  key={vendor.id}
                  className="bg-white border border-[#ebdcc0] rounded-3xl p-5 shadow-2xs space-y-4 hover:border-[#ca981d] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#fbf3d5] border border-[#f3e3b3] flex items-center justify-center text-[#ca981d]">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => onOpenVendorProfile && onOpenVendorProfile(vendor)}
                            className="font-serif font-bold text-base text-[#2c2419] hover:text-[#ca981d] text-left hover:underline transition-colors block"
                            title="Click to view full vendor profile"
                          >
                            {vendor.name}
                          </button>
                          <span className="text-xs text-[#6e5d48] font-semibold">{vendor.category}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-[#fbf3d5] text-[#5e470e] rounded-full font-bold text-[10px] flex items-center gap-1 border border-[#f3e3b3]">
                        <CheckCircle2 className="w-3 h-3 text-[#ca981d]" /> Booked
                      </span>
                    </div>

                    <div className="p-3 bg-[#faf6eb] rounded-2xl border border-[#ebdcc0] text-xs space-y-1">
                      <div className="flex justify-between text-[#6e5d48]">
                        <span>Contracted Spent:</span>
                        <span className="font-bold text-[#2c2419]">${(vendor.confirmedAmount || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[#6e5d48]">
                        <span>Location:</span>
                        <span className="font-medium text-[#2c2419]">{vendor.location}</span>
                      </div>
                    </div>

                    {vendor.notes && (
                      <p className="text-xs text-[#5e4f3a] italic bg-[#fffdfa] p-2.5 rounded-xl border border-[#ebdcc0]">
                        "{vendor.notes}"
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#f3e8d3] flex items-center justify-between text-xs">
                    {onOpenVendorProfile && (
                      <button
                        onClick={() => onOpenVendorProfile(vendor)}
                        className="px-3 py-1.5 bg-[#fbf3d5] hover:bg-[#f3db78] text-[#5e470e] border border-[#f3e3b3] rounded-xl font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#ca981d]" />
                        <span>Edit Profile</span>
                      </button>
                    )}
                    <button
                      onClick={() => onNavigateTab("inbox")}
                      className="text-xs text-[#ca981d] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Vendor Inbox</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: PROSPECTIVE VENDORS */}
      {/* ========================================================================= */}
      {activeSubTab === "prospective" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Summary & Average Quoted Cost */}
          <div className="bg-[#fffdfa] border border-[#ebdcc0] p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-center gap-2 text-[#2c2419]">
              <Clock className="w-5 h-5 text-[#ca981d]" />
              <span className="font-bold text-sm">
                {prospectiveCategory === "All"
                  ? `Active Quotes & Proposals (${prospectiveVendors.length})`
                  : `${prospectiveCategory} Proposals & Quotes (${prospectiveVendors.length})`}
              </span>
            </div>
            <div className="flex items-center gap-4 text-[#6e5d48]">
              <span>
                Average Quoted Cost {prospectiveCategory !== "All" ? `for ${prospectiveCategory}` : ""}:{" "}
                <strong className="text-[#b58212] text-base font-bold">
                  ${avgQuotedCost.toLocaleString()}
                </strong>
              </span>
            </div>
          </div>

          {/* Sub-Filters & Sorting Toolbar */}
          <div className="bg-white border border-[#ebdcc0] p-4 rounded-2xl shadow-2xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[11px] font-bold text-[#8c7a63] uppercase tracking-wider whitespace-nowrap mr-1">
                  Category:
                </span>
                {["All", "Florist", "DJ & Music", "Hair & Makeup", "Venue", "Catering", "Photographer"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProspectiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      prospectiveCategory === cat
                        ? "bg-[#ca981d] text-white shadow-2xs font-bold"
                        : "bg-[#faf6eb] text-[#6e5d48] hover:bg-[#f3e3b3] hover:text-[#2c2419]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                <span className="text-[11px] font-bold text-[#8c7a63] uppercase tracking-wider whitespace-nowrap">
                  Sort By:
                </span>
                <select
                  value={prospectiveSort}
                  onChange={(e) => setProspectiveSort(e.target.value as any)}
                  className="bg-[#faf6eb] border border-[#ebdcc0] text-[#2c2419] text-xs font-semibold px-3 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ca981d]"
                >
                  <option value="rating">⭐ Highest Reviewed / Rating First</option>
                  <option value="cheapest">💲 Cheapest First (Lowest Quoted Cost)</option>
                  <option value="highest_price">📈 Highest Price First</option>
                  <option value="scope">📦 Most Value / AI Scope Provided First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Prospective Vendors Grid */}
          {prospectiveVendors.length === 0 ? (
            <div className="bg-white border border-[#ebdcc0] rounded-3xl p-10 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-[#ca981d] mx-auto" />
              <h3 className="font-serif font-bold text-lg text-[#2c2419]">No prospective vendors found</h3>
              <p className="text-xs text-[#6e5d48]">
                Try selecting "All" categories or search for new vendor proposals in the Vendor Search tab.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {prospectiveVendors.map((vendor) => {
                const Icon = CATEGORY_ICONS[vendor.category] || Sparkles;

                return (
                  <div
                    key={vendor.id}
                    className="bg-white border border-[#ebdcc0] rounded-3xl p-5 shadow-2xs space-y-4 hover:border-[#ca981d] transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#fbf3d5] border border-[#f3e3b3] flex items-center justify-center text-[#ca981d] shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => onOpenVendorProfile && onOpenVendorProfile(vendor)}
                              className="font-serif font-bold text-base text-[#2c2419] hover:text-[#ca981d] text-left hover:underline transition-colors block leading-tight"
                              title="Click to view full vendor profile"
                            >
                              {vendor.name}
                            </button>
                            <span className="text-xs text-[#6e5d48] font-semibold">{vendor.category}</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-[#fbf3d5] text-[#5e470e] border border-[#f3e3b3] rounded-full font-bold text-[10px] shrink-0">
                          Quote Received
                        </span>
                      </div>

                      {/* Quoted Cost & Prominent Star Rating Metrics Box */}
                      <div className="grid grid-cols-2 gap-2 p-3 bg-[#faf6eb] rounded-2xl border border-[#ebdcc0] text-xs">
                        <div>
                          <span className="text-[#8c7a63] font-bold text-[10px] uppercase block">Total Quoted Cost</span>
                          <span className="font-serif font-bold text-base text-[#b58212]">
                            ${(vendor.suggestedAmount || 0).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#8c7a63] font-bold text-[10px] uppercase block">Online Rating</span>
                          <div className="flex items-center gap-1 font-serif font-bold text-sm text-[#2c2419]">
                            <Star className="w-3.5 h-3.5 fill-[#f6e4a6] text-[#ca981d]" />
                            <span>{(vendor.rating || 4.9).toFixed(1)} / 5.0</span>
                            <span className="text-[10px] font-normal text-[#8c7a63]">({vendor.reviewCount || 48})</span>
                          </div>
                        </div>
                      </div>

                      {/* AI Review Sentiment Summary Box */}
                      <div className="p-3 bg-[#fbf6ea] border border-[#e8d7b3] rounded-2xl text-xs space-y-1">
                        <div className="flex items-center gap-1 font-bold text-[#b58212] text-[10px] uppercase tracking-wider">
                          <Star className="w-3 h-3 text-[#ca981d] fill-[#f6e4a6]" /> AI Review Analysis
                        </div>
                        <p className="text-[#3d3222] text-[11px] font-medium leading-relaxed">
                          {vendor.reviewAnalysis || `★ ${(vendor.rating || 4.9).toFixed(1)}/5.0 based on ${vendor.reviewCount || 48} verified reviews. Outstanding design craftsmanship and punctual execution.`}
                        </p>
                      </div>

                      {/* AI Scope Score & Deliverables Comparison */}
                      <div className="p-3 bg-[#fdfaf2] border border-[#f3e3b3] rounded-2xl text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-bold text-[#ca981d] text-[10px] uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-[#e5b331]" /> AI Service Scope
                          </span>
                          <span className="text-[10px] font-bold bg-[#e7f5e1] text-[#2d6a1f] px-2 py-0.5 rounded-md border border-[#c4e8b8]">
                            {vendor.serviceScopeScore || 92}% Value Match
                          </span>
                        </div>
                        <p className="text-[11px] text-[#4a3e2e] leading-snug">
                          <strong>Deliverables Scope:</strong> {vendor.notes || "Full package coverage including custom setup, design execution, and event staffing."}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-[#f3e8d3] flex items-center gap-2">
                      {onOpenVendorProfile && (
                        <button
                          onClick={() => onOpenVendorProfile(vendor)}
                          className="py-2 px-3 bg-[#fbf3d5] hover:bg-[#f3db78] text-[#5e470e] border border-[#f3e3b3] rounded-xl font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#ca981d]" />
                          <span>Profile</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenBookConfirmModal(vendor)}
                        className="flex-1 py-2 bg-[#ca981d] hover:bg-[#b08314] text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Book Vendor
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: VENDOR SEARCH (DIRECTORY & EXTENSION INQUIRY) */}
      {/* ========================================================================= */}
      {activeSubTab === "search" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Radius & Category Filter Toolbar */}
          <div className="bg-white border border-[#e8e2d8] p-5 rounded-3xl shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="font-serif font-bold text-base text-[#2d3732]">
                  Directory Vendor Search around {profile.location || "Sonoma / Napa, CA"}
                </h2>
              </div>

              {/* Radius Search Slider */}
              <div className="flex items-center gap-3 bg-[#faf9f5] px-4 py-2 rounded-2xl border border-[#e8e2d8] text-xs">
                <Sliders className="w-4 h-4 text-[#2b4c7e]" />
                <span className="font-bold text-[#2d3732]">Search Radius:</span>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={radiusMiles}
                  onChange={(e) => setRadiusMiles(Number(e.target.value))}
                  className="w-28 accent-[#2b4c7e]"
                />
                <span className="font-extrabold text-[#2b4c7e] bg-white px-2 py-0.5 rounded-md border border-[#d8cfc3]">
                  {radiusMiles} miles
                </span>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === "All"
                    ? "bg-[#2b4c7e] text-white"
                    : "bg-[#f5f2eb] border border-[#e8e2d8] text-[#526357]"
                }`}
              >
                All Categories
              </button>
              {CATEGORY_LIST.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-[#2b4c7e] text-white"
                      : "bg-[#f5f2eb] border border-[#e8e2d8] text-[#526357]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Vendor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {directoryVendors
              .filter((v) => selectedCategory === "All" || v.category === selectedCategory)
              .filter((v) => v.distanceMiles <= radiusMiles)
              .map((vendor) => (
                <div
                  key={vendor.id}
                  className="bg-white border border-[#e8e2d8] rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Image Header */}
                    <div className="relative h-48 w-full bg-gray-100">
                      <img
                        src={vendor.imageUrl}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-extrabold text-[#2d3732] shadow-xs flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{vendor.soleneRating} / 5.0</span>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-300" />
                        <span>{vendor.distanceMiles} miles away ({vendor.location})</span>
                      </div>
                    </div>

                    {/* Info Body */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2b4c7e] uppercase tracking-wider">
                          {vendor.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Est: {vendor.estimatedPriceRange}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-lg text-[#2d3732]">{vendor.name}</h3>
                      <p className="text-xs text-[#526357]">{vendor.tagline}</p>

                      {/* AI Review Summary Box */}
                      <div className="p-3 bg-[#faf9f5] border border-[#e8e2d8] rounded-2xl text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-800 text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" /> AI Review Aggregator Summary
                        </div>
                        <p className="text-[#3d4a41] italic leading-relaxed">
                          "{vendor.aiReviewSummary}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Inquire Action */}
                  <div className="p-4 bg-[#faf8f5] border-t border-[#e8e2d8]">
                    <button
                      onClick={() => {
                        setSelectedDirectoryInquiry(vendor);
                        setInquiryFormData({
                          fullName: `${profile.partner1} & ${profile.partner2}`,
                          email: profile.gmailAddress,
                          eventDate: profile.weddingDate,
                          guestCount: profile.guestCount,
                          venueLocation: profile.location || "Sonoma / Napa, CA",
                          styleVision: profile.vibe || "Organic Botanical Ethereal with warm neutral accents",
                          budgetRange: vendor.estimatedPriceRange,
                          specialRequests: vendor.inquiryFormFields.specialRequests,
                        });
                      }}
                      className="w-full py-2.5 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 hover:opacity-95"
                      style={{ backgroundColor: brandPrimaryColor }}
                    >
                      <Send className="w-3.5 h-3.5 text-amber-300" />
                      <span>Inquire with AI (Extension Pre-Fill)</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: PRICE CONFIRMATION POP-UP (BEFORE BOOKING) */}
      {/* ========================================================================= */}
      {isBookConfirmModalOpen && bookingVendorTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-[#faf8f5] border border-[#e8e2d8] rounded-3xl shadow-xl max-w-md w-full p-6 text-[#2d3732] animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#e8e2d8]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-serif font-bold text-[#2d3732]">Confirm Contract Price</h2>
              </div>
              <button
                onClick={() => setIsBookConfirmModalOpen(false)}
                className="p-1 text-[#78887e] hover:text-[#2d3732] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBookingSubmit} className="space-y-4 mt-4 text-xs">
              <p className="text-[#526357]">
                You are marking <strong className="text-[#2d3732]">{bookingVendorTarget.name}</strong> as <strong>Booked & Contracted</strong>.
              </p>

              <div>
                <label className="font-bold text-[#3d4a41] uppercase tracking-wider block mb-1">
                  Confirmed Final Contract Price ($)
                </label>
                <input
                  type="number"
                  required
                  value={confirmedBookingPrice}
                  onChange={(e) => setConfirmedBookingPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#2b4c7e] rounded-xl text-base font-bold text-emerald-800 focus:outline-none"
                />
                <p className="text-[11px] text-[#78887e] mt-1">
                  This amount will update your Booked Spent Ledger in the Budget tab.
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookConfirmModalOpen(false)}
                  className="flex-1 py-2.5 bg-[#f0eae0] text-[#2d3732] font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 text-white font-bold rounded-xl shadow-2xs"
                >
                  Confirm & Move to Booked
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EXTENSION INQUIRY FORM PRE-FILL MODAL */}
      {/* ========================================================================= */}
      {selectedDirectoryInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-[#faf8f5] border border-[#e8e2d8] rounded-3xl shadow-2xl max-w-lg w-full p-6 text-[#2d3732] animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#e8e2d8]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-serif font-bold text-[#2d3732]">
                  Ivory AI Chrome Extension Form Auto-Fill
                </h2>
              </div>
              <button
                onClick={() => setSelectedDirectoryInquiry(null)}
                className="p-1 text-[#78887e] hover:text-[#2d3732] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#526357] my-3">
              Ivory AI extracted all form fields from <strong className="text-[#2d3732]">{selectedDirectoryInquiry.name}</strong>'s website and pre-filled them with your vision profile:
            </p>

            <form onSubmit={handleSendAIInquiry} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#4a5a50] block mb-1">Couple Name</label>
                  <input
                    type="text"
                    required
                    value={inquiryFormData.fullName}
                    onChange={(e) => setInquiryFormData({ ...inquiryFormData, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#d8cfc3] rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#4a5a50] block mb-1">Wedding Email</label>
                  <input
                    type="email"
                    required
                    value={inquiryFormData.email}
                    onChange={(e) => setInquiryFormData({ ...inquiryFormData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#d8cfc3] rounded-xl font-semibold text-[#2b4c7e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#4a5a50] block mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={inquiryFormData.eventDate}
                    onChange={(e) => setInquiryFormData({ ...inquiryFormData, eventDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#d8cfc3] rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#4a5a50] block mb-1">Guest Count</label>
                  <input
                    type="number"
                    required
                    value={inquiryFormData.guestCount}
                    onChange={(e) => setInquiryFormData({ ...inquiryFormData, guestCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#d8cfc3] rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#4a5a50] block mb-1">Style & Color Vision</label>
                <input
                  type="text"
                  value={inquiryFormData.styleVision}
                  onChange={(e) => setInquiryFormData({ ...inquiryFormData, styleVision: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#d8cfc3] rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-[#4a5a50] block mb-1">Special Requests / Questions</label>
                <textarea
                  rows={2}
                  value={inquiryFormData.specialRequests}
                  onChange={(e) => setInquiryFormData({ ...inquiryFormData, specialRequests: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#d8cfc3] rounded-xl font-medium"
                />
              </div>

              {inquirySuccessMsg ? (
                <div className="p-3 bg-emerald-100 text-emerald-800 font-bold text-center rounded-xl border border-emerald-300">
                  {inquirySuccessMsg}
                </div>
              ) : (
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDirectoryInquiry(null)}
                    className="flex-1 py-2.5 bg-[#f0eae0] text-[#2d3732] font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-white font-bold rounded-xl shadow-2xs flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: brandPrimaryColor }}
                  >
                    <Send className="w-3.5 h-3.5 text-amber-300" /> Submit Inquiry with AI
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
