const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const CustomerModel = require("../models/Customer"); // Import customer model
const Loan = require("../models/Loan");
// configure dotenv
dotenv.config();

// Read all customer
const baseUrl = process.env.BASE_URL;

// Get Customer and His Loan with KYC
router.get("/", async (_, res) => {
  try {
    let customers = await CustomerModel.find().populate("employer");
    const customerIds = customers.map((customer) => customer._id);

    let customersAndLoans = await Loan.find({
      customer: { $in: customerIds },
    });

    let result = customers.map((customer) => {
      const loan = customersAndLoans.find(
        (loan) => loan.customer.toString() === customer._id.toString()
      );

      return {
        ...customer.toJSON(),
        loan: loan
          ? {
              ...loan.toJSON(),
            }
          : null,
      };
    });

    result = result.map((customer) => {
      return {
        ...customer,
        valididcard: `${baseUrl}/public/filesUpload/${customer.valididcard}`,
        uploadpayslip: `${baseUrl}/public/filesUpload/${customer.uploadpayslip}`,
        uploadbankstatement: `${baseUrl}/public/filesUpload/${customer.uploadbankstatement}`,
        signature: `${baseUrl}/public/filesUpload/${customer.signature}`,
        employmentletter: `${baseUrl}/public/filesUpload/${customer.employmentletter}`,
        photocaptureImg: `${baseUrl}/public/filesUpload/${customer.photocapture}`,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to fetch customer" });
  }
});

module.exports = router;
