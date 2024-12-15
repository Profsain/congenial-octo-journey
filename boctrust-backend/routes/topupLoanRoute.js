    // top up loan update here 
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
    
    // endpoint to fetch all top-up loans
    router.get("/top-up-loans", async (req, res) => {
        try {
            const topUpLoans = await Loan.find({ isTopUpLoan: true }).populate("customer");
            res.status(200).json(topUpLoans);
        } catch (error) {
            console.error("Error fetching top-up loans:", error);
            res.status(500).json({ error: error.message });
        }
    });
    
    // update isTopUpLoanSent status
    router.put("/update-top-up-loan-status/:id", async (req, res) => {
        const { id } = req.params;
        try {
          const loan = await Loan.findById(id);
          if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
          }
          loan.isTopUpLoanSent = true;
          await loan.save();
          return res.status(200).json({ message: "Loan status updated successfully" });
        } catch (error) {
          console.error("Error updating loan status:", error);
          return res.status(500).json({ error: error.message });
      }
    });
    
    // endpoint to fetch customer existing loans
    router.get("/existing-loans/:customerId", async (req, res) => {
        const { customerId } = req.params;
        try {
            const loans = await Loan.find({ customer: customerId });
            res.status(200).json(loans);
        } catch (error) {
            console.error("Error fetching customer loans:", error);
            res.status(500).json({ error: error.message });
        }
    });
    
    // Terminate existing loan and add outstanding balance to a pending top-up loan
    router.put("/terminate-and-add-balance/:customerId", async (req, res) => {
      const { customerId } = req.params;
    
      try {
        // Find the customer by ID
        const customer = await Customer.findById(customerId);
    
        if (!customer) {
          return res.status(404).json({ error: "Customer not found." });
        }
    
        // Check if the customer has an active loan
        const existingLoan = await Loan.findOne({
          customer: customerId,
          loanstatus: { $in: ["completed"] },
          disbursementstatus: { $in: ["approved"] },
        });
    
        if (!existingLoan) {
          return res
            .status(404)
            .json({ error: "No active loan found for this customer." });
        }
    
        // Check if the customer has a pending top-up loan
        const topUpLoan = await Loan.findOne({
          customer: customerId,
          loanstatus: "booked",
          isTopUpLoan: true,
        });
    
        if (!topUpLoan) {
          return res.status(404).json({
            error: "No pending top-up loan found for this customer.",
          });
        }
    
        // Parse outstanding balance from the customer's current loan
        const outstandingBalance = parseFloat(customer.totalLoanBalance || "0");
    
        // Update the existing loan to "terminated/completed"
        existingLoan.loanstatus = "terminated";
        existingLoan.currentLoanTerminationStatus = "completed";
        await existingLoan.save();
    
        // Update the customer's loan balance to 0
        customer.totalLoanBalance = "0.00";
        await customer.save();
    
        // Add the outstanding balance to the top-up loan
        topUpLoan.loantotalrepayment += outstandingBalance;
    
        // topUpLoan.loantotalrepayment = topUpLoan.loanamount * (1 + 0.1); // Add 10% interest (example calculation)
        await topUpLoan.save();
    
        return res.status(200).json({
          message: "Loan terminated and balance added to top-up loan successfully.",
          terminatedLoan: existingLoan,
          updatedTopUpLoan: topUpLoan,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing the request." });
      }
    });
    
    // Update currentLoanTerminationStatus for a top-up loan
    router.put("/start-termination/:loanId", async (req, res) => {
      const { loanId } = req.params;
      const { currentLoanTerminationStatus } = req.body;
    
      // Validate input
      if (!currentLoanTerminationStatus) {
        return res.status(400).json({ error: "Termination status is required." });
      }
    
      const validStatuses = ["pending", "initiated", "completed"];
      if (!validStatuses.includes(currentLoanTerminationStatus)) {
        return res
          .status(400)
          .json({ error: "Invalid termination status. Must be 'pending', 'initiated', or 'completed'." });
      }
    
      try {
        // Find the loan by ID and ensure it is a top-up loan
        const loan = await Loan.findById(loanId);
    
        if (!loan) {
          return res.status(404).json({ error: "Loan not found." });
        }
    
        if (!loan.isTopUpLoan) {
          return res
            .status(400)
            .json({ error: "The specified loan is not a top-up loan." });
        }
    
        // Update the currentLoanTerminationStatus
        loan.currentLoanTerminationStatus = currentLoanTerminationStatus;
        await loan.save();
    
        return res.status(200).json({
          message: "Termination status updated successfully.",
          loan,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while updating the termination status." });
      }
    });
    
    module.exports = router;