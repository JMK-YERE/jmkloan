import React, { useState } from 'react';
import { Loan, User, PaymentMethod, AppNotification, LoanSatisfactionSurvey } from '../types';
import { formatTzs, formatDate } from '../utils/format';
import { 
  CreditCard, 
  PlusCircle, 
  Smartphone, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  PenTool,
  Scale,
  Award,
  Bell,
  Check,
  Download,
  Calendar,
  ChevronDown,
  ChevronUp,
  Star
} from 'lucide-react';
import { SignatureCanvas } from './SignatureCanvas';
import { ContractPdfModal } from './ContractPdfModal';
import { calculateAmortizationSchedule } from '../utils/amortization';
import { calculateMaxEligibleLoanAmount, getCreditTier } from '../utils/loanLimit';
import { PostLoanSatisfactionSurvey } from './PostLoanSatisfactionSurvey';

interface BorrowerDashboardProps {
  currentUser: User;
  loans: Loan[];
  notificationCount?: number;
  notifications?: AppNotification[];
  onMarkNotificationsRead?: () => void;
  onRequestNewLoan: (newLoanData: {
    principalAmount: number;
    durationMonths: number;
    purpose: string;
    guarantorName: string;
    guarantorPhone: string;
    guarantorNida: string;
    guarantorRelationship: string;
    lawyerFeeRequired: boolean;
    borrowerSignature: string;
  }) => void;
  onMakeRepayment: (loanId: string, amount: number, method: PaymentMethod, phone: string) => void;
  onSurveySubmitted?: (loanId: string, survey: LoanSatisfactionSurvey) => void;
}

