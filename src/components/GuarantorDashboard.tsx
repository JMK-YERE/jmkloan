import React, { useState } from 'react';
import { Loan, User } from '../types';
import { formatTzs } from '../utils/format';
import { Users, CheckCircle, ShieldAlert, FileText } from 'lucide-react';
import { SignatureCanvas } from './SignatureCanvas';

interface GuarantorDashboardProps {
  currentUser: User;
  loans: Loan[];
  onEndorseGuarantee: (loanId: string, signatureImage: string) => void;
}

export const GuarantorDashboard: React.FC<GuarantorDashboardProps> = ({
  currentUser,
  loans,
  onEndorseGuarantee,
}) => {
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [guarantorSig, setGuarantorSig] = useState('');

  // Loans where this user is the named guarantor
  const guaranteeRequests = loans.filter(
    (l) =>
      l.guarantor.fullName.toLowerCase().includes(currentUser.fullName.toLowerCase()) ||
      l.guarantor.phone === currentUser.phone ||
      l.guarantor.nidaNumber === currentUser.nidaNumber
  );

  const handleEndorseSubmit = () => {
    if (!selectedLoan || !guarantorSig) return;
    onEndorseGuarantee(selectedLoan.id, guarantorSig);
    setSelectedLoan(null);
    setGuarantorSig('');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
          Jopo la Mdhamini (Guarantor Endorsements)
        </span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
          Habari, {currentUser.fullName}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Kama mdhamini, unalinda uaminifu wa mkopo. Hakikisha unamfahamu mkopaji na unaridhia masharti kabla ya kusaini.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Maombi ya Udhamini Yanayokuhusu
        </h3>

        {guaranteeRequests.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            Hakuna maombi ya udhamini yanayosubiri uthibitisho wako kwa sasa.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {guaranteeRequests.map((loan) => (
              <div
                key={loan.id}
                className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        #{loan.loanNumber}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {loan.borrowerName}
                      </h4>
                    </div>
                    {loan.guarantor.status === 'ENDORSED' ? (
                      <span className="py-0.5 px-2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Umeshathibitisha
                      </span>
                    ) : (
                      <span className="py-0.5 px-2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Inasubiri Sahihi Yako
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{loan.purpose}</p>

                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Kiasi cha Mkopo:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {formatTzs(loan.principalAmount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Muda wa Marejesho:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Miezi {loan.durationMonths}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-[11px] text-slate-400">
                    Uhusiano: {loan.guarantor.relationship}
                  </span>

                  {loan.guarantor.status !== 'ENDORSED' ? (
                    <button
                      onClick={() => setSelectedLoan(loan)}
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition"
                    >
                      Kagua & Saini Kama Mdhamini
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Dhamana Imekamilika
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Endorsement Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full my-8 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Thibitisha Udhamini wa Mkopo #{selectedLoan.loanNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLoan(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Tamko Rasmi la Mdhamini (Guarantor Agreement)</span>
                </div>
                <p className="text-amber-900 dark:text-amber-200 leading-relaxed text-[11px]">
                  Mimi <strong>{currentUser.fullName}</strong> (NIDA: {currentUser.nidaNumber}) nathibitisha kuwa
                  namfahamu <strong>{selectedLoan.borrowerName}</strong> na ninajitoa kuwa mdhamini wake kwa mkopo
                  wa <strong>{formatTzs(selectedLoan.principalAmount)}</strong>. Mkopo ukishindwa kulipwa, nitawajibika
                  kusaidia ufuatiliaji wa marejesho kwa mujibu wa sheria za Tanzania.
                </p>
              </div>

              {/* Signature Canvas */}
              <div>
                <SignatureCanvas
                  title="Weka Sahihi Yako ya Kalamu ya Mdhamini"
                  subtitle="Saini ndani ya sanduku hapa chini kuthibitisha dhamana yako kisheria."
                  onSave={(dataUrl) => setGuarantorSig(dataUrl)}
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedLoan(null)}
                  className="py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Ghairi
                </button>
                <button
                  type="button"
                  disabled={!guarantorSig}
                  onClick={handleEndorseSubmit}
                  className="py-2 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50"
                >
                  Thibitisha Dhamana Hii
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
