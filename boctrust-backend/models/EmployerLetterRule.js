const mongoose = require("mongoose");

const EmployerLetterRuleSchema = mongoose.Schema(
  {
    ruleActive: {
      type: Boolean,
      defualt: true,
    },
    ruleTitle: {
      type: String,
      trim: true,
      required: true,
    },
    maximumTenure: {
      type: String,
      trim: true,
    },
    maximumAmount: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const EmployerLetterRule = mongoose.model(
  "EmployerLetterRule",
  EmployerLetterRuleSchema
);
module.exports = EmployerLetterRule;