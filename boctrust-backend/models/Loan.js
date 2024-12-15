const mongoose = require("mongoose");

const DisbursmentSchema = new mongoose.Schema({
  amount: Number,
  debitAccount: String,
  notes: String,
  creditAccountName: String,
});

const paymentRecordSchema = new mongoose.Schema({
  bankoneRecordId: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
});

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
        "declined",
      ],
    },
    bookingInitiated: {
      type: Boolean,
      default: false,
    },
    accountOfficer: {
      type: String,
    },
    loanAccountNumber: {
      type: String,
    },
    disbursementstatus: {
      type: String,
      enum: ["approved", "pending", "disbursed", "stopped"],
      default: "pending",
    },
    debursementDetails: {
      type: DisbursmentSchema,
    },
    deductions: String,
    loanamount: Number,
    monthlyrepayment: Number,
    buyoverloan: String,
    buyoverloanactivated: {
      type: Boolean,
      default: false,
    },
    loanproduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    numberofmonth: {
      type: Number,
      default: 0,
    },
    loantotalrepayment: String,
    loanpurpose: [String],
    otherpurpose: String,
    collateralDetails: String,
    collateralType: String,
    computationMode: {
      type: String,
      enum: ["0", "1"],
      default: "0",
    },
    interestAccrualCommencementDate: String,
    principalPaymentFrequency: {
      type: String,
      enum: ["0", "1", "2", "3", "4", "5"],
      default: "0",
    },
    interestPaymentFrequency: {
      type: String,
      enum: ["0", "1", "2", "3", "4", "5"],
      default: "0",
    },
    moratorium: String,
    paymentRecord: [paymentRecordSchema],
    // top up loan update here    
    isTopUpLoan: { type: Boolean, default: false },
    isTopUpLoanSent: { type: Boolean, default: false },
    currentLoanTerminationStatus: { type: String, enum: ["pending", "initiated", "completed"], default: "pending" },
  },
  { timestamps: true }
);

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
