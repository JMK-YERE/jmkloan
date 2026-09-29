/**
 * Calculates dynamic maximum eligible loan amount in TZS based on borrower's credit score (300 - 850 scale)
 * and repayment discipline compliant with Bank of Tanzania & Creditinfo standards.
 */
export interface CreditTierInfo {
  tierName: string;
  badgeColor: string;
  maxAmount: number;
  description: string;
  interestRateAdvantage: string;
}

export function getCreditTier(creditScore: number): CreditTierInfo {
  if (creditScore >= 780) {
    return {
      tierName: 'Daraja la Kwanza (Platinum / Bora Zaidi)',
      badgeColor: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
      maxAmount: 10000000,
      description: 'Historia bora kabisa ya marejesho bila kuchelewa.',
      interestRateAdvantage: 'Riba nafuu ya 7% kwa mwezi',
    };
  }
  if (creditScore >= 720) {
    return {
      tierName: 'Daraja la Dhahabu (Gold / Zuri Sana)',
      badgeColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200',
      maxAmount: 6500000,
      description: 'Uaminifu wa juu wa kifedha na marejesho thabiti.',
      interestRateAdvantage: 'Riba ya 8% kwa mwezi',
    };
  }
  if (creditScore >= 660) {
    return {
      tierName: 'Daraja la Fedha (Silver / Zuri)',
      badgeColor: 'text-blue-700 bg-blue-100 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
      maxAmount: 4000000,
      description: 'Uwezo mzuri wa marejesho na rekodi nzuri ya NIDA.',
      interestRateAdvantage: 'Riba ya kawaida ya 10% kwa mwezi',
    };
  }
  if (creditScore >= 580) {
    return {
      tierName: 'Daraja la Shaba (Bronze / Wastani)',
      badgeColor: 'text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
      maxAmount: 2000000,
      description: 'Uwezo wa wastani; mkopo mdogo unashauriwa kujenga alama.',
      interestRateAdvantage: 'Riba ya 12% kwa mwezi',
    };
  }
  return {
    tierName: 'Daraja la Mwanzo (Entry / Hatari ya Wastani)',
    badgeColor: 'text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
    maxAmount: 800000,
    description: 'Akaunti mpya; anza na kiwango kidogo ili kukuza uaminifu.',
    interestRateAdvantage: 'Riba ya 14% kwa mwezi',
  };
}

export function calculateMaxEligibleLoanAmount(creditScore: number): number {
  return getCreditTier(creditScore).maxAmount;
}
