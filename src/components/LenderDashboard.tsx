import React, { useState } from 'react';
import { Loan, User, AppNotification } from '../types';
import { formatTzs, formatDate } from '../utils/format';
import { 
  TrendingUp, 
  Wallet, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  UserCheck, 
  Search,
  Scale,
  Bell,
  BellRing,
  Check,
  Download
} from 'lucide-react';
import { SignatureCanvas } from './SignatureCanvas';
import { ContractPdfModal } from './ContractPdfModal';
import { LoanComparisonModal } from './LoanComparisonModal';
import { SendPaymentReminderModal } from './SendPaymentReminderModal';
import { downloadLoanAgreementPdf } from '../utils/pdfGenerator';

interface LenderDashboardProps {
  currentUser: User;
  loans: Loan[];
  notificationCount?: number;
  notifications?: AppNotification[];
  onMarkNotificationsRead?: () => void;
  onApproveLoan: (loanId: string, lenderSignature: string) => void;
  onRejectLoan: (loanId: string) => void;
  onSendReminder?: (loanId: string, channel: 'SMS' | 'PUSH' | 'BOTH', message: string) => void;
}

export const LenderDashboard: React.FC<LenderDashboardProps> = ({
  currentUser,
  loans,
  notificationCount = 0,
  notifications = [],
  onMarkNotificationsRead,
  onApproveLoan,
  onRejectLoan,
  onSendReminder,
}) => {
  const [selectedLoanForContract, setSelectedLoanForContract] = useState<Loan | null>(null);
  const [pdfModalLoan, setPdfModalLoan] = useState<Loan | null>(null);
  const [selectedLoanIdsForComparison, setSelectedLoanIdsForComparison] = useState<string[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [reminderLoan, setReminderLoan] = useState<Loan | null>(null);
  const [lenderSig, setLenderSig] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Stats
  const totalPrincipal = loans.reduce((acc, l) => acc + l.principalAmount, 0);
  const totalInterestExpected = loans.reduce((acc, l) => acc + l.totalInterest, 0);
  const totalCollected = loans.reduce((acc, l) => acc + l.amountPaid, 0);
  const pendingApprovals = loans.filter((l) => l.status === 'PENDING').length;

  const filteredLoans = loans.filter((l) => {
    const matchesSearch =
      l.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.loanNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.borrowerPhone.includes(searchQuery);
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleLoanSelection = (loanId: string) => {
    setSelectedLoanIdsForComparison((prev) =>
      prev.includes(loanId) ? prev.filter((id) => id !== loanId) : [...prev, loanId]
    );
  };

  const handleSelectAllForComparison = () => {
    if (selectedLoanIdsForComparison.length === filteredLoans.length && filteredLoans.length > 0) {
      setSelectedLoanIdsForComparison([]);
    } else {
      setSelectedLoanIdsForComparison(filteredLoans.map((l) => l.id));
    }
  };

  const selectedLoansForComparison = loans.filter((l) =>
    selectedLoanIdsForComparison.includes(l.id)
  );

  const handleQuickCompare = () => {
    if (selectedLoanIdsForComparison.length < 2) {
      const defaultIds = filteredLoans.slice(0, 3).map((l) => l.id);
      setSelectedLoanIdsForComparison(defaultIds);
    }
    setIsComparisonModalOpen(true);
  };

  const handleSignAndApprove = () => {
    if (!selectedLoanForContract) return;
    onApproveLoan(selectedLoanForContract.id, lenderSig);
    setSelectedLoanForContract(null);
    setLenderSig('');
  };

  const latestNotification = notifications[0];

  return (
    <div className="space-y-8">
      {/* Real-time Notification Alert Banner when counter > 0 */}
      {notificationCount > 0 && latestNotification && (
        <div className="p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative p-2 rounded-xl bg-emerald-600 text-white shrink-0">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                {notificationCount}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  {latestNotification.title}
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                  {latestNotification.timestamp.replace('T', ' ').substring(11, 16)}
                </span>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-snug">
                {latestNotification.message}
              </p>
            </div>
          </div>

          {onMarkNotificationsRead && (
            <button
              onClick={onMarkNotificationsRead}
              className="py-1 px-3 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-slate-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition self-end sm:self-auto shrink-0"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Weka Alama ya Kusomwa</span>
            </button>
          )}
        </div>
      )}

      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
              Jopo la Mkopeshaji (Lender Console)
            </span>
            {notificationCount > 0 && (
              <span className="py-0.5 px-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full font-mono">
                {notificationCount} Arifa Mpya
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Karibu, {currentUser.fullName}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {currentUser.occupation || 'Mwekezaji wa Fedha Binafsi'} · {currentUser.location}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="py-1.5 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" />
            <span>Leseni ya BOT: Imeidhinishwa</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Jumla Iliyokopeshwa</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {formatTzs(totalPrincipal)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Mtaji unaofanya kazi</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Faida ya Riba Inayotarajiwa</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
            +{formatTzs(totalInterestExpected)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Jumla ya faida halisi</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Marejesho Yaliyokusanywa</span>
            <CheckCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {formatTzs(totalCollected)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Yamelipwa kwa simu</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Maombi Yanayosubiri</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {pendingApprovals}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Yanahitaji sahihi yako</div>
        </div>
      </div>

      {/* Loans Table & Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Orodha ya Mikopo Yote</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kagua maelezo ya mkopaji, mdhamini, na fanya maamuzi ya kuidhinisha.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tafuta jina, namba au simu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
              {['ALL', 'PENDING', 'REPAYING', 'APPROVED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`py-1 px-2.5 rounded-md font-medium transition ${
                    statusFilter === st
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {st === 'ALL' && 'Zote'}
                  {st === 'PENDING' && 'Inasubiri'}
                  {st === 'REPAYING' && 'Inalipwa'}
                  {st === 'APPROVED' && 'Imeidhinishwa'}
                </button>
              ))}
            </div>

            {/* Compare Button */}
            <button
              type="button"
              onClick={handleQuickCompare}
              className="py-1.5 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition"
              title="Linganisha mikopo iliyochaguliwa ubavu kwa ubavu"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-600" />
              <span>Linganisha ({selectedLoanIdsForComparison.length})</span>
            </button>
          </div>
        </div>

        {/* Comparison Selection Floating Action Bar */}
        {selectedLoanIdsForComparison.length > 0 && (
          <div className="mx-6 mb-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                Umechagua mikopo {selectedLoanIdsForComparison.length} kwa ajili ya ulinganisho.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedLoanIdsForComparison([])}
                className="py-1 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Safisha Chaguo
              </button>
              <button
                type="button"
                onClick={() => setIsComparisonModalOpen(true)}
                className="py-1.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Linganisha Ubavu kwa Ubavu ({selectedLoanIdsForComparison.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredLoans.length > 0 &&
                      selectedLoanIdsForComparison.length === filteredLoans.length
                    }
                    onChange={handleSelectAllForComparison}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    title="Chagua zote kwa ulinganisho"
                  />
                </th>
                <th className="py-3 px-4">Namba ya Mkopo</th>
                <th className="py-3 px-4">Mkopaji & NIDA</th>
                <th className="py-3 px-4 text-right">Kiasi</th>
                <th className="py-3 px-4">Muda / Riba</th>
                <th className="py-3 px-4">Mdhamini</th>
                <th className="py-3 px-4">Mwanasheria</th>
                <th className="py-3 px-4">Hali</th>
                <th className="py-3 px-4 text-right">Hatua</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Hakuna mikopo inayolingana na utafutaji wako.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((l) => (
                  <tr
                    key={l.id}
                    className={`transition ${
                      selectedLoanIdsForComparison.includes(l.id)
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedLoanIdsForComparison.includes(l.id)}
                        onChange={() => toggleLoanSelection(l.id)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                        title="Chagua kulinganisha"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                      {l.loanNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{l.borrowerName}</div>
                      <div className="text-[11px] font-mono text-slate-400">NIDA: {l.borrowerNida}</div>
                      <div className="text-[11px] text-slate-400">{l.borrowerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatTzs(l.principalAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>Miezi {l.durationMonths}</div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Riba: {l.interestRate}%
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{l.guarantor.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {l.guarantor.status === 'ENDORSED' ? (
                          <span className="text-emerald-600 font-medium">✓ Amethibitisha</span>
                        ) : (
                          <span className="text-amber-500 font-medium">⏳ Bado kusaini</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {l.lawyerFeeRequired ? (
                        <span className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                          <Scale className="w-3.5 h-3.5" />
                          Ndio (+50k)
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Hapana</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {l.status === 'PENDING' && (
                        <span className="py-0.5 px-2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Inasubiri Idhini
                        </span>
                      )}
                      {l.status === 'REPAYING' && (
                        <span className="py-0.5 px-2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Inalipwa ({Math.round((l.amountPaid / l.totalRepayment) * 100)}%)
                        </span>
                      )}
                      {l.status === 'APPROVED' && (
                        <span className="py-0.5 px-2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          Imeidhinishwa
                        </span>
                      )}
                      {l.status === 'REJECTED' && (
                        <span className="py-0.5 px-2 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                          Imekataliwa
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedLoanForContract(l)}
                          className="py-1 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1 transition"
                          title="Tazama mkataba na saini"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Mkataba</span>
                        </button>

                        <button
                          onClick={() => setPdfModalLoan(l)}
                          className="py-1 px-2.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1 transition"
                          title="Tazama na Pakua Muhtasari wa Mkataba wa PDF"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-600" />
                          <span>PDF</span>
                        </button>

                        {l.status !== 'REJECTED' && l.status !== 'SETTLED' && (
                          <button
                            type="button"
                            onClick={() => setReminderLoan(l)}
                            className="py-1 px-2.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-medium flex items-center gap-1 transition"
                            title="Tuma SMS au Push Notification ya ukumbusho wa tarehe ya marejesho"
                          >
                            <BellRing className="w-3.5 h-3.5 text-amber-600" />
                            <span>Kumbusha</span>
                          </button>
                        )}

                        {l.status === 'PENDING' && (
                          <button
                            onClick={() => onRejectLoan(l.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition"
                            title="Kataa ombi hili"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract & Signature Modal for Lender */}
      {selectedLoanForContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full my-8 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Mkataba wa Mkopo #{selectedLoanForContract.loanNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLoanForContract(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {/* Contract terms card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Masharti Rasmi ya Mkataba (BOT Microfinance Act 2018)
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Mkopeshaji (<strong>{currentUser.fullName}</strong>) anakubali kumpa mkopo wa{' '}
                  <strong className="font-mono">{formatTzs(selectedLoanForContract.principalAmount)}</strong> kwa mkopaji{' '}
                  <strong>{selectedLoanForContract.borrowerName}</strong> (NIDA: {selectedLoanForContract.borrowerNida}).
                  Riba ni <strong>{selectedLoanForContract.interestRate}%</strong> kwa mwezi kwa muda wa miezi{' '}
                  <strong>{selectedLoanForContract.durationMonths}</strong>. Jumla ya kurejesha ni{' '}
                  <strong className="font-mono">{formatTzs(selectedLoanForContract.totalRepayment)}</strong>.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block">Mdhamini Rasmi:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedLoanForContract.guarantor.fullName} ({selectedLoanForContract.guarantor.relationship})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Mwanasheria:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedLoanForContract.lawyerFeeRequired ? 'Wakili Atakagua (Gharama: 50,000 TZS)' : 'Bila Wakili'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Borrower & Guarantor signature status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">Sahihi ya Mkopaji:</span>
                  {selectedLoanForContract.borrowerSignature ? (
                    <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded flex items-center justify-center">
                      <img
                        src={selectedLoanForContract.borrowerSignature}
                        alt="Sahihi ya Mkopaji"
                        className="h-14 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-14 flex items-center justify-center text-slate-400 text-center">
                      Bado hajasaini
                    </div>
                  )}
                </div>

                <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">Sahihi ya Mdhamini:</span>
                  {selectedLoanForContract.guarantor.signatureImage ? (
                    <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded flex items-center justify-center">
                      <img
                        src={selectedLoanForContract.guarantor.signatureImage}
                        alt="Sahihi ya Mdhamini"
                        className="h-14 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-14 flex items-center justify-center text-slate-400 text-center">
                      Bado hajasaini
                    </div>
                  )}
                </div>
              </div>

              {/* Lender Signature pad */}
              {selectedLoanForContract.status === 'PENDING' && (
                <div>
                  <SignatureCanvas
                    title="Weka Sahihi Yako ya Mkopeshaji Kuidhinisha"
                    subtitle="Kwa kuweka sahihi, unakubali kutoa fedha hizi kwa mkopaji kulingana na mkataba huu."
                    onSave={(dataUrl) => setLenderSig(dataUrl)}
                    existingSignature={selectedLoanForContract.lenderSignature}
                  />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPdfModalLoan(selectedLoanForContract)}
                className="py-2 px-3 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5 transition hover:bg-emerald-100"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pakua Muhtasari (PDF)</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedLoanForContract(null)}
                  className="py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Funga
                </button>

                {selectedLoanForContract.status === 'PENDING' && (
                  <button
                    onClick={handleSignAndApprove}
                    disabled={!lenderSig}
                    className="py-2 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Idhinisha & Toa Mkopo Huu
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contract PDF Summary Modal */}
      <ContractPdfModal
        loan={pdfModalLoan}
        isOpen={!!pdfModalLoan}
        onClose={() => setPdfModalLoan(null)}
      />

      {/* Side-by-Side Loan Comparison Modal */}
      <LoanComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        loans={selectedLoansForComparison}
        onSelectForApproval={(loan) => {
          setIsComparisonModalOpen(false);
          setSelectedLoanForContract(loan);
        }}
        onRemoveFromComparison={(loanId) => {
          setSelectedLoanIdsForComparison((prev) => prev.filter((id) => id !== loanId));
        }}
      />

      {/* Send Payment Reminder Modal (SMS / Push Notification) */}
      <SendPaymentReminderModal
        isOpen={!!reminderLoan}
        onClose={() => setReminderLoan(null)}
        loan={reminderLoan}
        onSendReminder={(loanId, channel, message) => {
          if (onSendReminder) {
            onSendReminder(loanId, channel, message);
          }
        }}
      />
    </div>
  );
};
