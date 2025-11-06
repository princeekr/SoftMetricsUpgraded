/**
 * Calculates the Present Value of an Annuity Factor (PVAF).
 * @param rate - The discount rate per period (as a percentage, e.g., 5 for 5%).
 * @param periods - The number of periods.
 * @returns The calculated PVAF.
 */
export function calculateAnnuityFactor(rate: number, periods: number): number {
  if (rate <= 0 || periods <= 0) {
    return 0;
  }
  const r = rate / 100;
  const factor = (1 - Math.pow(1 + r, -periods)) / r;
  return factor;
}

/**
 * Calculates the Net Present Value (NPV).
 * @param rate - The discount rate (as a percentage, e.g., 5 for 5%).
 * @param initialInvestment - The initial investment (a positive number).
 * @param cashFlows - An array of cash flows for each period.
 * @returns The calculated NPV.
 */
export function calculateNPV(rate: number, initialInvestment: number, cashFlows: number[]): number {
  if (rate < 0) {
    return -initialInvestment;
  }
  const r = rate / 100;
  let npv = -initialInvestment;

  cashFlows.forEach((cf, index) => {
    const period = index + 1;
    npv += cf / Math.pow(1 + r, period);
  });

  return npv;
}

export type CocomoProjectType = 'Organic' | 'Semidetached' | 'Embedded';

const COCOMO_CONSTANTS = {
  Organic: { a: 2.4, b: 1.05, c: 2.5, d: 0.38 },
  Semidetached: { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
  Embedded: { a: 3.6, b: 1.20, c: 2.5, d: 0.32 },
};

/**
 * Calculates software development effort and time using the basic COCOMO model.
 * @param kloc - Kilo Lines of Code.
 * @param projectType - The type of the project (Organic, Semidetached, Embedded).
 * @returns An object containing the calculated effort (in Person-Months) and developmentTime (in Months).
 */
export function calculateCocomo(kloc: number, projectType: CocomoProjectType): { effort: number; developmentTime: number } {
  if (kloc <= 0) {
    return { effort: 0, developmentTime: 0 };
  }
  const constants = COCOMO_CONSTANTS[projectType];
  const effort = constants.a * Math.pow(kloc, constants.b);
  const developmentTime = constants.c * Math.pow(effort, constants.d);

  return { effort, developmentTime };
}

/**
 * Calculates the future value of an amount adjusted for inflation.
 * @param initialAmount - The starting amount of money.
 * @param annualRate - The average annual inflation rate (as a percentage, e.g., 3 for 3%).
 * @param years - The number of years to project forward.
 * @returns The adjusted amount needed to have the same purchasing power.
 */
export function calculateInflationAdjustment(initialAmount: number, annualRate: number, years: number): number {
  if (initialAmount < 0 || annualRate < 0 || years < 0) {
    return initialAmount;
  }
  const rate = annualRate / 100;
  return initialAmount * Math.pow(1 + rate, years);
}

/**
 * Calculates Indian Income Tax for AY 2025-26 (New Regime).
 * @param totalIncome - The total annual income.
 * @returns The total tax payable.
 */
export function calculateIndianIncomeTax(totalIncome: number): number {
  if (totalIncome <= 0) {
    return 0;
  }

  // Standard Deduction for salaried individuals
  const standardDeduction = 50000;
  let taxableIncome = Math.max(0, totalIncome - standardDeduction);

  // Tax Rebate under Section 87A
  if (taxableIncome <= 700000) {
    return 0;
  }

  let tax = 0;

  // Slab 1: Up to 3,00,000 - 0%
  // No tax

  // Slab 2: 3,00,001 to 6,00,000 - 5%
  if (taxableIncome > 300000) {
    const slabAmount = Math.min(taxableIncome, 600000) - 300000;
    tax += slabAmount * 0.05;
  }

  // Slab 3: 6,00,001 to 9,00,000 - 10%
  if (taxableIncome > 600000) {
    const slabAmount = Math.min(taxableIncome, 900000) - 600000;
    tax += slabAmount * 0.10;
  }

  // Slab 4: 9,00,001 to 12,00,000 - 15%
  if (taxableIncome > 900000) {
    const slabAmount = Math.min(taxableIncome, 1200000) - 900000;
    tax += slabAmount * 0.15;
  }

  // Slab 5: 12,00,001 to 15,00,000 - 20%
  if (taxableIncome > 1200000) {
    const slabAmount = Math.min(taxableIncome, 1500000) - 1200000;
    tax += slabAmount * 0.20;
  }

  // Slab 6: Above 15,00,000 - 30%
  if (taxableIncome > 1500000) {
    const slabAmount = taxableIncome - 1500000;
    tax += slabAmount * 0.30;
  }

  // Health and Education Cess - 4% on the calculated tax
  const cess = tax * 0.04;
  const totalTax = tax + cess;

  return totalTax;
}