/**
 * Format credits (in cents) as dollar amount
 * @param credits - Credits in cents
 * @returns Formatted dollar string
 */
export function formatCreditsAsDollars(credits: number): string {
  const dollars = credits / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollars);
}

/**
 * Convert dollars to credits (cents)
 * @param dollars - Dollar amount
 * @returns Credits in cents
 */
export function dollarsToCredits(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Convert credits to dollars
 * @param credits - Credits in cents
 * @returns Dollar amount
 */
export function creditsToDollars(credits: number): number {
  return credits / 100;
}