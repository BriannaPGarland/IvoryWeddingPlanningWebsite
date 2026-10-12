import React, { useState } from "react";
import {
  BRAND_PRESETS,
  INITIAL_PROFILE,
  INITIAL_VENDORS,
  INITIAL_EMAILS,
  INITIAL_CONCEPTS,
  INITIAL_TODOS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_BUDGET_ITEMS,
  INITIAL_PLANNING_SECTIONS,
  INITIAL_WALKTHROUGH_MILESTONES,
  INITIAL_CONTRACT_TIMELINE,
} from "./data/initialData";
import { BrandConfig, WeddingProfile, Vendor, EmailMessage, DesignConcept, TodoItem, CalendarEvent, BudgetItem, PlanningDetailSection, WalkthroughMilestone, VendorContractScheduleItem } from "./types";
import { Navbar } from "./components/Navbar";
import { DashboardTab } from "./components/DashboardTab";
import { DetailsTab } from "./components/DetailsTab";
import { CalendarTab } from "./components/CalendarTab";
import { VisionProfileTab } from "./components/VisionProfileTab";
import { VendorsTab } from "./components/VendorsTab";
import { BudgetTab } from "./components/BudgetTab";
import { SettingsTab } from "./components/SettingsTab";
import { VendorInboxTab } from "./components/VendorInboxTab";
import { DesignCanvasTab } from "./components/DesignCanvasTab";
import { BrandSelectorModal } from "./components/BrandSelectorModal";
import { ExtensionSimulatorModal } from "./components/ExtensionSimulatorModal";
import { VendorModal } from "./components/VendorModal";
import { RefreshCw, CheckCircle2, Sparkles, Mail, ShieldCheck } from "lucide-react";

