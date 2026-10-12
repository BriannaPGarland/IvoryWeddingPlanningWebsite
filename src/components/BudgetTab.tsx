import React, { useState } from "react";
import { BudgetItem, VendorCategory, WeddingProfile } from "../types";
import {
  DollarSign,
  PieChart as PieChartIcon,
  Plus,
  CheckCircle2,
  Clock,
  Edit2,
  Sparkles,
  ShieldCheck,
  X,
  Save,
  Building2,
  TrendingUp,
} from "lucide-react";

interface Props {
  profile: WeddingProfile;
  budgetItems: BudgetItem[];
  onAddBudgetItem: (item: BudgetItem) => void;
  onUpdateBudgetItem: (id: string, updated: Partial<BudgetItem>) => void;
  onOpenVendorProfile?: (vendorName: string) => void;
  brandPrimaryColor?: string;
  brandAccentColor?: string;
}

export const CATEGORY_COLORS: Record<string, string> = {
  Venue: "#d9a123", // Deep Butter Gold
  Florist: "#e5b331", // Bright Butter Yellow
  Photographer: "#f3c246", // Warm Lemon Honey
  "DJ & Music": "#d28e1d", // Honey Amber
  "Bakery & Cake": "#c28e1d", // Rich Amber
  "Hair & Makeup": "#ecd889", // Pale Cream Yellow
  Catering: "#e2aa27", // Golden Amber
  Planner: "#b58212", // Warm Bronze Gold
  Custom: "#d2be8c",
  Other: "#d2be8c",
};

