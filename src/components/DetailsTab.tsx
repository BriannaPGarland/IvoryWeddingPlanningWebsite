import React, { useState } from "react";
import {
  WeddingProfile,
  Vendor,
  PlanningDetailSection,
  WalkthroughMilestone,
  VendorContractScheduleItem,
  TodoItem,
  DetailCheckItem,
} from "../types";
import {
  ClipboardList,
  Sparkles,
  CheckCircle2,
  Clock,
  Building2,
  Palette,
  Heart,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  FileText,
  RefreshCw,
  Search,
  Check,
  Calendar,
  AlertCircle,
  Flower2,
  Camera,
  Music,
  Wine,
  ArrowRight,
  PartyPopper,
  Edit3,
  Printer,
  Download,
  Copy,
  ExternalLink,
  Share2,
} from "lucide-react";

interface Props {
  profile: WeddingProfile;
  vendors: Vendor[];
  planningSections: PlanningDetailSection[];
  onUpdatePlanningSections: (sections: PlanningDetailSection[]) => void;
  walkthroughMilestones: WalkthroughMilestone[];
  onUpdateWalkthroughMilestones: (milestones: WalkthroughMilestone[]) => void;
  contractTimeline: VendorContractScheduleItem[];
  onUpdateContractTimeline: (timeline: VendorContractScheduleItem[]) => void;
  todos: TodoItem[];
  onToggleTodo: (id: string) => void;
  onAddTodo: (todo: TodoItem) => void;
}

