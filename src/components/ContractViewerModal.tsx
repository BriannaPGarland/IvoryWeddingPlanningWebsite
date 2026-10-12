import React from "react";
import { X, FileText, Download, CheckCircle2, ShieldCheck, Mail, Printer, ExternalLink, Sparkles } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  vendorName?: string;
  amount?: number;
  date?: string;
  emailSubject?: string;
}

export const ContractViewerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  documentName,
  vendorName = "Oakridge Venue & Estate",
  amount = 14500,
  date = "August 18, 2026",
  emailSubject = "Fully Executed Venue Agreement & Deposit Receipt",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs p-4 sm:p-6 flex justify-center items-start pt-8 pb-12 animate-in fade-in duration-200">
      <div className="bg-[#525659] border border-stone-600 rounded-2xl shadow-2xl max-w-3xl w-full text-stone-100 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* PDF Viewer Header Bar */}
        <div className="bg-[#323639] px-4 py-3 border-b border-stone-600 flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-red-600/90 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              PDF
            </div>
            <div className="truncate">
              <h3 className="font-sans text-sm font-semibold text-stone-100 truncate">{documentName}</h3>
              <p className="text-[11px] text-stone-400 truncate flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline shrink-0" />
                <span>Verified Email Attachment • {vendorName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(`Verified Contract Attachment: ${documentName}\nVendor: ${vendorName}\nAmount: $${amount}`)}`}
              download={documentName}
              className="p-2 text-stone-300 hover:text-white hover:bg-stone-700/80 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
              title="Download PDF copy"
            >
              <Download className="w-4 h-4 text-stone-300" />
              <span className="hidden sm:inline">Download</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 text-stone-300 hover:text-white hover:bg-stone-700/80 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Document Container Body */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-[#323639] flex-1 space-y-6">
          {/* AI Extraction Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-200/90 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Ivory AI Auto-Extracted:</strong> Total ${amount.toLocaleString()} • Event Date: {date} • Attached to thread "{emailSubject}"
              </span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/30 shrink-0">
              ✓ Executed
            </span>
          </div>

          {/* Paper Sheet Preview */}
          <div className="bg-white text-stone-900 rounded-lg shadow-xl p-6 sm:p-10 mx-auto max-w-2xl font-serif space-y-6 text-sm leading-relaxed border border-stone-200">
            {/* Letterhead */}
            <div className="border-b-2 border-stone-900 pb-4 flex justify-between items-start gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 uppercase">
                  {vendorName}
                </h1>
                <p className="text-xs font-sans text-stone-600 mt-0.5">
                  Official Client Service Contract & Booking Receipt
                </p>
              </div>
              <div className="text-right font-sans text-xs text-stone-500 space-y-0.5">
                <div>Document ID: #EXT-{Math.floor(Math.random() * 80000 + 10000)}</div>
                <div>Date Issued: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                <div className="font-bold text-emerald-700">STATUS: SIGNED & LOCKED</div>
              </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-4 font-sans text-xs bg-stone-50 p-4 rounded-lg border border-stone-200">
              <div>
                <span className="font-bold uppercase text-stone-500 block text-[10px]">SERVICE PROVIDER:</span>
                <span className="font-semibold text-stone-900 block">{vendorName}</span>
                <span className="text-stone-600">Sonoma Valley, CA</span>
              </div>
              <div>
                <span className="font-bold uppercase text-stone-500 block text-[10px]">CLIENT / COUPLE:</span>
                <span className="font-semibold text-stone-900 block">Brianna Garland & Partner</span>
                <span className="text-stone-600">Event Date: {date}</span>
              </div>
            </div>

            {/* Scope of Agreement */}
            <div className="space-y-2">
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-1">
                1. Scope of Services & Deliverables
              </h4>
              <p className="text-xs text-stone-700 font-sans leading-relaxed">
                This agreement formalizes the reservation for wedding event services provided by {vendorName}. Deliverables include exclusive property access, professional coordination, setup and strike, as detailed in the attached quote proposal.
              </p>
            </div>

            {/* Itemized Fee Breakdown Table */}
            <div className="space-y-2">
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-1">
                2. Investment Schedule & Payment Summary
              </h4>
              <table className="w-full text-xs font-sans border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 font-bold border-b border-stone-300">
                    <th className="py-2 px-2 text-left">Item Description</th>
                    <th className="py-2 px-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-800">
                  <tr>
                    <td className="py-2 px-2">Primary Wedding Package Reservation</td>
                    <td className="py-2 px-2 text-right font-medium">${(amount * 0.85).toFixed(0)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2">On-Site Coordination & Production Support</td>
                    <td className="py-2 px-2 text-right font-medium">${(amount * 0.15).toFixed(0)}</td>
                  </tr>
                  <tr className="font-bold bg-stone-50 text-stone-900 text-sm">
                    <td className="py-2.5 px-2">Total Contract Investment</td>
                    <td className="py-2.5 px-2 text-right text-amber-800">${amount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signature Block */}
            <div className="pt-6 border-t border-stone-300 grid grid-cols-2 gap-6 font-sans text-xs">
              <div className="space-y-3">
                <span className="font-bold text-stone-500 uppercase text-[10px]">Vendor Representative Signature</span>
                <div className="font-serif italic text-lg text-stone-800 border-b border-stone-400 pb-1">
                  {vendorName.split(" ")[0]} Representative
                </div>
                <div className="text-[10px] text-stone-500">Electronically Verified • {date}</div>
              </div>

              <div className="space-y-3">
                <span className="font-bold text-stone-500 uppercase text-[10px]">Client Signature</span>
                <div className="font-serif italic text-lg text-stone-800 border-b border-stone-400 pb-1">
                  Brianna Garland
                </div>
                <div className="text-[10px] text-stone-500">Electronically Signed via Email Link</div>
              </div>
            </div>

            {/* Footer stamp */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-400 font-sans">
              <span>Attached Document: {documentName}</span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Ivory Verified Contract Attachment
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
