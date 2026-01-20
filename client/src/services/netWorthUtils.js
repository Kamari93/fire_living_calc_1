import {
  computeNetWorth,
  computeAnnualSurplus,
  computeNetAnnual,
  resolveTargetNetWorth,
} from "./financeHelpers";
import { getConservativeAssumptions } from "./financeHelpers";

// export function generateNetWorthProjection({
//   startYear,
//   currentNetWorth,
//   annualSurplus,
//   returnRate,
//   endYear,
//   targetNetWorth,
// }) {
//   const data = [];
//   let netWorth = currentNetWorth;

//   for (let year = startYear; year <= endYear; year++) {
//     data.push({
//       year,
//       netWorth: Math.round(netWorth),
//     });

//     if (targetNetWorth && netWorth >= targetNetWorth) break;

//     netWorth = netWorth * (1 + returnRate) + annualSurplus;
//   }

//   return data;
// }

/**
 * Generates a net worth projection array for charting
 * Returns: [{ year, netWorth }, ...]
 */
export function generateNetWorthProjection({
  startYear,
  currentNetWorth,
  annualSurplus,
  returnRate,
  //   targetNetWorth,
  endYear,
}) {
  const projection = [];
  let netWorth = currentNetWorth;

  for (let year = startYear; year <= endYear; year++) {
    netWorth = netWorth * (1 + returnRate) + annualSurplus;
    projection.push({ year, netWorth });
    // if (netWorth >= targetNetWorth) break; // optional stop at target
    if (year === endYear) break;
  }

  return projection;
}

/**
 * Build net worth projections for charting from a scenario object.
 * Assumes FI years (estimated & realistic) are already calculated by backend.
 */
export function buildNetWorthProjectionsFromScenario(scenario) {
  if (!scenario) return { historical: [], estimated: [], realistic: [] };

  const currentYear = new Date().getFullYear();

  const netAnnual = computeNetAnnual(
    scenario.income?.takeHome,
    scenario.income?.additionalIncome
  );

  const annualSurplus = computeAnnualSurplus(
    netAnnual,
    scenario.income?.additionalIncome,
    scenario.expenses
  );

  const currentNetWorth = computeNetWorth(
    scenario.assets,
    scenario.liabilities
  );

  const targetNetWorth = resolveTargetNetWorth(scenario);

  // Base / conservative assumptions
  const baseReturn = (scenario.fireGoal?.investmentReturnRate ?? 7) / 100;
  const { adjustedSurplus, adjustedReturn } = getConservativeAssumptions({
    annualSurplus,
    returnRate: baseReturn,
  });

  const estimatedFIYear =
    scenario.fireGoal?.estimatedFIYear ?? currentYear + 40;
  const realisticFIYear =
    scenario.fireGoal?.realisticFIYear ?? currentYear + 45;

  const historical = (scenario.netWorthHistory || []).map((h) => ({
    year: h.year,
    netWorth: h.netWorth,
  }));

  return {
    // historical: scenario.netWorthHistory || [],
    historical,
    fiTarget: targetNetWorth,
    estimated: generateNetWorthProjection({
      startYear: currentYear,
      currentNetWorth,
      annualSurplus,
      returnRate: baseReturn,
      targetNetWorth,
      endYear: estimatedFIYear,
    }),

    realistic: generateNetWorthProjection({
      startYear: currentYear,
      currentNetWorth,
      annualSurplus: adjustedSurplus,
      returnRate: adjustedReturn,
      targetNetWorth,
      endYear: realisticFIYear,
    }),
  };
}

// This file defines a function to build net worth projections from a financial scenario.
// It uses helper functions to compute net worth, annual surplus, and generates projections for estimated and realistic scenarios.

// import {
//   computeNetWorth,
//   computeAnnualSurplus,
//   computeNetAnnual,
//   estimateFIYear,
//   resolveTargetNetWorth,
// } from "./financeHelpers";
// import { generateNetWorthProjection } from "./netWorthProjection";

// export function buildNetWorthProjectionsFromScenario(scenario) {
//   const currentYear = new Date().getFullYear();