export const DetailsTab: React.FC<Props> = ({
  profile,
  vendors,
  planningSections,
  onUpdatePlanningSections,
  walkthroughMilestones,
  onUpdateWalkthroughMilestones,
  contractTimeline,
  onUpdateContractTimeline,
  todos,
  onToggleTodo,
  onAddTodo,
}) => {
  // Mode selection: "overview" vs "walkthrough"
  const [viewMode, setViewMode] = useState<"overview" | "walkthrough">("overview");

  // Active Category in Overview Mode
  const [activeSectionId, setActiveSectionId] = useState<string>("signage");

  // Walkthrough Active Step Index
  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState<number>(0);

  // Scanning State
  const [isScanningContracts, setIsScanningContracts] = useState(false);
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null);

  // Add Item Modal in Overview
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItemQuestion, setNewItemQuestion] = useState("");
  const [newItemAnswer, setNewItemAnswer] = useState("");

  // Export Modals State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isDocsExportModalOpen, setIsDocsExportModalOpen] = useState(false);
  const [copiedDocsSuccess, setCopiedDocsSuccess] = useState(false);

  // AI Contract Scan simulation / execution
  const handleScanContracts = () => {
    setIsScanningContracts(true);
    setScanSuccessMessage(null);

    setTimeout(() => {
      setIsScanningContracts(false);
      setScanSuccessMessage(
        "Successfully scanned 6 vendor contracts & emails! Extracted call times for Hair & Makeup (8:00 AM), Florist delivery (12:30 PM), DJ soundcheck (2:30 PM), and Venue gates opening."
      );

      // Auto-update or confirm contract timeline
      const updatedTimeline = contractTimeline.map((item) => ({ ...item, confirmed: true }));
      onUpdateContractTimeline(updatedTimeline);

      setTimeout(() => setScanSuccessMessage(null), 6000);
    }, 1500);
  };

  // Generate Google Docs / Printable HTML Document
  const generateFormattedDocumentHtml = () => {
    const groomName = profile.groomName || "Alex Vance";
    const brideName = profile.brideName || "Brianna Garland";
    const weddingDate = profile.weddingDate || "September 18, 2026";
    const location = profile.location || "Oakridge Estate, Sonoma, CA";

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>${brideName} & ${groomName} - Master Wedding Planning Document</title>
        <style>
          body { font-family: 'Georgia', serif; color: #2c2419; margin: 40px; line-height: 1.6; background-color: #ffffff; }
          h1 { color: #8a6410; font-size: 28px; border-bottom: 2px solid #ca981d; padding-bottom: 8px; margin-bottom: 4px; }
          .subtitle { font-size: 14px; color: #6e5d48; margin-bottom: 24px; font-style: italic; }
          h2 { color: #2c2419; font-size: 20px; margin-top: 28px; border-bottom: 1px solid #ebdcc0; padding-bottom: 4px; }
          h3 { color: #ca981d; font-size: 16px; margin-top: 16px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; margin-bottom: 20px; font-size: 13px; }
          th { background-color: #faf6eb; color: #2c2419; border: 1px solid #ebdcc0; padding: 8px 12px; text-align: left; }
          td { border: 1px solid #ebdcc0; padding: 8px 12px; }
          .checklist-item { margin-bottom: 8px; font-size: 13px; }
          .checkbox { font-weight: bold; color: #ca981d; margin-right: 8px; }
          .answer { color: #555; margin-left: 24px; font-size: 12px; font-style: italic; }
          .meta-box { background: #faf6eb; border: 1px solid #ebdcc0; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div className="meta-box">
          <h1>💍 ${brideName} & ${groomName}</h1>
          <div className="subtitle">Master Wedding Day Plan, Vendor Itinerary & Planning Details • ${weddingDate} • ${location}</div>
          <div><strong>Guest Count:</strong> ${profile.guestCount || 120} guests | <strong>Theme:</strong> Modern Vineyard Romance</div>
        </div>

        <h2>⏰ AI-Extracted Day-Of Vendor Schedule</h2>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Category</th>
              <th>Vendor & Event</th>
              <th>Contract Source</th>
            </tr>
          </thead>
          <tbody>
            ${contractTimeline
              .map(
                (item) => `
              <tr>
                <td><strong>${item.time}</strong></td>
                <td>${item.category}</td>
                <td><strong>${item.event}</strong><br/><span style="color:#666">${item.notes}</span></td>
                <td>${item.sourceDoc}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <h2>📋 Category Planning Details & Logistics</h2>
        ${planningSections
          .map(
            (sec) => `
          <h3>${sec.title}</h3>
          <p style="font-size: 12px; color: #666;"><em>${sec.description}</em></p>
          <div>
            ${sec.items
              .map(
                (item) => `
              <div class="checklist-item">
                <span class="checkbox">${item.isCompleted ? "☑" : "☐"}</span>
                <strong>${item.question}</strong>
                <div class="answer">➡️ ${item.answer} ${item.sourceDoc ? `(Doc: ${item.sourceDoc})` : ""}</div>
              </div>
            `
              )
              .join("")}
          </div>
        `
          )
          .join("")}

        <h2>👥 Booked Vendor Contact Roster</h2>
        <table>
          <thead>
            <tr>
              <th>Vendor Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Quoted Cost</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${vendors
              .map(
                (v) => `
              <tr>
                <td><strong>${v.name}</strong></td>
                <td>${v.category}</td>
                <td>${v.status}</td>
                <td>$${v.quotedPrice?.toLocaleString() || "N/A"}</td>
                <td>${v.notes || "-"}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <h2>🗓️ Timeline Milestones Walkthrough</h2>
        ${walkthroughMilestones
          .map(
            (ms) => `
          <h3>${ms.timeframeLabel}: ${ms.title}</h3>
          <p style="font-size:12px; color:#666;">${ms.description}</p>
          <ul>
            ${ms.questions
              .map(
                (q) => `
              <li>${q.isCompleted ? "☑" : "☐"} <strong>${q.question}</strong>: ${q.answer}</li>
            `
              )
              .join("")}
          </ul>
        `
          )
          .join("")}

        <hr style="margin-top: 40px; border: none; border-top: 1px solid #ebdcc0;" />
        <p style="text-align: center; font-size: 11px; color: #999;">Exported from Garland & Vance Wedding OS • ${new Date().toLocaleDateString()}</p>
      </body>
      </html>
    `;
  };

  // Copy to clipboard for Google Docs
  const handleCopyForGoogleDocs = () => {
    const docHtml = generateFormattedDocumentHtml();
    navigator.clipboard.writeText(docHtml);
    setCopiedDocsSuccess(true);
    setTimeout(() => setCopiedDocsSuccess(false), 4000);
  };

  // Download .doc file for Google Docs import
  const handleDownloadDoc = () => {
    const docHtml = generateFormattedDocumentHtml();
    const blob = new Blob([docHtml], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Wedding_Master_Planning_Template_${(profile.brideName || "Bride").replace(/\s+/g, "_")}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Trigger browser print modal for printable template
  const handleTriggerPrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(generateFormattedDocumentHtml());
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  // Toggle item completion in planning section
  const handleToggleItem = (sectionId: string, itemId: string) => {
    const updatedSections = planningSections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: sec.items.map((item) => {
          if (item.id !== itemId) return item;
          const nextVal = !item.isCompleted;

          // Also sync with walkthrough milestones if matching
          return { ...item, isCompleted: nextVal };
        }),
      };
    });

    onUpdatePlanningSections(updatedSections);
  };

  // Update item question / answer text
  const handleUpdateItemText = (
    sectionId: string,
    itemId: string,
    field: "question" | "answer",
    val: string
  ) => {
    const updatedSections = planningSections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: sec.items.map((item) => {
          if (item.id !== itemId) return item;
          return { ...item, [field]: val };
        }),
      };
    });
    onUpdatePlanningSections(updatedSections);
  };

  // Add new detail item
  const handleAddDetailItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemQuestion.trim()) return;

    const newItem: DetailCheckItem = {
      id: "item_" + Date.now(),
      question: newItemQuestion.trim(),
      answer: newItemAnswer.trim() || "Pending details...",
      isCompleted: false,
      category: activeSectionId,
    };

    const updatedSections = planningSections.map((sec) => {
      if (sec.id !== activeSectionId) return sec;
      return {
        ...sec,
        items: [...sec.items, newItem],
      };
    });

    onUpdatePlanningSections(updatedSections);

    // Also add to global To-Dos if incomplete
    onAddTodo({
      id: "todo_" + Date.now(),
      title: newItemQuestion.trim(),
      category: activeSectionId,
      dueDate: profile.weddingDate || "2026-09-18",
      completed: false,
    });

    setNewItemQuestion("");
    setNewItemAnswer("");
    setIsAddItemOpen(false);
  };

  // Delete item
  const handleDeleteItem = (sectionId: string, itemId: string) => {
    const updatedSections = planningSections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: sec.items.filter((item) => item.id !== itemId),
      };
    });
    onUpdatePlanningSections(updatedSections);
  };

  // Toggle walkthrough question
  const handleToggleWalkthroughQuestion = (milestoneId: string, questionId: string) => {
    const updatedMilestones = walkthroughMilestones.map((ms) => {
      if (ms.id !== milestoneId) return ms;
      const updatedQuestions = ms.questions.map((q) => {
        if (q.id !== questionId) return q;
        return { ...q, isCompleted: !q.isCompleted };
      });
      const allDone = updatedQuestions.every((q) => q.isCompleted);
      return { ...ms, questions: updatedQuestions, isCompleted: allDone };
    });

    onUpdateWalkthroughMilestones(updatedMilestones);
  };

  // Active section data in Overview
  const currentSection = planningSections.find((s) => s.id === activeSectionId) || planningSections[0];

  // Helper icon map
  const renderCategoryIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case "Palette":
        return <Palette className={className} />;
      case "Building2":
        return <Building2 className={className} />;
      case "Heart":
        return <Heart className={className} />;
      case "Sparkles":
        return <Sparkles className={className} />;
      case "Clock":
        return <Clock className={className} />;
      case "ShieldAlert":
        return <ShieldAlert className={className} />;
      default:
        return <ClipboardList className={className} />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Left Export Actions Bar (Outside the main header div) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDocsExportModalOpen(true)}
            className="px-4 py-2 bg-white border border-[#ebdcc0] hover:border-[#ca981d] text-[#2c2419] rounded-2xl text-xs font-bold transition-colors flex items-center gap-2 shadow-2xs group"
          >
            <Share2 className="w-4 h-4 text-[#ca981d] group-hover:scale-110 transition-transform" />
            <span>Export to Google Docs</span>
          </button>

          <button
            onClick={handleTriggerPrint}
            className="px-4 py-2 bg-white border border-[#ebdcc0] hover:border-[#ca981d] text-[#2c2419] rounded-2xl text-xs font-bold transition-colors flex items-center gap-2 shadow-2xs group"
          >
            <Printer className="w-4 h-4 text-[#ca981d] group-hover:scale-110 transition-transform" />
            <span>Printable Binder Template</span>
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 bg-[#faf6eb] border border-[#ebdcc0] rounded-2xl">
          <button
            onClick={() => setViewMode("overview")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === "overview"
                ? "bg-[#ca981d] text-white shadow-2xs"
                : "text-[#6e5d48] hover:text-[#2c2419]"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Master Overview</span>
          </button>
          <button
            onClick={() => setViewMode("walkthrough")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === "walkthrough"
                ? "bg-[#ca981d] text-white shadow-2xs"
                : "text-[#6e5d48] hover:text-[#2c2419]"
            }`}
          >
            <PartyPopper className="w-3.5 h-3.5 text-[#fbf0cb]" />
            <span>Walkthrough Journey</span>
          </button>
        </div>
      </div>

      {/* Main Header & Mode Switcher */}
      <div className="bg-[#fffdfa] border border-[#ebdcc0] p-6 rounded-3xl shadow-2xs space-y-5">
        <div className="border-b border-[#f3e3b3] pb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#2c2419] flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-[#ca981d]" />
              <span>Master Wedding Planning Details & Timeline</span>
            </h1>
            <p className="text-sm text-[#6e5d48] mt-1">
              Store every wedding detail (Signage, Hotel Blocks, Officiant, Emergency Kits) and walk through your step-by-step timeline.
            </p>
          </div>
        </div>

        {/* AI Contract Scanner Bar */}
        <div className="bg-[#faf6eb] border border-[#ebdcc0] p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fbf3d5] border border-[#f3e3b3] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#ca981d]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#2c2419]">AI Contract & Email Timeline Synthesizer</h3>
              <p className="text-xs text-[#6e5d48]">
                Scans signed vendor PDF contracts to extract exact call times, arrival windows, and delivery notes.
              </p>
            </div>
          </div>

          <button
            onClick={handleScanContracts}
            disabled={isScanningContracts}
            className="px-4 py-2.5 bg-[#ca981d] hover:bg-[#b08314] text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-2 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#fbf0cb] ${isScanningContracts ? "animate-spin" : ""}`} />
            <span>{isScanningContracts ? "Scanning Contracts with Gemini..." : "Scan Contracts for Timeline"}</span>
          </button>
        </div>

        {scanSuccessMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{scanSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: MASTER DETAILS OVERVIEW & CONTRACT TIMELINE */}
      {/* ========================================================================= */}
      {viewMode === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Row: AI Extracted Vendor Day-Of Schedule */}
          <div className="bg-[#fffdfa] border border-[#ebdcc0] rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#f3e3b3] pb-3">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#2c2419] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#ca981d]" />
                  <span>AI-Extracted Vendor Day-Of Schedule</span>
                </h2>
                <p className="text-xs text-[#6e5d48]">
                  Verified arrival windows & call times compiled directly from signed vendor proposals.
                </p>
              </div>

              <span className="text-xs bg-[#fbf3d5] text-[#5e470e] px-3 py-1 rounded-full font-bold border border-[#f3e3b3]">
                {contractTimeline.length} Call Times Confirmed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {contractTimeline.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-[#faf6eb] border border-[#ebdcc0] rounded-2xl space-y-2 hover:border-[#ca981d] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#ca981d] bg-white px-2 py-0.5 rounded-md border border-[#ebdcc0]">
                      {item.time}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#8c7a63]">{item.category}</span>
                  </div>
                  <h4 className="font-serif font-bold text-xs text-[#2c2419]">{item.event}</h4>
                  <p className="text-[11px] text-[#6e5d48] line-clamp-2">{item.notes}</p>
                  <div className="flex items-center gap-1 text-[10px] text-[#8c7a63] font-semibold pt-1 border-t border-[#ebdcc0]">
                    <FileText className="w-3 h-3 text-[#ca981d]" />
                    <span className="truncate">{item.sourceDoc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Planning Details Category Template Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Category Sidebar */}
            <div className="lg:col-span-4 space-y-2">
              <div className="bg-[#fffdfa] border border-[#ebdcc0] p-3 rounded-2xl shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8c7a63] px-3 py-1 block">
                  Planning Detail Templates
                </span>
                {planningSections.map((sec) => {
                  const isActive = sec.id === activeSectionId;
                  const completedCount = sec.items.filter((i) => i.isCompleted).length;
                  const totalCount = sec.items.length;

                  return (
                    <button
                      key={sec.id}
                      onClick={() => setActiveSectionId(sec.id)}
                      className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between gap-3 ${
                        isActive
                          ? "bg-[#ca981d] text-white shadow-2xs"
                          : "hover:bg-[#faf6eb] text-[#2c2419]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {renderCategoryIcon(
                          sec.iconName,
                          `w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#ca981d]"}`
                        )}
                        <span className="text-xs font-serif font-bold truncate">{sec.title}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive ? "bg-white/20 text-white" : "bg-[#fbf3d5] text-[#5e470e]"
                        }`}
                      >
                        {completedCount}/{totalCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Selected Category Details List */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-[#fffdfa] border border-[#ebdcc0] rounded-3xl p-6 shadow-2xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f3e3b3] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#fbf3d5] border border-[#f3e3b3] flex items-center justify-center shrink-0">
                      {renderCategoryIcon(currentSection.iconName, "w-5 h-5 text-[#ca981d]")}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#2c2419]">{currentSection.title}</h3>
                      <p className="text-xs text-[#6e5d48]">{currentSection.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsAddItemOpen(true)}
                    className="px-3.5 py-2 bg-[#ca981d] hover:bg-[#b08314] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question / Detail</span>
                  </button>
                </div>

                {/* Section Notes */}
                <div className="p-3.5 bg-[#faf6eb] border border-[#ebdcc0] rounded-2xl text-xs text-[#6e5d48] space-y-1">
                  <span className="font-bold text-[#2c2419] block">Category Notes:</span>
                  <p>{currentSection.notes}</p>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {currentSection.items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all space-y-2 ${
                        item.isCompleted
                          ? "bg-emerald-50/50 border-emerald-200"
                          : "bg-white border-[#ebdcc0] hover:border-[#ca981d]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => handleToggleItem(currentSection.id, item.id)}
                            className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                              item.isCompleted
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-[#ebdcc0] bg-white hover:border-[#ca981d]"
                            }`}
                          >
                            {item.isCompleted && <Check className="w-3.5 h-3.5" />}
                          </button>

                          <div className="flex-1 space-y-1">
                            <h4
                              className={`font-serif font-bold text-sm ${
                                item.isCompleted ? "line-through text-slate-500" : "text-[#2c2419]"
                              }`}
                            >
                              {item.question}
                            </h4>

                            <div className="flex items-center gap-2 pt-0.5">
                              <input
                                type="text"
                                value={item.answer}
                                onChange={(e) =>
                                  handleUpdateItemText(
                                    currentSection.id,
                                    item.id,
                                    "answer",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter detail or answer..."
                                className="flex-1 px-3 py-1.5 bg-[#faf6eb] border border-[#ebdcc0] rounded-xl text-xs text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]"
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteItem(currentSection.id, item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete detail"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.sourceDoc && (
                        <div className="flex items-center gap-1.5 text-[11px] text-[#ca981d] font-semibold pl-8">
                          <FileText className="w-3 h-3" />
                          <span>Verified via contract: {item.sourceDoc}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: INTERACTIVE WALKTHROUGH MODE (VISUAL TIMELINE JOURNEY) */}
      {/* ========================================================================= */}
      {viewMode === "walkthrough" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Walkthrough Interactive Header */}
          <div className="bg-gradient-to-br from-[#faf6eb] via-[#fffdfa] to-[#fbf3d5] border border-[#ebdcc0] rounded-3xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#ca981d] bg-[#fbf3d5] px-3 py-1 rounded-full border border-[#f3e3b3] inline-block mb-2">
                  Interactive Timeline Journey
                </span>
                <h2 className="text-xl font-serif font-bold text-[#2c2419]">
                  Step-by-Step Wedding Planning Walkthrough
                </h2>
                <p className="text-xs text-[#6e5d48] mt-1">
                  Scroll from months out to the day-of celebration. Answer questions to build your master itinerary!
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#2c2419]">
                  Step {activeMilestoneIdx + 1} of {walkthroughMilestones.length}
                </span>
                <div className="flex gap-1">
                  <button
                    disabled={activeMilestoneIdx === 0}
                    onClick={() => setActiveMilestoneIdx((prev) => Math.max(0, prev - 1))}
                    className="p-2 bg-white border border-[#ebdcc0] rounded-xl text-xs font-bold disabled:opacity-40 hover:bg-[#faf6eb]"
                  >
                    ← Prev
                  </button>
                  <button
                    disabled={activeMilestoneIdx === walkthroughMilestones.length - 1}
                    onClick={() =>
                      setActiveMilestoneIdx((prev) =>
                        Math.min(walkthroughMilestones.length - 1, prev + 1)
                      )
                    }
                    className="p-2 bg-[#ca981d] text-white rounded-xl text-xs font-bold disabled:opacity-40 hover:bg-[#b08314]"
                  >
                    Next Step →
                  </button>
                </div>
              </div>
            </div>

            {/* Horizontal Step Timeline Bar */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none border-t border-[#ebdcc0] pt-4">
              {walkthroughMilestones.map((ms, idx) => {
                const isActive = idx === activeMilestoneIdx;
                const completedCount = ms.questions.filter((q) => q.isCompleted).length;

                return (
                  <button
                    key={ms.id}
                    onClick={() => setActiveMilestoneIdx(idx)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-[#ca981d] text-white shadow-2xs scale-105"
                        : "bg-white border border-[#ebdcc0] text-[#6e5d48] hover:bg-[#faf6eb]"
                    }`}
                  >
                    <span>{ms.timeframeLabel}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-[#fbf3d5] text-[#5e470e]"
                      }`}
                    >
                      {completedCount}/{ms.questions.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Milestone Walkthrough Card */}
          {(() => {
            const milestone = walkthroughMilestones[activeMilestoneIdx];
            if (!milestone) return null;

            return (
              <div
                key={milestone.id}
                className={`border rounded-3xl p-8 space-y-6 transition-all shadow-md ${
                  milestone.celebrationEffect
                    ? "bg-gradient-to-br from-[#fffdfa] via-[#fbf3d5] to-[#f9edd0] border-[#ca981d]"
                    : "bg-white border-[#ebdcc0]"
                }`}
              >
                {/* Milestone Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ebdcc0] pb-5">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        milestone.celebrationEffect
                          ? "bg-[#ca981d] text-white shadow-md animate-pulse"
                          : "bg-[#fbf3d5] border border-[#f3e3b3] text-[#ca981d]"
                      }`}
                    >
                      {milestone.celebrationEffect ? (
                        <PartyPopper className="w-6 h-6 text-white" />
                      ) : (
                        <Sparkles className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#b58212]">
                        {milestone.timeframeLabel}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-[#2c2419]">{milestone.title}</h3>
                      <p className="text-xs text-[#6e5d48] mt-0.5">{milestone.description}</p>
                    </div>
                  </div>

                  {milestone.celebrationEffect && (
                    <div className="px-4 py-2 bg-[#ca981d] text-white font-serif font-bold text-xs rounded-2xl shadow-2xs flex items-center gap-2 self-start md:self-auto">
                      <Sparkles className="w-4 h-4 text-[#fbf0cb]" />
                      <span>✨ Celebration Day-Of Mode Active!</span>
                    </div>
                  )}
                </div>

                {/* Verified Contract Note Banner */}
                {milestone.contractVerifiedNotes && (
                  <div className="p-4 bg-[#faf6eb] border border-[#ebdcc0] rounded-2xl text-xs text-[#2c2419] flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#ca981d] shrink-0" />
                    <div>
                      <span className="font-bold text-[#b58212] block">Verified from Signed Vendor Contracts:</span>
                      <p className="text-[#6e5d48]">{milestone.contractVerifiedNotes}</p>
                    </div>
                  </div>
                )}

                {/* Milestone Questions List */}
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-base text-[#2c2419] flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#ca981d]" />
                    <span>Planning Questions & Action Checkpoints ({milestone.questions.length})</span>
                  </h4>

                  <div className="grid grid-cols-1 gap-3">
                    {milestone.questions.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => handleToggleWalkthroughQuestion(milestone.id, q.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                          q.isCompleted
                            ? "bg-emerald-50/70 border-emerald-300 shadow-2xs"
                            : "bg-[#fffdfa] border-[#ebdcc0] hover:border-[#ca981d] shadow-2xs"
                        }`}
                      >
                        <div
                          className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                            q.isCompleted
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-[#ebdcc0] bg-white"
                          }`}
                        >
                          {q.isCompleted && <Check className="w-4 h-4" />}
                        </div>

                        <div className="space-y-1 flex-1">
                          <h5
                            className={`font-serif font-bold text-sm ${
                              q.isCompleted ? "line-through text-slate-500" : "text-[#2c2419]"
                            }`}
                          >
                            {q.question}
                          </h5>
                          <p className="text-xs text-[#6e5d48] leading-relaxed">{q.answer}</p>

                          {q.sourceDoc && (
                            <div className="flex items-center gap-1 text-[10px] text-[#ca981d] font-semibold pt-1">
                              <FileText className="w-3 h-3" />
                              <span>Verified in {q.sourceDoc}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Walkthrough Footer Controls */}
                <div className="pt-4 border-t border-[#ebdcc0] flex items-center justify-between">
                  <button
                    disabled={activeMilestoneIdx === 0}
                    onClick={() => setActiveMilestoneIdx((prev) => Math.max(0, prev - 1))}
                    className="px-4 py-2 bg-white border border-[#ebdcc0] rounded-xl text-xs font-bold disabled:opacity-40 hover:bg-[#faf6eb]"
                  >
                    ← Previous Stage
                  </button>

                  <button
                    disabled={activeMilestoneIdx === walkthroughMilestones.length - 1}
                    onClick={() =>
                      setActiveMilestoneIdx((prev) =>
                        Math.min(walkthroughMilestones.length - 1, prev + 1)
                      )
                    }
                    className="px-5 py-2.5 bg-[#ca981d] text-white rounded-xl text-xs font-bold shadow-2xs hover:bg-[#b08314] flex items-center gap-2"
                  >
                    <span>Proceed to Next Timeline Stage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD CUSTOM DETAIL ITEM */}
      {/* ========================================================================= */}
      {isAddItemOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-[#ebdcc0] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#f3e3b3] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#2c2419]">
                Add Question / Planning Detail
              </h3>
              <button
                type="button"
                onClick={() => setIsAddItemOpen(false)}
                className="text-[#8c7a63] hover:text-[#2c2419] font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDetailItem} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#6e5d48]">Question / Detail Description</label>
                <input
                  type="text"
                  required
                  value={newItemQuestion}
                  onChange={(e) => setNewItemQuestion(e.target.value)}
                  placeholder="e.g. Have we confirmed the groomsmen boutonnieres?"
                  className="w-full px-3.5 py-2.5 bg-[#faf6eb] border border-[#ebdcc0] rounded-xl text-sm text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#6e5d48]">Answer / Logistics Note</label>
                <input
                  type="text"
                  value={newItemAnswer}
                  onChange={(e) => setNewItemAnswer(e.target.value)}
                  placeholder="e.g. Blossom & Vine delivering 5 sage boutonnieres at 11:30 AM"
                  className="w-full px-3.5 py-2.5 bg-[#faf6eb] border border-[#ebdcc0] rounded-xl text-sm text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddItemOpen(false)}
                  className="px-4 py-2.5 bg-[#faf6eb] hover:bg-[#f3e3b3] text-[#2c2419] font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#ca981d] hover:bg-[#b08314] text-white font-bold rounded-xl text-xs transition-colors shadow-2xs"
                >
                  Save Detail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EXPORT TO GOOGLE DOCS TEMPLATE */}
      {/* ========================================================================= */}
      {isDocsExportModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-[#ebdcc0] rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#f3e3b3] pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#fbf3d5] border border-[#f3e3b3] flex items-center justify-center text-[#ca981d]">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#2c2419]">
                    Export to Google Docs Template
                  </h3>
                  <p className="text-xs text-[#6e5d48]">
                    Formats all wedding details, timeline call times, and checklists for standard Google Docs templates.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDocsExportModalOpen(false)}
                className="text-[#8c7a63] hover:text-[#2c2419] font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-[#faf6eb] border border-[#ebdcc0] rounded-2xl text-xs space-y-2 shrink-0">
              <span className="font-bold text-[#2c2419] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#ca981d]" />
                <span>Google Workspace Template Formatting Ready</span>
              </span>
              <p className="text-[#6e5d48]">
                Click <strong>"Copy for Google Docs"</strong> to copy the full rich-formatted document directly to your clipboard, then open Google Docs (docs.google.com) and paste (Ctrl+V / Cmd+V). Or click <strong>"Download .doc File"</strong> to download a Word/Docs compatible file.
              </p>
            </div>

            {/* Document Preview Box */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 border border-[#ebdcc0] rounded-2xl font-mono text-[11px] text-slate-800 space-y-4">
              <div className="font-serif font-bold text-base text-[#8a6410]">
                💍 {profile.brideName || "Brianna Garland"} & {profile.groomName || "Alex Vance"} - Master Wedding Document
              </div>
              <div>Date: {profile.weddingDate} | Location: {profile.location}</div>
              <div className="border-t border-slate-300 pt-2 font-bold text-slate-700">
                ⏰ DAY-OF VENDOR TIMELINE ({contractTimeline.length} events)
              </div>
              {contractTimeline.map((item) => (
                <div key={item.id} className="pl-3 border-l-2 border-[#ca981d]">
                  <strong>{item.time}</strong> - {item.event} ({item.category})
                </div>
              ))}

              <div className="border-t border-slate-300 pt-2 font-bold text-slate-700">
                📋 PLANNING DETAILS BY CATEGORY ({planningSections.length} sections)
              </div>
              {planningSections.map((sec) => (
                <div key={sec.id} className="pl-3">
                  <div className="font-bold text-[#b58212]">{sec.title}</div>
                  {sec.items.map((i) => (
                    <div key={i.id} className="text-[10px] pl-2 text-slate-600">
                      [{i.isCompleted ? "x" : " "}] {i.question} → {i.answer}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 border-t border-[#f3e3b3]">
              {copiedDocsSuccess ? (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Copied rich formatted document to clipboard! Paste into Google Docs.</span>
                </span>
              ) : (
                <span className="text-xs text-[#6e5d48]">Ready for 1-click import into Google Docs</span>
              )}

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleDownloadDoc}
                  className="px-4 py-2.5 bg-white border border-[#ebdcc0] hover:border-[#ca981d] text-[#2c2419] font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#ca981d]" />
                  <span>Download .doc File</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyForGoogleDocs}
                  className="px-5 py-2.5 bg-[#ca981d] hover:bg-[#b08314] text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy for Google Docs</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
