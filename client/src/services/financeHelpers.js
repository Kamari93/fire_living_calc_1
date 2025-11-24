export function toNumber(v) {
  if (v === undefined || v === null || v === "") return 0;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function sumExpenses(expenses = {}) {
  let total = 0;
  const keys = [
    "rent",
    "groceries",
    "healthcare",
    "childcare",
    "transportation",
    "utilities",
    "discretionary",
  ];
  keys.forEach((k) => (total += toNumber(expenses[k])));
  if (Array.isArray(expenses.customExpenses)) {
    total += expenses.customExpenses.reduce(
      (s, e) => s + toNumber(e?.amount),
      0
    );
  }
  // include legacy taxes if present? usually taxes are not expense here
  return total;
}

export function sumAssets(assets = {}) {
  return (
    toNumber(assets.cash) +
    toNumber(assets.investments) +
    toNumber(assets.realEstate) +
    toNumber(assets.otherAssets)
  );
}

export function sumLiabilities(liabilities = {}) {
  return (
    toNumber(liabilities.studentLoans) +
    toNumber(liabilities.mortgage) +
    toNumber(liabilities.carLoan) +
    toNumber(liabilities.creditCardDebt) +
    toNumber(liabilities.otherDebts)
  );
}

export function computeNetWorth(assets = {}, liabilities = {}) {
  return sumAssets(assets) - sumLiabilities(liabilities);
}

export function computeAnnualSurplus(
  netAnnual = 0,
  additionalIncome = 0,
  expenses = {}
) {
  // netAnnual is expected to be takeHome + additionalIncome if available.
  // Use netAnnual if present; otherwise fallback to additionalIncome (rare).
  const net = toNumber(netAnnual);
  const add = toNumber(additionalIncome);
  const totalExp = sumExpenses(expenses);
  // const totalAnnualExp = monthlyToAnnual(totalExp);
  const base = net !== 0 ? net : add;
  return base - totalExp;
  // return base - totalAnnualExp;
}

export function computeAnnualSurplusViewCard(
  netAnnual = 0,
  additionalIncome = 0,
  expenses = {}
) {
  // netAnnual is expected to be takeHome + additionalIncome if available.
  // Use netAnnual if present; otherwise fallback to additionalIncome (rare).
  const net = toNumber(netAnnual);
  const add = toNumber(additionalIncome);
  const totalExp = sumExpenses(expenses);
  const totalAnnualExp = monthlyToAnnual(totalExp);
  const base = net !== 0 ? net : add;
  return base - totalAnnualExp;
}

// export function computeComprehensivePosition(
//   assets = {},
//   liabilities = {},
//   netAnnual = 0,
//   additionalIncome = 0,
//   expenses = {}
// ) {
//   const netWorth = computeNetWorth(assets, liabilities);
//   const annualSurplus = computeAnnualSurplus(
//     netAnnual,
//     additionalIncome,
//     expenses
//   );
//   return {
//     netWorth,
//     annualSurplus,
//     comprehensive: netWorth + annualSurplus, // recommended metric
//   };
// }

export function computeComprehensivePosition(netWorth = 0, annualSurplus = 0) {
  netWorth = toNumber(netWorth);
  annualSurplus = toNumber(annualSurplus);
  return netWorth + annualSurplus;
}

// function that calculates net annual plus additonal income
export function computeNetAnnual(netAnnual = 0, additionalIncome = 0) {
  return toNumber(netAnnual) + toNumber(additionalIncome);
}

// Optional: compute user's original metric corrected to subtract expenses and liabilities
export function computeRequestedMetric(
  netAnnual = 0,
  additionalIncome = 0,
  liabilities = {},
  expenses = {}
) {
  // interprets "Total Current Net = netAnnual + additionalIncome - liabilities - expenses"
  const net = toNumber(netAnnual);
  const add = toNumber(additionalIncome);
  const liab = sumLiabilities(liabilities);
  const exp = sumExpenses(expenses);
  return net + add - liab - exp;
}

export function monthlyToAnnual(exp) {
  return toNumber(exp) * 12;
}

export function annualToMonthly(exp) {
  return toNumber(exp) / 12;
}

export function formatNumber(num) {
  return `$${num.toLocaleString()}`;
}

// format number short (e.g., 1500000 -> $1.5M)
export function formatNumberShort(num) {
  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(1)}B`;
  } else if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(1)}M`;
  } else if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(1)}K`;
  } else {
    return `$${num}`;
  }
}

// format number short no decimals (e.g., 1500000 -> $1M)
export function formatNumberShortNoDecimals(num) {
  if (num >= 1_000_000_000) {
    return `$${Math.round(num / 1_000_000_000)}B`;
  } else if (num >= 1_000_000) {
    return `$${Math.round(num / 1_000_000)}M`;
  } else if (num >= 1_000) {
    return `$${Math.round(num / 1_000)}K`;
  } else {
    return `$${num}`;
  }
}

// Estimate years to reach target net worth given current net worth, annual contributions, and annual return rate
export function estimateYearsToTarget({
  netWorth = 0,
  annualContribution = 0,
  target = 0,
  annualReturn = 0.07,
}) {
  const W = toNumber(netWorth);
  const C = toNumber(annualContribution);
  const T = toNumber(target);
  const r = Number(annualReturn) || 0;

  if (T <= W) return 0; // already at/above target
  if (C <= 0 && r <= 0) return Infinity; // no growth or contributions
  // r === 0: linear growth
  if (r === 0) {
    if (C <= 0) return Infinity;
    return (T - W) / C;
  }

  // Use closed-form: A = (T + C/r) / (W + C/r); t = ln(A) / ln(1+r)
  const denom = W + C / r;
  if (denom <= 0) return Infinity;
  const A = (T + C / r) / denom; // A is ratio of future to present value
  if (A <= 0) return Infinity;
  const t = Math.log(A) / Math.log(1 + r); // years
  if (!Number.isFinite(t) || t < 0) return Infinity;
  return t;
}

export function estimateFIYear({
  netWorth = 0,
  annualContribution = 0,
  target = 0,
  annualReturn = 0.07,
  currentYear = new Date().getFullYear(),
}) {
  const years = estimateYearsToTarget({
    netWorth,
    annualContribution,
    target,
    annualReturn,
  });
  if (!Number.isFinite(years)) return null;
  return Math.ceil(currentYear + years);
}
