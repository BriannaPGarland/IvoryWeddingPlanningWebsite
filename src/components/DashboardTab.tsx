import React from "react";
import { WeddingProfile, Vendor, TodoItem, EmailMessage } from "../types";
import {
  Calendar,
  DollarSign,
  CheckCircle2,
  ListTodo,
  Sparkles,
  ArrowRight,
  Mail,
  Users,
  Palette,
  AlertCircle,
  FileText,
  Clock,
  Plus,
  Star,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";

interface Props {
  profile: WeddingProfile;
  vendors: Vendor[];
  todos: TodoItem[];
  emails: EmailMessage[];
  onToggleTodo: (id: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenExtension: () => void;
  onOpenVendorProfile?: (vendorOrName: Vendor | string) => void;
  onInspectQuote?: (vendorName: string) => void;
}

export const DashboardTab: React.FC<Props> = ({
  profile,
  vendors,
  todos,
  emails,
  onToggleTodo,
  onNavigateTab,
  onOpenExtension,
  onOpenVendorProfile,
  onInspectQuote,
}) => {
  // Budget metrics
  const totalSpent = vendors.reduce((acc, v) => acc + (v.confirmedAmount || v.suggestedAmount || 0), 0);
  const budgetPercentage = Math.min(100, Math.round((totalSpent / (profile?.budget || 1)) * 100));

  // Progress metrics
  const totalVendorsNeeded = 10;
  const bookedVendorsCount = vendors.filter(v => v.status === "booked" || v.status === "contract_signed" || v.status === "paid").length;
  const overallProgress = Math.round((bookedVendorsCount / totalVendorsNeeded) * 100);

  // Todo metrics
  const pendingTodos = todos.filter(t => !t.completed);

  // Countdown
  const getDaysRemaining = () => {
    if (!profile?.weddingDate) return 0;
    const wedding = new Date(profile.weddingDate).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((wedding - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const daysRemaining = getDaysRemaining();

  // Booked Vendor Email Notifications logic
  const isVendorBooked = (vendorName: string, explicitBookedFlag?: boolean) => {
    if (explicitBookedFlag) return true;
    if (!vendorName) return false;
    const match = vendors.find((v) => (v?.name || "").toLowerCase().includes(vendorName.toLowerCase()));
    return match ? match.status === "booked" || match.status === "contract_signed" || match.status === "paid" : false;
  };

  const bookedVendorPendingEmails = emails.filter(
    (e) => isVendorBooked(e.vendorName, e.isBookedVendor) && e.pendingResponse
  );
  const allBookedVendorEmails = emails.filter((e) => isVendorBooked(e.vendorName, e.isBookedVendor));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Comforting Hero Banner */}
      <div className="bg-gradient-to-br from-[#fbf4e2] via-[#fffdfa] to-[#f5ead2] border border-[#ebdcc0] rounded-3xl p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#f3db78]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-20 -top-10 w-48 h-48 bg-[#ca981d]/15 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6e4a6] text-[#4a3910] text-xs font-semibold border border-[#e8d28a]">
              <Sparkles className="w-3.5 h-3.5 text-[#ca981d]" />
              <span>AI Wedding Assistant Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2c2419]">
              Welcome back, {profile.partner1.split(" ")[0]}! ✨
            </h1>
            <p className="text-sm md:text-base text-[#615341] leading-relaxed">
              Your wedding vision is stored and synchronized. Your custom AI Chrome Extension is ready to auto-fill vendor forms and extract email contracts.
            </p>
          </div>

          {/* Countdown Clock Display */}
          <div className="bg-white/90 backdrop-blur-xs border border-[#ebdcc0] p-5 rounded-2xl shadow-2xs flex items-center gap-5 min-w-[280px]">
            <div className="w-14 h-14 rounded-2xl bg-[#ca981d] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-2xs">
              {daysRemaining}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#937d5c] font-semibold">
                Days Until Wedding
              </div>
              <div className="text-sm font-semibold text-[#2c2419] mt-0.5">
                {profile?.weddingDate ? new Date(profile.weddingDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }) : "Date Pending"}
              </div>
              <div className="text-xs text-[#8c785c] mt-0.5 flex items-center gap-1">
                <span>📍 {profile?.location || "Location Pending"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Planning Progress */}
        <div className="bg-white border border-[#ebdcc0] p-5 rounded-2xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#857258]">
            <span>Planning Progress</span>
            <CheckCircle2 className="w-4 h-4 text-[#ca981d]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-bold text-[#2c2419]">{overallProgress}%</span>
            <span className="text-xs text-[#6e5d48] font-medium">{bookedVendorsCount} of {totalVendorsNeeded} Vendors Secured</span>
          </div>
          <div className="w-full h-2.5 bg-[#f6efe0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ca981d] rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Budget Tracker */}
        <div className="bg-white border border-[#ebdcc0] p-5 rounded-2xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#857258]">
            <span>Vendor Budget Spent</span>
            <DollarSign className="w-4 h-4 text-[#d9a123]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-bold text-[#2c2419]">${totalSpent.toLocaleString()}</span>
            <span className="text-xs text-[#6e5d48] font-medium">Target: ${profile.budget.toLocaleString()}</span>
          </div>
          <div className="w-full h-2.5 bg-[#f6efe0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#e5b331] rounded-full transition-all duration-500"
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Dedicated Email Inbox */}
        <div className="bg-white border border-[#ebdcc0] p-5 rounded-2xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#857258]">
            <span>Dedicated App Email</span>
            <Mail className="w-4 h-4 text-[#ca981d]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#2c2419] truncate">{profile.gmailAddress}</div>
            <div className="text-xs text-[#73634e] mt-1">
              AI automatically extracts quotes & contracts sent to this inbox.
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("inbox")}
            className="text-xs text-[#ca981d] font-bold hover:underline flex items-center gap-1 pt-1"
          >
            <span>Open Vendor Inbox ({emails.filter(e => !e.isRead).length} unread)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Two-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: To-dos & Recent AI Contract Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priority Booked Vendor Communication Notifications */}
          <div className="bg-gradient-to-br from-[#fffdf5] via-[#fffbf0] to-[#fef6dc] border-2 border-[#e2a82b] rounded-2xl p-6 shadow-xs space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#f3d378] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#d99b1c] text-white flex items-center justify-center shadow-2xs">
                  <Star className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h2 className="text-base font-serif font-bold text-[#2c2419] flex items-center gap-2">
                    <span>Booked Vendor Notifications</span>
                    {bookedVendorPendingEmails.length > 0 && (
                      <span className="bg-[#d99b1c] text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                        {bookedVendorPendingEmails.length} Pending
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-[#735414]">
                    Prioritized messages and questions from your signed/booked vendors
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab("inbox")}
                className="px-3 py-1.5 bg-[#282219] hover:bg-[#3d3427] text-[#f3db78] text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shrink-0"
              >
                <span>Filter Booked Inbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {bookedVendorPendingEmails.length > 0 ? (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-[#825c0e] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#d99b1c]" />
                  <span>The following booked vendors sent questions pending your response:</span>
                </div>

                {bookedVendorPendingEmails.map((email) => (
                  <div
                    key={email.id}
                    className="p-4 bg-white border border-[#e2a82b] rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#b8800b] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#2c2419]">{email.vendorName}</span>
                        <span className="bg-[#282219] text-[#f3db78] text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-[#f3db78]" /> Booked
                        </span>
                        <span className="text-[11px] text-[#8c7a63]">{email.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#a06d07] line-clamp-1">{email.subject}</h4>
                      <p className="text-[11px] text-[#6e5d48] line-clamp-1">{email.body}</p>
                    </div>

                    <button
                      onClick={() => onNavigateTab("inbox")}
                      className="px-3.5 py-2 bg-[#d99b1c] hover:bg-[#b8800b] text-white font-bold text-xs rounded-xl shadow-2xs transition-colors shrink-0 flex items-center justify-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Reply in Inbox</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : allBookedVendorEmails.length > 0 ? (
              <div className="p-4 bg-white/80 border border-[#f3d378] rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-[#543f0f]">
                  <CheckCircle2 className="w-4 h-4 text-[#2d6a4f]" />
                  <span>All communications with your <strong>{allBookedVendorEmails.length} booked vendor(s)</strong> are up to date!</span>
                </div>
                <button
                  onClick={() => onNavigateTab("inbox")}
                  className="text-xs text-[#ca981d] font-bold hover:underline"
                >
                  View Booked History
                </button>
              </div>
            ) : (
              <div className="p-4 bg-white/80 border border-[#f3d378] rounded-xl text-center text-xs text-[#735414]">
                No booked vendor communications yet. Once you sign contracts, their emails will prioritize here!
              </div>
            )}
          </div>

          {/* Recent AI Contract Alerts */}
          <div className="bg-white border border-[#ebdcc0] rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ca981d]" />
                <h2 className="text-lg font-serif font-bold text-[#2c2419]">
                  Recent AI Contract & Quote Intelligence
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab("inbox")}
                className="text-xs text-[#ca981d] font-semibold hover:underline"
              >
                View All Inbox Emails
              </button>
            </div>

            <div className="space-y-3">
              {emails.slice(0, 3).map((email) => {
                const matchVendor = vendors.find(v => (v?.name || "").toLowerCase().includes((email?.vendorName || "").toLowerCase()));
                return (
                  <div
                    key={email.id}
                    className="p-4 rounded-xl border border-[#ebdcc0] bg-[#fffdfa] hover:bg-[#faf4e6] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenVendorProfile) {
                              onOpenVendorProfile(matchVendor || email.vendorName);
                            }
                          }}
                          className="font-bold text-sm text-[#2c2419] hover:text-[#ca981d] text-left hover:underline flex items-center gap-1 transition-colors"
                          title="Click to view full vendor profile & AI contract"
                        >
                          <span>{email.vendorName}</span>
                          <Sparkles className="w-3 h-3 text-[#ca981d]" />
                        </button>

                        {email.attachmentName && (
                          <span className="text-[10px] bg-[#fbf3d5] text-[#523d0c] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 border border-[#e8d28a]">
                            <FileText className="w-3 h-3 text-[#ca981d]" /> {email.attachmentName}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6e5f4c] line-clamp-1">{email.subject}</p>
                      {email.extractedQuote && (
                        <div className="text-xs text-[#2c2419] font-medium pt-1 flex items-center gap-2">
                          <span className="text-[#42330a] bg-[#f8ecbf] px-2 py-0.5 rounded-sm font-bold">
                            Suggested Spent: ${email.extractedQuote.price.toLocaleString()}
                          </span>
                          <span className="text-[#80705a] text-[11px]">
                            Found in: {email.extractedQuote.sourceDoc}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenVendorProfile) {
                            onOpenVendorProfile(matchVendor || email.vendorName);
                          }
                        }}
                        className="px-2.5 py-1.5 bg-[#f6efe0] hover:bg-[#ebdcc0] text-[#2c2419] text-xs font-semibold rounded-lg transition-colors"
                        title="View Full Vendor Profile"
                      >
                        View Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (onInspectQuote) {
                            onInspectQuote(email.vendorName);
                          } else {
                            onNavigateTab("vendors");
                          }
                        }}
                        className="px-3.5 py-1.5 bg-[#ca981d] hover:bg-[#b08314] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors whitespace-nowrap"
                      >
                        Inspect Quote
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Planning To-Dos */}
          <div className="bg-white border border-[#ebdcc0] rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-[#ca981d]" />
                <h2 className="text-lg font-serif font-bold text-[#2c2419]">To-Dos Left ({pendingTodos.length})</h2>
              </div>
              <button
                onClick={() => onNavigateTab("vendors")}
                className="text-xs text-[#ca981d] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Add Vendor Task</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  onClick={() => onToggleTodo(todo.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    todo.completed
                      ? "bg-[#faf6eb] border-[#ebdcc0] opacity-60"
                      : "bg-white border-[#ebdcc0] hover:border-[#ca981d]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => {}}
                      className="w-4 h-4 accent-[#ca981d] rounded-sm cursor-pointer"
                    />
                    <span
                      className={`text-sm font-medium ${
                        todo.completed ? "line-through text-[#9e8f7a]" : "text-[#2c2419]"
                      }`}
                    >
                      {todo.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] bg-[#f8f1df] text-[#5e4f3a] px-2 py-0.5 rounded-md font-medium">
                      {todo.category}
                    </span>
                    <span className="text-[11px] text-[#91816b] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Due {todo.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Vision Snapshot & Extension Helper CTA */}
        <div className="space-y-6">
          {/* Chrome Extension Promo Card */}
          <div className="bg-gradient-to-br from-[#282219] to-[#1e1912] text-white p-6 rounded-2xl shadow-sm space-y-4 border border-[#423728]">
            <div className="w-10 h-10 rounded-xl bg-[#f6e4a6]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#f6e4a6]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-[#fbf7f0]">
                Chrome Extension Vision Auto-Fill
              </h3>
              <p className="text-xs text-[#dcd1be] leading-relaxed">
                When you visit any vendor's website (Google Forms, custom forms, Squarespace), our Chrome Extension pops up and fills out all inquiries using your AI wedding vision.
              </p>
            </div>
            <button
              onClick={onOpenExtension}
              className="w-full bg-[#ca981d] hover:bg-[#b08314] text-white py-2.5 rounded-xl font-semibold text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5"
            >
              <span>Test Extension Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Wedding Vision Snapshot Card */}
          <div className="bg-white border border-[#ebdcc0] rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#2c2419]">My Vision Profile</h3>
              <button
                onClick={() => onNavigateTab("vision")}
                className="text-xs text-[#ca981d] font-semibold hover:underline"
              >
                Edit Vision
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#8c7a63] font-semibold uppercase tracking-wider block text-[10px] mb-1">
                  Aesthetic & Vibe
                </span>
                <p className="text-[#2c2419] font-medium leading-relaxed italic bg-[#faf6eb] p-2.5 rounded-xl border border-[#ebdcc0]">
                  "{profile.vibe}"
                </p>
              </div>

              <div>
                <span className="text-[#8c7a63] font-semibold uppercase tracking-wider block text-[10px] mb-1">
                  Color Palette
                </span>
                <div className="flex items-center gap-2">
                  {profile.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[#8c7a63] font-semibold uppercase tracking-wider block text-[10px] mb-1">
                  Floral Requests
                </span>
                <p className="text-[#2c2419] font-medium leading-relaxed">
                  {profile.florals}
                </p>
              </div>

              {profile.pinterestBoardUrl && (
                <div className="pt-2 border-t border-[#f3e8d3] flex items-center justify-between text-[#ca981d]">
                  <span className="font-medium">Pinterest Synced ({profile.syncedPinsCount} Pins)</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#e5b331]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