//   const netAnnual = computeNetAnnual(
//     scenario.income?.takeHome,
//     scenario.income?.additionalIncome
//   );

//   const annualSurplus = computeAnnualSurplus(
//     netAnnual,
//     scenario.income?.additionalIncome,
//     scenario.expenses
//   );

//   const currentNetWorth = computeNetWorth(
//     scenario.assets,
//     scenario.liabilities
//   );

//   //   const returnRate = (scenario.fireGoal?.investmentReturnRate ?? 7) / 100;

//   const targetNetWorth = resolveTargetNetWorth(scenario);

//   const baseReturn = (scenario.fireGoal?.investmentReturnRate ?? 7) / 100;

//   const conservativeReturn = Math.max(baseReturn - 0.02, 0.01);

//   const estimatedFIYear =
//     scenario.fireGoal?.estimatedFIYear ??
//     estimateFIYear({
//       netWorth: currentNetWorth,
//       annualContribution: annualSurplus,
//       target: targetNetWorth,
//       annualReturn: baseReturn,
//       currentYear,
//     });

//   const realisticFIYear = estimateFIYear({
//     netWorth: currentNetWorth,
//     annualContribution: annualSurplus * 0.85,
//     target: targetNetWorth,
//     annualReturn: conservativeReturn,
//     currentYear,
//   });

//   return {
//     historical: scenario.netWorthHistory || [],
//     estimated: generateNetWorthProjection({
//       startYear: currentYear,
//       currentNetWorth,
//       annualSurplus,
//       returnRate: baseReturn,
//       targetNetWorth,
//       endYear: estimatedFIYear ?? currentYear + 40,
//     }),

//     realistic: generateNetWorthProjection({
//       startYear: currentYear,
//       currentNetWorth,
//       annualSurplus: annualSurplus * 0.85,
//       returnRate: conservativeReturn,
//       targetNetWorth,
//       endYear: realisticFIYear ?? currentYear + 45,
//     }),
//     // estimated: generateNetWorthProjection({
//     //   startYear: currentYear,
//     //   currentNetWorth,
//     //   annualSurplus,
//     //   returnRate,
//     //   targetNetWorth,
//     //   endYear: estimatedFIYear ?? currentYear + 40,
//     // }),
//   };
// }

// // This file defines a function to build net worth projections from a financial scenario.
// // It uses helper functions to compute net worth, annual surplus, and generates projections for estimated and realistic scenarios.

// // This file defines a function to build net worth projections from a financial scenario.
// // It uses helper functions to compute net worth, annual surplus, and generates projections for estimated and realistic scenarios.

// // export function buildNetWorthProjectionsFromScenario(scenario) {
// //   const currentYear = new Date().getFullYear();

// //   const netAnnual = computeNetAnnual(
// //     scenario.income?.takeHome,
// //     scenario.income?.additionalIncome
// //   );

// //   const annualSurplus = computeAnnualSurplus(
// //     netAnnual,
// //     scenario.income?.additionalIncome,
// //     scenario.expenses
// //   );

// //   const currentNetWorth = computeNetWorth(
// //     scenario.assets,
// //     scenario.liabilities
// //   );

// //   const estimatedEndYear =
// //     scenario.fireGoal?.estimatedFIYear ?? currentYear + 30;

// //   const realisticEndYear =
// //     scenario.fireGoal?.realisticFIYear ?? currentYear + 40;

// //   const returnRate = (scenario.fireGoal?.investmentReturnRate ?? 7) / 100;

// //   return {
// //     historical: scenario.netWorthHistory || [],
// //     estimated: generateNetWorthProjection({
// //       startYear: currentYear,
// //       currentNetWorth,
// //       annualSurplus,
// //       returnRate,
// //       endYear: estimatedEndYear,
// //     }),
// //     realistic: generateNetWorthProjection({
// //       startYear: currentYear,
// //       currentNetWorth,
// //       annualSurplus,
// //       returnRate,
// //       endYear: realisticEndYear,
// //     }),
// //   };
// // }
