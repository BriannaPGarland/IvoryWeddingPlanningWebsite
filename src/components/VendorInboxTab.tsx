import React, { useState, useEffect } from "react";
import { EmailMessage, Vendor, WeddingProfile } from "../types";
import {
  Mail,
  Sparkles,
  FileText,
  User,
  Paperclip,
  RefreshCw,
  Search,
  Check,
  ShieldCheck,
  Star,
  MessageSquare,
  Send,
  HelpCircle,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface Props {
  emails: EmailMessage[];
  vendors: Vendor[];
  profile: WeddingProfile;
  onUpdateVendorQuote: (vendorName: string, amount: number, sourceDoc: string, notes: string) => void;
  onMarkRead: (emailId: string) => void;
  onNavigateTab: (tab: string) => void;
  onSendReply?: (emailId: string, replyText: string) => void;
  onTriggerScan?: (targetEmail: string) => void;
  isScanningInbox?: boolean;
}

export const VendorInboxTab: React.FC<Props> = ({
  emails,
  vendors,
  profile,
  onUpdateVendorQuote,
  onMarkRead,
  onNavigateTab,
  onSendReply,
  onTriggerScan,
  isScanningInbox = false,
}) => {
  // Filter Toggle Mode: "all" | "booked" | "pending"
  const [filterMode, setFilterMode] = useState<"all" | "booked" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(emails[0]?.id || null);

  // AI & Reply State
  const [isExtractingQuote, setIsExtractingQuote] = useState(false);
  const [appliedSuccessMsg, setAppliedSuccessMsg] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySuccessMsg, setReplySuccessMsg] = useState<string | null>(null);

  // Automatically reset filters to 'all' whenever signed-in email updates to show the full inbox without restrictive filters
  useEffect(() => {
    setFilterMode("all");
    setSearchQuery("");
    if (emails && emails.length > 0) {
      setSelectedEmailId(emails[0].id);
    }
  }, [profile.gmailAddress, emails.length]);

  // Helper function to check if vendor is booked
  const isVendorBooked = (vendorName: string, explicitBookedFlag?: boolean) => {
    if (explicitBookedFlag) return true;
    if (!vendorName) return false;
    const match = vendors.find((v) => (v?.name || "").toLowerCase().includes(vendorName.toLowerCase()));
    return match ? match.status === "booked" || match.status === "contract_signed" || match.status === "paid" : false;
  };

  // Filter logic
  const filteredEmails = emails.filter((e) => {
    const isBooked = isVendorBooked(e.vendorName, e.isBookedVendor);
    const q = (searchQuery || "").toLowerCase();
    const matchesSearch =
      (e?.vendorName || "").toLowerCase().includes(q) ||
      (e?.subject || "").toLowerCase().includes(q) ||
      (e?.senderName || "").toLowerCase().includes(q) ||
      (e?.body || "").toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (filterMode === "booked") {
      return isBooked;
    }
    if (filterMode === "pending") {
      return e.pendingResponse;
    }
    return true;
  });

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || filteredEmails[0] || emails[0] || null;

  const bookedEmailCount = emails.filter((e) => isVendorBooked(e.vendorName, e.isBookedVendor)).length;
  const pendingResponseCount = emails.filter((e) => e.pendingResponse).length;

  const handleExtractQuoteWithAI = async () => {
    if (!selectedEmail) return;
    setIsExtractingQuote(true);

    try {
      const res = await fetch("/api/gemini/extract-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailSubject: selectedEmail.subject,
          emailBody: selectedEmail.body,
          documentName: selectedEmail.attachmentName,
        }),
      });

      const extracted = await res.json();

      selectedEmail.extractedQuote = {
        price: extracted.suggestedAmountSpent || 3500,
        sourceDoc: extracted.documentName || selectedEmail.attachmentName || "Proposal.pdf",
        services: extracted.keyServices || "Vendor Services",
        notes: extracted.summaryNotes || "Extracted contract details.",
        contactPerson: extracted.contactPerson || selectedEmail.senderName,
      };

      setIsExtractingQuote(false);
    } catch (e) {
      console.error("Extract quote failed:", e);
      setIsExtractingQuote(false);
    }
  };

  const handleApplyToVendorBudget = () => {
    if (!selectedEmail || !selectedEmail.extractedQuote) return;
    const q = selectedEmail.extractedQuote;

    onUpdateVendorQuote(selectedEmail.vendorName, q.price, q.sourceDoc, q.notes);

    setAppliedSuccessMsg(`✓ Extracted $${q.price.toLocaleString()} applied to ${selectedEmail.vendorName}!`);
    setTimeout(() => setAppliedSuccessMsg(null), 3000);
  };

  const handleSendReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmail || !replyText.trim()) return;

    if (onSendReply) {
      onSendReply(selectedEmail.id, replyText.trim());
    } else {
      selectedEmail.pendingResponse = false;
      selectedEmail.body += `\n\n-------------------------\n📤 YOUR REPLY (${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}):\n${replyText}`;
    }

    setReplySuccessMsg(`✓ Reply sent to ${selectedEmail.senderName}! Pending response alert cleared.`);
    setReplyText("");
    setTimeout(() => setReplySuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ebdcc0] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-[#2c2419]">Planning Inbox</h1>
            <span className="bg-[#ca981d] text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#fbf0cb]" /> Auto-Monitored Inbox
            </span>
          </div>
          <p className="text-sm text-[#6e5d48] mt-1">
            Connected wedding inbox (<span className="font-semibold text-[#ca981d]">{profile.gmailAddress}</span>). 
            Prioritizes communications from booked vendors, contract PDFs, and pending questions.
          </p>
        </div>

        <button
          type="button"
          disabled={isScanningInbox}
          onClick={() => {
            if (onTriggerScan) {
              onTriggerScan(profile.gmailAddress);
            }
          }}
          className="px-5 py-2.5 bg-[#ca981d] hover:bg-[#b08314] text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 text-[#fbf0cb] ${isScanningInbox ? "animate-spin" : ""}`} />
          <span>{isScanningInbox ? "Scanning Inbox & Updating AI Info..." : "Scan Email & Refresh AI Info"}</span>
        </button>
      </div>

      {/* Main Split View: Mailbox Sidebar (5 cols) & Email Reader (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Email List & Toggle Filters */}
        <div className="lg:col-span-5 space-y-4">
          {/* Toggle Filter Bar */}
          <div className="bg-[#faf6eb] border border-[#ebdcc0] p-1.5 rounded-2xl flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setFilterMode("all")}
              className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                filterMode === "all"
                  ? "bg-white text-[#2c2419] shadow-xs font-bold border border-[#ebdcc0]"
                  : "text-[#7a6a54] hover:text-[#2c2419]"
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-[#ca981d]" />
              <span>All ({emails.length})</span>
            </button>

            <button
              onClick={() => setFilterMode("booked")}
              className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                filterMode === "booked"
                  ? "bg-[#282219] text-[#fbf7f0] shadow-xs font-bold"
                  : "text-[#7a6a54] hover:text-[#2c2419]"
              }`}
            >
              <Star className="w-3.5 h-3.5 text-[#f3db78] fill-[#f3db78]" />
              <span>Booked ({bookedEmailCount})</span>
            </button>

            <button
              onClick={() => setFilterMode("pending")}
              className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                filterMode === "pending"
                  ? "bg-[#d99b1c] text-white shadow-xs font-bold"
                  : "text-[#7a6a54] hover:text-[#2c2419]"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#fff7db]" />
              <span>Pending ({pendingResponseCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#a39278] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search vendor emails, questions, proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#ebdcc0] rounded-xl text-xs text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]/30"
            />
          </div>

          {/* Email Cards List */}
          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredEmails.length === 0 ? (
              <div className="p-8 border border-dashed border-[#ebdcc0] rounded-2xl text-center space-y-2 bg-white">
                <Mail className="w-8 h-8 text-[#c7b79e] mx-auto" />
                <p className="text-xs font-bold text-[#2c2419]">No emails match this filter</p>
                <p className="text-[11px] text-[#7a6a54]">Try switching to 'All' or clearing your search.</p>
              </div>
            ) : (
              filteredEmails.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                const isBooked = isVendorBooked(email.vendorName, email.isBookedVendor);
                const isPending = email.pendingResponse;

                return (
                  <div
                    key={email.id}
                    onClick={() => {
                      setSelectedEmailId(email.id);
                      onMarkRead(email.id);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                      isPending
                        ? isSelected
                          ? "bg-[#fffdf5] border-[#d99b1c] ring-2 ring-[#f3d378] shadow-md"
                          : "bg-[#fffbf0] border-[#e2a82b] ring-1 ring-[#f6d788]/70 hover:border-[#d99b1c]"
                        : isSelected
                        ? "bg-white border-[#ca981d] ring-2 ring-[#f3e3b3] shadow-xs"
                        : email.isRead
                        ? "bg-[#faf6eb] border-[#ebdcc0] opacity-90 hover:border-[#ca981d]/50"
                        : "bg-white border-[#ebdcc0] font-semibold hover:border-[#ca981d]/70"
                    }`}
                  >
                    {/* Top Row Badges & Vendor Name */}
                    <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-[#2c2419] text-xs truncate max-w-[170px]">
                          {email.vendorName}
                        </span>

                        {isBooked && (
                          <span className="bg-[#282219] text-[#f3db78] text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 shrink-0">
                            <Star className="w-2.5 h-2.5 fill-[#f3db78]" /> Booked Vendor
                          </span>
                        )}

                        {isPending && (
                          <span className="bg-[#d99b1c] text-white text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 shrink-0 animate-pulse">
                            ⚡️ Pending Response
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-[#8c7a63] shrink-0 font-normal">{email.date}</span>
                    </div>

                    {/* Subject */}
                    <h3
                      className={`text-xs font-semibold line-clamp-1 mb-1 ${
                        isPending ? "text-[#875b06] font-bold" : "text-[#2c2419]"
                      }`}
                    >
                      {email.subject}
                    </h3>

                    {/* Body Snippet */}
                    <p className="text-[11px] text-[#6e5d48] line-clamp-2 leading-relaxed">
                      {email.body}
                    </p>

                    {/* Bottom Info Bar */}
                    <div className="mt-2.5 pt-2 border-t border-[#f3e8d3] flex items-center justify-between text-[11px]">
                      {email.attachmentName ? (
                        <span className="text-[#ca981d] font-semibold flex items-center gap-1 bg-[#fbf3d5] px-2 py-0.5 rounded-md border border-[#f3e3b3]">
                          <Paperclip className="w-3 h-3 text-[#ca981d]" /> {email.attachmentName}
                        </span>
                      ) : (
                        <span className="text-[#a39278]">No attachment</span>
                      )}

                      {email.extractedQuote && (
                        <span className="text-[#5e470e] font-bold bg-[#fbf3d5] border border-[#f3e3b3] px-2 py-0.5 rounded-md">
                          ${email.extractedQuote.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Email Content Reader & Interactive Quick Reply */}
        <div className="lg:col-span-7 space-y-6">
          {selectedEmail ? (
            <div className="bg-white border border-[#ebdcc0] rounded-2xl p-6 shadow-2xs space-y-6">
              {/* Alert Callout Banner for Pending Response */}
              {selectedEmail.pendingResponse && (
                <div className="p-4 bg-gradient-to-r from-[#fef5db] to-[#fbf0cb] border border-[#e2a82b] rounded-2xl flex items-start gap-3 text-xs text-[#614207] shadow-2xs animate-in fade-in">
                  <AlertTriangle className="w-5 h-5 text-[#d99b1c] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-[#473003]">
                      ⚡️ Booked Vendor Action Required
                    </p>
                    <p className="leading-relaxed">
                      <strong>{selectedEmail.senderName}</strong> from <strong>{selectedEmail.vendorName}</strong> sent this question and is awaiting your input regarding ceremony layout or schedule.
                    </p>
                  </div>
                </div>
              )}

              {/* Email Top Header */}
              <div className="border-b border-[#f3e8d3] pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#ca981d]">
                      {selectedEmail.vendorName}
                    </span>
                    {isVendorBooked(selectedEmail.vendorName, selectedEmail.isBookedVendor) && (
                      <span className="bg-[#282219] text-[#f3db78] text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#f3db78]" /> Booked Vendor
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#8c7a63]">{selectedEmail.date}</span>
                </div>

                <h2 className="text-xl font-serif font-bold text-[#2c2419]">{selectedEmail.subject}</h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-[#6e5d48]">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#ca981d]" />
                    <span>
                      From: <strong className="text-[#2c2419]">{selectedEmail.senderName}</strong> (&lt;
                      {selectedEmail.senderEmail}&gt;)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#ca981d]" />
                    <span>
                      To: <strong className="text-[#ca981d]">{profile.gmailAddress}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Reply Box */}
              <div className="bg-[#faf6eb] border border-[#ebdcc0] p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#ca981d]" />
                    <span className="font-serif font-bold text-sm text-[#2c2419]">
                      Reply to {selectedEmail.senderName}
                    </span>
                  </div>
                  {selectedEmail.pendingResponse ? (
                    <span className="text-[11px] font-bold text-[#d99b1c] bg-[#fbf3d5] px-2 py-0.5 rounded-md border border-[#f3e3b3]">
                      Pending Your Answer
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-[#2d6a4f] bg-[#e8f5e9] px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#2d6a4f]" /> Responded
                    </span>
                  )}
                </div>

                <form onSubmit={handleSendReplySubmit} className="space-y-3">
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Type your reply to ${selectedEmail.senderName} (e.g. "We prefer the North Vineyard Slope facing arch!")...`}
                    className="w-full p-3 bg-white border border-[#ebdcc0] rounded-xl text-xs text-[#2c2419] focus:outline-none focus:ring-2 focus:ring-[#ca981d]/40 font-sans leading-relaxed"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#7a6a54]">
                      Sent directly from <strong className="text-[#ca981d]">{profile.gmailAddress}</strong>
                    </span>
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="px-4 py-2 bg-[#ca981d] hover:bg-[#b08314] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5 text-[#fbf0cb]" />
                      <span>Send Reply</span>
                    </button>
                  </div>
                </form>

                {replySuccessMsg && (
                  <div className="p-2.5 bg-[#e8f5e9] text-[#1b4332] font-semibold text-xs text-center rounded-xl border border-[#c8e6c9] animate-in fade-in">
                    {replySuccessMsg}
                  </div>
                )}
              </div>

              {/* AI Quote Extraction Card */}
              <div className="bg-gradient-to-br from-[#fffdfa] via-[#fdfaf2] to-[#faf6eb] border border-[#f3e3b3] p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#ca981d]" />
                    <span className="font-serif font-bold text-sm text-[#2c2419]">
                      Gemini Contract & Quote Extractor
                    </span>
                  </div>

                  <button
                    onClick={handleExtractQuoteWithAI}
                    disabled={isExtractingQuote}
                    className="px-3 py-1.5 bg-[#ca981d] hover:bg-[#b08314] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isExtractingQuote ? "animate-spin text-[#fbf0cb]" : ""}`} />
                    <span>{isExtractingQuote ? "Extracting..." : "Re-Run AI Extraction"}</span>
                  </button>
                </div>

                {selectedEmail.extractedQuote ? (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-[#ebdcc0]">
                      <div>
                        <span className="text-[10px] text-[#8c7a63] uppercase font-semibold block">
                          Suggested Spent Amount
                        </span>
                        <span className="text-2xl font-serif font-bold text-[#b58212]">
                          ${selectedEmail.extractedQuote.price.toLocaleString()}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#8c7a63] uppercase font-semibold block">
                          Found in Document
                        </span>
                        <span className="font-semibold text-[#2c2419] flex items-center gap-1 mt-1">
                          <FileText className="w-3.5 h-3.5 text-[#ca981d]" />
                          {selectedEmail.extractedQuote.sourceDoc}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#ebdcc0] space-y-1">
                      <span className="text-[10px] text-[#8c7a63] uppercase font-semibold block">
                        Included Services
                      </span>
                      <p className="text-[#2c2419] font-medium">{selectedEmail.extractedQuote.services}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={handleApplyToVendorBudget}
                        className="w-full py-2.5 bg-[#ca981d] hover:bg-[#b08314] text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4 text-[#fbf0cb]" />
                        <span>Confirm & Add ${selectedEmail.extractedQuote.price.toLocaleString()} to {selectedEmail.vendorName} Budget</span>
                      </button>
                    </div>

                    {appliedSuccessMsg && (
                      <div className="p-2.5 bg-[#fbf3d5] text-[#5e470e] font-semibold text-center rounded-xl border border-[#f3e3b3]">
                        {appliedSuccessMsg}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[#6e5d48]">
                    No quote extracted yet. Click "Re-Run AI Extraction" to let Gemini parse contracts in this email!
                  </p>
                )}
              </div>

              {/* Email Body Content */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8c7a63]">Message Body</h3>
                <div className="p-4 bg-[#faf6eb] border border-[#ebdcc0] rounded-2xl text-xs text-[#2c2419] whitespace-pre-wrap leading-relaxed font-sans">
                  {selectedEmail.body}
                </div>
              </div>

              {/* Attachment Pill */}
              {selectedEmail.attachmentName && (
                <div className="p-3 bg-[#fbf3d5] border border-[#f3e3b3] rounded-xl flex items-center justify-between text-xs text-[#5e470e]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#ca981d]" />
                    <span className="font-semibold">{selectedEmail.attachmentName}</span>
                  </div>
                  <span className="text-[11px] font-medium text-[#7a5a0f]">PDF Document • Extracted</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 border border-dashed border-[#ebdcc0] rounded-2xl text-center space-y-3 bg-white">
              <Mail className="w-10 h-10 text-[#c7b79e] mx-auto" />
              <p className="font-serif font-bold text-base text-[#2c2419]">Select an email</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