export const BudgetTab: React.FC<Props> = ({
  profile,
  budgetItems,
  onAddBudgetItem,
  onUpdateBudgetItem,
  onOpenVendorProfile,
  brandPrimaryColor = "#ca981d",
  brandAccentColor = "#f6e4a6",
}) => {
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);

  // New Budget Item Form State
  const [category, setCategory] = useState<VendorCategory>("Florist");
  const [vendorName, setVendorName] = useState("");
  const [estimatedCost, setEstimatedCost] = useState<number>(1000);
  const [quotedCost, setQuotedCost] = useState<number>(1000);
  const [actualSpent, setActualSpent] = useState<number>(0);
  const [status, setStatus] = useState<BudgetItem["status"]>("Estimated");
  const [notes, setNotes] = useState("");

  const totalBudget = profile.budget || 45000;

  // Booked vendors spent amount (Booked / Paid vendors count towards actual spent)
  const totalActualSpent = budgetItems.reduce((acc, item) => acc + (item.actualSpent || 0), 0);

  // Total Allocated Budget (Sum of estimated/allocated target costs across all vendors)
  const totalAllocatedBudget = budgetItems.reduce((acc, item) => acc + (item.estimatedCost || 0), 0);

  // Total Quoted Cost
  const totalQuotedCost = budgetItems.reduce((acc, item) => acc + (item.quotedCost || 0), 0);

  const remainingBudget = totalBudget - totalActualSpent;
  const percentSpent = Math.min(100, Math.round((totalActualSpent / totalBudget) * 100));

  // Category Aggregation
  const categoryTotals: Record<
    string,
    { spent: number; quoted: number; allocated: number; count: number }
  > = {};

  budgetItems.forEach((item) => {
    const cat = item.category || "Other";
    if (!categoryTotals[cat]) {
      categoryTotals[cat] = { spent: 0, quoted: 0, allocated: 0, count: 0 };
    }
    categoryTotals[cat].spent += item.actualSpent || 0;
    categoryTotals[cat].quoted += item.quotedCost || 0;
    categoryTotals[cat].allocated += item.estimatedCost || 0;
    categoryTotals[cat].count += 1;
  });

  const handleCreateBudgetItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName.trim()) return;

    const newItem: BudgetItem = {
      id: "b_" + Date.now(),
      category,
      vendorName: vendorName.trim(),
      estimatedCost: Number(estimatedCost),
      quotedCost: Number(quotedCost),
      actualSpent: status === "Booked" || status === "Paid" ? Number(actualSpent || quotedCost) : Number(actualSpent || 0),
      status,
      notes: notes.trim() || undefined,
    };

    onAddBudgetItem(newItem);
    setIsAddModalOpen(false);
    setVendorName("");
    setNotes("");
  };

  const handleSaveEditItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    onUpdateBudgetItem(editingItem.id, {
      estimatedCost: Number(editingItem.estimatedCost),
      quotedCost: Number(editingItem.quotedCost),
      actualSpent: Number(editingItem.actualSpent),
      status: editingItem.status,
      vendorName: editingItem.vendorName,
      category: editingItem.category,
      notes: editingItem.notes,
    });

    setEditingItem(null);
  };

  const filteredItems = budgetItems.filter((item) => {
    if (filterCategory === "All") return true;
    return item.category === filterCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ebdcc0] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-[#ca981d]" />
            <h1 className="text-2xl font-serif font-bold text-[#2c2419]">
              Wedding Budget & Expense Ledger
            </h1>
          </div>
          <p className="text-sm text-[#6e5d48] mt-1">
            Manage your ${totalBudget.toLocaleString()} target budget by configuring allocated targets, tracking quoted vendor prices, and updating booked spent amounts.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-[#ca981d] hover:bg-[#b08314] text-white rounded-xl text-xs font-bold shadow-xs transition-opacity flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-[#fbf0cb]" />
          <span>Add Expense Item</span>
        </button>
      </div>

      {/* TOP METRIC CARDS - Removed "Total Quoted Cost (Prospective)" Header Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Total Target Budget */}
        <div className="bg-white border border-[#ebdcc0] p-5 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#8c7a63] uppercase tracking-wider block">
            Total Target Budget Cap
          </span>
          <div className="text-2xl font-serif font-bold text-[#2c2419]">
            ${totalBudget.toLocaleString()}
          </div>
          <p className="text-xs text-[#6e5d48]">Set in Couple Settings</p>
        </div>

        {/* Card 2: Total Booked Contract Spent */}
        <div className="bg-white border border-[#ebdcc0] p-5 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#8c7a63] uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ca981d]" /> Booked Contract Spent
          </span>
          <div className="text-2xl font-serif font-bold text-[#b58212]">
            ${totalActualSpent.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-[#f6efe0] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#ca981d] h-full rounded-full transition-all duration-500"
                style={{ width: `${percentSpent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-[#ca981d]">{percentSpent}%</span>
          </div>
        </div>

        {/* Card 3: Total Allocated Target Budget */}
        <div className="bg-white border border-[#ebdcc0] p-5 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#8c7a63] uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#ca981d]" /> Allocated Budget Total
          </span>
          <div className="text-2xl font-serif font-bold text-[#2c2419]">
            ${totalAllocatedBudget.toLocaleString()}
          </div>
          <p className="text-xs text-[#6e5d48]">
            Sum of target limits configured across all categories
          </p>
        </div>
      </div>

      {/* CATEGORY ALLOCATION BREAKDOWN WITH EXPLICIT GREEN VS YELLOW COLOR LEGEND */}
      <div className="bg-white border border-[#ebdcc0] p-6 rounded-3xl shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f3e8d3] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-[#ca981d]" />
              <h2 className="font-serif font-bold text-lg text-[#2c2419]">
                Category Allocation Breakdown
              </h2>
            </div>
            <p className="text-xs text-[#6e5d48] mt-0.5">
              Compare your allocated budget targets against received vendor quotes and booked spent totals.
            </p>
          </div>

          <span className="text-xs font-bold text-[#2c2419] bg-[#faf6eb] px-3 py-1 rounded-full border border-[#ebdcc0]">
            {Object.keys(categoryTotals).length} Active Categories
          </span>
        </div>

        {/* EXPLICIT COLOR LEGEND BADGES */}
        <div className="p-3.5 bg-[#faf6eb] border border-[#ebdcc0] rounded-2xl flex flex-wrap items-center gap-4 text-xs">
          <span className="font-bold text-[#2c2419] uppercase tracking-wider">
            Color Legend:
          </span>
          <div className="flex items-center gap-2 font-semibold text-[#065f46]">
            <span className="w-3.5 h-3.5 rounded-md bg-[#059669] shrink-0" />
            <span>Green Bar = Booked Contract Spent</span>
          </div>
          <div className="flex items-center gap-2 font-semibold text-[#9a3412]">
            <span className="w-3.5 h-3.5 rounded-md bg-[#f59e0b] shrink-0" />
            <span>Yellow/Amber Bar = Quoted Vendor Price</span>
          </div>
          <div className="flex items-center gap-2 font-semibold text-[#6e5d48]">
            <span className="w-3.5 h-3.5 rounded-md bg-[#e5e7eb] border border-[#d1d5db] shrink-0" />
            <span>Gray/Light Bar = Total Allocated Budget Target</span>
          </div>
        </div>

        {/* CATEGORY CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categoryTotals).map(([catName, totals]) => {
            const catColor = CATEGORY_COLORS[catName] || "#ca981d";
            const spentPercent = Math.min(
              100,
              Math.round((totals.spent / (totals.allocated || 1)) * 100)
            );
            const quotedPercent = Math.min(
              100,
              Math.round((totals.quoted / (totals.allocated || 1)) * 100)
            );

            return (
              <div
                key={catName}
                className="p-4 rounded-2xl border border-[#ebdcc0] bg-[#fffdfa] space-y-3 shadow-2xs hover:border-[#ca981d] transition-colors"
              >
                <div className="flex items-center justify-between border-b border-[#f3e8d3] pb-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#2c2419]">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: catColor }}
                    />
                    <span>{catName}</span>
                  </div>
                  <span className="text-xs font-bold text-[#ca981d] bg-[#fbf3d5] px-2.5 py-0.5 rounded-lg border border-[#f3e3b3]">
                    Target: ${totals.allocated.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[#065f46] font-semibold">
                    <span>🟢 Booked Spent:</span>
                    <span className="font-bold">${totals.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#9a3412] font-semibold">
                    <span>🟡 Quoted Price:</span>
                    <span className="font-bold">${totals.quoted.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#6e5d48] font-semibold">
                    <span>⚪ Allocated Target:</span>
                    <span className="font-bold">${totals.allocated.toLocaleString()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-[#f3f4f6] border border-[#e5e7eb] h-3 rounded-full overflow-hidden flex relative">
                    {/* Green portion for booked spent */}
                    <div
                      className="h-full bg-[#059669] transition-all duration-300"
                      style={{ width: `${spentPercent}%` }}
                      title={`Booked Spent: $${totals.spent}`}
                    />
                    {/* Yellow portion for quoted */}
                    <div
                      className="h-full bg-[#f59e0b] opacity-80 transition-all duration-300"
                      style={{
                        width: `${Math.max(0, quotedPercent - spentPercent)}%`,
                      }}
                      title={`Quoted Price: $${totals.quoted}`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#8c7a63] font-medium">
                    <span>{spentPercent}% Booked Spent</span>
                    <span>{quotedPercent}% Quoted</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED VENDOR EXPENSE LEDGER (WITH EDIT BOX FOR ALLOCATED BUDGET & SPENT) */}
      <div className="bg-white border border-[#ebdcc0] rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f3e8d3] pb-4">
          <div>
            <h2 className="font-serif font-bold text-lg text-[#2c2419]">
              Detailed Vendor Expense Ledger
            </h2>
            <p className="text-xs text-[#6e5d48]">
              Click the edit button on any line to adjust the vendor's allocated budget and booked actual spent.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            <button
              onClick={() => setFilterCategory("All")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                filterCategory === "All"
                  ? "bg-[#ca981d] text-white font-bold"
                  : "bg-[#faf6eb] text-[#6e5d48] border border-[#ebdcc0] hover:border-[#ca981d]"
              }`}
            >
              All ({budgetItems.length})
            </button>
            {Object.keys(categoryTotals).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                  filterCategory === cat
                    ? "bg-[#ca981d] text-white font-bold"
                    : "bg-[#fffdfa] text-[#6e5d48] border border-[#ebdcc0]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#f3e8d3] text-[#8c7a63] uppercase tracking-wider font-bold">
                <th className="py-3 px-3">Vendor / Service</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Allocated Target ($)</th>
                <th className="py-3 px-3 text-right">Quoted Cost ($)</th>
                <th className="py-3 px-3 text-right">Booked Spent ($)</th>
                <th className="py-3 px-3 text-center">Edit / Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3e8d3]">
              {filteredItems.map((item) => {
                const isBooked = item.status === "Booked" || item.status === "Paid";
                const isQuoted = item.status === "Quoted";

                return (
                  <tr key={item.id} className="hover:bg-[#faf6eb]/60 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-[#2c2419]">
                      <div className="flex items-center gap-2">
                        <span>{item.vendorName}</span>
                        {onOpenVendorProfile && (
                          <button
                            onClick={() => onOpenVendorProfile(item.vendorName)}
                            className="text-[10px] text-[#ca981d] hover:underline font-bold"
                          >
                            Profile
                          </button>
                        )}
                      </div>
                      {item.notes && (
                        <p className="text-[11px] font-normal text-[#6e5d48] mt-0.5">
                          {item.notes}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 bg-[#faf6eb] text-[#2c2419] border border-[#ebdcc0] rounded-lg font-semibold text-[11px]">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      {isBooked ? (
                        <span className="px-2.5 py-1 bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] rounded-full font-bold text-[10px] flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3 text-[#059669]" /> Booked
                        </span>
                      ) : isQuoted ? (
                        <span className="px-2.5 py-1 bg-[#fff8e3] text-[#7a5a0f] border border-[#e8d28a] rounded-full font-bold text-[10px] flex items-center gap-1 w-max">
                          <Clock className="w-3 h-3 text-[#ca981d]" /> Quote Received
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-[#faf6eb] text-[#6e5d48] border border-[#ebdcc0] rounded-full font-bold text-[10px] w-max">
                          Estimated Target
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right font-bold text-[#2c2419]">
                      ${item.estimatedCost.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-right font-semibold text-[#9a3412]">
                      ${item.quotedCost ? item.quotedCost.toLocaleString() : "-"}
                    </td>

                    <td className="py-3.5 px-3 text-right font-bold text-[#065f46]">
                      ${item.actualSpent ? item.actualSpent.toLocaleString() : "$0"}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="px-2.5 py-1.5 bg-[#fbf3d5] text-[#5e470e] hover:bg-[#f3db78] border border-[#f3e3b3] rounded-lg font-bold text-xs flex items-center gap-1 transition-colors"
                          title="Edit Allocated Budget & Booked Spent"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#ca981d]" />
                          <span>Edit Budget Box</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT BUDGET ITEM BOX / MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-[#ebdcc0] rounded-3xl shadow-2xl max-w-md w-full p-6 text-[#2c2419] space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#f3e8d3]">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#ca981d]" />
                <h2 className="text-lg font-serif font-bold text-[#2c2419]">
                  Edit Budget Box for {editingItem.vendorName}
                </h2>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1.5 text-[#8c7a63] hover:text-[#2c2419] rounded-xl hover:bg-[#faf6eb]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditItem} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                  Vendor Name
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.vendorName}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, vendorName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                  Allocated Budget Target ($)
                </label>
                <input
                  type="number"
                  required
                  value={editingItem.estimatedCost}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, estimatedCost: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl text-sm font-bold text-[#ca981d]"
                />
                <p className="text-[10px] text-[#8c7a63] mt-1">
                  Set the target amount allocated for this vendor.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                    Quoted Price ($)
                  </label>
                  <input
                    type="number"
                    value={editingItem.quotedCost}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, quotedCost: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl font-bold text-[#9a3412]"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                    Booked Spent ($)
                  </label>
                  <input
                    type="number"
                    value={editingItem.actualSpent}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, actualSpent: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl font-bold text-[#065f46]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                  Status
                </label>
                <select
                  value={editingItem.status}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      status: e.target.value as BudgetItem["status"],
                    })
                  }
                  className="w-full px-3 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl font-semibold text-xs"
                >
                  <option value="Estimated">Estimated Target</option>
                  <option value="Quoted">Quoted Received</option>
                  <option value="Booked">Booked & Contract Signed</option>
                  <option value="Paid">Paid in Full</option>
                </select>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={editingItem.notes || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, notes: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-2.5 bg-[#faf6eb] hover:bg-[#ebdcc0] text-[#2c2419] font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#ca981d] hover:bg-[#b08314] text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-[#fbf0cb]" />
                  <span>Save Edits</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD EXPENSE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-[#ebdcc0] rounded-3xl shadow-2xl max-w-md w-full p-6 text-[#2c2419] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#f3e8d3]">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#ca981d]" />
                <h2 className="text-lg font-serif font-bold text-[#2c2419]">Add Budget Expense Item</h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-[#8c7a63] hover:text-[#2c2419] rounded-xl hover:bg-[#faf6eb]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBudgetItem} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                  Vendor / Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blossom & Vine Florist"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl font-semibold text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as VendorCategory)}
                  className="w-full px-3 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl font-semibold focus:outline-none"
                >
                  <option value="Venue">Venue</option>
                  <option value="Florist">Florist</option>
                  <option value="Photographer">Photographer</option>
                  <option value="DJ & Music">DJ & Music</option>
                  <option value="Catering">Catering</option>
                  <option value="Bakery & Cake">Bakery & Cake</option>
                  <option value="Hair & Makeup">Hair & Makeup</option>
                  <option value="Planner">Planner</option>
                  <option value="Decor & Rentals">Decor & Rentals</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                  Allocated Target Budget ($)
                </label>
                <input
                  type="number"
                  required
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl font-bold text-[#ca981d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                    Quoted Cost ($)
                  </label>
                  <input
                    type="number"
                    value={quotedCost}
                    onChange={(e) => setQuotedCost(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                    Booked Spent ($)
                  </label>
                  <input
                    type="number"
                    value={actualSpent}
                    onChange={(e) => setActualSpent(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BudgetItem["status"])}
                  className="w-full px-3 py-2.5 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl font-semibold"
                >
                  <option value="Estimated">Estimated Target</option>
                  <option value="Quoted">Quoted (Prospective)</option>
                  <option value="Booked">Booked (Contract Signed)</option>
                  <option value="Paid">Paid in Full</option>
                </select>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#2c2419] block mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Payment schedule, contract notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#fffdfa] border border-[#ebdcc0] rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-[#faf6eb] hover:bg-[#ebdcc0] text-[#2c2419] font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#ca981d] hover:bg-[#b08314] text-white rounded-xl font-bold shadow-xs"
                >
                  Save Budget Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
