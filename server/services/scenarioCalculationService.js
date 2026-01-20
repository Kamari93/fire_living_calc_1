// services/scenarioCalculationService.js

const {
  computeNetWorth,
  computeAnnualSurplus,
  computeNetAnnual,
  estimateFIYear,
  resolveTargetNetWorth,
} = require("../utils/financeHelpers"); // adjust path if needed

const { generateNetWorthProjection } = require("../utils/netWorthProjection");

function getRealisticSurplusFactor(baseReturn) {
  if (baseReturn >= 0.11) return 0.9; // optimistic markets
  if (baseReturn >= 0.09) return 0.875; // normal strong markets
  return 0.85; // conservative baseline
}

function calculateScenarioOutcome(scenario) {
  const currentYear = new Date().getFullYear();

  // --- Income & surplus ---
  const netAnnual = computeNetAnnual(
    scenario.income?.takeHome,
    scenario.income?.additionalIncome
  );

  const annualSurplus = computeAnnualSurplus(
    netAnnual,
    scenario.income?.additionalIncome,
    scenario.expenses
  );

  // --- Net worth ---
  const currentNetWorth = computeNetWorth(
    scenario.assets,
    scenario.liabilities
  );

  // --- Targets & returns ---
  const targetNetWorth = resolveTargetNetWorth(scenario);
  const baseReturn = (scenario.fireGoal?.investmentReturnRate ?? 7) / 100;
  const conservativeReturn = Math.max(baseReturn - 0.02, 0.01);

  // --- FI Years (AUTHORITATIVE) ---
  const estimatedFIYear = estimateFIYear({
    netWorth: currentNetWorth,
    annualContribution: annualSurplus,
    target: targetNetWorth,
    annualReturn: baseReturn,
    currentYear,
  });

  const realisticFIYear = estimateFIYear({
    netWorth: currentNetWorth,
    annualContribution: annualSurplus * 0.85,
    target: targetNetWorth,
    annualReturn: conservativeReturn,
    currentYear,
  });

  return {
    estimatedFIYear,
    realisticFIYear,
    assumptions: {
      baseReturn,
      conservativeReturn,
      annualSurplus,
    },
    projections: {
      estimated: generateNetWorthProjection({
        startYear: currentYear,
        currentNetWorth,
        annualSurplus,
        returnRate: baseReturn,
        targetNetWorth,
        endYear: estimatedFIYear ?? currentYear + 40,
      }),
      realistic: generateNetWorthProjection({
        startYear: currentYear,
        currentNetWorth,
        // annualSurplus: annualSurplus * 0.85,
        annualContribution:
          annualSurplus * getRealisticSurplusFactor(baseReturn),
        returnRate: conservativeReturn,
        targetNetWorth,
        endYear: realisticFIYear ?? currentYear + 45,
      }),
    },
  };
}

module.exports = {
  calculateScenarioOutcome,
};
// This file defines a service to calculate financial scenario outcomes.
