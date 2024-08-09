const express = require("express");
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

const Loan = require("../models/Loan"); // Import Loan model
const Customer = require("../models/Customer");

require('dotenv').config();

// Parse JSON string from .env
const bankoneConfig = JSON.parse(process.env.BANKONE_API_CONFIG);

// Get all loan products using bankone
router.get('/all-loan-products', async (req, res) => {
  try {
    const response = await axios.get(`${bankoneConfig.baseURL}${bankoneConfig.endpoints.getProducts}`, {
      params: {
        authToken: bankoneConfig.authToken,
        mfbCode: bankoneConfig.mfbCode,
      },
    });

    const allLoanProducts = response.data;

    return res.status(200).json(allLoanProducts);
  } catch (error) {
    console.error("Error fetching loan products from BankOne:", error.response.data);

    return res.status(500).json({ error: "Failed to fetch loan products" });
  }
});

// Get all loan account officers endpoint
router.get('/account-officers', async (req, res) => {
  try {
    const response = await axios.get(`${bankoneConfig.baseURL}${bankoneConfig.endpoints.getAccountOfficers}`, {
      params: {
        authToken: bankoneConfig.authToken,
        mfbCode: bankoneConfig.mfbCode,
      },
    });

    const allAcountOfficers = response.data;

    return res.status(200).json(allAcountOfficers);
  } catch (error) {
    console.error("Error fetching all account officers from BankOne:", error.response.data);

    return res.status(500).json({ error: "Failed to fetch account officers" });
  }
});

