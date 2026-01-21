const mongoose = require("mongoose");

const IncomeSourceSchema = new mongoose.Schema(
  {
    type: String, // "w2", "freelance", etc.
    amount: Number,
  },
  { _id: false } // Prevents creation of _id for each income source
);

const CustomExpenseSchema = new mongoose.Schema(
  {
    label: String,
    amount: Number,
  },
  { _id: false } // Prevents creation of _id for each custom expense
);

const ScenarioSnapshotSchema = new mongoose.Schema(
  {
    scenarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Scenario" },
    name: String,
    title: String,
    location: {
      city: String,
      state: String,
      zip: String,
    },
    income: {
      grossAnnual: Number,
      filingStatus: { type: String, default: "" },
      dependents: { type: Number, default: 0 },
      // netAnnual: Number,
      totalIncomeTax: Number, // new: total of federal+state+local (user-supplied)
      netAnnual: Number,
      takeHome: Number, // new: gross - totalIncomeTax
      incomeSources: [IncomeSourceSchema], // Array of income sources
      additionalIncome: Number,
    },
    expenses: {
      rent: Number,
      groceries: Number,
      healthcare: Number,
      childcare: Number,
      transportation: Number,
      utilities: Number,
      discretionary: Number,
      taxes: {
        federal: Number,
        state: Number,
        local: Number,
      },
      customExpenses: [CustomExpenseSchema], // Array of custom expenses
    },
    assets: {
      cash: Number,
      investments: Number,
      realEstate: Number,
      otherAssets: Number,
    },
    liabilities: {
      studentLoans: Number,
      mortgage: Number,
      carLoan: Number,
      creditCardDebt: Number,
      otherDebts: Number,
    },
    savingsRate: Number,
    fireGoal: {
      targetNetWorth: Number,
      estimatedFIYear: Number,
      realisticFIYear: Number,
      investmentReturnRate: Number,
      withdrawalRate: Number,
    },
    // NEW: store snapshots of net worth over time
    netWorthHistory: [
      {
        year: Number,
        netWorth: Number,
        annualExpenses: Number,
        annualSurplus: Number,
        recordedAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: Date,
    updatedAt: Date,
  },
  { _id: false }
);

const ScenarioComparisonSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  scenarioIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scenario" }], // for reference
  snapshots: [ScenarioSnapshotSchema], // for historical accuracy
  title: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ScenarioComparison", ScenarioComparisonSchema);
// This model defines the structure of scenario comparisons in MongoDB.
// It includes fields for user ID, scenario IDs, snapshots of scenarios,
// title, notes, and timestamps for creation and updates.
// The userId field references the User model, allowing us to associate comparisons with specific users.
// The scenarioIds field is an array of references to the Scenario model, which allows us to track multiple scenarios in a comparison.
// The snapshots field stores historical snapshots of scenarios, which can be useful for tracking changes over time.
// The title and notes fields allow for storing additional information about the comparison, such as a custom title or notes.
// The createdAt and updatedAt fields automatically record when the scenario was created and last updated,
// providing a historical context for each comparison.
// This model is useful for users who want to compare different financial scenarios,
// enabling them to analyze and make informed decisions about their financial planning.
