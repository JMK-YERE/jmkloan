export type Role = 'LENDER' | 'BORROWER' | 'GUARANTOR' | 'ADMIN';

export type LoanStatus = 'PENDING' | 'GUARANTOR_APPROVED' | 'APPROVED' | 'DISBURSED' | 'REPAYING' | 'SETTLED' | 'DEFAULTED' | 'REJECTED';

export type PaymentMethod = 'MPESA' | 'TIGO_PESA' | 'AIRTEL_MONEY' | 'HALOPESA' | 'BANK_TRANSFER' | 'CASH';

export interface KycVerificationMetadata {
  nidaCardPhotoBase64?: string;
  capturedAt?: string;
  verificationMethod?: 'CAMERA_CAPTURE' | 'FILE_UPLOAD';
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nidaNumber: string;
  role: Role;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'SUSPENDED';
  avatarUrl?: string;
  location?: string;
  occupation?: string;
  monthlyIncome?: number;
  creditScore: number; // 300 - 850
  maxEligibleLoanAmount?: number; // Dynamic limit based on credit score
  registeredAt: string;
  isKycVerified: boolean;
  nidaCardPhotoBase64?: string;
  kycMetadata?: KycVerificationMetadata;
}

export interface Guarantor {
  id: string;
  fullName: string;
  phone: string;
  nidaNumber: string;
  relationship: string;
  workplace: string;
  signatureImage?: string;
  status: 'PENDING' | 'ENDORSED' | 'DECLINED';
  endorsedAt?: string;
}

export interface LoanSatisfactionSurvey {
  rating: number; // 1 - 5 stars
  easeOfApplication?: number; // 1 - 5
  transparencyRating?: number; // 1 - 5
  customerServiceRating?: number; // 1 - 5
  recommendLikelihood: 'DEFINITELY' | 'MAYBE' | 'UNLIKELY';
  feedbackComment?: string;
  submittedAt: string;
}

export interface Loan {
  id: string;
  loanNumber: string;
  borrowerId: string;
  borrowerName: string;
  borrowerPhone: string;
  borrowerNida: string;
  lenderId?: string;
  lenderName?: string;
  principalAmount: number; // in TZS
  interestRate: number; // % per month or term
  durationMonths: number;
  purpose: string;
  status: LoanStatus;
  requestedAt: string;
  approvedAt?: string;
  dueDate?: string;
  totalInterest: number;
  processingFee: number;
  lawyerFeeRequired: boolean;
  lawyerFeeAmount: number;
  totalRepayment: number;
  amountPaid: number;
  guarantor: Guarantor;
  borrowerSignature?: string;
  lenderSignature?: string;
  contractPdfGenerated?: boolean;
  satisfactionSurvey?: LoanSatisfactionSurvey;
}

export interface RepaymentInstallment {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: string;
  principal: number;
  interest: number;
  totalDue: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  paidDate?: string;
  receiptNumber?: string;
}

export interface PaymentTransaction {
  id: string;
  loanId: string;
  loanNumber: string;
  borrowerName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  phoneSender: string;
}

export type NotificationType = 'NEW_LOAN_APPLICATION' | 'LOAN_APPROVED' | 'REPAYMENT_RECEIVED' | 'GUARANTOR_ENDORSED' | 'PAYMENT_REMINDER';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  loanNumber?: string;
  amount?: number;
  channel?: 'SMS' | 'PUSH' | 'BOTH';
  recipientPhone?: string;
}
