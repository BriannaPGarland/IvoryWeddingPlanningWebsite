import React, { useState } from "react";
import { WeddingProfile, BrandConfig } from "../types";
import { generateChromeExtensionZip } from "../utils/chromeExtensionGenerator";
import {
  Puzzle,
  Download,
  Sparkles,
  X,
  Globe,
  Check,
  Send,
  RefreshCw,
  Info,
  ShieldCheck,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ListFilter,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: WeddingProfile;
  brand: BrandConfig;
}

export const ExtensionSimulatorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  profile,
  brand,
}) => {
  if (!isOpen) return null;

  // Simulator Form State
  const [dateFieldStyle, setDateFieldStyle] = useState<"dropdowns" | "calendar" | "single_select">("dropdowns");
  
  // Date Fields
  const [formMonth, setFormMonth] = useState("");
  const [formDay, setFormDay] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formDateText, setFormDateText] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Profile Fields
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formGuests, setFormGuests] = useState("");
  const [formServiceType, setFormServiceType] = useState("");
  const [formColors, setFormColors] = useState("");
  const [formFlorals, setFormFlorals] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [checkedServices, setCheckedServices] = useState<{ [key: string]: boolean }>({
    floralDesign: false,
    personalBouquets: false,
    ceremonyArch: false,
    dayOfStyling: false,
  });

  const [isFilling, setIsFilling] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSimulateAutofill = async () => {
    setIsFilling(true);
    try {
      const res = await fetch("/api/gemini/extrapolate-vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          formContext: "Sonoma Floral Artistry Vendor Inquiry Form",
        }),
      });

      const data = await res.json();

      // Populate Month, Day, Year Dropdowns
      setFormMonth("May");
      setFormDay("16");
      setFormYear("2027");
      setFormDateText(data.eventDate || "05/16/2027");

      // Contact info
      const fullCouple = profile.coupleNames || "Brianna & Joe";
      const fName = fullCouple.split("&")[0]?.split(" ")[0]?.trim() || "Brianna";
      setFormFirstName(fName);
      setFormLastName("Garland");
      setFormEmail(profile.gmailAddress || "brianna.wedding2026@serenoweddings.com");
      setFormPhone("(707) 555-0192");

      setFormGuests(data.guestCount || String(profile.guestCount));
      setFormServiceType("100-150");
      setFormColors(data.colorPalette || profile.colors.join(", "));
      setFormFlorals(data.floralVision || profile.florals);
      setFormMessage(data.messageToVendor || `Hi! We are planning our wedding on ${profile.weddingDate}...`);
      setCheckedServices({
        floralDesign: true,
        personalBouquets: true,
        ceremonyArch: true,
        dayOfStyling: false,
      });

      setIsFilled(true);
    } catch (e) {
      console.error(e);
      // Fallback direct fill
      setFormMonth("May");
      setFormDay("16");
      setFormYear("2027");
      setFormDateText("05/16/2027");
      setFormFirstName("Brianna");
      setFormLastName("Garland");
      setFormEmail(profile.gmailAddress || "brianna.wedding2026@serenoweddings.com");
      setFormPhone("(707) 555-0192");
      setFormGuests(String(profile.guestCount));
      setFormServiceType("100-150");
      setFormColors(profile.colors.join(", "));
      setFormFlorals(profile.florals);
      setFormMessage(`Hi! We are planning our wedding on ${profile.weddingDate} for ~${profile.guestCount} guests. Our vibe is ${profile.vibe}.`);
      setCheckedServices({
        floralDesign: true,
        personalBouquets: true,
        ceremonyArch: true,
        dayOfStyling: false,
      });
      setIsFilled(true);
    } finally {
      setIsFilling(false);
    }
  };

  const handleDownloadExtensionZip = async () => {
    setIsDownloading(true);
    try {
      const blob = await generateChromeExtensionZip(profile, brand);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${brand.name.toLowerCase().replace(/\s+/g, "_")}_chrome_extension.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Error generating zip:", e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="bg-[#faf8f5] border border-[#e8e2d8] rounded-3xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden text-[#2d3732] animate-in fade-in zoom-in duration-200 flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-[#e8e2d8] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shadow-xs"
              style={{ backgroundColor: brand.primaryColor }}
            >
              <Puzzle className="w-5 h-5 text-[#f4a261]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif font-bold text-[#2d3732] flex items-center gap-2">
                  <span className="font-ivory-script text-2xl font-normal italic text-[#0e6251]">{brand.name}</span>
                  <span>Chrome Extension Simulator</span>
                </h2>
                <span className="text-[10px] bg-[#0e6251] text-white px-2 py-0.5 rounded-full font-bold">
                  Manifest V3 Ready
                </span>
              </div>
              <p className="text-xs text-[#5c6d62]">
                Test how the extension auto-populates vendor inquiry forms, including <strong>Month/Day/Year Date Dropdowns</strong> & Calendar Pickers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadExtensionZip}
              disabled={isDownloading}
              className="px-4 py-2 bg-[#0e6251] hover:bg-[#0a483b] text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Download className={`w-3.5 h-3.5 text-[#f4a261] ${isDownloading ? "animate-bounce" : ""}`} />
              <span>{isDownloading ? "Zipping Extension..." : "Download Extension (.zip)"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#78887e] hover:text-[#2d3732] rounded-xl hover:bg-[#f0eae0]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Browser Chrome Simulator Frame */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 bg-[#f0eae0]/50 space-y-4">
          {/* Mock Browser URL Bar */}
          <div className="bg-[#e2dcd0] rounded-2xl p-2.5 flex items-center gap-3 border border-[#d2c8b8] shadow-2xs">
            <div className="flex items-center gap-1.5 pl-2">
              <span className="w-3 h-3 rounded-full bg-[#e76f51]" />
              <span className="w-3 h-3 rounded-full bg-[#f4a261]" />
              <span className="w-3 h-3 rounded-full bg-[#2a9d8f]" />
            </div>

            <div className="flex-1 bg-white px-3 py-1 rounded-xl text-xs text-[#526357] flex items-center gap-2 border border-[#d2c8b8] font-mono">
              <Globe className="w-3.5 h-3.5 text-[#0e6251]" />
              <span>https://www.sonomafloralartistry.com/wedding-inquiry</span>
            </div>

            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-2xs cursor-pointer"
              style={{ backgroundColor: brand.primaryColor }}
              title={`${brand.name} Extension Extension Active`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#f4a261]" />
              <span className="font-ivory-script text-base italic">{brand.name}</span>
            </div>
          </div>

          {/* Test Controls Bar: Switch Vendor Form Date Style */}
          <div className="p-3 bg-white border border-[#dcd4c8] rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-[#405044] font-semibold">
              <ListFilter className="w-4 h-4 text-[#0e6251]" />
              <span>Simulated Vendor Date Input Type:</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#faf8f5] p-1 rounded-xl border border-[#dcd4c8]">
              <button
                type="button"
                onClick={() => setDateFieldStyle("dropdowns")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  dateFieldStyle === "dropdowns"
                    ? "bg-[#0e6251] text-white shadow-xs"
                    : "text-[#526357] hover:bg-[#f0eae0]"
                }`}
              >
                Month / Day / Year Dropdowns
              </button>
              <button
                type="button"
                onClick={() => setDateFieldStyle("calendar")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  dateFieldStyle === "calendar"
                    ? "bg-[#0e6251] text-white shadow-xs"
                    : "text-[#526357] hover:bg-[#f0eae0]"
                }`}
              >
                Interactive Calendar Picker
              </button>
              <button
                type="button"
                onClick={() => setDateFieldStyle("single_select")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  dateFieldStyle === "single_select"
                    ? "bg-[#0e6251] text-white shadow-xs"
                    : "text-[#526357] hover:bg-[#f0eae0]"
                }`}
              >
                Combined Date Select
              </button>
            </div>
          </div>

          {/* Simulated External Vendor Website Page */}
          <div className="bg-white border border-[#dcd4c8] rounded-2xl p-6 md:p-8 shadow-sm space-y-6 relative overflow-hidden">
            <div className="border-b border-[#f0eae0] pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#a07a50]">
                  Sonoma Botanical Florist
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#1f2923]">
                  Inquire For Your Wedding Day
                </h3>
              </div>
              <span className="text-xs text-[#809185] italic font-serif">"Crafting floral memories"</span>
            </div>

            {isSubmitted ? (
              <div className="p-8 text-center space-y-3 bg-[#eef8f2] rounded-2xl border border-[#c2e8d0]">
                <ShieldCheck className="w-10 h-10 text-[#0e6251] mx-auto" />
                <h4 className="font-serif font-bold text-lg text-[#0e6251]">Inquiry Submitted to Sonoma Florals!</h4>
                <p className="text-xs text-[#526357]">
                  Your message was received. They will reply to your dedicated Gmail account (<strong className="text-[#0e6251]">{profile.gmailAddress}</strong>).
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setIsFilled(false);
                    setFormMonth("");
                    setFormDay("");
                    setFormYear("");
                    setFormDateText("");
                    setFormFirstName("");
                    setFormLastName("");
                    setFormEmail("");
                    setFormPhone("");
                    setFormGuests("");
                    setFormColors("");
                    setFormFlorals("");
                    setFormMessage("");
                  }}
                  className="px-4 py-2 bg-[#0e6251] text-white text-xs font-semibold rounded-xl"
                >
                  Reset Form Simulation
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSubmitted(true);
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
              >
                {/* Contact First & Last Name */}
                <div>
                  <label className="font-semibold text-[#405044] block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-[#dcd4c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e6251]/30 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#405044] block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Last Name"
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-[#dcd4c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e6251]/30 font-medium"
                  />
                </div>

                {/* Email & Phone */}
                <div>
                  <label className="font-semibold text-[#405044] block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-[#dcd4c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e6251]/30 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#405044] block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-[#dcd4c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e6251]/30 font-medium"
                  />
                </div>

                {/* WEDDING DATE INPUT FIELD VARIATIONS */}
                <div className="md:col-span-2 p-3.5 bg-[#fcfaf7] border border-[#e8dfd1] rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-[#1f2923] text-xs flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 text-[#0e6251]" />
                      <span>Wedding Date *</span>
                    </label>
                    <span className="text-[10px] text-[#809185] italic font-medium">
                      {dateFieldStyle === "dropdowns" && "Mode: 3 Separate Month / Day / Year Dropdowns"}
                      {dateFieldStyle === "calendar" && "Mode: Click Input to Open Interactive Calendar Picker"}
                      {dateFieldStyle === "single_select" && "Mode: Combined Date Range Select"}
                    </span>
                  </div>

                  {/* OPTION 1: MONTH, DAY, YEAR DROPDOWNS */}
                  {dateFieldStyle === "dropdowns" && (
                    <div className="grid grid-cols-3 gap-2">
                      {/* Month Dropdown */}
                      <div>
                        <span className="text-[10px] font-semibold text-[#6a7c70] block mb-0.5">Month</span>
                        <select
                          name="wedding_month"
                          id="wedding_month"
                          value={formMonth}
                          onChange={(e) => setFormMonth(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#dcd4c8] rounded-xl font-medium text-[#2d3732] focus:ring-2 focus:ring-[#0e6251]/30"
                        >
                          <option value="">Month</option>
                          <option value="January">January</option>
                          <option value="February">February</option>
                          <option value="March">March</option>
                          <option value="April">April</option>
                          <option value="May">May</option>
                          <option value="June">June</option>
                          <option value="July">July</option>
                          <option value="August">August</option>
                          <option value="September">September</option>
                          <option value="October">October</option>
                          <option value="November">November</option>
                          <option value="December">December</option>
                        </select>
                      </div>

                      {/* Day Dropdown */}
                      <div>
                        <span className="text-[10px] font-semibold text-[#6a7c70] block mb-0.5">Day</span>
                        <select
                          name="wedding_day"
                          id="wedding_day"
                          value={formDay}
                          onChange={(e) => setFormDay(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#dcd4c8] rounded-xl font-medium text-[#2d3732] focus:ring-2 focus:ring-[#0e6251]/30"
                        >
                          <option value="">Day</option>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                            <option key={d} value={String(d)}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Year Dropdown */}
                      <div>
                        <span className="text-[10px] font-semibold text-[#6a7c70] block mb-0.5">Year</span>
                        <select
                          name="wedding_year"
                          id="wedding_year"
                          value={formYear}
                          onChange={(e) => setFormYear(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#dcd4c8] rounded-xl font-medium text-[#2d3732] focus:ring-2 focus:ring-[#0e6251]/30"
                        >
                          <option value="">Year</option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                          <option value="2028">2028</option>
                          <option value="2029">2029</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* OPTION 2: INTERACTIVE CALENDAR POPUP */}
                  {dateFieldStyle === "calendar" && (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Click to pick wedding date..."
                        value={formDateText}
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        onChange={(e) => setFormDateText(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#dcd4c8] rounded-xl font-medium cursor-pointer focus:ring-2 focus:ring-[#0e6251]/30"
                      />

                      {/* Calendar Popup Window (similar to screenshot) */}
                      {isCalendarOpen && (
                        <div className="absolute top-12 left-0 z-30 bg-white border border-[#dcd4c8] rounded-2xl p-4 shadow-xl w-72 animate-in fade-in slide-in-from-top-2 duration-150">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#f0eae0]">
                            <span className="font-bold text-[#1f2923] text-sm">May 2027</span>
                            <div className="flex items-center gap-1">
                              <button type="button" className="p-1 hover:bg-[#f0eae0] rounded-lg">
                                <ChevronLeft className="w-4 h-4 text-[#526357]" />
                              </button>
                              <button type="button" className="p-1 hover:bg-[#f0eae0] rounded-lg">
                                <ChevronRight className="w-4 h-4 text-[#526357]" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-[#78887e] mb-1">
                            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                          </div>

                          <div className="grid grid-cols-7 gap-1 text-center text-xs">
                            {/* Blank padding days for May 1st Saturday */}
                            <span className="p-1 text-gray-300">25</span>
                            <span className="p-1 text-gray-300">26</span>
                            <span className="p-1 text-gray-300">27</span>
                            <span className="p-1 text-gray-300">28</span>
                            <span className="p-1 text-gray-300">29</span>
                            <span className="p-1 text-gray-300">30</span>
                            <span className="p-1 font-semibold hover:bg-[#f0eae0] rounded-md cursor-pointer">1</span>

                            {Array.from({ length: 30 }, (_, i) => i + 2).map((day) => {
                              const isSelected = day === 16;
                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => {
                                    setFormDateText(`05/${day < 10 ? "0" + day : day}/2027`);
                                    setFormMonth("May");
                                    setFormDay(String(day));
                                    setFormYear("2027");
                                    setIsCalendarOpen(false);
                                  }}
                                  className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    isSelected
                                      ? "bg-[#0e6251] text-white font-bold ring-2 ring-[#0e6251]/30"
                                      : "hover:bg-[#f0eae0] text-[#2d3732]"
                                  }`}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* OPTION 3: COMBINED DATE SELECT */}
                  {dateFieldStyle === "single_select" && (
                    <select
                      value={formDateText}
                      onChange={(e) => setFormDateText(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#dcd4c8] rounded-xl font-medium text-[#2d3732] focus:ring-2 focus:ring-[#0e6251]/30"
                    >
                      <option value="">-- Select Target Wedding Date --</option>
                      <option value="May 16, 2027">May 16, 2027 (Spring 2027)</option>
                      <option value="Spring 2027">Spring 2027</option>
                      <option value="May 2027">May 2027</option>
                      <option value="Fall 2027">Fall 2027</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-[#405044] block mb-1">
                    Estimated Guest Range
                  </label>
                  <select
                    value={formServiceType}
                    onChange={(e) => setFormServiceType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-[#dcd4c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e6251]/30 font-medium text-[#2d3732]"
                  >
                    <option value="">-- Select Guest Range --</option>
                    <option value="50-100">50 - 100 guests</option>
                    <option value="100-150">100 - 150 guests</option>
                    <option value="150-200">150 - 200 guests</option>
                    <option value="200+">200+ guests</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#405044] block mb-1">
                    Color Palette Preferences
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sage green, alabaster, blush"
                    value={formColors}
                    onChange={(e) => setFormColors(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-[#dcd4c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e6251]/30 font-medium"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-[#405044] block mb-2">
                    Services Requested (Checkboxes)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-[#faf8f5] p-3 rounded-xl border border-[#dcd4c8]">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-[#2d3732]">
                      <input
                        type="checkbox"
                        checked={checkedServices.floralDesign}
                        onChange={(e) => setCheckedServices({ ...checkedServices, floralDesign: e.target.checked })}
                        className="rounded border-[#dcd4c8] text-[#0e6251] focus:ring-[#0e6251]"
                      />
                      <span>Floral Design</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-[#2d3732]">
                      <input
                        type="checkbox"
                        checked={checkedServices.personalBouquets}
                        onChange={(e) => setCheckedServices({ ...checkedServices, personalBouquets: e.target.checked })}
                        className="rounded border-[#dcd4c8] text-[#0e6251] focus:ring-[#0e6251]"
                      />
                      <span>Bouquets</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-[#2d3732]">
                      <input
                        type="checkbox"
                        checked={checkedServices.ceremonyArch}
                        onChange={(e) => setCheckedServices({ ...checkedServices, ceremonyArch: e.target.checked })}
                        className="rounded border-[#dcd4c8] text-[#0e6251] focus:ring-[#0e6251]"
                      />
                      <span>Ceremony Arch</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-[#2d3732]">
                      <input
                        type="checkbox"
                        checked={checkedServices.dayOfStyling}
                        onChange={(e) => setCheckedServices({ ...checkedServices, dayOfStyling: e.target.checked })}
                        className="rounded border-[#dcd4c8] text-[#0e6251] focus:ring-[#0e6251]"
                      />
                      <span>Day-Of Styling</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-[#405044] block mb-1">
                    Floral Vision Requests
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Eucalyptus, garden roses..."
                    value={formFlorals}
                    onChange={(e) => setFormFlorals(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-[#dcd4c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e6251]/30 font-medium"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-[#405044] block mb-1">
                    Message / Additional Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your wedding vision..."
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-[#dcd4c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e6251]/30 font-medium"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#2d3732] hover:bg-[#1a231f] text-white font-semibold text-xs rounded-xl shadow-xs"
                  >
                    Send Vendor Inquiry
                  </button>
                </div>
              </form>
            )}

            {/* FLOATING CHROME EXTENSION POPUP BADGE */}
            {!isSubmitted && (
              <div className="absolute bottom-5 right-5 z-20 max-w-xs w-full bg-white border border-[#0e6251] rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between pb-2 border-b border-[#f0eae0]">
                  <span className="font-serif font-bold text-xs text-[#0e6251] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#f4a261]" />
                    <span className="font-ivory-script text-lg font-normal italic">{brand.name} AI Companion</span>
                  </span>
                  <span className="text-[10px] bg-[#eef6f3] text-[#0e6251] px-1.5 py-0.5 rounded-md font-bold">
                    Form Visible On Screen
                  </span>
                </div>

                <p className="text-[11px] text-[#526357] my-2 leading-relaxed">
                  Vendor inquiry form detected on screen! Fill in vision profile for <strong>{profile.coupleNames}</strong>?
                </p>

                <button
                  type="button"
                  onClick={handleSimulateAutofill}
                  disabled={isFilling}
                  className="w-full py-2 bg-[#0e6251] hover:bg-[#0a483b] text-white rounded-xl font-bold text-xs transition-all shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#f4a261] ${isFilling ? "animate-spin" : ""}`} />
                  <span>{isFilling ? "Extrapolating with AI..." : `Autofill Vision with ${brand.name}`}</span>
                </button>

                {isFilled && (
                  <div className="mt-2 text-[10px] text-center font-bold text-[#0e6251] bg-[#eef8f2] p-1.5 rounded-lg border border-[#c2e8d0]">
                    ✓ Populated date dropdowns (May 16, 2027) & vision details!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