// Endpoint to Approve Booked loans by COO
router.post("/approve-book/:loanId", async (req, res) => {
  const { loanId } = req.params;
  const { 
    bvn,
    productCode,
    notificationPreference,
    transactionPermission,
    accountTier,
    customerImage,
    customerSignature,
    identificationImage
  } = req.body;

  console.log(req.body);
  
  // Enhanced logging for debugging
  console.log(`Received loanId: ${loanId}`);

  try {
    // const objectIdLoanId = ObjectId(loanId);

    // Find the loan by ID (string) and update bookingApproval
    const loan = await Loan.findByIdAndUpdate(
      loanId, 
      { bookingApproval: true },
      { new: true } // Return the updated document
    );

    if (!loan) {
      console.error(`Loan not found with ID: ${loanId}`);
      return res.status(404).json({ error: "Loan not found" });
    }

    const customerId = loan.customerId;

    // Enhanced logging for debugging
    console.log(`Customer ID associated with loan: ${customerId}`);

    const customer = await Customer.findById(customerId);

    if (!customer) {
      console.error(`Customer not found with ID: ${customerId}`);
      return res.status(404).json({ error: "Customer not found" });
    }

    // Additional checks for required fields
    if (!bvn || !productCode) {
      return res.status(400).json({ error: "BVN and ProductCode are required" });
    }

    console.log(`Customer found: ${customer._id}`);

    const options = {
      method: "POST",
      headers: {
        authToken: bankoneConfig.authToken,
        mfbCode: bankoneConfig.mfbCode,
      },
      body: JSON.stringify({
        TransactionTrackingRef: customer._id,
        AccountOpeningTrackingRef: customer._id,
        ProductCode: productCode,
        LastName: customer.lastname,
        OtherNames: customer.firstname,
        BVN: bvn,
        PhoneNo: customer.phonenumber,
        Gender: customer.gender,
        PlaceOfBirth: customer.stateoforigin,
        DateOfBirth: customer.dob,
        Address: customer.houseaddress,
        NextOfKinPhoneNo: customer.nkinphonenumber,
        NextOfKinName: `${customer.nkinfirstname} ${customer.nkinlastname}`,
        HasSufficientInfoOnAccountInfo: true,
        Email: customer.email,
        NotificationPreference: notificationPreference,
        TransactionPermission: transactionPermission,
        AccountTier: accountTier,
        CustomerImage: customerImage,
        CustomerSignature: customerSignature,
        IdentificationImage: identificationImage,
      }),
    };

    const response = await fetch(`${bankoneConfig.baseURL}${bankoneConfig.endpoints.createCustomerAndAccount}`, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    console.error(err);

    if (err.message.includes("Network response was not ok")) {
      return res.status(502).json({ error: "Bad Gateway: Failed to communicate with BankOne API" });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all loan
router.get("/", async (req, res) => {
  try {
    const loans = await Loan.find({
      loanstatus: { $ne: "with operations" },
    })
      .populate("customer")
      .populate("loanproduct");
    return res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all pending laons loan
router.get("/pending", async (req, res) => {
  try {
    const loans = await Loan.find({
      loanstatus: { $in: ["with credit", "with coo"] },
    })
      .populate("customer")
      .populate("loanproduct");
    return res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all pending laons loan
router.get("/pending", async (req, res) => {
  try {
    const loans = await Loan.find({
      loanstatus: { $in: ["with credit", "with coo"] },
    })
      .populate("customer")
      .populate("loanproduct");
    return res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all both booked and Unbooked laons
router.get("/booked-or-unbooked", async (req, res) => {
  try {
    const loans = await Loan.find({
      loanstatus: { $in: ["unbooked", "booked"] },
    })
      .populate("customer")
      .populate("loanproduct");
    return res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all Booked and Disbursed laons loan
router.get("/booked-or-disbursed", async (req, res) => {
  try {
    const loans = await Loan.find({
      loanstatus: { $in: ["booked", "completed"] },
    })
      .populate("customer")
      .populate("loanproduct");
    return res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Create new loan
router.post("/", async (req, res) => {
  try {
    const newLoanData = req.body;
    const newLoan = await Loan.create(newLoanData);
    return res
      .status(201)
      .json({ success: "Loan created successfully", loan: newLoan });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update loan
router.put("/{id}", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedLoan = await Loan.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedLoan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    return res
      .status(200)
      .json({ success: "Loan updated successfully", loan: updatedLoan });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update loan
router.put("/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { loanstatus } = req.body;

    const updatedLoan = await Loan.findByIdAndUpdate(
      id,
      {
        loanstatus,
      },
      {
        new: true,
      }
    );

    if (!updatedLoan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    return res
      .status(200)
      .json({ success: "Loan Status updated successfully", loan: updatedLoan });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

// Delete loan
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLoan = await Loan.findByIdAndDelete(id).populate("customer");

    if (!deletedLoan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    return res.status(200).json({ success: "Loan deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// add new loan operations
// Endpoint to add a new loan to the allLoans array of a customer
router.post("/:customerId", async (req, res) => {
  const { customerId } = req.params;
  const newLoan = req.body; // Assuming the loan object is sent in the request body

  try {
    // Find the customer by ID
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Add the new loan to the allLoans array
    // customer.allLoans.push(newLoan);

    const addedLoan = await Loan.create(newLoan);

    // Save the updated customer document
    // await customer.save();

    res
      .status(201)
      .json({ message: "Loan added successfully", loan: addedLoan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to fetch all loans for a customer
router.get("/:customerId", async (req, res) => {
  const { customerId } = req.params;

  try {
    // Find the customer by ID
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const customerLoans = await Loan.find({ customer: customer._id }).populate(
      "customer"
    );

    // Return the allLoans array
    res.status(200).json(customerLoans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to update a loan object in the allLoans array
router.put("/:customerId/update/:loanId", async (req, res) => {
  const { customerId, loanId } = req.params;
  const loanUpdates = req.body;

  try {
    // Find the customer by ID
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const loanFound = Loan.findOneAndUpdate(
      { _id: loanId, customer: customer._id },
      loanUpdates,
      {
        new: true,
      }
    );

    if (!loanFound) {
      return res.status(404).json({ error: "Customer Loan not Found" });
    }

    res.status(200).json({
      message: "Loan updated successfully",
      loan: loanFound,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to Book loans by Operations Officers
router.put("/book/:customerId", async (req, res) => {
  const { customerId } = req.params;

  try {
    // Find the customer by ID
    const loan = await Loan.findById(customerId, {
      loanstatus: "booked",
    });

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    // Return the allLoans array
    res.status(200).json(customerLoans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint for Operations to disburse loans
router.put("/disburse/:loanId", async (req, res) => {
  const { loanId } = req.params;

  try {
    // Find the customer by ID
    const loan = await Loan.findByIdAndUpdate(loanId, {
      disbursementstatus: "disbursed",
    });

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    // Return the allLoans array
    res.status(200).json(customerLoans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint for Operations to disburse loans
router.put("/approve-disburse/:loanId", async (req, res) => {
  const { loanId } = req.params;

  try {
    // Find the customer by ID
    const loan = await Loan.findByIdAndUpdate(loanId, {
      disbursementstatus: "approved",
    });

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    // Return the allLoans array
    res.status(200).json(customerLoans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
