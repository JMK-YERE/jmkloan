import { Loan } from '../types';

export interface AmortizationRow {
  installmentNumber: number;
  dueDate: string;
  principalDue: number;
  interestDue: number;
  feesDue: number;
  totalDue: number;
  remainingBalance: number;
  status: 'PAID' | 'PARTIAL' | 'PENDING';
  cumulativePaidPortion: number;
}

/**
 * Calculates projected monthly amortization schedule based on loan principal, interest rate, duration, and fees.
 */
export function calculateAmortizationSchedule(loan: Loan): AmortizationRow[] {
  const duration = Math.max(1, loan.durationMonths || 1);
  const startDate = loan.approvedAt ? new Date(loan.approvedAt) : new Date(loan.requestedAt);

  const monthlyPrincipal = Math.floor(loan.principalAmount / duration);
  const monthlyInterest = Math.floor(loan.totalInterest / duration);
  const totalFees = (loan.processingFee || 0) + (loan.lawyerFeeRequired ? (loan.lawyerFeeAmount || 0) : 0);
  const monthlyFee = Math.floor(totalFees / duration);

  const rows: AmortizationRow[] = [];
  let remainingPrincipal = loan.principalAmount;
  let accumulatedDue = 0;

  for (let i = 1; i <= duration; i++) {
    // Add i months to start date
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + i);

    // Adjust last month rounding differences
    const principalForMonth = i === duration ? remainingPrincipal : monthlyPrincipal;
    const feeForMonth = i === duration ? totalFees - (monthlyFee * (duration - 1)) : monthlyFee;
    const interestForMonth = i === duration ? loan.totalInterest - (monthlyInterest * (duration - 1)) : monthlyInterest;

    const installmentTotal = principalForMonth + interestForMonth + feeForMonth;
    remainingPrincipal = Math.max(0, remainingPrincipal - principalForMonth);
    accumulatedDue += installmentTotal;

    // Determine status relative to loan.amountPaid
    let status: 'PAID' | 'PARTIAL' | 'PENDING' = 'PENDING';
    if (loan.amountPaid >= accumulatedDue) {
      status = 'PAID';
    } else if (loan.amountPaid > accumulatedDue - installmentTotal) {
      status = 'PARTIAL';
    }

    rows.push({
      installmentNumber: i,
      dueDate: d.toISOString(),
      principalDue: principalForMonth,
      interestDue: interestForMonth,
      feesDue: feeForMonth,
      totalDue: installmentTotal,
      remainingBalance: remainingPrincipal,
      status,
      cumulativePaidPortion: Math.min(installmentTotal, Math.max(0, loan.amountPaid - (accumulatedDue - installmentTotal))),
    });
  }

  return rows;
}
