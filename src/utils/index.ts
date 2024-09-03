import data from '../data/list_of_calculators.json';

const BOOKMARK_KEY = 'finflex:favorites';

export const getCalculatorByName = (name: string) => {
  return data.find(calculator => calculator.link === name);
};

// Utility functions to manage favorites in localStorage
export const toggleFavorite = (name: string): boolean => {
  try {
    const favorites = getFavorites();

    if (favorites.includes(name)) {
      // Remove the name if it's already a favorite
      const updatedFavorites = favorites.filter(fav => fav !== name);
      saveFavorites(updatedFavorites);
      return true;
    } else {
      // Add the name if it's not already a favorite
      favorites.push(name);
      saveFavorites(favorites);
      return true;
    }
  } catch (error) {
    return false;
  }
};

export const isFavorite = (name: string): boolean => {
  const favorites = getFavorites();
  return favorites.includes(name);
};

// Helper functions

function getFavorites(): string[] {
  const storedFavorites = localStorage.getItem(BOOKMARK_KEY);
  return storedFavorites ? JSON.parse(storedFavorites) : [];
}

function saveFavorites(favorites: string[]): void {
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(favorites));
}

export enum InvestmentType {
  LUMPSUM = 0,
  SIP = 1,
  STEPUP_SIP = 2,
}

export const getInvestmentType = (
  isSIP: boolean,
  isStepUpSIP: boolean,
): InvestmentType => {
  let investmentType;
  if (isSIP && !isStepUpSIP) {
    investmentType = InvestmentType.SIP;
  } else if (isSIP && isStepUpSIP) {
    investmentType = InvestmentType.STEPUP_SIP;
  } else {
    investmentType = InvestmentType.LUMPSUM;
  }
  return investmentType;
};

export const frequencyMap: { [key: string]: number } = {
  weekly: 52,
  monthly: 12,
  quarterly: 4,
  annually: 1,
};
type Frequency = keyof typeof frequencyMap;

//Result calculation functions
export const calculateTotalInvestment = (
  sipAmount: number,
  numberOfYears: number,
  sipFrequency: keyof typeof frequencyMap,
): number => {
  const frequencyMultiplier = frequencyMap[sipFrequency];
  const totalInvestment = sipAmount * frequencyMultiplier * numberOfYears;
  return totalInvestment;
};

export const calculateTotalInvestmentWithStepUp = (
  sipAmount: number,
  numberOfYears: number,
  sipFrequency: keyof typeof frequencyMap,
  stepUpPercentage: number,
): number => {
  const frequencyMultiplier = frequencyMap[sipFrequency];
  let totalInvestment = 0;
  let currentSIPAmount = sipAmount;

  for (let i = 0; i < numberOfYears; i++) {
    totalInvestment += currentSIPAmount * frequencyMultiplier; // Add the annual contribution
    currentSIPAmount += (currentSIPAmount * stepUpPercentage) / 100; // Increase SIP amount by step-up percentage
  }

  return totalInvestment;
};

export const formatRupeeAmount = (amount: number | string): string => {
  if (typeof amount === 'string') {
    amount = parseFloat(amount);
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const calculateLumpsumReturnAmount = (
  principalAmount: number,
  timeFrame: number,
  expectedReturnRate: number,
): number => {
  // Compound interest formula: A = P(1 + r/n)^(nt)
  // Assuming compounding occurs annually (n=1)
  const totalAmount =
    principalAmount * Math.pow(1 + expectedReturnRate / 100, timeFrame);

  // Calculate the return amount minus the invested amount (total return - principal)
  const estimatedReturn = totalAmount - principalAmount;

  return Math.round(estimatedReturn);
};

export const calculateTax = (amount: number, taxPercentage: number): number => {
  // Calculate the tax amount
  const taxAmount = amount * (taxPercentage / 100);

  return Math.round(taxAmount);
};

export const calculateExpenseRatio = (
  finalValue: number,
  expenseRatioPercentage: number,
): number => {
  // Calculate the expense ratio amount
  const expenseAmount = finalValue * (expenseRatioPercentage / 100);

  return Math.round(expenseAmount);
};

export const adjustAmount = (
  amount: number,
  inflationRate: number,
  expenseRatioPercentage: number,
  taxPercentage: number,
): number => {
  // Calculate the expense ratio amount
  const expenseAmount = amount * (expenseRatioPercentage / 100);

  // Calculate the tax amount
  const taxAmount = amount * (taxPercentage / 100);

  // Subtract the expense and tax from the amount
  let adjustedAmount = amount - expenseAmount - taxAmount;

  // Adjust the remaining amount for inflation
  adjustedAmount = adjustedAmount * (1 - inflationRate / 100);

  return Math.round(adjustedAmount);
};

export const calculateSIPReturn = (
  sipAmount: number,
  timeFrame: number,
  expectedReturnRate: number,
  sipFrequency: Frequency
): number => {
  const frequencyMultiplier = frequencyMap[sipFrequency];
  const totalPeriods = timeFrame * frequencyMultiplier;
  const periodRate = expectedReturnRate / (100 * frequencyMultiplier);

  let totalReturn = 0;

  for (let i = 0; i < totalPeriods; i++) {
    // Calculate the future value of each SIP installment
    const futureValue = sipAmount * Math.pow(1 + periodRate, totalPeriods - i);
    totalReturn += futureValue;
  }

  // Subtract the total investment to get the estimated return
  const totalInvestment = sipAmount * totalPeriods;
  const estimatedReturn = totalReturn - totalInvestment;

  return Math.round(estimatedReturn);
};

export const calculateSIPReturnWithStepUp = (
  sipAmount: number,
  timeFrame: number,
  expectedReturnRate: number,
  sipFrequency: keyof typeof frequencyMap,
  stepUpPercentage: number
): number => {
  const frequencyMultiplier = frequencyMap[sipFrequency];
  const totalPeriods = timeFrame * frequencyMultiplier;
  const periodRate = expectedReturnRate / (100 * frequencyMultiplier);

  let totalReturn = 0;
  let currentSIPAmount = sipAmount;

  for (let i = 0; i < totalPeriods; i++) {
    // Calculate the future value of each SIP installment
    const futureValue = currentSIPAmount * Math.pow(1 + periodRate, totalPeriods - i);
    totalReturn += futureValue;

    // Apply step-up at the start of each year (after 12 contributions)
    if ((i + 1) % frequencyMultiplier === 0) {
      currentSIPAmount += (currentSIPAmount * stepUpPercentage) / 100;
    }
  }

  // Total investment calculation should include the correct SIP amounts after step-ups
  const totalInvestment = calculateTotalInvestmentWithStepUp(sipAmount, timeFrame, sipFrequency, stepUpPercentage);
  currentSIPAmount = sipAmount;

  for (let i = 0; i < timeFrame; i++) {
    currentSIPAmount += (currentSIPAmount * stepUpPercentage) / 100;
  }

  const estimatedReturn = totalReturn - totalInvestment;
  
  return Math.round(estimatedReturn);
};
