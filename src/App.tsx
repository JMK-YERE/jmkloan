import React, { useState } from 'react';
import { User, Loan, Role, PaymentMethod, PaymentTransaction, AppNotification, LoanSatisfactionSurvey } from './types';
import { INITIAL_USERS, INITIAL_LOANS, INITIAL_TRANSACTIONS } from './data/mockData';
import { formatTzs } from './utils/format';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { LoanCalculator } from './components/LoanCalculator';
import { LenderDashboard } from './components/LenderDashboard';
import { BorrowerDashboard } from './components/BorrowerDashboard';
import { GuarantorDashboard } from './components/GuarantorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { BackendDiagnosticsModal } from './components/BackendDiagnosticsModal';
import { RegisterModal } from './components/RegisterModal';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'NEW_LOAN_APPLICATION',
    title: 'Ombi Jipya la Mkopo',
    message: 'Salum Juma Kibwana ameomba mkopo mpya wa 1,200,000 TZS (#JMK-2026-002) kwa ajili ya gereji.',
    timestamp: '2026-09-27T08:45:00Z',
    read: false,
    loanNumber: 'JMK-2026-002',
    amount: 1200000,
  },
  {
    id: 'notif-2',
    type: 'REPAYMENT_RECEIVED',
    title: 'Rejesho la Fedha Limepokelewa',
    message: 'Baraka Emmanuel Mushi amelipa rejesho la 945,000 TZS kupitia M-Pesa (Ref: QE49XP129K).',
    timestamp: '2026-09-12T15:20:10Z',
    read: false,
    loanNumber: 'JMK-2026-001',
    amount: 945000,
  },
];

