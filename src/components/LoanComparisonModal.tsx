import React from 'react';
import { Loan } from '../types';
import { formatTzs, formatDate } from '../utils/format';
import { 
  Scale, 
  X, 
  Percent, 
  Clock, 
  Banknote, 
  TrendingUp, 
  ShieldCheck, 
  UserCheck, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface LoanComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  loans: Loan[];
  onSelectForApproval: (loan: Loan) => void;
  onRemoveFromComparison: (loanId: string) => void;
}

export const LoanComparisonModal: React.FC<LoanComparisonModalProps> = ({
  isOpen,
  onClose,
  loans,
  onSelectForApproval,
  onRemoveFromComparison,
}) => {
  if (!isOpen || loans.length === 0) return null;

  // Aggregate highlights for comparison
  const highestInterest = Math.max(...loans.map((l) => l.interestRate));
  const lowestDuration = Math.min(...loans.map((l) => l.durationMonths));
  const largestAmount = Math.max(...loans.map((l) => l.principalAmount));
  const totalFundingRequired = loans.reduce((acc, l) => acc + l.principalAmount, 0);
  const totalProjectedProfit = loans.reduce((acc, l) => acc + l.totalInterest, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-6xl w-full my-6 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Ulinganisho wa Mikopo Ubavu kwa Ubavu (Side-by-Side Loan Comparison)
                </h3>
                <span className="py-0.5 px-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full font-mono">
                  Mikopo {loans.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Linganisha viwango vya riba, muda wa marejesho, na kiasi kilichoombwa kufanya maamuzi bora ya uwekezaji.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Jumla ya Mtaji:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatTzs(totalFundingRequired)}</span>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-700 pl-4">
                <span className="text-[10px] text-slate-400 block uppercase">Faida Tarajiwa:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">+{formatTzs(totalProjectedProfit)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Overview Metrics Bar */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Riba ya Juu Zaidi:</span>
            <span className="font-mono font-bold text-emerald-600 text-sm">{highestInterest}% / mwezi</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Muda Mfupi Zaidi:</span>
            <span className="font-mono font-bold text-blue-600 text-sm">{lowestDuration} Miezi</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Kiasi Kikubwa Zaidi:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{formatTzs(largestAmount)}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Wastani wa Faida:</span>
            <span className="font-mono font-bold text-amber-600 text-sm">
              +{formatTzs(Math.round(totalProjectedProfit / loans.length))} / mkopo
            </span>
          </div>
        </div>

        {/* Cards Side-by-Side Container */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map((loan) => {
              const monthlyRepayment = Math.round(loan.totalRepayment / loan.durationMonths);
              const isHighestInterest = loan.interestRate === highestInterest;
              const isShortestDuration = loan.durationMonths === lowestDuration;
              const isLargestAmount = loan.principalAmount === largestAmount;

              return (
                <div
                  key={loan.id}
                  className="bg-white dark:bg-slate-900 border-2 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-lg border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 relative"
                >
                  {/* Remove pill button */}
                  <button
                    onClick={() => onRemoveFromComparison(loan.id)}
                    className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                    title="Ondoa kwenye ulinganisho"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="space-y-4">
                    {/* Loan Identifier & Borrower */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          #{loan.loanNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {loan.status === 'PENDING' ? 'Inasubiri Idhini' : loan.status}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {loan.borrowerName}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        NIDA: {loan.borrowerNida}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">
                        "{loan.purpose}"
                      </p>
                    </div>

                    {/* KEY COMPARISON ATTRIBUTE 1: Kiasi Kilichoombwa (Requested Amount) */}
                    <div className={`p-3.5 rounded-xl border ${
                      isLargestAmount
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50'
                    }`}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                          Kiasi Kilichoombwa:
                        </span>
                        {isLargestAmount && (
                          <span className="text-[10px] font-bold text-emerald-600 font-sans">
                            Kiwango Kikubwa
                          </span>
                        )}
                      </div>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                        {formatTzs(loan.principalAmount)}
                      </div>
                    </div>

                    {/* KEY COMPARISON ATTRIBUTE 2: Kiwango cha Riba (Interest Rate) */}
                    <div className={`p-3.5 rounded-xl border ${
                      isHighestInterest
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50'
                    }`}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Percent className="w-3.5 h-3.5 text-emerald-600" />
                          Kiwango cha Riba:
                        </span>
                        {isHighestInterest && (
                          <span className="text-[10px] font-bold text-emerald-600 font-sans flex items-center gap-0.5">
                            <Sparkles className="w-3 h-3" />
                            Faida Kubwa Zaidi
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {loan.interestRate}% / mwezi
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          Faida: +{formatTzs(loan.totalInterest)}
                        </span>
                      </div>
                    </div>

                    {/* KEY COMPARISON ATTRIBUTE 3: Muda wa Marejesho (Loan Duration) */}
                    <div className={`p-3.5 rounded-xl border ${
                      isShortestDuration
                        ? 'border-blue-300 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-950/20'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50'
                    }`}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          Muda wa Marejesho:
                        </span>
                        {isShortestDuration && (
                          <span className="text-[10px] font-bold text-blue-600 font-sans">
                            Mzunguko wa Haraka
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                          Miezi {loan.durationMonths}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {formatTzs(monthlyRepayment)} / mwezi
                        </span>
                      </div>
                    </div>

                    {/* Detailed Specifications Breakdown */}
                    <div className="py-2 space-y-2 border-y border-slate-100 dark:border-slate-800 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Jumla ya Marejesho:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {formatTzs(loan.totalRepayment)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Mdhamini (Guarantor):</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          {loan.guarantor.fullName}
                          {loan.guarantor.status === 'ENDORSED' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <span className="text-[10px] text-amber-500">(Bado)</span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Mkataba wa Wakili:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {loan.lawyerFeeRequired ? '✓ Wakili Yupo (+Ada)' : 'Hajumuishi'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Tarehe ya Ombi:</span>
                        <span className="font-mono text-slate-500 text-[11px]">
                          {formatDate(loan.requestedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-4 mt-2">
                    {loan.status === 'PENDING' ? (
                      <button
                        onClick={() => {
                          onClose();
                          onSelectForApproval(loan);
                        }}
                        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Kagua & Saini Mkataba</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    ) : (
                      <div className="py-2 text-center text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
                        Mkopo Tayari Umeidhinishwa
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Mikataba yote inazingatia Sheria ya Huduma Ndogo za Fedha ya Benki Kuu ya Tanzania (BOT).</span>
          </div>

          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
          >
            Funga Ulinganisho
          </button>
        </div>
      </div>
    </div>
  );
};
