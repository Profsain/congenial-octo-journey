const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
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
