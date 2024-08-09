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

// Endpoint to Approve Booked loans by COO
router.post("/", async (req, res) => {
    console.log("my name");
    const { loanId } = req.query;
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
  
    console.log("my name");
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
  })


module.exports = router;
