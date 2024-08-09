const mongoose = require("mongoose");

const ExtraLenderSchema = new mongoose.Schema({
  name: { type: String },
  deductions: { type: Number },
});

const CreditBureauSearchSchema = new mongoose.Schema({
  bureauName: { type: String, default: "" },
  bvnNo: { type: String, default: "" },
  reportType: { type: String, default: "" },
  reportReason: { type: String, default: "" },
  bureauDate: { type: String, default: "" },
  bureauSearchReport: { type: String, default: "" },
  isCreditBureauCheck: {
    type: Boolean,
    default: false,
  },
  creditBureauResult: {},
  updatedAt: Date, // Field to store the timestamp
});

const customerSchema = new mongoose.Schema(
  {
    bvnnumber: {
      type: String,
    },
    title: {
      type: String,
      default: "",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Loan'
    },
    firstname: String,
    lastname: String,
    email: { type: String, unique: true, required: true },
    phonenumber: String,
    dob: String,
    maritalstatus: String,
    noofdependent: String,
    educationlevel: String,
    howdidyouhearaboutus: String,
    houseaddress: String,
    stateofresidence: String,
    lga: String,
    stateoforigin: String,
    ippis: { type: String, default: "nill" },
    servicenumber: { type: String, default: "nill" },
    valididcard: String,
    idcardnotinclude: String,
    nkinfirstname: String,
    nkinlastname: String,
    nkinphonenumber: String,
    nkinrelationship: String,
    nkinresidentialaddress: String,
    gender: String,

    careertype: String,

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
    },
    employeraddress: String,
    employmentletter: String,
    employmentstartdate: String,
    netmonthlyincome: String,
    totalannualincome: String,
    officialemail: String,
    uploadpayslip: String,
    uploadbankstatement: String,

    salarybankname: String,
    salaryaccountnumber: String,
    sameasaboveaccount: String,
    bankcode: String,
    disbursementbankname: String,
    disbursementaccountnumber: String,
    hasloan: String,
    currentmonthlyplanrepaymentamount: String,
    estimatedmonthlylivingexpense: String,

    beneficiaryname: String,
    beneficiarybank: String,
    beneficiaryaccountnumber: String,
    liquidationbalance: String,

    guarantee: String,

    acceptterms: String,
    acceptpolicy: String,
    sharemyremita: Boolean,
    agreefullname: String,
    agreedate: String,
    signature: String,
    photocapture: String,
    

    username: { type: String, unique: true, required: true },
    password: String,
    confirmpassword: String,
    token: String,
    creditCheck: {
      assignment: {
        creditAnalyst: { type: String, default: "" },
        isCreditAnalystAssigned: {
          type: Boolean,
          default: false,
        },
        updatedAt: Date, // Field to store the timestamp
      },
      creditDbSearch: {
        searchType: { type: String, default: "" },
        searchBy: { type: String, default: "" },
        searchDate: { type: String, default: "" },
        remarks: { type: String, default: "" },
        dbSearchReport: { type: String, default: "" },
        isCreditDbCheck: {
          type: Boolean,
          default: false,
        },
        updatedAt: Date, // Field to store the timestamp
      },
      deductCheck: {
        searchByDeduct: { type: String, default: "" },
        searchDateDeduct: { type: String, default: "" },
        remarksDeduct: { type: String, default: "" },
        deductSearchReport: { type: String, default: "" },
        isDeductCheck: {
          type: Boolean,
          default: false,
        },
        updatedAt: Date, // Field to store the timestamp
      },
      creditBureauSearch: {
        type: [CreditBureauSearchSchema],
        default: [],
      },
      paySlipAnalysis: {
        netPay: { type: Number, default: 0 },
        extraLenders: {
          type: [ExtraLenderSchema],
          default: [],
        },
        numOfExtraLenders: {
          type: Number,
          default: 0,
        },
        monthlyLoanRepayment: { type: Number, default: 0 },
        dateOfBirth: { type: String, default: "" },
        dateOfAppointment: { type: String, default: "" },
        isApplicantCivilianPolice: {
          type: Boolean,
          default: false,
        },
        uploadPaySlip: { type: String, default: "" },
        benchmark: { type: Number },
        isPaySlipContainsMoreThenFiveLenders: {
          type: Boolean,
          default: false,
        },
        monthlyDeductionBelowPercentageBenchmark: {
          type: Boolean,
          default: false,
        },
        takeHomePayNotLessThanBenchmark: {
          type: Boolean,
          default: false,
        },
        takeHomePayNotLessThan20PercentGross: {
          type: Boolean,
          default: false,
        },
        netPayNotLessThanBenchmark: {
          type: Boolean,
          default: false,
        },
        updatedAt: Date, // Field to store the timestamp
      },
      decisionSummary: {
        customerTakeHomeAfterLoanApproval: { type: String, default: "" },
        customerHasGoodCreditHistory: {
          type: Boolean,
          default: false,
        },
        isCustomerOnSoftSuit: {
          type: Boolean,
          default: false,
        },
        isCustomerNextOfKinOk: {
          type: Boolean,
          default: false,
        },
        isCreditCheckOk: {
          type: Boolean,
          default: false,
        },
        isBvnCheckOk: {
          type: Boolean,
          default: false,
        },
        maxAmountLendable: Number,
        totalMonthlyDeductions: Number,
        disbursementInstruction: { type: String, default: "" },
        creditOfficerReview: { type: String, default: "" },
        creditOfficerApprovalStatus: {
          type: String,
          enum: ["approved", "declined", "pending"],
          default: "pending",
        },
        headOfCreditApprovalStatus: {
          type: String,
          enum: ["approved", "declined", "pending"],
          default: "pending",
        },
        cooApprovalStatus: {
          type: String,
          enum: ["approved", "declined", "pending"],
          default: "pending",
        },
        creditOfficerApprovedAt: Date, // Field to store the timestamp
      },
    },
    branch: {
      type: String,
      default: "head office",
    },
    kyc: {
      isFacialMatch: {
        type: Boolean,
        default: false,
      },
      isIdCardValid: {
        type: Boolean,
        default: false,
      },
      isPhotoCaptured: {
        type: Boolean,
        default: false,
      },
      isSignatureValid: {
        type: Boolean,
        default: false,
      },
      isOtherDocsValidated: {
        type: Boolean,
        default: false,
      },
      isKycApproved: {
        type: Boolean,
        default: false,
      },
      timestamps: {
        type: Date,
        default: Date.now,
      },
    },

    transactions: {
      type: Array,
      default: [],
    },
    myLoansBalance: {
      type: String,
      default: "0.00",
    },
    totalLoanBalance: {
      type: String,
      default: "0.00",
    },

    banking: {
      isAccountCreated: {
        type: Boolean,
        default: false,
      },
      accountDetails: {
        type: Object, // hold an object
        default: {}, //  default empty object
      },
    },
    remita: {
      isRemitaCheck: {
        type: Boolean,
        default: false,
      },
      remitaStatus: {
        type: String,
        default: "pending",
      },
      loanStatus: {
        type: String,
        default: "pending",
      },
      stopLoanStatus: {
        type: String,
        default: "new",
      },
      remitaDetails: {
        type: Object, // hold an object
        default: {}, //  default empty object
      },
      disbursementDetails: {
        type: Object, // hold an object
        default: {}, //  default empty object
      },
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
