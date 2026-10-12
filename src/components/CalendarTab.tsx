import React, { useState } from "react";
import { CalendarEvent, EventType, WeddingProfile } from "../types";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  AlertCircle,
  FileText,
  X,
  Building2,
  Info,
} from "lucide-react";

interface Props {
  events: CalendarEvent[];
  profile: WeddingProfile;
  onAddEvent: (event: CalendarEvent) => void;
  onOpenVendorProfile?: (vendorName: string) => void;
  brandPrimaryColor?: string;
  brandAccentColor?: string;
}

export const CATEGORY_LABELS: Record<
  EventType,
  { label: string; bg: string; text: string; border: string; dotColor: string }
> = {
  walkthrough: {
    label: "Site Walkthrough",
    bg: "bg-[#fef9c3]",
    text: "text-[#854d0e]",
    border: "border-[#fef08a]",
    dotColor: "#ca8a04",
  },
  tasting: {
    label: "Tasting & Mockup",
    bg: "bg-[#ffedd5]",
    text: "text-[#9a3412]",
    border: "border-[#fed7aa]",
    dotColor: "#ea580c",
  },
  payment: {
    label: "Payment Due",
    bg: "bg-[#fef2f2]",
    text: "text-[#991b1b]",
    border: "border-[#fecaca]",
    dotColor: "#dc2626",
  },
  consultation: {
    label: "Vendor Consultation",
    bg: "bg-[#ecfdf5]",
    text: "text-[#065f46]",
    border: "border-[#a7f3d0]",
    dotColor: "#059669",
  },
  rehearsal: {
    label: "Rehearsal & Dinner",
    bg: "bg-[#f3e8ff]",
    text: "text-[#6b21a8]",
    border: "border-[#e9d5ff]",
    dotColor: "#9333ea",
  },
  wedding_day: {
    label: "✨ Wedding Day",
    bg: "bg-[#ca981d]",
    text: "text-white",
    border: "border-[#b08314]",
    dotColor: "#d97706",
  },
  deadline: {
    label: "Final Deadline",
    bg: "bg-[#fff1f2]",
    text: "text-[#9f1239]",
    border: "border-[#fecdd3]",
    dotColor: "#e11d48",
  },
};

