const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    loanstatus: {
      type: String,
      default: "with operations",
      enum: [
        "with operations",
        "with credit",
        "with coo",
        "unbooked",
        "booked",
        "completed",
      ],
    },
    bookingApproval: {
      type: Boolean,
      default: false,
    },
    accountOfficer: {
      type: String,
    },
    loanproduct: {
      type: String,
      required: true
    },
    disbursementstatus: {
      type: String,
      enum: ["approved", "pending", "disbursed", "stopped"],
      default: "pending",
    },
    deductions: String,
    loanamount: Number,
    monthlyrepayment: Number,
    buyoverloan: String,
    buyoverloanactivated: {
      type: Boolean,
      default: false,
    },
    numberofmonth: {
      type: Number,
      default: 0,
    },
    loantotalrepayment: String,
    loanpurpose: [String],
    otherpurpose: String,
  },
  { timestamps: true }
);

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
