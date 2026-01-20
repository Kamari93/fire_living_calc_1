function generateNetWorthProjection({
  startYear,
  currentNetWorth,
  annualSurplus,
  returnRate,
  endYear,
  targetNetWorth,
}) {
  const data = [];
  let netWorth = currentNetWorth;

  for (let year = startYear; year <= endYear; year++) {
    data.push({
      year,
      netWorth: Math.round(netWorth),
    });

    if (targetNetWorth && netWorth >= targetNetWorth) break;

    netWorth = netWorth * (1 + returnRate) + annualSurplus;
  }

  return data;
}

module.exports = {
  generateNetWorthProjection,
};
