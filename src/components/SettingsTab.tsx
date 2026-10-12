import React, { useState } from "react";
import { WeddingProfile } from "../types";
import {
  Settings,
  Mail,
  Heart,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Link,
  PlusCircle,
  Save,
  Check,
  Zap,
  Key,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { GoogleAccountModal } from "./GoogleAccountModal";

interface Props {
  profile: WeddingProfile;
  onUpdateProfile: (updated: Partial<WeddingProfile>) => void;
  onTriggerScan?: (targetEmail: string) => void;
  isScanningInbox?: boolean;
  brandPrimaryColor?: string;
}

export const SettingsTab: React.FC<Props> = ({
  profile,
  onUpdateProfile,
  onTriggerScan,
  isScanningInbox = false,
  brandPrimaryColor = "#2b4c7e",
}) => {
  const [coupleNames, setCoupleNames] = useState(profile.coupleNames);
  const [partner1, setPartner1] = useState(profile.partner1);
  const [partner2, setPartner2] = useState(profile.partner2);
  const [weddingDate, setWeddingDate] = useState(profile.weddingDate);
  const [location, setLocation] = useState(profile.location);
  const [budget, setBudget] = useState(profile.budget);
  const [guestCount, setGuestCount] = useState(profile.guestCount);
  const [vibe, setVibe] = useState(profile.vibe);
  const [florals, setFlorals] = useState(profile.florals);
  const [notes, setNotes] = useState(profile.notes);

  // Email setup mode state
  const [emailMode, setEmailMode] = useState<"google_oauth" | "new_punny">(
    profile.emailSetupMode === "create_new_punny" ? "new_punny" : "google_oauth"
  );
  const [gmailAddress, setGmailAddress] = useState(profile.gmailAddress);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Google Account Switcher Modal State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Helper to generate punny email options based on partner names
  const p1First = partner1 ? partner1.split(" ")[0] : "Brianna";
  const p2First = partner2 ? partner2.split(" ")[0] : "Alex";
  const year = weddingDate ? new Date(weddingDate).getFullYear() : 2026;

  const punnyEmailOptions = [
    `${p1First}And${p2First}TieTheKnot@gmail.com`,
    `${p1First}And${p2First}HappilyEverAfter@gmail.com`,
    `${p1First}And${p2First}SayIDo${year}@gmail.com`,
    `${p1First}And${p2First}TyingTheKnot@gmail.com`,
    `${p1First}And${p2First}EverAfter${year}@gmail.com`,
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      coupleNames,
      partner1,
      partner2,
      weddingDate,
      location,
      budget: Number(budget),
      guestCount: Number(guestCount),
      vibe,
      florals,
      notes,
      gmailAddress,
      emailSetupMode: emailMode,
      isGoogleAccountLinked: emailMode === "google_oauth",
      linkedGoogleEmail: emailMode === "google_oauth" ? gmailAddress : undefined,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ebdcc0] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#ca981d]" />
            <h1 className="text-2xl font-serif font-bold text-[#2c2419]">
              Wedding Settings & Email Configuration
            </h1>
          </div>
          <p className="text-sm text-[#6e5d48] mt-1">
            Manage couple details, wedding date, target budget limit, and your AI-monitored wedding email account.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-4 py-2 bg-[#fbf3d5] text-[#5e470e] border border-[#f3e3b3] rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs">
            <Check className="w-4 h-4 text-[#ca981d]" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: EMAIL CONFIGURATION & GOOGLE SIGN-IN PROMPT */}
        <div className="bg-white border border-[#ebdcc0] rounded-3xl p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f3e8d3] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#fbf3d5] text-[#ca981d] border border-[#f3e3b3] flex items-center justify-center font-bold">
                <Mail className="w-5 h-5 text-[#ca981d]" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-[#2c2419]">
                  Wedding Email Setup & Google Account Integration
                </h2>
                <p className="text-xs text-[#6e5d48]">
                  Choose between creating a dedicated wedding email or signing in with your preferred Google account.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
              className="px-4 py-2 bg-[#faf6eb] hover:bg-[#f3e3b3] text-[#2c2419] border border-[#ebdcc0] rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-2xs self-start sm:self-auto"
            >
              <Key className="w-4 h-4 text-[#ca981d]" />
              <span>Prompt / Switch Google Account</span>
            </button>
          </div>

          {/* Connected Google Account Callout Banner */}
          {profile.isGoogleAccountLinked && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-900 block">Google Account Active & Authorized</span>
                  <span className="text-emerald-700 font-mono text-[11px]">
                    {profile.linkedGoogleEmail || gmailAddress}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(true)}
                className="px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[11px] transition-colors self-start sm:self-auto"
              >
                Change Google Account
              </button>
            </div>
          )}

          {/* Setup Mode Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setEmailMode("google_oauth");
                setIsGoogleModalOpen(true);
              }}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                emailMode === "google_oauth"
                  ? "bg-[#faf6eb] border-[#ca981d] ring-2 ring-[#f3e3b3]"
                  : "bg-[#fffdfa] border-[#ebdcc0] hover:border-[#ca981d]/40"
              }`}
            >
              <Key className={`w-5 h-5 shrink-0 mt-0.5 ${emailMode === "google_oauth" ? "text-[#ca981d]" : "text-[#8c7a63]"}`} />
              <div>
                <div className="font-bold text-sm text-[#2c2419]">Sign In / Connect Google Account</div>
                <p className="text-xs text-[#6e5d48] mt-0.5">
                  Sign in with any Gmail / Google account of your choice to give Ivory AI vendor quote access.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setEmailMode("new_punny")}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                emailMode === "new_punny"
                  ? "bg-[#faf6eb] border-[#ca981d] ring-2 ring-[#f3e3b3]"
                  : "bg-[#fffdfa] border-[#ebdcc0] hover:border-[#ca981d]/40"
              }`}
            >
              <PlusCircle className={`w-5 h-5 shrink-0 mt-0.5 ${emailMode === "new_punny" ? "text-[#ca981d]" : "text-[#8c7a63]"}`} />
              <div>
                <div className="font-bold text-sm text-[#2c2419]">Create Dedicated Wedding Gmail</div>
                <p className="text-xs text-[#6e5d48] mt-0.5">
                  Generate a fun, dedicated wedding email handle like <strong className="text-[#ca981d]">{p1First}And{p2First}TieTheKnot@gmail.com</strong>.
                </p>
              </div>
            </button>
          </div>

          {/* Mode 1: Punny Email Suggestions */}
          {emailMode === "new_punny" && (
            <div className="bg-[#faf6eb] p-4 rounded-2xl border border-[#ebdcc0] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#2c2419] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#ca981d]" /> AI-Generated Punny Email Options
                </label>
                <span className="text-[11px] text-[#6e5d48] italic">Click any option to select</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {punnyEmailOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setGmailAddress(opt)}
                    className={`p-2.5 rounded-xl text-left text-xs font-medium border transition-all flex items-center justify-between ${
                      gmailAddress === opt
                        ? "bg-[#ca981d] text-white border-[#ca981d] shadow-xs"
                        : "bg-white text-[#2c2419] border-[#ebdcc0] hover:border-[#ca981d]"
                    }`}
                  >
                    <span className="truncate">{opt}</span>
                    {gmailAddress === opt && <Check className="w-4 h-4 text-[#fbf0cb] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Address Input */}
          <div>
            <label className="text-xs font-bold text-[#2c2419] uppercase tracking-wider block mb-1">
              Active Wedding Email / Google Account Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={gmailAddress}
                onChange={(e) => setGmailAddress(e.target.value)}
                placeholder="e.g. BriannaAndAlexTieTheKnot@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#ebdcc0] rounded-xl text-sm font-semibold text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]/30"
              />
              <Mail className="w-4 h-4 text-[#a39278] absolute left-3.5 top-3" />
            </div>
            <p className="text-[11px] text-[#8c7a63] mt-1">
              This email is monitored by Ivory AI for quote extraction, PDF parsing, and vendor inbox sync.
            </p>
          </div>
        </div>

        {/* SECTION 2: COUPLE & WEDDING DETAILS */}
        <div className="bg-white border border-[#ebdcc0] rounded-3xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2.5 border-b border-[#f3e8d3] pb-4">
            <Heart className="w-5 h-5 text-[#ca981d]" />
            <h2 className="font-serif font-bold text-lg text-[#2c2419]">Couple & Event Setup</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#6e5d48] uppercase tracking-wider block mb-1">
                Couple Display Title
              </label>
              <input
                type="text"
                required
                value={coupleNames}
                onChange={(e) => setCoupleNames(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#ebdcc0] rounded-xl text-sm font-semibold text-[#2c2419]"
              />
            </div>

            <div>
              <label className="font-bold text-[#6e5d48] uppercase tracking-wider block mb-1">
                Wedding Date
              </label>
              <input
                type="date"
                required
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#ebdcc0] rounded-xl text-sm font-semibold text-[#2c2419]"
              />
            </div>

            <div>
              <label className="font-bold text-[#6e5d48] uppercase tracking-wider block mb-1">
                Partner 1 Full Name
              </label>
              <input
                type="text"
                required
                value={partner1}
                onChange={(e) => setPartner1(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#ebdcc0] rounded-xl text-sm text-[#2c2419]"
              />
            </div>

            <div>
              <label className="font-bold text-[#6e5d48] uppercase tracking-wider block mb-1">
                Partner 2 Full Name
              </label>
              <input
                type="text"
                required
                value={partner2}
                onChange={(e) => setPartner2(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#ebdcc0] rounded-xl text-sm text-[#2c2419]"
              />
            </div>

            <div>
              <label className="font-bold text-[#6e5d48] uppercase tracking-wider block mb-1">
                Wedding Location / Region
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#ebdcc0] rounded-xl text-sm text-[#2c2419]"
              />
            </div>

            <div>
              <label className="font-bold text-[#6e5d48] uppercase tracking-wider block mb-1">
                Expected Guest Count
              </label>
              <input
                type="number"
                required
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-[#ebdcc0] rounded-xl text-sm font-semibold text-[#2c2419]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: BUDGET TARGET & VISION PREFERENCES */}
        <div className="bg-white border border-[#ebdcc0] rounded-3xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2.5 border-b border-[#f3e8d3] pb-4">
            <DollarSign className="w-5 h-5 text-[#b58212]" />
            <h2 className="font-serif font-bold text-lg text-[#2c2419]">Budget Limit & Aesthetic Preferences</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#6e5d48] uppercase tracking-wider block mb-1">
                Total Target Budget Limit ($)
              </label>
              <input
                type="number"
                required
                step="1000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-[#ebdcc0] rounded-xl text-sm font-bold text-[#b58212]"
              />
            </div>

            <div>
              <label className="font-bold text-[#6e5d48] uppercase tracking-wider block mb-1">
                Floral & Foliage Style
              </label>
              <input
                type="text"
                value={florals}
                onChange={(e) => setFlorals(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#ebdcc0] rounded-xl text-sm text-[#2c2419]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#6e5d48] uppercase tracking-wider block mb-1 text-xs">
              Overall Aesthetic Vibe & Theme
            </label>
            <textarea
              rows={2}
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-[#ebdcc0] rounded-xl text-xs text-[#2c2419]"
            />
          </div>

          <div>
            <label className="font-bold text-[#6e5d48] uppercase tracking-wider block mb-1 text-xs">
              Special Planning Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-[#ebdcc0] rounded-xl text-xs text-[#2c2419]"
            />
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#ca981d] hover:bg-[#b08314] text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#fbf0cb]" />
            <span>Save All Settings & Configurations</span>
          </button>
        </div>
      </form>

      {/* Google Account Sign-In / Switcher Modal */}
      <GoogleAccountModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        profile={profile}
        onUpdateProfile={(updated) => {
          onUpdateProfile(updated);
          if (updated.gmailAddress) setGmailAddress(updated.gmailAddress);
        }}
        onTriggerScan={onTriggerScan}
        brandPrimaryColor={brandPrimaryColor}
      />
    </div>
  );
};
