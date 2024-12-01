const express = require("express");
const router = express.Router();
const CustomerLoan = require("../models/Loan");
const Customer = require("../models/Customer");

// Submit Top-up Loan Request
router.post("/top-up-request", async (req, res) => {
    const { customerId, loanAmount, loanDuration, note } = req.body;

    try {
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const newLoan = new CustomerLoan({
            customerId,
            customerName: `${customer.firstname} ${customer.lastname}`,
            customerAccounNo: customer.salaryaccountnumber,
            customerDisAccount: customer.disbursementaccountnumber,
            disbursementBank: customer.disbursementbankname,
            loanProduct: customer.loanproduct,
            loanDuration,
            loanAmount,
            totalRepayment: loanAmount * 1.1, // Example calculation
            currentBalance: loanAmount,
            totalBalance: loanAmount * 1.1,
            note,
            loanStatus: "Pending",
            isLoanApproved: false,
            isTopUpLoan: true
        });

        await newLoan.save();
        res.status(201).json({ message: "Top-up loan request submitted", loan: newLoan });
    } catch (error) {
        res.status(500).json({ message: "Error submitting loan request", error: error.message });
    }
});

module.exports = router;
