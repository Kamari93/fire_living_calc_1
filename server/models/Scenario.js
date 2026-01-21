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

const ScenarioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // <-- updated property name
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // user: { type: String, required: true }, // Username or email for easy reference
  name: { type: String, required: true },
  title: { type: String }, // title of the scenario example "Retirement in 2030"
  location: {
    city: String,
    state: String,
    zip: String,
  },
  income: {
    grossAnnual: Number,
    filingStatus: { type: String, default: "" },
    dependents: { type: Number, default: 0 },
    netAnnual: Number,
    totalIncomeTax: Number, // new: total of federal+state+local (user-supplied)
    takeHome: Number, // new: gross - totalIncomeTax
    incomeSources: [IncomeSourceSchema], // Array of income sources
    additionalIncome: Number, // e.g., side hustles, investments
  },
  expenses: {
    rent: Number,
    groceries: Number,
    healthcare: Number,
    childcare: Number,
    transportation: Number,
    utilities: Number,
    discretionary: Number,
    // keep taxes object for backward compatibility (deprecated)
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
    investmentReturnRate: { type: Number, default: 0.07 },
    withdrawalRate: { type: Number, default: 0.04 },
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Scenario", ScenarioSchema);
// This model defines the structure of a financial scenario in MongoDB.
// It includes fields for user ID, title, location, income, expenses, assets, liabilities,
// savings rate, FIRE goal, and timestamps for creation and updates.
// The income and expenses fields are structured to allow for detailed tracking of various sources and types.
// The model supports multiple income sources and custom expenses, providing flexibility for users to define their financial
// situation.

// const mongoose = require("mongoose");

// const ScenarioSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   name: { type: String, required: true },
//   income: { type: Number, required: true },
//   expenses: { type: Number, required: true },
//   location: { type: String, required: true },
//   fireGoal: { type: Number, required: true },
//   assumptions: {
//     investmentReturn: { type: Number, default: 0.07 },
//     inflation: { type: Number, default: 0.02 },
//     withdrawalRate: { type: Number, default: 0.04 },
//   },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Scenario", ScenarioSchema);

// This model defines the structure of the Scenario document in MongoDB.
// It includes fields for user, name, income, expenses, location, fireGoal, assumptions, and createdAt timestamp.
// The user field is a reference to the User model, allowing us to associate scenarios with specific users.
// The assumptions field contains default values for investment return, inflation, and withdrawal rate, which can
// be adjusted based on user preferences or financial planning needs.