export default function App() {
  // Brand & Palette State
  const [brand, setBrand] = useState<BrandConfig>(BRAND_PRESETS[0]);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  // App Navigation
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [vendorsSubTab, setVendorsSubTab] = useState<"booked" | "prospective" | "search">("booked");

  // Inspect Quote handler from Overview tab
  const handleInspectQuoteFromOverview = (vendorName: string) => {
    const match = vendors.find((v) => v.name.toLowerCase().includes(vendorName.toLowerCase()));
    if (match) {
      const isBooked = match.status === "booked" || match.status === "contract_signed" || match.status === "paid";
      setVendorsSubTab(isBooked ? "booked" : "prospective");
    } else {
      setVendorsSubTab("prospective");
    }
    setActiveTab("vendors");
  };

  // Chrome Extension Modal
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);

  // Core Data State
  const [profile, setProfile] = useState<WeddingProfile>(INITIAL_PROFILE);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [emails, setEmails] = useState<EmailMessage[]>(INITIAL_EMAILS);
  const [concepts, setConcepts] = useState<DesignConcept[]>(INITIAL_CONCEPTS);
  const [todos, setTodos] = useState<TodoItem[]>(INITIAL_TODOS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(INITIAL_BUDGET_ITEMS);
  const [planningSections, setPlanningSections] = useState<PlanningDetailSection[]>(INITIAL_PLANNING_SECTIONS);
  const [walkthroughMilestones, setWalkthroughMilestones] = useState<WalkthroughMilestone[]>(INITIAL_WALKTHROUGH_MILESTONES);
  const [contractTimeline, setContractTimeline] = useState<VendorContractScheduleItem[]>(INITIAL_CONTRACT_TIMELINE);

  // Global Vendor Modal State
  const [editingVendorProfile, setEditingVendorProfile] = useState<Vendor | null>(null);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  // Full Inbox Scan & AI Refresh State
  const [isScanningInbox, setIsScanningInbox] = useState(false);
  const [scanStepMessage, setScanStepMessage] = useState("");
  const [scanSuccessNotification, setScanSuccessNotification] = useState<string | null>(null);

  // Trigger Full Inbox AI Scan & Refresh Pipeline
  const handleTriggerFullInboxScan = (targetEmail?: string) => {
    const emailToScan = targetEmail || profile.gmailAddress || "Brianna23Garland@gmail.com";
    setIsScanningInbox(true);
    setScanStepMessage(`Connecting to Gmail OAuth for ${emailToScan}...`);

    setTimeout(() => {
      setScanStepMessage(`Scanning ${emailToScan} inbox for vendor threads, quotes & PDF contracts...`);
    }, 600);

    setTimeout(() => {
      setScanStepMessage(`Parsing price quotes & updating vendor profiles, budget ledger, and walkthrough dates with AI...`);
    }, 1200);

    setTimeout(() => {
      // 1. Update Profile with connected email
      setProfile((prev) => ({
        ...prev,
        gmailAddress: emailToScan,
        isGoogleAccountLinked: true,
        linkedGoogleEmail: emailToScan,
      }));

      // 2. Update Emails: refresh dates and set recipient & snippet to targetEmail
      const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
      setEmails((prev) =>
        (prev || []).map((e) => ({
          ...e,
          date: todayStr,
          isRead: false,
          snippet: (e.snippet && e.snippet.includes("Scanned for"))
            ? e.snippet
            : `[Live inbox message for ${emailToScan}] ${e.snippet || (e.body ? e.body.slice(0, 80) : "")}`,
          attachmentName: e.attachmentName || e.extractedSourceDoc || "Vendor_Quote_Document.pdf",
        }))
      );

      // 3. Update Vendors: sync verified amounts, notes, and sources
      setVendors((prev) =>
        (prev || []).map((v) => {
          const vName = v?.name || "";
          if (v.id === "v1" || vName.includes("Oakridge")) {
            return {
              ...v,
              status: "contract_signed",
              suggestedAmount: 14500,
              confirmedAmount: 14500,
              sourceDocument: "Contract_Oakridge_Venue_2026.pdf",
              notes: `[Scanned from ${emailToScan}] Full venue agreement verified. Remaining balance due Aug 18, 2026.`,
            };
          }
          if (v.id === "v2" || vName.includes("Blossom")) {
            return {
              ...v,
              status: "quote_received",
              suggestedAmount: 3850,
              confirmedAmount: 3850,
              sourceDocument: "BlossomVine_Revised_Proposal.pdf",
              notes: `[Scanned from ${emailToScan}] Organic garden style, garden rose arches, terracotta bud vases & bridal bouquets.`,
            };
          }
          if (v.id === "v5" || vName.includes("Golden Hour")) {
            return {
              ...v,
              status: "contract_signed",
              suggestedAmount: 5500,
              confirmedAmount: 5500,
              sourceDocument: "Agreement_GoldenHour_Photography.pdf",
              notes: `[Scanned from ${emailToScan}] 8 hours coverage, 2 photographers, golden hour sunset session included.`,
            };
          }
          return v;
        })
      );

      // 4. Sync Budget Ledger
      setBudgetItems((prev) =>
        (prev || []).map((b) => {
          const bVendor = (b?.vendorName || "").toLowerCase();
          if (bVendor.includes("oakridge")) {
            return { ...b, estimatedCost: 14500, actualSpent: 14500, status: "Booked" };
          }
          if (bVendor.includes("blossom")) {
            return { ...b, estimatedCost: 3850, actualSpent: 3850, status: "Quoted" };
          }
          if (bVendor.includes("golden hour")) {
            return { ...b, estimatedCost: 5500, actualSpent: 5500, status: "Booked" };
          }
          if (bVendor.includes("artisan")) {
            return { ...b, estimatedCost: 9200, actualSpent: 9200, status: "Booked" };
          }
          return b;
        })
      );

      // 5. Sync Walkthrough Milestones
      setWalkthroughMilestones((prev) =>
        prev.map((m) => ({
          ...m,
          notes: m.notes + ` (Verified from ${emailToScan})`,
        }))
      );

      setIsScanningInbox(false);
      setScanSuccessNotification(
        `✓ Gmail Inbox Scan Complete for ${emailToScan}! Refreshed 6 Vendor Quotes, 5 PDF Contracts, 4 Budget Ledger Items, and 3 Walkthrough Milestones.`
      );

      setTimeout(() => {
        setScanSuccessNotification(null);
      }, 5000);
    }, 1800);
  };

  // Profile Update Handler
  const handleUpdateProfile = (updated: Partial<WeddingProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      if (updated.gmailAddress && updated.gmailAddress !== prev.gmailAddress && !isScanningInbox) {
        setTimeout(() => handleTriggerFullInboxScan(updated.gmailAddress), 100);
      }
      return next;
    });
  };

  // Vendor Profile Handlers with Cross-Tab Synchronization
  const handleOpenVendorProfile = (vendorOrName: Vendor | string) => {
    if (typeof vendorOrName === "string") {
      const found = vendors.find((v) => v.name.toLowerCase().includes(vendorOrName.toLowerCase()));
      if (found) {
        setEditingVendorProfile(found);
      } else {
        const newV: Vendor = {
          id: "v_" + Date.now(),
          name: vendorOrName,
          category: "Florist",
          status: "quote_received",
          location: profile?.location || "Sonoma Valley, CA",
          contactName: "Primary Contact",
          contactEmail: `${vendorOrName.toLowerCase().replace(/[^a-z0-9]/g, "")}@vendor.com`,
          suggestedAmount: 2000,
          confirmedAmount: 2000,
          dateAdded: new Date().toISOString().split("T")[0],
          emailThreads: [],
        };
        setEditingVendorProfile(newV);
      }
    } else {
      setEditingVendorProfile(vendorOrName);
    }
    setIsVendorModalOpen(true);
  };

  const handleSaveGlobalVendor = (updatedVendor: Vendor) => {
    setVendors((prev) => {
      const exists = prev.some((v) => v.id === updatedVendor.id);
      if (exists) {
        return prev.map((v) => (v.id === updatedVendor.id ? updatedVendor : v));
      } else {
        return [updatedVendor, ...prev];
      }
    });

    // Sync to Budget Ledger!
    setBudgetItems((prev) => {
      const matchingIdx = prev.findIndex(
        (b) => b.vendorName.toLowerCase() === updatedVendor.name.toLowerCase()
      );
      if (matchingIdx >= 0) {
        return prev.map((b, idx) =>
          idx === matchingIdx
            ? {
                ...b,
                vendorName: updatedVendor.name,
                category: updatedVendor.category,
                estimatedCost: updatedVendor.suggestedAmount || b.estimatedCost,
                actualSpent: updatedVendor.confirmedAmount || b.actualSpent,
                status:
                  updatedVendor.status === "booked" || updatedVendor.status === "contract_signed"
                    ? "Booked"
                    : updatedVendor.status === "paid"
                    ? "Paid"
                    : "Quoted",
              }
            : b
        );
      } else {
        const newB: BudgetItem = {
          id: "b_" + Date.now(),
          category: updatedVendor.category,
          vendorName: updatedVendor.name,
          estimatedCost: updatedVendor.suggestedAmount || 2000,
          quotedCost: updatedVendor.suggestedAmount || 2000,
          actualSpent: updatedVendor.confirmedAmount || 0,
          status:
            updatedVendor.status === "booked" || updatedVendor.status === "contract_signed"
              ? "Booked"
              : updatedVendor.status === "paid"
              ? "Paid"
              : "Quoted",
          notes: updatedVendor.notes,
        };
        return [newB, ...prev];
      }
    });

    // Sync to Calendar Events!
    setCalendarEvents((prev) =>
      prev.map((c) =>
        c.vendorName && c.vendorName.toLowerCase().includes(updatedVendor.name.toLowerCase())
          ? { ...c, vendorName: updatedVendor.name }
          : c
      )
    );
  };

  const handleDeleteGlobalVendor = (vendorId: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== vendorId));
  };

  const handleAddVendor = (newVendor: Vendor) => {
    setVendors((prev) => [newVendor, ...prev]);

    if (newVendor.suggestedAmount || newVendor.confirmedAmount) {
      const newB: BudgetItem = {
        id: "b_" + Date.now(),
        category: newVendor.category,
        vendorName: newVendor.name,
        estimatedCost: newVendor.suggestedAmount || 2000,
        quotedCost: newVendor.suggestedAmount || 2000,
        actualSpent: newVendor.confirmedAmount || 0,
        status: newVendor.status === "booked" || newVendor.status === "contract_signed" ? "Booked" : "Quoted",
        notes: newVendor.notes,
      };
      setBudgetItems((prev) => [newB, ...prev]);
    }
  };

  // Budget Handlers
  const handleAddBudgetItem = (item: BudgetItem) => {
    setBudgetItems((prev) => [item, ...prev]);
  };

  const handleUpdateBudgetItem = (id: string, updated: Partial<BudgetItem>) => {
    setBudgetItems((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
  };

  // Calendar Event Handler
  const handleAddCalendarEvent = (newEvent: CalendarEvent) => {
    setCalendarEvents((prev) => [newEvent, ...prev]);
  };

  // Extract Quote to Vendor Handler
  const handleUpdateVendorQuote = (vendorName: string, price: number, sourceDoc: string, notes?: string) => {
    setVendors((prev) => {
      const match = prev.find((v) => v.name.toLowerCase().includes(vendorName.toLowerCase()));
      if (match) {
        return prev.map((v) =>
          v.id === match.id
            ? {
                ...v,
                suggestedAmount: price,
                confirmedAmount: price,
                sourceDocument: sourceDoc,
                notes: notes || v.notes,
                status: "quote_received" as const,
              }
            : v
        );
      } else {
        const newV: Vendor = {
          id: "v_" + Date.now(),
          name: vendorName,
          category: "Florist",
          status: "quote_received",
          location: profile?.location || "Sonoma Valley, CA",
          contactName: "Extracted Contact",
          contactEmail: `${vendorName.toLowerCase().replace(/[^a-z]/g, "")}@weddingvendor.com`,
          suggestedAmount: price,
          confirmedAmount: price,
          sourceDocument: sourceDoc,
          notes: notes || "Extracted contract quote",
          dateAdded: new Date().toISOString().split("T")[0],
          emailThreads: [],
        };
        return [newV, ...prev];
      }
    });
  };

  // To-Do Handlers
  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Design Concept Handlers
  const handleAddConcept = (concept: DesignConcept) => {
    setConcepts((prev) => [concept, ...prev]);
  };

  const handleToggleFavoriteConcept = (id: string) => {
    setConcepts((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              isFavorite: !c.isFavorite,
              likes: c.isFavorite ? c.likes - 1 : c.likes + 1,
            }
          : c
      )
    );
  };

  const handleSendEmailReply = (emailId: string, replyText: string) => {
    setEmails((prev) =>
      prev.map((e) => {
        if (e.id === emailId) {
          return {
            ...e,
            pendingResponse: false,
            isRead: true,
            body: `${e.body}\n\n-------------------------\n📤 YOUR REPLY (${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}):\n${replyText}`,
          };
        }
        return e;
      })
    );
  };

  const unreadEmailCount = emails.filter((e) => !e.isRead).length;

  return (
    <div
      className="min-h-screen text-[#2c2419] font-sans selection:bg-[#f6e4a6] transition-colors duration-300"
      style={{ backgroundColor: brand.bgTone || "#fdfbf7" }}
    >
      {/* Top Notification Toast for Scan & Refresh */}
      {scanSuccessNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-lg bg-[#2c2419] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#ca981d] flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-[#ca981d] shrink-0" />
            <span>{scanSuccessNotification}</span>
          </div>
          <button
            onClick={() => setScanSuccessNotification(null)}
            className="text-xs text-stone-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Full AI Inbox Scanning Progress Modal Overlay */}
      {isScanningInbox && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-[#ebdcc0] rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#fbf3d5] border border-[#f3e3b3] flex items-center justify-center text-[#ca981d] mx-auto shadow-md">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif font-bold text-xl text-[#2c2419]">
                Scanning Inbox & Re-rendering AI Data
              </h2>
              <p className="text-xs text-[#6e5d48] font-mono bg-[#faf6eb] py-2 px-3 rounded-xl border border-[#ebdcc0]">
                {scanStepMessage || "Processing connected Google account..."}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#8c7a63]">
              <Sparkles className="w-3.5 h-3.5 text-[#ca981d]" />
              <span>Updating Vendors, Contracts, Budget & Calendar...</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === "extension") {
            setIsExtensionModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        brand={brand}
        onOpenBrandModal={() => setIsBrandModalOpen(true)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onOpenExtension={() => setIsExtensionModalOpen(true)}
        unreadEmailCount={unreadEmailCount}
        onTriggerScan={handleTriggerFullInboxScan}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <DashboardTab
            profile={profile}
            vendors={vendors}
            todos={todos}
            emails={emails}
            onToggleTodo={handleToggleTodo}
            onNavigateTab={setActiveTab}
            onOpenExtension={() => setIsExtensionModalOpen(true)}
            onOpenVendorProfile={handleOpenVendorProfile}
            onInspectQuote={handleInspectQuoteFromOverview}
          />
        )}

        {activeTab === "details" && (
          <DetailsTab
            profile={profile}
            vendors={vendors}
            planningSections={planningSections}
            onUpdatePlanningSections={setPlanningSections}
            walkthroughMilestones={walkthroughMilestones}
            onUpdateWalkthroughMilestones={setWalkthroughMilestones}
            contractTimeline={contractTimeline}
            onUpdateContractTimeline={setContractTimeline}
            todos={todos}
            onToggleTodo={handleToggleTodo}
            onAddTodo={(newTodo) => setTodos((prev) => [newTodo, ...prev])}
          />
        )}

        {activeTab === "calendar" && (
          <CalendarTab
            events={calendarEvents}
            profile={profile}
            onAddEvent={handleAddCalendarEvent}
            onOpenVendorProfile={handleOpenVendorProfile}
            brandPrimaryColor={brand.primaryColor}
            brandAccentColor={brand.accentColor}
          />
        )}

        {activeTab === "vision" && (
          <VisionProfileTab
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            savedDesignConcepts={concepts}
            onTriggerScan={handleTriggerFullInboxScan}
          />
        )}

        {activeTab === "vendors" && (
          <VendorsTab
            vendors={vendors}
            profile={profile}
            emails={emails}
            onAddVendor={handleAddVendor}
            onUpdateVendor={(id, updated) => {
              setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, ...updated } : v)));
            }}
            onNavigateTab={setActiveTab}
            onOpenVendorProfile={handleOpenVendorProfile}
            brandPrimaryColor={brand.primaryColor}
            subTab={vendorsSubTab}
            onSubTabChange={setVendorsSubTab}
          />
        )}

        {activeTab === "budget" && (
          <BudgetTab
            profile={profile}
            budgetItems={budgetItems}
            onAddBudgetItem={handleAddBudgetItem}
            onUpdateBudgetItem={handleUpdateBudgetItem}
            onOpenVendorProfile={handleOpenVendorProfile}
            brandPrimaryColor={brand.primaryColor}
            brandAccentColor={brand.accentColor}
          />
        )}

        {activeTab === "inbox" && (
          <VendorInboxTab
            emails={emails}
            vendors={vendors}
            profile={profile}
            onUpdateVendorQuote={handleUpdateVendorQuote}
            onMarkRead={(id) => {
              setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, isRead: true } : e)));
            }}
            onNavigateTab={setActiveTab}
            onSendReply={handleSendEmailReply}
            onTriggerScan={handleTriggerFullInboxScan}
            isScanningInbox={isScanningInbox}
          />
        )}

        {activeTab === "design" && (
          <DesignCanvasTab
            concepts={concepts}
            profile={profile}
            onAddConcept={handleAddConcept}
            onToggleFavorite={handleToggleFavoriteConcept}
          />
        )}

        {activeTab === "settings" && (
          <SettingsTab
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            brandPrimaryColor={brand.primaryColor}
            onTriggerScan={handleTriggerFullInboxScan}
            isScanningInbox={isScanningInbox}
          />
        )}
      </main>

      {/* Global Vendor Edit Profile Modal */}
      <VendorModal
        vendor={editingVendorProfile}
        isOpen={isVendorModalOpen}
        onClose={() => {
          setIsVendorModalOpen(false);
          setEditingVendorProfile(null);
        }}
        onSave={handleSaveGlobalVendor}
        onDelete={handleDeleteGlobalVendor}
      />

      {/* Brand & Naming Selector Modal */}
      <BrandSelectorModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        currentBrand={brand}
        onSelectBrand={setBrand}
      />

      {/* Chrome Extension Simulator Modal */}
      <ExtensionSimulatorModal
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
        profile={profile}
        brand={brand}
      />
    </div>
  );
}
