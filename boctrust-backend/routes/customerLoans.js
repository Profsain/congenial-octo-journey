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
router.get("/", async (req, res) => {
  try {
    const { search, dateFilter, sort="latest" } = req.query;

    let queryObject = {};

    if (search) {
      const stringSearchFields = ["firstname", "lastname", "username", "email"];

      const query = {
        $or: [
          ...stringSearchFields.map((field) => ({
            [field]: new RegExp("^" + search, "i"),
          })),
        ],
      };
      queryObject = { ...queryObject, ...query };
    }

    if (dateFilter) {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      const query = {
        createdAt: {
          $gte: startOfToday,
          $lt: endOfToday,
        },
      };
      queryObject = { ...queryObject, ...query };
    }

    

    let customerCollection =  CustomerModel.find(queryObject).populate("employer");

    if (sort === "latest") {
      customerCollection = customerCollection.sort("-kyc.timestamps");
    }
    if (sort === "oldest") {
      customerCollection = customerCollection.sort("kyc.timestamps");
    }

    let customers = await customerCollection

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
