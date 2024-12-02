const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Loan = require("../models/Loan"); // Import Loan model
const {
  handleInterBankTransfer,
  getLoanAccountStatement,
} = require("../services/bankoneOperationsServices");
const { generateTransactionRef } = require("../utils/generateTransactionRef");
const Employer = require("../models/EmployersManager");
const { default: axios } = require("axios");
const CreditAnalysis = require("../models/CreditAnalysis");

// Submit Top-up Loan Request
router.post("/top-up-request", async (req, res) => {
    const { customerId, loanAmount, loanDuration, note } = req.body;
    try {
        // Find the customer by ID
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // find current loan product interest rate
        const product = await Product.findById(customer.loanproduct);

        // calculate new loan total repayment
        const interestRate = (loanAmount * product.interestRate * loanDuration) / 100;

        const totalRepayment = parseFloat(loanAmount) + interestRate;
      

        // calculate new monthly repayment amount to 2 decimal places
        const newMonthlyRepayment = parseFloat((totalRepayment / loanDuration).toFixed(2));

    const newLoan = await Loan.create({
      customer: customer._id,
      loanstatus: "with credit",
      loanproduct: customer.loanproduct,
      loanamount: loanAmount,
      monthlyrepayment: newMonthlyRepayment, // update
      numberofmonth: loanDuration,
      loantotalrepayment: totalRepayment, // update
      loanpurpose: customer.loanpurpose,
      deductions: customer.deductions,
      isTopUpLoan: true,
    });
    
    await CreditAnalysis.create({
      customer: customer._id,
      loan: newLoan._id,
    });

    return res
      .status(201)
      .json({ message: "Loan Application Submitted Successfully" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Add this endpoint to fetch all top-up loans
router.get("/top-up-loans", async (req, res) => {
    try {
        const topUpLoans = await Loan.find({ isTopUpLoan: true }).populate("customer");
        res.status(200).json(topUpLoans);
    } catch (error) {
        console.error("Error fetching top-up loans:", error);
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
