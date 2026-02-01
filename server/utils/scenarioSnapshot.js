function buildScenarioSnapshot(scenario) {
  const obj = scenario.toObject ? scenario.toObject() : scenario;

  return {
    scenarioId: obj._id,
    name: obj.name,
    title: obj.title,
    location: obj.location,
    income: obj.income,
    expenses: obj.expenses,
    assets: obj.assets,
    liabilities: obj.liabilities,
    savingsRate: obj.savingsRate,
    fireGoal: obj.fireGoal,
    netWorthHistory: obj.netWorthHistory,
    createdAt: obj.createdAt,
    updatedAt: new Date(),
  };
}

module.exports = { buildScenarioSnapshot };

//mirrors scenario snapshot schema..to properly update scenario snapshot when scenairio is updated
