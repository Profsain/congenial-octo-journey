const express = require('express');
const router = express.Router();
const Customer = require("../models/Customer");
const Loan = require("../models/Loan");
const fetchAccessToken = require('../utils/nddAccessToken');


const BASE_URL = 'https://apitest.nibss-plc.com.ng/mandate/v1';

// Route to create a mandate direct debit
router.post('/create-mandate', async (req, res) => {
  console.log(req.body);
  const { startDate, endDate, customerId} = req.body;

  try {
    const accessToken = await fetchAccessToken();

    if (!accessToken) {
      return res.status(401).json({ error: "Access token could not be retrieved" });
    }

    // find customer loan by id
    const loan = await Loan.findById(customerId);

    if (!loan) {
      return res.status(404).json({ error: "Customer loan not found" });
    }

    // find customer by id
    const customer = await Customer.findById(loan.customer);

    // Create a new mandate request
    console.log("Creating mandate request for customer:", customer);

    const data = {
     
      mandateRequests: [
        {
          accountNumber: "1780004070",
          productId: "3",
          bankCode: "2348029039468",
          payerName: "Adeola",
          payerAddress: "Adeola Hopewell",
          accountName: "Mobolaji Temabo Ake",
          amount: "10000",
          payeeName: "OG Advertising agency",
          Narration: "3 months ad payment",
          payeeAddress: "Ahmadu bello way",
          phoneNumber: "08023640703",
          emailAddress: "make@nibss-plc.com.ng",
          subscriberCode: "OGIBVBNN-001BJ",
          startDate: "20220615",
          endDate: "20320615",
          fileExtension: ".pdf",
          mandateFile:
            "http://localhost:3030/public/filesUpload/1723669274974-CreditDBCheck.pdf",
        },
      ],
    };

    const response = await fetch(`${BASE_URL}/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        apiKey: process.env.NIBSS_API_KEY
      },
      body: JSON.stringify(data), // Fixed here
    });

    const responseData = await response.json();
    console.log(responseData)

    if (!response.ok) {
      console.error("API Error Response:", { status: response.status, responseData });
      return res.status(response.status).json({
        error: response.statusText,
        details: responseData,
      });
    }

    console.log("Mandate Created Successfully:", responseData);
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// endpoint to fetch mandate details
router.post('/fetchMandateDetails', async (req, res) => {
  try {
    const accessToken = await fetchAccessToken();
    const { page, pageSize, billerId, accountNumber } = req.body;

    const response = await fetch(`${BASE_URL}/api/MandateRequest/FetchMandate?page=${page}&pageSize=${pageSize}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ billerId, accountNumber })
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// endpoint to update mandate status
router.post("/updateMandateStatus", async (req, res) => {
  const { auth, mandateUpdateRequests } = req.body;

  // Validate request body
  if (!auth || !mandateUpdateRequests || !Array.isArray(mandateUpdateRequests)) {
    return res.status(400).json({ error: "Invalid request body format" });
  }

  try {
    // Make a POST request to the external API using fetch
    const apiResponse = await fetch(`${BASE_URL}/status`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer <BEARER_TOKEN>", // Replace with actual token
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth: {
          username: auth.username,
          password: auth.password,
          apiKey: auth.apiKey,
        },
        mandateUpdateRequests,
      }),
    });

    // Parse the JSON response
    const responseData = await apiResponse.json();

    // Respond back to the client
    if (apiResponse.ok) {
      res.status(200).json(responseData);
    } else {
      res.status(apiResponse.status).json({
        error: "Failed to update mandate status",
        details: responseData,
      });
    }
  } catch (error) {
    console.error("Error updating mandate status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;


// {
//   "auth": {
//     "username": "biller1@biller.com",
//     "password": "password",
//     "apiKey": "xxxxxx"
//   },
//   "mandateUpdateRequests": [
//     {
//       "mandateCode": "RC990999/001/448888800",
//       "phoneNumber": "08030607376",
//       "payerName": "Test Payer",
//       "payerAddress": "Local Address, Lagos",
//       "status": 1,
//       "workFlowStatus": 1,
//       "emailAddress": "sfagbola@nibss-plc.com.ng"
//     }
//   ]
// }