export default function App() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[1]); // Default to Dr. Neema (Lender)
  const [currentRole, setCurrentRole] = useState<Role>('LENDER');
  const [loans, setLoans] = useState<Loan[]>(INITIAL_LOANS);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);

  // Simple state-based notification counter & items
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [notificationCount, setNotificationCount] = useState<number>(INITIAL_NOTIFICATIONS.length);

  const [activeView, setActiveView] = useState<'LANDING' | 'DASHBOARD' | 'CALCULATOR'>('DASHBOARD');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  // Notification helper
  const addNotification = (
    type: AppNotification['type'],
    title: string,
    message: string,
    loanNumber?: string,
    amount?: number
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      loanNumber,
      amount,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setNotificationCount((prev) => prev + 1); // increment state-based counter
  };

  const handleMarkNotificationsRead = () => {
    setNotificationCount(0); // clear state counter
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Switch role and update the active user view
  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    const userForRole = users.find((u) => u.role === role);
    if (userForRole) {
      setCurrentUser(userForRole);
    }
  };

  // Loan Actions
  const handleApproveLoan = (loanId: string, lenderSignature: string) => {
    const targetLoan = loans.find((l) => l.id === loanId);
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? {
              ...l,
              status: 'REPAYING',
              lenderId: currentUser?.id,
              lenderName: currentUser?.fullName,
              approvedAt: new Date().toISOString(),
              lenderSignature,
              contractPdfGenerated: true,
            }
          : l
      )
    );

    // Alert on approval
    addNotification(
      'LOAN_APPROVED',
      'Mkopo Umeidhinishwa & Fedha Zimetolewa',
      `Mkopo #${targetLoan?.loanNumber || loanId} wa ${targetLoan ? formatTzs(targetLoan.principalAmount) : ''} umeidhinishwa na mkataba umesainiwa rasmi.`,
      targetLoan?.loanNumber,
      targetLoan?.principalAmount
    );
  };

  const handleRejectLoan = (loanId: string) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, status: 'REJECTED' } : l))
    );
  };

  const handleRequestNewLoan = (newLoanData: {
    principalAmount: number;
    durationMonths: number;
    purpose: string;
    guarantorName: string;
    guarantorPhone: string;
    guarantorNida: string;
    guarantorRelationship: string;
    lawyerFeeRequired: boolean;
    borrowerSignature: string;
  }) => {
    const interestRate = newLoanData.durationMonths <= 2 ? 8 : 12;
    const totalInterest = Math.round(newLoanData.principalAmount * (interestRate / 100) * newLoanData.durationMonths);
    const processingFee = Math.round(newLoanData.principalAmount * 0.015);
    const lawyerFeeAmount = newLoanData.lawyerFeeRequired ? 50000 : 0;
    const totalRepayment = newLoanData.principalAmount + totalInterest + processingFee + lawyerFeeAmount;

    const newLoan: Loan = {
      id: `loan-tz-${Date.now()}`,
      loanNumber: `JMK-2026-00${loans.length + 1}`,
      borrowerId: currentUser?.id || 'usr-guest',
      borrowerName: currentUser?.fullName || 'Mkopaji Mpya',
      borrowerPhone: currentUser?.phone || '+255712345678',
      borrowerNida: currentUser?.nidaNumber || '19950000000000000000',
      principalAmount: newLoanData.principalAmount,
      interestRate,
      durationMonths: newLoanData.durationMonths,
      purpose: newLoanData.purpose,
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
      totalInterest,
      processingFee,
      lawyerFeeRequired: newLoanData.lawyerFeeRequired,
      lawyerFeeAmount,
      totalRepayment,
      amountPaid: 0,
      guarantor: {
        id: `g-${Date.now()}`,
        fullName: newLoanData.guarantorName,
        phone: newLoanData.guarantorPhone,
        nidaNumber: newLoanData.guarantorNida,
        relationship: newLoanData.guarantorRelationship,
        workplace: 'Kazi Binafsi',
        status: 'PENDING',
      },
      borrowerSignature: newLoanData.borrowerSignature,
    };

    setLoans([newLoan, ...loans]);

    // Alert on new loan application
    addNotification(
      'NEW_LOAN_APPLICATION',
      'Ombi Jipya la Mkopo Limepokelewa',
      `Mkopaji ${newLoan.borrowerName} ametuma ombi jipya la mkopo #${newLoan.loanNumber} wa ${formatTzs(newLoan.principalAmount)}.`,
      newLoan.loanNumber,
      newLoan.principalAmount
    );
  };

  const handleEndorseGuarantee = (loanId: string, signatureImage: string) => {
    const targetLoan = loans.find((l) => l.id === loanId);
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? {
              ...l,
              guarantor: {
                ...l.guarantor,
                status: 'ENDORSED',
                endorsedAt: new Date().toISOString(),
                signatureImage,
              },
            }
          : l
      )
    );

    // Alert on guarantor endorsement
    addNotification(
      'GUARANTOR_ENDORSED',
      'Dhamana Imethibitishwa',
      `Mdhamini amethibitisha na kusaini dhamana ya mkopo #${targetLoan?.loanNumber || loanId}.`,
      targetLoan?.loanNumber
    );
  };

  const handleMakeRepayment = (loanId: string, amount: number, method: PaymentMethod, phone: string) => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return;

    const newAmountPaid = loan.amountPaid + amount;
    const isFullyPaid = newAmountPaid >= loan.totalRepayment;

    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? {
              ...l,
              amountPaid: newAmountPaid,
              status: isFullyPaid ? 'SETTLED' : l.status,
            }
          : l
      )
    );

    const ref = 'TZ' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      loanId,
      loanNumber: loan.loanNumber,
      borrowerName: loan.borrowerName,
      amount,
      paymentMethod: method,
      referenceNumber: ref,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED',
      phoneSender: phone,
    };

    setTransactions([newTx, ...transactions]);

    // Alert on repayment transaction
    addNotification(
      'REPAYMENT_RECEIVED',
      'Rejesho la Fedha Limepokelewa',
      `Rejesho la ${formatTzs(amount)} limepokelewa kupitia ${method} (Kumbukumbu: ${ref}) kwa mkopo #${loan.loanNumber}.`,
      loan.loanNumber,
      amount
    );
  };

  const handleSurveySubmit = (loanId: string, survey: LoanSatisfactionSurvey) => {
    const targetLoan = loans.find((l) => l.id === loanId);
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId ? { ...l, satisfactionSurvey: survey } : l
      )
    );

    addNotification(
      'REPAYMENT_RECEIVED',
      'Tathmini ya Mkopo Imepokelewa',
      `Asante kwa kutoa tathmini ya nyota ${survey.rating}/5 kwa mkopo #${targetLoan?.loanNumber || loanId}.`,
      targetLoan?.loanNumber
    );
  };

  const handleSendPaymentReminder = (
    loanId: string,
    channel: 'SMS' | 'PUSH' | 'BOTH',
    message: string
  ) => {
    const targetLoan = loans.find((l) => l.id === loanId);
    if (!targetLoan) return;

    addNotification(
      'PAYMENT_REMINDER',
      `Ukumbusho wa Malipo (${channel === 'BOTH' ? 'SMS + Push' : channel}): Mkopo #${targetLoan.loanNumber}`,
      message,
      targetLoan.loanNumber,
      targetLoan.totalRepayment - targetLoan.amountPaid
    );
  };

  // User Actions
  const handleApproveUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'APPROVED', isKycVerified: true } : u))
    );
  };

  const handleRejectUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'SUSPENDED' } : u))
    );
  };

  const handleRegisterSuccess = (newUser: User) => {
    setUsers([newUser, ...users]);
    setCurrentUser(newUser);
    setCurrentRole(newUser.role);
    setActiveView('DASHBOARD');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setActiveView('DASHBOARD');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('LANDING');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation with notification badge counter */}
      <Navbar
        currentUser={currentUser}
        currentRole={currentRole}
        notificationCount={notificationCount}
        notifications={notifications}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        onRoleChange={handleRoleChange}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        onLogout={handleLogout}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'LANDING' && (
          <LandingPage
            onStartDemo={() => {
              setActiveView('DASHBOARD');
              if (!currentUser) setCurrentUser(INITIAL_USERS[1]);
            }}
            onOpenRegister={() => setIsRegisterOpen(true)}
            onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
          />
        )}

        {activeView === 'CALCULATOR' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center space-y-1 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Kikokotoo cha Mikopo Tanzania
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kokotoa kiasi, riba, ada ya wakili, na ratiba ya marejesho kwa uwazi wa asilimia 100.
              </p>
            </div>
            <LoanCalculator
              onApplyWithCalculation={() => {
                if (currentUser && currentUser.role === 'BORROWER') {
                  setActiveView('DASHBOARD');
                } else {
                  setIsRegisterOpen(true);
                }
              }}
            />
          </div>
        )}

        {activeView === 'DASHBOARD' && (
          <div>
            {!currentUser ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Tafadhali Ingia Kwanza Kwenye Dashibodi
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                  Chagua kuingia kama Mkopeshaji, Mkopaji, Mdhamini, au Msimamizi Mkuu kuona mfumo unavyofanya kazi.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="py-2 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                  >
                    Fungua dirisha la kuingia
                  </button>
                  <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="py-2 px-5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition"
                  >
                    Jisajili Akaunti Mpya
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {currentRole === 'LENDER' && (
                  <LenderDashboard
                    currentUser={currentUser}
                    loans={loans}
                    notificationCount={notificationCount}
                    notifications={notifications}
                    onMarkNotificationsRead={handleMarkNotificationsRead}
                    onApproveLoan={handleApproveLoan}
                    onRejectLoan={handleRejectLoan}
                    onSendReminder={handleSendPaymentReminder}
                  />
                )}

                {currentRole === 'BORROWER' && (
                  <BorrowerDashboard
                    currentUser={currentUser}
                    loans={loans}
                    notificationCount={notificationCount}
                    notifications={notifications}
                    onMarkNotificationsRead={handleMarkNotificationsRead}
                    onRequestNewLoan={handleRequestNewLoan}
                    onMakeRepayment={handleMakeRepayment}
                    onSurveySubmitted={handleSurveySubmit}
                  />
                )}

                {currentRole === 'GUARANTOR' && (
                  <GuarantorDashboard
                    currentUser={currentUser}
                    loans={loans}
                    onEndorseGuarantee={handleEndorseGuarantee}
                  />
                )}

                {currentRole === 'ADMIN' && (
                  <AdminDashboard
                    users={users}
                    loans={loans}
                    transactions={transactions}
                    onApproveUser={handleApproveUser}
                    onRejectUser={handleRejectUser}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onOpenDiagnostics={() => setIsDiagnosticsOpen(true)} />

      {/* Modals */}
      <BackendDiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