export const BorrowerDashboard: React.FC<BorrowerDashboardProps> = ({
  currentUser,
  loans,
  notificationCount = 0,
  notifications = [],
  onMarkNotificationsRead,
  onRequestNewLoan,
  onMakeRepayment,
  onSurveySubmitted,
}) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedLoanForPayment, setSelectedLoanForPayment] = useState<Loan | null>(null);
  const [selectedLoanForSignature, setSelectedLoanForSignature] = useState<Loan | null>(null);
  const [pdfModalLoan, setPdfModalLoan] = useState<Loan | null>(null);
  const [expandedScheduleLoanId, setExpandedScheduleLoanId] = useState<string | null>(null);
  const [surveyLoanId, setSurveyLoanId] = useState<string | null>(null);
  const [dismissedSurveyIds, setDismissedSurveyIds] = useState<string[]>([]);

  // Apply Form State
  const [amount, setAmount] = useState<number>(1000000);
  const [duration, setDuration] = useState<number>(3);
  const [purpose, setPurpose] = useState('');
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorPhone, setGuarantorPhone] = useState('+255');
  const [guarantorNida, setGuarantorNida] = useState('');
  const [guarantorRel, setGuarantorRel] = useState('Ndugu / Rafiki wa Karibu');
  const [lawyerRequired, setLawyerRequired] = useState(false);
  const [borrowerSig, setBorrowerSig] = useState('');

  // Payment State
  const [payAmount, setPayAmount] = useState<number>(200000);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('MPESA');
  const [payPhone, setPayPhone] = useState(currentUser.phone || '+255712345678');
  const [isProcessingStk, setIsProcessingStk] = useState(false);
  const [stkMessage, setStkMessage] = useState('');

  const myLoans = loans.filter((l) => l.borrowerId === currentUser.id || l.borrowerName === currentUser.fullName);
  const settledLoans = myLoans.filter((l) => l.status === 'SETTLED');
  const activeSurveyLoan = surveyLoanId
    ? settledLoans.find((l) => l.id === surveyLoanId)
    : (settledLoans.find((l) => !l.satisfactionSurvey && !dismissedSurveyIds.includes(l.id)) ||
       settledLoans.find((l) => !dismissedSurveyIds.includes(l.id)));

  // Dynamic Maximum Eligible Loan Amount based on credit score
  const creditScore = currentUser.creditScore || 680;
  const maxEligibleAmount = currentUser.maxEligibleLoanAmount || calculateMaxEligibleLoanAmount(creditScore);
  const creditTier = getCreditTier(creditScore);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount > maxEligibleAmount) {
      alert(`Kiasi ulichoomba cha ${formatTzs(amount)} kinazidi kiwango chako cha juu unachostahili cha ${formatTzs(maxEligibleAmount)} (Alama: ${creditScore}/850). Tafadhali weka kiasi kisichozidi kiwango hiki.`);
      return;
    }

    if (!borrowerSig) {
      alert('Tafadhali weka sahihi yako ya kalamu kwenye kisanduku kabla ya kutuma ombi.');
      return;
    }
    onRequestNewLoan({
      principalAmount: amount,
      durationMonths: duration,
      purpose,
      guarantorName,
      guarantorPhone,
      guarantorNida,
      guarantorRelationship: guarantorRel,
      lawyerFeeRequired: lawyerRequired,
      borrowerSignature: borrowerSig,
    });
    setIsApplyModalOpen(false);
  };

  const handleTriggerMpesaStk = () => {
    setIsProcessingStk(true);
    setStkMessage(`Inatuma ombi la STK Push kwenda namba ${payPhone}... Weka PIN yako ya simu.`);
    setTimeout(() => {
      if (selectedLoanForPayment) {
        onMakeRepayment(selectedLoanForPayment.id, payAmount, payMethod, payPhone);
      }
      setIsProcessingStk(false);
      setStkMessage('Malipo yamekamilika! Muamala umethibitishwa.');
      setTimeout(() => {
        setSelectedLoanForPayment(null);
        setStkMessage('');
      }, 1500);
    }, 1800);
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
              Jopo la Mkopaji (Borrower Portal)
            </span>
            {notificationCount > 0 && (
              <span className="py-0.5 px-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full font-mono">
                {notificationCount} Mpya
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Habari, {currentUser.fullName}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Simu: {currentUser.phone} · NIDA: {currentUser.nidaNumber}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-800 text-right">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Alama ya Uaminifu (Score)</div>
            <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
              <Award className="w-4 h-4" />
              <span>{currentUser.creditScore} / 850</span>
            </div>
          </div>

          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Omba Mkopo Mpya</span>
          </button>
        </div>
      </div>

      {/* Dynamic Credit Profile & Maximum Eligible Loan Limit Card */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Uwezo Wako wa Kukopa (Credit Limit Profile)
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${creditTier.badgeColor}`}>
                {creditTier.tierName}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Kiwango cha Juu Unachostahili:{' '}
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                {formatTzs(maxEligibleAmount)}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {creditTier.description} {creditTier.interestRateAdvantage}.
            </p>
          </div>

          <button
            onClick={() => {
              setAmount(Math.min(maxEligibleAmount, 1000000));
              setIsApplyModalOpen(true);
            }}
            className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-2 self-start sm:self-center shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Omba Hadi {formatTzs(maxEligibleAmount)}</span>
          </button>
        </div>

        {/* Dynamic Limit Meter & Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Alama ya BOT/Creditinfo:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{creditScore} / 850</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((creditScore / 850) * 100))}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1.5 block">
              Inaongozwa na rekodi yako ya NIDA na nidhamu ya kurejesha
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">Kikomo cha Mkopo Huu:</span>
            <div className="font-mono font-bold text-base text-slate-900 dark:text-white tabular-nums">
              {formatTzs(maxEligibleAmount)}
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
              ✓ Umeidhinishwa kuomba bila kipingamizi
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">Jinsi ya Kuongeza Kikomo:</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              Rejesha mikopo yako kwa wakati kabla ya tarehe ya ukomo ili kufungua mikopo ya hadi TZS 10,000,000.
            </p>
          </div>
        </div>
      </div>

      {/* Post-Loan Satisfaction Survey for Settled Loans */}
      {activeSurveyLoan && (
        <PostLoanSatisfactionSurvey
          loan={activeSurveyLoan}
          onSurveySubmitted={(loanId, survey) => {
            if (onSurveySubmitted) {
              onSurveySubmitted(loanId, survey);
            }
          }}
          onDismiss={() => {
            setDismissedSurveyIds((prev) => [...prev, activeSurveyLoan.id]);
          }}
        />
      )}

      {/* Active Loans */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Mikopo Yangu</h3>

        {myLoans.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <CreditCard className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Huna mkopo wowote kwa sasa.
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Bonyeza "Omba Mkopo Mpya" kuanzisha maombi. Mkopeshaji atakagua na kukupa majibu haraka.
            </p>
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="mt-4 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition"
            >
              Anzisha Maombi ya Mkopo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {myLoans.map((loan) => {
              const percentPaid = Math.round((loan.amountPaid / loan.totalRepayment) * 100);
              const remaining = loan.totalRepayment - loan.amountPaid;

              return (
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
                        <div className="text-xs text-slate-500">{loan.purpose}</div>
                      </div>
                      <span className="py-0.5 px-2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {loan.status === 'REPAYING' ? 'Inalipwa' : loan.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Kiasi Ulichokopa:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                          {formatTzs(loan.principalAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Baki ya Kulipa:</span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {formatTzs(remaining)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>Maendeleo ya Marejesho:</span>
                        <span className="font-mono font-bold">{percentPaid}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentPaid}%` }}
                        />
                      </div>
                    </div>

                    {/* Projected Amortization Schedule Accordion */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedScheduleLoanId(
                            expandedScheduleLoanId === loan.id ? null : loan.id
                          )
                        }
                        className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                      >
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Ratiba ya Marejesho (Amortization Schedule)</span>
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 font-normal">
                          <span>{loan.durationMonths} Miezi</span>
                          {expandedScheduleLoanId === loan.id ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </span>
                      </button>

                      {/* Expandable Amortization Schedule Table */}
                      {expandedScheduleLoanId === loan.id && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                          <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                                Mchanganuo wa Kila Mwezi (Principal & Interest)
                              </span>
                              <span className="text-[10px] text-slate-500">
                                Riba: {loan.interestRate}%/mwezi · Rejesho la kila mwezi: {formatTzs(Math.round(loan.totalRepayment / loan.durationMonths))}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                              BOT Rule Compliant
                            </span>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-[11px]">
                              <thead className="bg-slate-50/60 dark:bg-slate-950/60 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                  <th className="py-2.5 px-3">Awamu</th>
                                  <th className="py-2.5 px-3">Tarehe</th>
                                  <th className="py-2.5 px-3 text-right">Mtaji</th>
                                  <th className="py-2.5 px-3 text-right">Riba</th>
                                  <th className="py-2.5 px-3 text-right">Ada</th>
                                  <th className="py-2.5 px-3 text-right">Jumla Rejesho</th>
                                  <th className="py-2.5 px-3 text-right">Baki ya Deni</th>
                                  <th className="py-2.5 px-3 text-center">Hali</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                                {calculateAmortizationSchedule(loan).map((row) => (
                                  <tr
                                    key={row.installmentNumber}
                                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition ${
                                      row.status === 'PAID'
                                        ? 'bg-emerald-50/30 dark:bg-emerald-950/15'
                                        : row.status === 'PARTIAL'
                                        ? 'bg-amber-50/30 dark:bg-amber-950/15'
                                        : ''
                                    }`}
                                  >
                                    <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white font-sans">
                                      Mwezi {row.installmentNumber}
                                    </td>
                                    <td className="py-2 px-3 text-slate-500 font-sans text-[10px]">
                                      {formatDate(row.dueDate)}
                                    </td>
                                    <td className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">
                                      {formatTzs(row.principalDue)}
                                    </td>
                                    <td className="py-2 px-3 text-right text-emerald-600 dark:text-emerald-400">
                                      +{formatTzs(row.interestDue)}
                                    </td>
                                    <td className="py-2 px-3 text-right text-slate-500">
                                      {row.feesDue > 0 ? `+${formatTzs(row.feesDue)}` : '0 TZS'}
                                    </td>
                                    <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">
                                      {formatTzs(row.totalDue)}
                                    </td>
                                    <td className="py-2 px-3 text-right text-slate-400 text-[10px]">
                                      {formatTzs(row.remainingBalance)}
                                    </td>
                                    <td className="py-2 px-3 text-center font-sans">
                                      {row.status === 'PAID' ? (
                                        <span className="text-emerald-600 font-bold text-[10px] flex items-center justify-center gap-0.5">
                                          <CheckCircle2 className="w-3 h-3" />
                                          Imelipwa
                                        </span>
                                      ) : row.status === 'PARTIAL' ? (
                                        <span className="text-amber-500 font-bold text-[10px]">
                                          Inalipwa
                                        </span>
                                      ) : (
                                        <span className="text-slate-400 text-[10px]">
                                          Inasubiri
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-wrap gap-2 justify-between items-center border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400">
                      Mkopeshaji: {loan.lenderName || 'Bado hajapangiwa'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPdfModalLoan(loan)}
                        className="py-1.5 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                        title="Tazama & Pakua Muhtasari wa Mkataba (PDF)"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mkataba (PDF)</span>
                      </button>

                      {loan.status === 'SETTLED' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSurveyLoanId(loan.id);
                            setDismissedSurveyIds((prev) => prev.filter((id) => id !== loan.id));
                          }}
                          className="py-1.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>
                            {loan.satisfactionSurvey
                              ? `Tathmini (${loan.satisfactionSurvey.rating}★)`
                              : 'Toa Tathmini'}
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedLoanForPayment(loan);
                            setPayAmount(Math.min(remaining, Math.round(loan.totalRepayment / loan.durationMonths)));
                          }}
                          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Lipa kwa Simu</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Apply Loan Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full my-8 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Fomu ya Maombi ya Mkopo</h3>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-6 space-y-5 text-xs">
              {/* Dynamic Eligible Loan Limit Guidance Notice */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 block text-xs">
                    Kikomo Chako cha Juu Kinachoruhusiwa: {formatTzs(maxEligibleAmount)}
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Kulingana na Alama zako za Mkopo: {creditScore}/850 ({creditTier.tierName}).
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
                  Ukomo: {formatTzs(maxEligibleAmount)}
                </span>
              </div>

              {/* Principal & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kiasi Unachotaka Kukopa (TZS):
                  </label>
                  <input
                    type="number"
                    step={50000}
                    min={100000}
                    max={maxEligibleAmount}
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono ${
                      amount > maxEligibleAmount
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-slate-400">{formatTzs(amount)}</span>
                    {amount > maxEligibleAmount && (
                      <span className="text-[10px] text-red-500 font-bold">
                        Umezidi kikomo cha {formatTzs(maxEligibleAmount)}!
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Muda wa Marejesho:
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value={1}>Mwezi 1 (Riba 8%)</option>
                    <option value={2}>Miezi 2 (Riba 10%)</option>
                    <option value={3}>Miezi 3 (Riba 12%)</option>
                    <option value={6}>Miezi 6 (Riba 15%)</option>
                  </select>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kusudi la Mkopo (Sababu):
                </label>
                <input
                  type="text"
                  required
                  placeholder="k.m. Mtaji wa kuongeza bidhaa dukani au ada ya shule"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              {/* Guarantor Details */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-3">
                <span className="block font-bold text-slate-900 dark:text-white text-xs">
                  Taarifa za Mdhamini Wako (Guarantor):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Jina Kamili la Mdhamini:</label>
                    <input
                      type="text"
                      required
                      placeholder="k.m. Bi. Rehema Bakari"
                      value={guarantorName}
                      onChange={(e) => setGuarantorName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Namba ya Simu ya Mdhamini:</label>
                    <input
                      type="tel"
                      required
                      placeholder="+255762334455"
                      value={guarantorPhone}
                      onChange={(e) => setGuarantorPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">NIDA ya Mdhamini (Tarakimu 20):</label>
                    <input
                      type="text"
                      required
                      maxLength={20}
                      placeholder="19880905456780000004"
                      value={guarantorNida}
                      onChange={(e) => setGuarantorNida(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Uhusiano na Mdhamini:</label>
                    <input
                      type="text"
                      placeholder="k.m. Kaka, Mzazi, Bosi wa kazi"
                      value={guarantorRel}
                      onChange={(e) => setGuarantorRel(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Lawyer fee toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-indigo-600" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Huduma ya Mwanasheria / Wakili
                    </span>
                    <p className="text-[11px] text-slate-400">Ukaguzi rasmi wa mikataba na fomu ya kisheria</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={lawyerRequired}
                  onChange={(e) => setLawyerRequired(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600"
                />
              </div>

              {/* Signature Canvas */}
              <div>
                <SignatureCanvas
                  title="Sahihi ya Kalamu ya Mkopaji"
                  subtitle="Weka sahihi yako kwa kidole au kalamu ya simu ili kuthibitisha maombi haya."
                  onSave={(dataUrl) => setBorrowerSig(dataUrl)}
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
                >
                  Tuma Maombi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment / STK Modal */}
      {selectedLoanForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Lipa Marejesho ya Mkopo</h3>
              </div>
              <button
                onClick={() => setSelectedLoanForPayment(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Namba ya Mkopo:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  #{selectedLoanForPayment.loanNumber}
                </span>
                <span className="text-slate-500 block mt-1">
                  Baki ya Deni: {formatTzs(selectedLoanForPayment.totalRepayment - selectedLoanForPayment.amountPaid)}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kiasi cha Kulipa (TZS):
                </label>
                <input
                  type="number"
                  step={10000}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mtandao wa Malipo:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'MPESA', label: 'M-Pesa (Vodacom)' },
                    { id: 'TIGO_PESA', label: 'Tigo Pesa' },
                    { id: 'AIRTEL_MONEY', label: 'Airtel Money' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayMethod(m.id as PaymentMethod)}
                      className={`p-2 rounded-lg border text-center transition ${
                        payMethod === m.id
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Namba ya Simu ya Kulipa:
                </label>
                <input
                  type="tel"
                  value={payPhone}
                  onChange={(e) => setPayPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                />
              </div>

              {stkMessage && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs">
                  {stkMessage}
                </div>
              )}

              <button
                type="button"
                disabled={isProcessingStk}
                onClick={handleTriggerMpesaStk}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {isProcessingStk ? 'Inasubiri PIN kwenye simu yako...' : `Lipa ${formatTzs(payAmount)} Sasa`}
              </button>
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
    </div>
  );
};
