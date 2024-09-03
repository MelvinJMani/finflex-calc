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
  SIP= 1,
  STEPUP_SIP = 2
}

export const getInvestmentType = (isSIP: boolean, isStepUpSIP: boolean) : InvestmentType => {
  let investmentType ;
  if(isSIP && !isStepUpSIP) {
    investmentType = InvestmentType.SIP;
  }else if(isSIP && isStepUpSIP){
      investmentType = InvestmentType.STEPUP_SIP;
  }else {
    investmentType = InvestmentType.LUMPSUM;
  }
  console.log(isSIP, isStepUpSIP, investmentType);
  return investmentType;
}

export const frequencyMap: { [key: string]: number } = {
  weekly: 52,
  monthly: 12,
  quarterly: 4,
  annually: 1,
};
//Result calculation functions
export const calculateTotalInvestment = (
  sipAmount: number,
  numberOfYears: number,
  sipFrequency: keyof typeof frequencyMap
): number => {
  const frequencyMultiplier = frequencyMap[sipFrequency];
  const totalInvestment = sipAmount * frequencyMultiplier * numberOfYears;
  return totalInvestment;
};

export const calculateTotalInvestmentWithStepUp = (
  sipAmount: number,
  numberOfYears: number,
  sipFrequency: keyof typeof frequencyMap,
  stepUpPercentage: number
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

export const formatRupeeAmount = (amount: number| string): string => {
  if(typeof amount === 'string'){
    amount = parseFloat(amount);
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};