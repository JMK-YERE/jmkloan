import React, { useState } from 'react';
import { Loan } from '../types';
import { formatTzs, formatDate } from '../utils/format';
import { downloadLoanAgreementPdf, printLoanAgreementPdf } from '../utils/pdfGenerator';
import { FileText, Download, Printer, X, ShieldCheck, CheckCircle2, Scale } from 'lucide-react';

interface ContractPdfModalProps {
  loan: Loan | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ContractPdfModal: React.FC<ContractPdfModalProps> = ({ loan, isOpen, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !loan) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      downloadLoanAgreementPdf(loan);
      setIsDownloading(false);
    }, 600);
  };

  const handlePrint = () => {
    printLoanAgreementPdf(loan);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full my-8 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>Muhtasari wa Mkataba wa Mkopo</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  #{loan.loanNumber}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hati rasmi ya kisheria kulingana na Sheria ya Huduma Ndogo za Fedha 2018 (BOT).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Scrollable Preview */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs bg-slate-50/50 dark:bg-slate-950/30">
          {/* Printable Sheet Emulation */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            {/* Top Seal */}
            <div className="text-center border-b border-emerald-600/30 pb-4">
              <div className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                Jamhuri ya Muungano wa Tanzania
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Mkataba Rasmi wa Mkopo wa Kifedha
              </h4>
              <p className="text-[11px] text-slate-500">
                Sheria ya Huduma Ndogo za Fedha (Microfinance Act, 2018) & Sheria ya Mikataba
              </p>
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 font-mono">
                <span>Namba: <strong>#{loan.loanNumber}</strong></span>
                <span>Tarehe: <strong>{loan.approvedAt ? formatDate(loan.approvedAt) : formatDate(loan.requestedAt)}</strong></span>
                <span>Hali: <strong className="text-emerald-600">IMEIDHINISHWA KISHERIA</strong></span>
              </div>
            </div>

            {/* Parties */}
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-2 pb-1 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
                <span>1. Pandikizi za Mkataba (Parties Involved)</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Mkopeshaji (Lender)</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{loan.lenderName || 'Mkopeshaji Aliyethibitishwa'}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Leseni ya BOT: TIER-2-TZ-8849</div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Mkopaji (Borrower)</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{loan.borrowerName}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">NIDA: {loan.borrowerNida}</div>
                  <div className="text-[10px] text-slate-500">{loan.borrowerPhone}</div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Mdhamini (Guarantor)</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{loan.guarantor.fullName}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">NIDA: {loan.guarantor.nidaNumber}</div>
                  <div className="text-[10px] text-slate-500">Uhusiano: {loan.guarantor.relationship}</div>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-2 pb-1 border-b border-slate-200 dark:border-slate-800">
                2. Muundo wa Kifedha & Ratiba (Financial Summary)
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Kiasi Halisi:</span>
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white tabular-nums">
                    {formatTzs(loan.principalAmount)}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Kiwango cha Riba:</span>
                  <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {loan.interestRate}% / mwezi
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Muda wa Mkopo:</span>
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                    Miezi {loan.durationMonths}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">Jumla ya Kulipa:</span>
                  <span className="font-mono font-bold text-sm text-emerald-800 dark:text-emerald-300 tabular-nums">
                    {formatTzs(loan.totalRepayment)}
                  </span>
                </div>
              </div>

              {loan.lawyerFeeRequired && (
                <div className="mt-2.5 p-2.5 rounded-lg border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20 flex items-center justify-between text-[11px] text-purple-900 dark:text-purple-300">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Scale className="w-3.5 h-3.5 text-purple-600" />
                    Mkataba huu unajumuisha Ukaguzi na Ada ya Mwanasheria / Wakili
                  </span>
                  <span className="font-mono font-bold">+{formatTzs(loan.lawyerFeeAmount)}</span>
                </div>
              )}
            </div>

            {/* Terms Summary */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                3. Masharti ya Kisheria (Legal Declarations)
              </span>
              <ul className="list-disc pl-4 space-y-1">
                <li>Mkopaji anakubali kurejesha mkopo huu kwa awamu za kila mwezi bila kukiuka makubaliano.</li>
                <li>Mdhamini anakiri kwamba mkopaji akishindwa kurejesha, atawajibika kusaidia kufanikisha marejesho.</li>
                <li>Mkataba huu una kibali cha kisheria na unatambulika mahakamani chini ya Sheria ya Mikataba ya Tanzania.</li>
              </ul>
            </div>

            {/* Signatures */}
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3 pb-1 border-b border-slate-200 dark:border-slate-800">
                4. Sahihi za Kidijitali (Embedded Electronic Signatures)
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Lender Signature */}
                <div className="p-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-center bg-slate-50/50 dark:bg-slate-950/50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Mkopeshaji</span>
                  {loan.lenderSignature ? (
                    <img src={loan.lenderSignature} alt="Sahihi ya Mkopeshaji" className="h-10 mx-auto object-contain my-1" />
                  ) : (
                    <div className="h-10 flex items-center justify-center text-[10px] text-slate-400 italic">Sahihi ya Kidijitali</div>
                  )}
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px] border-t border-slate-200 dark:border-slate-800 pt-1 mt-1">
                    {loan.lenderName || 'Mkopeshaji'}
                  </span>
                </div>

                {/* Borrower Signature */}
                <div className="p-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-center bg-slate-50/50 dark:bg-slate-950/50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Mkopaji</span>
                  {loan.borrowerSignature ? (
                    <img src={loan.borrowerSignature} alt="Sahihi ya Mkopaji" className="h-10 mx-auto object-contain my-1" />
                  ) : (
                    <div className="h-10 flex items-center justify-center text-[10px] text-slate-400 italic">Sahihi ya Kalamu</div>
                  )}
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px] border-t border-slate-200 dark:border-slate-800 pt-1 mt-1">
                    {loan.borrowerName}
                  </span>
                </div>

                {/* Guarantor Signature */}
                <div className="p-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-center bg-slate-50/50 dark:bg-slate-950/50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Mdhamini</span>
                  {loan.guarantor.signatureImage ? (
                    <img src={loan.guarantor.signatureImage} alt="Sahihi ya Mdhamini" className="h-10 mx-auto object-contain my-1" />
                  ) : (
                    <div className="h-10 flex items-center justify-center text-[10px] text-slate-400 italic">Imethibitishwa</div>
                  )}
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px] border-t border-slate-200 dark:border-slate-800 pt-1 mt-1">
                    {loan.guarantor.fullName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Mkataba Umethibitishwa na Mfumo wa JmkLoanApp</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Chapisha / Print</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Inatengeneza PDF...' : 'Pakua Mkataba (PDF)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
