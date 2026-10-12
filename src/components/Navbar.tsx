import React, { useState } from "react";
import { BrandConfig, WeddingProfile } from "../types";
import {
  LayoutDashboard,
  ClipboardList,
  Palette,
  Users,
  Image as ImageIcon,
  Mail,
  Puzzle,
  ChevronDown,
  Heart,
  Calendar,
  DollarSign,
  User,
  Key,
  Bell,
  Shield,
  Check,
  Mail as MailIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { GoogleAccountModal } from "./GoogleAccountModal";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  brand: BrandConfig;
  onOpenBrandModal: () => void;
  profile: WeddingProfile;
  onUpdateProfile?: (updated: Partial<WeddingProfile>) => void;
  onOpenExtension: () => void;
  unreadEmailCount: number;
  onTriggerScan?: (targetEmail: string) => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  brand,
  onOpenBrandModal,
  profile,
  onUpdateProfile,
  unreadEmailCount,
  onTriggerScan,
}) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(profile.gmailAddress || "Brianna23Garland@gmail.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Calculate days remaining until wedding
  const getDaysRemaining = () => {
    if (!profile.weddingDate) return 0;
    const wedding = new Date(profile.weddingDate).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((wedding - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const daysLeft = getDaysRemaining();

  const tabs = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "details", label: "The Details", icon: ClipboardList },
    { id: "vision", label: "Vision Profile", icon: Palette },
    { id: "vendors", label: "Vendors and Contracts", icon: Users },
    { id: "budget", label: "Budget", icon: DollarSign },
    { id: "calendar", label: "Google Calendar", icon: Calendar, highlight: true },
    { id: "inbox", label: "Inbox", icon: Mail, badge: unreadEmailCount },
    { id: "design", label: "Design", icon: ImageIcon },
    { id: "extension", label: "Chrome Extension", icon: Puzzle },
  ];

  const handleSaveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessMsg("Account & security settings updated successfully!");
    setTimeout(() => {
      setSaveSuccessMsg("");
      setIsProfileModalOpen(false);
    }, 1800);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fdfaf5]/90 backdrop-blur-md border-b border-[#ebdcc0] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Header Row */}
          <div className="flex items-center justify-between h-16 pt-2">
            {/* Brand Logo & Name Selector + Email Under Ivory */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#2b2216] shadow-2xs font-serif font-bold text-xl bg-[#f6e4a6]"
                style={{ backgroundColor: brand.accentColor || "#f6e4a6" }}
              >
                ✨
              </div>
              <div>
                <button
                  onClick={onOpenBrandModal}
                  className="group flex items-center gap-1.5 text-[#2c2419] hover:text-[#ca981d] transition-colors text-left"
                >
                  <span className="font-ivory-script text-2xl sm:text-3xl font-normal italic tracking-wide text-[#2c2419] leading-none drop-shadow-2xs">{brand.name}</span>
                  <ChevronDown className="w-4 h-4 text-[#a39276] group-hover:text-[#ca981d] transition-colors" />
                </button>
                {/* Subtitle under Ivory title */}
                <div className="text-xs text-[#7e705c] flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3 text-[#ca981d]" />
                  <span className="font-serif italic text-[#6e5d48]">Wedding planning made easy.</span>
                </div>
              </div>
            </div>

            {/* Right Side - Shifted all the way over to the right */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
              {/* Google Account Switcher Quick Pill */}
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#faf6eb] hover:bg-[#f3e3b3] border border-[#ebdcc0] rounded-full text-[11px] font-bold text-[#2c2419] transition-all shadow-2xs"
                title="Connect or Switch Google Account for Gmail Access"
              >
                <Key className="w-3.5 h-3.5 text-[#ca981d]" />
                <span className="truncate max-w-[140px]">
                  {profile.linkedGoogleEmail || profile.gmailAddress || "Google Sign-In"}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>

              {/* Couple & Countdown Badge */}
              <div className="flex items-center gap-2 bg-[#ca981d] border border-[#b58514] px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-2xs">
                <Heart className="w-3.5 h-3.5 text-white fill-white/30" />
                <span className="text-white font-bold">{profile.coupleNames}</span>
                <span className="text-white/60">•</span>
                <Calendar className="w-3.5 h-3.5 text-white" />
                <span className="text-white font-bold">{daysLeft} Days to Wedding</span>
              </div>

              {/* Profile Icon Button */}
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="w-9 h-9 rounded-full bg-white border border-[#ebdcc0] hover:border-[#ca981d] hover:bg-[#faf6eb] flex items-center justify-center text-[#2c2419] transition-all shadow-2xs group relative"
                title="Account Settings & Profile"
              >
                <User className="w-4 h-4 text-[#2c2419] group-hover:text-[#ca981d]" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </button>
            </div>
          </div>

          {/* Tab Navigation Row */}
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-white text-[#2c2419] shadow-xs border border-[#e5d6b4] font-bold ring-1 ring-[#f3e3b3]"
                      : "text-[#6e604f] hover:text-[#2c2419] hover:bg-[#f6efe0]"
                  } ${tab.highlight ? "border border-[#f0da99] bg-[#fffbf0]" : ""}`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#ca981d]" : "text-[#9d8d75]"
                    }`}
                  />
                  <span>{tab.label}</span>

                  {typeof tab.badge === "number" && tab.badge > 0 && (
                    <span className="ml-1 bg-[#d9a08b] text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Profile & Settings Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-[#ebdcc0] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#f3e3b3] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#faf6eb] border border-[#ebdcc0] flex items-center justify-center text-[#ca981d]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#2c2419]">
                    Account & Profile Settings
                  </h3>
                  <p className="text-xs text-[#7e705c]">Manage account email, password & notifications</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="text-[#8c7a63] hover:text-[#2c2419] font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfileSettings} className="space-y-4 text-xs">
              <div className="p-3 bg-[#faf6eb] border border-[#ebdcc0] rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ca981d] text-white flex items-center justify-center font-bold text-sm">
                  BG
                </div>
                <div>
                  <div className="font-bold text-[#2c2419] text-sm">Brianna Garland & Joe Miller</div>
                  <div className="text-[#6e5d48]">May 16, 2027 • Sonoma Valley Wedding</div>
                </div>
              </div>

              {/* Email Address & Google Account Setup */}
              <div className="space-y-2">
                <label className="font-bold text-[#6e5d48] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MailIcon className="w-3.5 h-3.5 text-[#ca981d]" />
                    <span>Active Planning Email</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      setIsGoogleModalOpen(true);
                    }}
                    className="text-[11px] text-[#ca981d] hover:underline font-bold"
                  >
                    Switch Google Account
                  </button>
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => {
                    setUserEmail(e.target.value);
                    if (onUpdateProfile) onUpdateProfile({ gmailAddress: e.target.value });
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#faf6eb] border border-[#ebdcc0] rounded-xl text-sm font-medium text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]"
                  required
                />
                
                <div className="p-2.5 bg-white border border-[#ebdcc0] rounded-xl flex items-center justify-between text-[11px]">
                  <span className="text-[#6e5d48]">
                    {profile.isGoogleAccountLinked ? "✓ OAuth Linked" : "Dedicated Email"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      setIsGoogleModalOpen(true);
                    }}
                    className="px-2.5 py-1 bg-[#faf6eb] hover:bg-[#f3e3b3] text-[#2c2419] font-bold rounded-lg border border-[#ebdcc0]"
                  >
                    Prompt Google Account
                  </button>
                </div>
              </div>

              {/* Password Reset */}
              <div className="space-y-2 pt-1 border-t border-[#f3e3b3]">
                <label className="font-bold text-[#6e5d48] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#ca981d]" />
                  <span>Change Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#faf6eb] border border-[#ebdcc0] rounded-xl text-xs text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]"
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#faf6eb] border border-[#ebdcc0] rounded-xl text-xs text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]"
                />
              </div>

              {/* Preferences */}
              <div className="space-y-2 pt-2 border-t border-[#f3e3b3]">
                <div className="font-bold text-[#6e5d48] flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#ca981d]" />
                  <span>Notifications & Email Sync</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-[#2c2419]">
                  <input type="checkbox" defaultChecked className="rounded text-[#ca981d] focus:ring-[#ca981d]" />
                  <span>Receive instant vendor quote notifications</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[#2c2419]">
                  <input type="checkbox" defaultChecked className="rounded text-[#ca981d] focus:ring-[#ca981d]" />
                  <span>Auto-sync vendor contracts into Google Calendar</span>
                </label>
              </div>

              {saveSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 bg-[#faf6eb] text-[#2c2419] font-bold rounded-xl text-xs hover:bg-[#f3e3b3] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ca981d] text-white font-bold rounded-xl text-xs hover:bg-[#b08314] transition-colors shadow-2xs"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google Account Sign-In / Switcher Modal */}
      <GoogleAccountModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        profile={profile}
        onUpdateProfile={(updated) => {
          if (onUpdateProfile) onUpdateProfile(updated);
          if (updated.gmailAddress) setUserEmail(updated.gmailAddress);
        }}
        onTriggerScan={onTriggerScan}
      />
    </>
  );
};

