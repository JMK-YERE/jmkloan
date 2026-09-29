import React, { useState } from 'react';
import { Calculator, ShieldCheck, Scale } from 'lucide-react';
import { formatTzs } from '../utils/format';

interface LoanCalculatorProps {
  onApplyWithCalculation?: (calc: {
    principal: number;
    interestRate: number;
    durationMonths: number;
    lawyerFeeRequired: boolean;
    lawyerFeeAmount: number;
    processingFee: number;
    totalRepayment: number;
  }) => void;
}

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({ onApplyWithCalculation }) => {
  const [principal, setPrincipal] = useState<number>(2000000);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [lawyerFeeRequired, setLawyerFeeRequired] = useState<boolean>(true);

  // Calculations
  const processingFee = Math.round(principal * 0.015); // 1.5% processing fee
  const lawyerFeeAmount = lawyerFeeRequired ? 50000 : 0; // Flat 50,000 TZS for legal verification
  const totalInterest = Math.round((principal * (interestRate / 100)) * (durationMonths / 1));
  const totalRepayment = principal + totalInterest + processingFee + lawyerFeeAmount;
  const monthlyInstallment = Math.round(totalRepayment / durationMonths);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 lg:p-8">
      <div className="flex items-center gap-2 mb-1">
        <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Kikokotoo cha Mkopo & Riba</h3>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
        Kokotoa marejesho ya mkopo kwa uwazi kamili kulingana na miongozo ya Benki Kuu ya Tanzania (BOT).
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Principal Amount */}
          <div>
            <div className="flex items-center justify-between text-sm font-medium mb-2">
              <span className="text-slate-700 dark:text-slate-300">Kiasi cha Mkopo (Principal):</span>
              <span className="font-mono font-bold text-slate-900 dark:text-emerald-400 text-base tabular-nums">
                {formatTzs(principal)}
              </span>
            </div>
            <input
              type="range"
              min={200000}
              max={15000000}
              step={100000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
              <span>200,000 TZS</span>
              <span>15,000,000 TZS</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex items-center justify-between text-sm font-medium mb-2">
              <span className="text-slate-700 dark:text-slate-300">Kiwango cha Riba:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-emerald-400 text-base tabular-nums">
                {interestRate}% / mwezi
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={20}
              step={1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
              <span>3% (Chini)</span>
              <span>20% (Kiwango cha kawaida)</span>
            </div>
          </div>

          {/* Duration Months */}
          <div>
            <div className="flex items-center justify-between text-sm font-medium mb-2">
              <span className="text-slate-700 dark:text-slate-300">Muda wa Marejesho:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-emerald-400 text-base tabular-nums">
                Miezi {durationMonths}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 6, 9, 12].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDurationMonths(m)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition ${
                    durationMonths === m
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  Mwezi {m}
                </button>
              ))}
            </div>
          </div>

          {/* Lawyer Fee Toggle (Specific prompt requirement) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={lawyerFeeRequired}
                onChange={(e) => setLawyerFeeRequired(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Mkataba na Mwanasheria / Wakili (Legal Endorsement)
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {lawyerFeeRequired ? '+50,000 TZS' : 'Hapana'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Mwanasheria anathibitisha mkataba na mashahidi kisheria kwa mujibu wa Sheria ya Mikopo Tanzania ili kulinda mkopeshaji na mkopaji.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Results Summary Column */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 rounded-xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-4">
              Muhtasari wa Marejesho
            </h4>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Mkopo Halisi:</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white tabular-nums">
                  {formatTzs(principal)}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Riba ({interestRate}% × miezi {durationMonths}):</span>
                <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                  +{formatTzs(totalInterest)}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Ada ya Maombi (1.5%):</span>
                <span className="font-mono font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                  +{formatTzs(processingFee)}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Ada ya Wakili / Mkataba:</span>
                <span className="font-mono font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                  {lawyerFeeRequired ? `+${formatTzs(lawyerFeeAmount)}` : '0 TZS'}
                </span>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Jumla ya Kulipa:</span>
                  <span className="font-mono text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                    {formatTzs(totalRepayment)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-emerald-600 dark:text-emerald-400">
                  <span>Rejesho la Kila Mwezi:</span>
                  <span className="font-mono font-bold text-sm tabular-nums">
                    {formatTzs(monthlyInstallment)} / mwezi
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              Inajumuisha mkataba wa kisheria na sahihi ya kalamu
            </div>

            {onApplyWithCalculation && (
              <button
                type="button"
                onClick={() =>
                  onApplyWithCalculation({
                    principal,
                    interestRate,
                    durationMonths,
                    lawyerFeeRequired,
                    lawyerFeeAmount,
                    processingFee,
                    totalRepayment,
                  })
                }
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition shadow-sm"
              >
                Omba Mkopo Huu Sasa
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
