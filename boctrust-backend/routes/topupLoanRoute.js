const express = require("express");
const router = express.Router();
const CustomerLoan = require("../models/Loan");
const Customer = require("../models/Customer");

// Submit Top-up Loan Request
router.post("/top-up-request", async (req, res) => {
    const { customerId, loanAmount, loanDuration, note } = req.body;

    try {
        // Find the customer by ID
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Fetch or derive the customer's interest rate
        const interestRate = parseFloat(customer.loanproduct.interestRate) || 0.1; // Default to 10% if not available

        // Calculate total repayment based on the interest rate
        const totalRepayment = loanAmount + loanAmount * interestRate;

        // Create a new loan with the calculated total repayment
        const newLoan = new CustomerLoan({
            customerId,
            customerName: `${customer.firstname} ${customer.lastname}`,
            customerAccounNo: customer.salaryaccountnumber,
            customerDisAccount: customer.disbursementaccountnumber,
            disbursementBank: customer.disbursementbankname,
            loanProduct: customer.loanproduct,
            loanDuration,
            loanAmount,
            totalRepayment, // Use the calculated total repayment
            currentBalance: loanAmount,
            totalBalance: totalRepayment, // Reflect total repayment here as well
            note,
            loanStatus: "Pending",
            isLoanApproved: false,
            isTopUpLoan: true,
        });

        // Save the new loan
        await newLoan.save();
        res.status(201).json({ message: "Top-up loan request submitted", loan: newLoan });
    } catch (error) {
        res.status(500).json({ message: "Error submitting loan request", error: error.message });
    }
});

module.exports = router;
