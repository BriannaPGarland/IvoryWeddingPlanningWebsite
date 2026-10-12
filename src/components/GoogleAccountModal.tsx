import React, { useState } from "react";
import { WeddingProfile } from "../types";
import {
  Mail,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  PlusCircle,
  X,
  ShieldCheck,
  Check,
  ArrowRight,
  Key,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: WeddingProfile;
  onUpdateProfile: (updated: Partial<WeddingProfile>) => void;
  onTriggerScan?: (targetEmail: string) => void;
  brandPrimaryColor?: string;
}

export const GoogleAccountModal: React.FC<Props> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onTriggerScan,
  brandPrimaryColor = "#ca981d",
}) => {
  const [setupMode, setSetupMode] = useState<"google_oauth" | "create_new_punny">(
    profile.emailSetupMode || "google_oauth"
  );
  const [customGmail, setCustomGmail] = useState(
    profile.linkedGoogleEmail || (profile.gmailAddress.endsWith("@gmail.com") ? profile.gmailAddress : "")
  );
  const [punnyAddress, setPunnyAddress] = useState(
    profile.gmailAddress && !profile.gmailAddress.endsWith("@gmail.com")
      ? profile.gmailAddress
      : `${profile.partner1.split(" ")[0]}And${profile.partner2.split(" ")[0]}TieTheKnot@gmail.com`
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [scanStepMessage, setScanStepMessage] = useState("");
  const [connectSuccess, setConnectSuccess] = useState(false);

  if (!isOpen) return null;

  // Punny suggestions
  const p1 = profile.partner1 ? profile.partner1.split(" ")[0] : "Brianna";
  const p2 = profile.partner2 ? profile.partner2.split(" ")[0] : "Joe";
  const year = profile.weddingDate ? new Date(profile.weddingDate).getFullYear() : 2027;

  const punnyOptions = [
    `${p1}And${p2}TieTheKnot@gmail.com`,
    `${p1}And${p2}SayIDo${year}@gmail.com`,
    `${p1}And${p2}HappilyEverAfter@gmail.com`,
    `${p1}And${p2}TyingTheKnot@gmail.com`,
    `${p1}And${p2}EverAfter${year}@gmail.com`,
  ];

  const handleConnectGoogle = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setScanStepMessage("Connecting Google OAuth 2.0...");

    const targetEmail = setupMode === "google_oauth" ? (customGmail.trim() || `${p1.toLowerCase()}.${p2.toLowerCase()}.wedding@gmail.com`) : punnyAddress;

    setTimeout(() => {
      setScanStepMessage(`Scanning Gmail inbox for ${targetEmail}...`);
    }, 600);

    setTimeout(() => {
      setScanStepMessage("Parsing vendor emails, PDF quotes & contract dates with AI...");
    }, 1200);

    setTimeout(() => {
      setIsConnecting(false);
      setConnectSuccess(true);

      onUpdateProfile({
        gmailAddress: targetEmail,
        emailSetupMode: setupMode,
        isGoogleAccountLinked: setupMode === "google_oauth",
        linkedGoogleEmail: setupMode === "google_oauth" ? targetEmail : undefined,
      });

      if (onTriggerScan) {
        onTriggerScan(targetEmail);
      }

      setTimeout(() => {
        setConnectSuccess(false);
        onClose();
      }, 1000);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white border border-[#ebdcc0] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#f3e8d3] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#fbf3d5] border border-[#f3e3b3] flex items-center justify-center text-[#ca981d] shadow-2xs">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-[#2c2419]">
                Choose Google Email Account Setup
              </h2>
              <p className="text-xs text-[#6e5d48] mt-0.5">
                Sign in with your preferred Google account or create a dedicated wedding email.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#faf6eb] text-[#8c7a63] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Connection Status Badge */}
        {profile.isGoogleAccountLinked && profile.linkedGoogleEmail && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-emerald-900 block">Connected Google Account Active</span>
                <span className="text-emerald-700 font-mono text-[11px]">
                  {profile.linkedGoogleEmail}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
              Gmail OAuth Active
            </span>
          </div>
        )}

        {/* Setup Options Cards */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-[#2c2419] uppercase tracking-wider block">
            Select Your Preferred Integration Method
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Mode 1: Connect Google Account (OAuth / Custom Gmail) */}
            <button
              type="button"
              onClick={() => setSetupMode("google_oauth")}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                setupMode === "google_oauth"
                  ? "bg-[#faf6eb] border-[#ca981d] ring-2 ring-[#f3e3b3]"
                  : "bg-white border-[#ebdcc0] hover:border-[#ca981d]/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#ebdcc0] flex items-center justify-center text-[#ca981d]">
                  <Key className="w-4 h-4" />
                </div>
                {setupMode === "google_oauth" && (
                  <Check className="w-4 h-4 text-[#ca981d]" />
                )}
              </div>
              <div>
                <div className="font-serif font-bold text-sm text-[#2c2419]">
                  Sign In / Connect Google Account
                </div>
                <p className="text-[11px] text-[#6e5d48] mt-1 leading-relaxed">
                  Sign in with any Gmail or Google account of your choice to give Ivory AI read/send vendor access.
                </p>
              </div>
            </button>

            {/* Mode 2: Dedicated Wedding Gmail */}
            <button
              type="button"
              onClick={() => setSetupMode("create_new_punny")}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                setupMode === "create_new_punny"
                  ? "bg-[#faf6eb] border-[#ca981d] ring-2 ring-[#f3e3b3]"
                  : "bg-white border-[#ebdcc0] hover:border-[#ca981d]/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#ebdcc0] flex items-center justify-center text-[#ca981d]">
                  <PlusCircle className="w-4 h-4" />
                </div>
                {setupMode === "create_new_punny" && (
                  <Check className="w-4 h-4 text-[#ca981d]" />
                )}
              </div>
              <div>
                <div className="font-serif font-bold text-sm text-[#2c2419]">
                  Create Dedicated Wedding Gmail
                </div>
                <p className="text-[11px] text-[#6e5d48] mt-1 leading-relaxed">
                  Generate a dedicated punny email (e.g. {p1}And{p2}TieTheKnot@gmail.com) managed specifically for this wedding.
                </p>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleConnectGoogle} className="space-y-5">
          {/* Option A Inputs: Google Account OAuth / Custom Email */}
          {setupMode === "google_oauth" && (
            <div className="bg-[#faf6eb] p-5 rounded-2xl border border-[#ebdcc0] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2c2419] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#ca981d]" />
                  Google Sign-In & Email Prompt
                </span>
                <span className="text-[10px] bg-[#fbf3d5] text-[#5e470e] px-2 py-0.5 rounded font-semibold border border-[#f3e3b3]">
                  OAuth 2.0 Ready
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#6e5d48] block mb-1.5">
                  Enter or Confirm Your Google / Gmail Address:
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={customGmail}
                    onChange={(e) => setCustomGmail(e.target.value)}
                    placeholder="e.g. my.custom.wedding.email@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#ebdcc0] rounded-xl text-sm font-semibold text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]/30"
                  />
                  <Mail className="w-4 h-4 text-[#a39278] absolute left-3.5 top-3" />
                </div>
                <p className="text-[11px] text-[#8c7a63] mt-1.5 leading-normal">
                  💡 You can enter <strong>any Google Account</strong> here to give Ivory AI permission to read incoming vendor quotes and parse attachments for rendering.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#ebdcc0] space-y-1 text-[11px] text-[#6e5d48]">
                <div className="font-bold text-[#2c2419]">Scopes Granted Upon Authorization:</div>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Read incoming vendor emails & contract attachments</li>
                  <li>Extract price quotes, payment dates & floorplans</li>
                  <li>Send AI-drafted replies to vendors on your behalf</li>
                </ul>
              </div>
            </div>
          )}

          {/* Option B Inputs: Dedicated Punny Email Generator */}
          {setupMode === "create_new_punny" && (
            <div className="bg-[#faf6eb] p-5 rounded-2xl border border-[#ebdcc0] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2c2419] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#ca981d]" />
                  AI-Generated Punny Email Options
                </span>
                <span className="text-[10px] text-[#8c7a63] italic">Select one or type custom</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {punnyOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPunnyAddress(opt)}
                    className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                      punnyAddress === opt
                        ? "bg-[#ca981d] text-white border-[#ca981d] shadow-xs"
                        : "bg-white text-[#2c2419] border-[#ebdcc0] hover:border-[#ca981d]"
                    }`}
                  >
                    <span className="truncate">{opt}</span>
                    {punnyAddress === opt && <Check className="w-4 h-4 text-[#fbf0cb] shrink-0" />}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#6e5d48] block mb-1">
                  Dedicated Handle:
                </label>
                <input
                  type="email"
                  required
                  value={punnyAddress}
                  onChange={(e) => setPunnyAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#ebdcc0] rounded-xl text-sm font-semibold text-[#2c2419]"
                />
              </div>
            </div>
          )}

          {/* Connect / Confirm Button */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-[#faf6eb] hover:bg-[#ebdcc0] text-[#2c2419] font-bold text-xs rounded-2xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isConnecting}
              className="px-7 py-3 bg-[#ca981d] hover:bg-[#b08314] text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center gap-2"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#fbf0cb]" />
                  <span>{scanStepMessage || "Authorizing Google Account..."}</span>
                </>
              ) : connectSuccess ? (
                <>
                  <Check className="w-4 h-4 text-[#fbf0cb]" />
                  <span>Google Account Linked!</span>
                </>
              ) : (
                <>
                  <span>
                    {setupMode === "google_oauth"
                      ? "Sign In & Link Google Account"
                      : "Set Dedicated Wedding Gmail"}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#fbf0cb]" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