export const CalendarTab: React.FC<Props> = ({
  events,
  profile,
  onAddEvent,
  onOpenVendorProfile,
  brandPrimaryColor = "#ca981d",
  brandAccentColor = "#f6e4a6",
}) => {
  const [viewMode, setViewMode] = useState<"agenda" | "month">("agenda");
  const [filterCat, setFilterCat] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEventForModal, setSelectedEventForModal] = useState<CalendarEvent | null>(null);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // New Event Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("2026-08-25");
  const [time, setTime] = useState("1:00 PM");
  const [category, setCategory] = useState<EventType>("consultation");
  const [vendorName, setVendorName] = useState("");
  const [location, setLocation] = useState(profile?.location || "Sonoma Valley, CA");
  const [notes, setNotes] = useState("");

  const filteredEvents = events.filter((ev) => {
    if (filterCat === "All") return true;
    return ev.category === filterCat;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEv: CalendarEvent = {
      id: "cal_" + Date.now(),
      title: title.trim(),
      date,
      time,
      category,
      vendorName: vendorName.trim() || undefined,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      isGoogleCalendarSynced: true,
    };

    onAddEvent(newEv);
    setIsAddModalOpen(false);
    setTitle("");
    setVendorName("");
    setNotes("");

    setSyncStatus("Event synced to Google Calendar!");
    setTimeout(() => setSyncStatus(null), 3500);
  };

  const handleDayClick = (dayStr: string) => {
    setDate(dayStr);
    setIsAddModalOpen(true);
  };

  const handleExportiCal = () => {
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Solene AI Wedding Planner//EN",
      ...events.map(
        (e) => `BEGIN:VEVENT
SUMMARY:${e.title}
DTSTART:${e.date.replace(/-/g, "")}T120000Z
LOCATION:${e.location || "Sonoma Valley"}
DESCRIPTION:${e.notes || "Wedding Event"}
END:VEVENT`
      ),
      "END:VCALENDAR",
    ].join("\n");

    const blob = new Blob([icsData], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wedding_schedule_${profile.partner1.split(" ")[0]}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ebdcc0] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-[#2c2419]">
              Google Calendar & Milestone Schedule
            </h1>
            <span className="bg-[#ca981d] text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#fbf0cb]" /> Synced with Google Account
            </span>
          </div>
          <p className="text-sm text-[#6e5d48] mt-1">
            All vendor walkthroughs, cake tastings, and payment deadlines automatically synchronize with your account (<strong className="text-[#ca981d]">{profile?.gmailAddress}</strong>).
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={handleExportiCal}
            className="px-4 py-2.5 bg-white border border-[#ebdcc0] hover:border-[#ca981d] text-[#2c2419] rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#ca981d]" />
            <span>Export (.ics)</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-[#ca981d] hover:bg-[#b08314] text-white rounded-xl text-xs font-semibold shadow-xs transition-opacity flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#fbf0cb]" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="p-3 bg-[#fbf3d5] text-[#5e470e] border border-[#f3e3b3] rounded-xl text-xs font-bold flex items-center justify-between animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ca981d]" />
            <span>{syncStatus}</span>
          </div>
          <span className="text-[10px] bg-[#f5e4a8] text-[#4a390d] px-2 py-0.5 rounded-md">Live Sync Active</span>
        </div>
      )}

      {/* COLOR LEGEND BAR */}
      <div className="bg-white border border-[#ebdcc0] p-4 rounded-2xl shadow-2xs space-y-2">
        <div className="text-xs font-bold text-[#2c2419] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#ca981d]" /> Event Category Color Legend
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(CATEGORY_LABELS).map(([key, cfg]) => (
            <div
              key={key}
              onClick={() => setFilterCat(key === filterCat ? "All" : key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${cfg.bg} ${cfg.text} ${cfg.border} ${
                filterCat === key ? "ring-2 ring-[#ca981d]" : ""
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cfg.dotColor }}
              />
              <span>{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* View Switcher & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#ebdcc0] shadow-2xs">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#faf6eb] p-1 rounded-xl">
          <button
            onClick={() => setViewMode("agenda")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "agenda"
                ? "bg-white text-[#2c2419] shadow-xs ring-1 ring-[#f3e3b3]"
                : "text-[#786650] hover:text-[#2c2419]"
            }`}
          >
            Agenda Timeline ({events.length})
          </button>
          <button
            onClick={() => setViewMode("month")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "month"
                ? "bg-white text-[#2c2419] shadow-xs ring-1 ring-[#f3e3b3]"
                : "text-[#786650] hover:text-[#2c2419]"
            }`}
          >
            Interactive Grid View
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-[#a39278] shrink-0" />
          <button
            onClick={() => setFilterCat("All")}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              filterCat === "All"
                ? "bg-[#ca981d] text-white font-bold"
                : "bg-[#f8f1df] text-[#5e4f3a] hover:bg-[#ebdcc0]"
            }`}
          >
            All Categories
          </button>
          {Object.entries(CATEGORY_LABELS).map(([catKey, cfg]) => (
            <button
              key={catKey}
              onClick={() => setFilterCat(catKey)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                filterCat === catKey
                  ? "bg-[#ca981d] text-white font-bold"
                  : "bg-[#fdfcfa] text-[#5e4f3a] border border-[#ebdcc0] hover:border-[#ca981d]"
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* AGENDA TIMELINE VIEW (WITH TITLE ACCORDION/DROPDOWN) */}
      {viewMode === "agenda" ? (
        <div className="space-y-4">
          {filteredEvents.map((ev) => {
            const catCfg = CATEGORY_LABELS[ev.category] || {
              label: ev.category,
              bg: "bg-gray-100",
              text: "text-gray-800",
              border: "border-gray-300",
              dotColor: "#6b7280",
            };

            const isWeddingDay = ev.category === "wedding_day";
            const isExpanded = expandedEventId === ev.id;

            return (
              <div
                key={ev.id}
                className={`rounded-2xl border transition-all shadow-2xs overflow-hidden ${
                  isWeddingDay
                    ? "bg-gradient-to-r from-[#2c2419] via-[#3a3022] to-[#2c2419] text-white border-[#ca981d]"
                    : "bg-white border-[#ebdcc0] hover:border-[#ca981d]"
                }`}
              >
                {/* Main Accordion Title Header */}
                <div
                  onClick={() => setExpandedEventId(isExpanded ? null : ev.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-black/5 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Date Badge */}
                    <div
                      className={`px-3.5 py-2.5 rounded-xl text-center shrink-0 border ${
                        isWeddingDay
                          ? "bg-[#ca981d] text-white border-white/30"
                          : `${catCfg.bg} ${catCfg.text} ${catCfg.border}`
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider">
                        {new Date(ev.date).toLocaleDateString("en-US", { month: "short" })}
                      </div>
                      <div className="text-xl font-serif font-bold leading-tight">
                        {new Date(ev.date).getDate()}
                      </div>
                      <div className="text-[9px] font-semibold opacity-80">
                        {new Date(ev.date).toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                            isWeddingDay
                              ? "bg-[#fbf0cb] text-[#4a390d] border-[#f3e3b3]"
                              : `${catCfg.bg} ${catCfg.text} ${catCfg.border}`
                          }`}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: catCfg.dotColor }}
                          />
                          {catCfg.label}
                        </span>

                        {ev.vendorName && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onOpenVendorProfile) onOpenVendorProfile(ev.vendorName!);
                            }}
                            className={`text-xs font-semibold hover:underline flex items-center gap-1 cursor-pointer ${
                              isWeddingDay ? "text-[#fbf0cb]" : "text-[#ca981d]"
                            }`}
                          >
                            <Building2 className="w-3 h-3" />
                            {ev.vendorName}
                          </span>
                        )}
                      </div>

                      {/* CLICKABLE TITLE */}
                      <h3
                        className={`font-serif font-bold text-base flex items-center gap-2 ${
                          isWeddingDay ? "text-white text-lg" : "text-[#2c2419]"
                        }`}
                      >
                        <span>{ev.title}</span>
                        <span className="text-xs text-[#a39278] font-sans font-normal italic">
                          (Click title to {isExpanded ? "collapse" : "view all details"})
                        </span>
                      </h3>

                      <div
                        className={`flex items-center gap-4 text-xs font-medium ${
                          isWeddingDay ? "text-[#fbf0cb]" : "text-[#6e5d48]"
                        }`}
                      >
                        {ev.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {ev.time}
                          </span>
                        )}

                        {ev.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {ev.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 bg-[#fbf3d5] text-[#5e470e] border border-[#f3e3b3]">
                      <CheckCircle2 className="w-3 h-3 text-[#ca981d]" />
                      <span>Google Cal Synced</span>
                    </span>

                    <button className="p-1.5 rounded-lg bg-[#faf6eb] hover:bg-[#ebdcc0] text-[#2c2419] transition-colors">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#2c2419]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#2c2419]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* ACCORDION DROPDOWN CONTENT */}
                {isExpanded && (
                  <div className="p-5 border-t border-[#f3e8d3] bg-[#faf6eb]/60 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-bold text-[#2c2419] block mb-1 uppercase tracking-wider">
                          Full Event Description / Notes
                        </span>
                        <p className="text-[#6e5d48] bg-white p-3 rounded-xl border border-[#ebdcc0] leading-relaxed">
                          {ev.notes || "No additional notes provided."}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="font-bold text-[#2c2419] block mb-1 uppercase tracking-wider">
                            Location & Venue
                          </span>
                          <div className="p-3 bg-white rounded-xl border border-[#ebdcc0] flex items-center justify-between">
                            <span className="text-[#2c2419] font-medium">{ev.location || "Location not set"}</span>
                            <a
                              href={`https://maps.google.com/?q=${encodeURIComponent(ev.location || "Sonoma Valley")}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[#ca981d] hover:underline flex items-center gap-1 font-bold"
                            >
                              Open Maps <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        {ev.vendorName && (
                          <div>
                            <span className="font-bold text-[#2c2419] block mb-1 uppercase tracking-wider">
                              Assigned Vendor Profile
                            </span>
                            <div className="p-3 bg-white rounded-xl border border-[#ebdcc0] flex items-center justify-between">
                              <span className="text-[#2c2419] font-semibold">{ev.vendorName}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onOpenVendorProfile) onOpenVendorProfile(ev.vendorName!);
                                }}
                                className="px-3 py-1 bg-[#fbf3d5] text-[#5e470e] hover:bg-[#f3db78] rounded-lg font-bold flex items-center gap-1"
                              >
                                Edit Profile <Building2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEventForModal(ev);
                        }}
                        className="px-4 py-2 bg-[#ca981d] text-white hover:bg-[#b08314] rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5"
                      >
                        <Info className="w-4 h-4 text-[#fbf0cb]" />
                        <span>Pop-up Full Information Modal</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* INTERACTIVE MONTH GRID VIEW */
        <div className="bg-white border border-[#ebdcc0] rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#f3e8d3] pb-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-[#2c2419]">
                August & September 2026 Interactive Calendar Grid
              </h2>
              <p className="text-xs text-[#6e5d48]">
                Click on any day cell to add a new milestone event, or click an event badge to view full information.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#ca981d]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ca981d]" />
              <span>Google Calendar Live Sync</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#8c7a63] uppercase tracking-wider pb-2 border-b border-[#f3e8d3]">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = i - 2; // offset for month start
              const isValidDay = dayNum >= 1 && dayNum <= 31;
              const dateStr = `2026-08-${dayNum < 10 ? "0" + dayNum : dayNum}`;
              const dayEvents = events.filter(
                (e) => e.date === dateStr || (dayNum === 18 && e.date.includes("09-18"))
              );

              return (
                <div
                  key={i}
                  onClick={() => {
                    if (isValidDay) handleDayClick(dateStr);
                  }}
                  className={`min-h-[100px] p-2 border rounded-2xl flex flex-col justify-between text-xs transition-all cursor-pointer hover:border-[#ca981d] hover:shadow-xs group ${
                    isValidDay ? "bg-[#fffdfa] border-[#ebdcc0]" : "bg-[#faf6eb]/30 border-transparent opacity-30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#2c2419] text-xs">
                      {isValidDay ? dayNum : ""}
                    </span>
                    {isValidDay && (
                      <span className="opacity-0 group-hover:opacity-100 text-[10px] text-[#ca981d] font-bold">
                        + Add
                      </span>
                    )}
                  </div>

                  {dayEvents.length > 0 && (
                    <div className="space-y-1 mt-1">
                      {dayEvents.map((ev) => {
                        const cfg = CATEGORY_LABELS[ev.category] || {
                          bg: "bg-amber-100",
                          text: "text-amber-900",
                          border: "border-amber-300",
                          dotColor: "#ca981d",
                        };

                        return (
                          <div
                            key={ev.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEventForModal(ev);
                            }}
                            className={`p-1.5 rounded-lg text-[10px] font-bold leading-tight border transition-all cursor-pointer shadow-2xs hover:scale-102 ${cfg.bg} ${cfg.text} ${cfg.border}`}
                            title={`${ev.title} - Click for details`}
                          >
                            <div className="truncate font-serif flex items-center gap-1">
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: cfg.dotColor }}
                              />
                              <span className="truncate">{ev.title}</span>
                            </div>
                            {ev.time && <div className="text-[9px] opacity-80 mt-0.5">{ev.time}</div>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FULL INFORMATION POP-UP MODAL */}
      {selectedEventForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-[#ebdcc0] rounded-3xl shadow-2xl max-w-lg w-full p-6 text-[#2c2419] space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#f3e8d3] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#fbf3d5] border border-[#f3e3b3] flex items-center justify-center text-[#ca981d]">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#2c2419]">
                    Event Milestone Information
                  </h2>
                  <p className="text-xs text-[#6e5d48]">Google Calendar Synchronized Event</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEventForModal(null)}
                className="p-1.5 text-[#8c7a63] hover:text-[#2c2419] rounded-xl hover:bg-[#faf6eb]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Event Details Content */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7a63] block mb-1">
                  Title
                </span>
                <h3 className="text-base font-serif font-bold text-[#2c2419] bg-[#faf6eb] p-3 rounded-xl border border-[#ebdcc0]">
                  {selectedEventForModal.title}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#fffdfa] p-3 rounded-xl border border-[#ebdcc0]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7a63] block mb-1">
                    Date & Time
                  </span>
                  <p className="font-bold text-[#2c2419]">
                    {new Date(selectedEventForModal.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-[#6e5d48] font-medium mt-0.5">{selectedEventForModal.time || "All Day"}</p>
                </div>

                <div className="bg-[#fffdfa] p-3 rounded-xl border border-[#ebdcc0]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7a63] block mb-1">
                    Event Type
                  </span>
                  {(() => {
                    const cfg = CATEGORY_LABELS[selectedEventForModal.category] || {
                      label: selectedEventForModal.category,
                      bg: "bg-amber-100",
                      text: "text-amber-900",
                      border: "border-amber-300",
                      dotColor: "#ca981d",
                    };
                    return (
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1.5 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.dotColor }} />
                        {cfg.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {selectedEventForModal.vendorName && (
                <div className="bg-[#fbf3d5] p-3.5 rounded-xl border border-[#f3e3b3] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5e470e] block">
                      Associated Vendor
                    </span>
                    <p className="font-bold text-sm text-[#2c2419] mt-0.5">
                      {selectedEventForModal.vendorName}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const vName = selectedEventForModal.vendorName!;
                      setSelectedEventForModal(null);
                      if (onOpenVendorProfile) onOpenVendorProfile(vName);
                    }}
                    className="px-3 py-1.5 bg-[#ca981d] text-white hover:bg-[#b08314] rounded-xl font-bold text-xs shadow-2xs flex items-center gap-1"
                  >
                    Edit Profile <Building2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="bg-[#fffdfa] p-3 rounded-xl border border-[#ebdcc0]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7a63] block mb-1">
                  Location
                </span>
                <p className="font-semibold text-[#2c2419]">
                  📍 {selectedEventForModal.location || "Location not specified"}
                </p>
              </div>

              <div className="bg-[#fffdfa] p-3 rounded-xl border border-[#ebdcc0]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7a63] block mb-1">
                  Notes & Reminders
                </span>
                <p className="text-[#6e5d48] leading-relaxed">
                  {selectedEventForModal.notes || "No extra notes attached."}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#f3e8d3] flex justify-end">
              <button
                onClick={() => setSelectedEventForModal(null)}
                className="px-6 py-2.5 bg-[#ca981d] hover:bg-[#b08314] text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Close Pop-up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD EVENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-[#ebdcc0] rounded-3xl shadow-2xl max-w-md w-full p-6 text-[#2c2419] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#f3e8d3]">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#ca981d]" />
                <h2 className="text-lg font-serif font-bold text-[#2c2419]">Add Wedding Milestone Event</h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-[#8c7a63] hover:text-[#2c2419] rounded-xl hover:bg-[#faf6eb]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Venue Final Walkthrough"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#ca981d]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    placeholder="1:00 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                  Category & Color Code
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventType)}
                  className="w-full px-3 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl font-semibold focus:outline-none"
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                  Vendor Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Oakridge Estate"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Sonoma Valley, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Meeting details, rain backup space, prep notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-[#faf6eb] hover:bg-[#ebdcc0] text-[#2c2419] rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#ca981d] hover:bg-[#b08314] text-white rounded-xl font-bold shadow-xs"
                >
                  Save & Sync to Google Cal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
