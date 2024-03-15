const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const dotenv = require("dotenv");

// configure dotenv
dotenv.config();

// Generate a unique requestId
const generateRequestId = () => {
  return Date.now().toString();
}

// Generate the authorization header
const generateAuthorization = () => {
  const apiKey = process.env.REMITA_API_KEY;
  const requestId = generateRequestId();
  const apiToken = process.env.REMITA_TOKEN; // API_TOKEN is the secret key

  const dataToHash = apiKey + requestId + apiToken;
  const apiHash = crypto.createHash('sha512').update(dataToHash).digest('hex');
  return apiHash;
}

const merchantId = process.env.REMITA_MERCHANT_ID;
const apiKey = process.env.REMITA_API_KEY;
const apiToken = process.env.REMITA_TOKEN;
const baseUrl = "https://login.remita.net/"

// get salary history endpoint (Verify)
router.post('/get-salary-history', async (req, res) => {
  // extract the customer details from the request body
  const { firstName, lastName, accountNumber, bankCode, bvn, authorisationChannel } = req.body;

  try {
      const d = new Date();
      const requestId = d.getTime();
      const randomnumber = Math.floor(Math.random() * 1101233);
      const authorisationCode = randomnumber;
      const dataToHash = apiKey + requestId + apiToken;
    const apiHash = crypto.createHash('sha512').update(dataToHash).digest('hex');
    
    const authorization = "remitaConsumerKey=" + apiKey + ", remitaConsumerToken=" + apiHash;
    
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Api_Key", "QzAwMDAxMDg3MzgxMjM0fEMwMDAwMTA4NzM4");
      myHeaders.append("Merchant_id", merchantId);
      myHeaders.append("Request_id", requestId);
      myHeaders.append("Authorization", authorization);

      const raw = JSON.stringify({
        "authorisationCode": authorisationCode,
        "firstName": firstName,
        "lastName": lastName,
        "accountNumber": accountNumber,
        "bankCode": bankCode,
        "bvn": bvn,
        "authorisationChannel": authorisationChannel
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      const response = await fetch(`${baseUrl}remita/exapp/api/v1/send/api/loansvc/data/api/v2/payday/salary/history/ph`, requestOptions)
      
    if (!response) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    res.status(200).json({
      message: "Salary history api called successfully",
      data: result
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// loan disbursement notification endpoint
router.post('/loan-disbursement-notification', async (req, res) => {

  try {
    const d = new Date();
    const requestId = d.getTime();
    const randomnumber = Math.floor(Math.random() * 1101233);
    const authorisationCode = randomnumber;
    const dataToHash = apiKey + requestId + apiToken;
    const apiHash = crypto.createHash('sha512').update(dataToHash).digest('hex');
    
    const authorization = "remitaConsumerKey=" + apiKey + ", remitaConsumerToken=" + apiHash;
    
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Api_Key", apiKey);
      myHeaders.append("Merchant_id", merchantId);
      myHeaders.append("Request_id", requestId);
      myHeaders.append("Authorization", authorization);

    const loanAmount = req.body.loanamount;
    const collectionAmount = req.body.loantotalrepayment;
    const dateOfDisbursement = new Date().toISOString();
    // next 30 days after date of disbursement
    const dateOfCollection = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString();
    // number of repayment months
    const numberOfRepayments = req.body.numberofmonth;
    const customerId = req.body.remita.remitaDetails.data.data.customerId;
    console.log("id", customerId)
    const raw = JSON.stringify({
      "customerId": customerId,
      "authorisationCode": authorisationCode,
      "authorisationChannel": "WEB",
      "phoneNumber": req.body.phonenumber,
      "accountNumber": req.body.salaryaccountnumber,
      "currency": "NGN",
      "loanAmount": loanAmount,
      "collectionAmount": collectionAmount,
      "dateOfDisbursement": dateOfDisbursement,
      "dateOfCollection": dateOfCollection,
      "totalCollectionAmount": collectionAmount,
      "numberOfRepayments": numberOfRepayments,
      "bankCode": req.body.bankcode
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    const response = await fetch(`${baseUrl}remita/exapp/api/v1/send/api/loansvc/data/api/v2/payday/post/loan`, requestOptions)
    
    if (!response) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result)
    res.status(200).json({
      message: "Loan disbursement notification api called successfully",
      data: result
    });
  } catch (error) {
    // Handle any errors that occur during the request
    console.error("Error:", error.message);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// router.post('/loan-disbursement-notification', async (req, res) => {
//   try {
//     const { apiKey, apiToken, merchantId, baseUrl } = req.body;
//     const d = new Date();
//     const requestId = d.getTime();
//     const randomnumber = Math.floor(Math.random() * 1101233);
//     const authorisationCode = randomnumber;
//     const dataToHash = apiKey + requestId + apiToken;
//     const dataBuffer = Buffer.from(dataToHash); // Convert data to Buffer
//     const apiHash = crypto.createHash('sha512').update(dataBuffer).digest('hex'); // Use Buffer as input

//     const authorization = `remitaConsumerKey=${apiKey}, remitaConsumerToken=${apiHash}`;

//     const myHeaders = {
//       'Content-Type': 'application/json',
//       'Api_Key': apiKey,
//       'Merchant_id': merchantId,
//       'Request_id': requestId,
//       'Authorization': authorization
//     };

//     const loanAmount = parseInt(req.body.loanamount);
//     const collectionAmount = parseInt(req.body.loantotalrepayment);
//     const dateOfDisbursement = new Date().toISOString();
//     const dateOfCollection = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString();
//     const numberOfRepayments = parseInt(req.body.numberofmonth);

//     const raw = JSON.stringify({
//       "customerId": req.body.remita.remitaDetails.data.data.customerId,
//       "authorisationCode": authorisationCode,
//       "authorisationChannel": "WEB",
//       "phoneNumber": req.body.phonenumber,
//       "accountNumber": req.body.salaryaccountnumber,
//       "currency": "NGN",
//       "loanAmount": loanAmount,
//       "collectionAmount": collectionAmount,
//       "dateOfDisbursement": dateOfDisbursement,
//       "dateOfCollection": dateOfCollection,
//       "totalCollectionAmount": collectionAmount,
//       "numberOfRepayments": numberOfRepayments,
//       "bankCode": req.body.bankcode
//     });

//     const requestOptions = {
//       method: 'POST',
//       headers: myHeaders,
//       body: raw,
//       redirect: 'follow'
//     };

//     const response = await fetch(`${baseUrl}remita/exapp/api/v1/send/api/loansvc/data/api/v2/payday/post/loan`, requestOptions);

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const result = await response.json();
//     console.log(result);
//     res.status(200).json({
//       message: "Loan disbursement notification api called successfully",
//       data: result
//     });
//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });

// collection notification endpoint (webhooks in process )
router.post('/collection-notification', (req, res) => {
  try {
    // Handle the incoming collection notification data
    const collectionData = req.body;

    // Process the collection notification data (you can customize this part)
    // In this example, we're acknowledging the notification by updating the 'notificationSent' field.
    collectionData.notificationSent = true;

    // Log the received collection data (you can customize this part)
    console.log('Received collection notification:');
    console.log(collectionData);

    // Respond with an acknowledgment (you can customize this part)
    const acknowledgment = {
      message: 'Collection notification received and acknowledged',
      collectionData: collectionData,
    };

    res.status(200).json(acknowledgment);
  } catch (error) {
    console.error('Error handling collection notification:', error);
    res.status(500).json({ error: 'An error occurred while processing the notification' });
  }
});

// mandate history endpoint (Done)
router.post('/mandate-history', async (req, res) => {
  try {
  
    const d = new Date();
    const requestId = d.getTime();
    const randomnumber = Math.floor(Math.random() * 1101233);
    const authorisationCode = randomnumber;
    const dataToHash = apiKey + requestId + apiToken;
    const apiHash = crypto.createHash('sha512').update(dataToHash).digest('hex');
    
    const authorization = "remitaConsumerKey=" + apiKey + ", remitaConsumerToken=" + apiHash;
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Api_Key", apiKey);
    myHeaders.append("Merchant_id", merchantId);
    myHeaders.append("Request_id", requestId);
    myHeaders.append("Authorization", authorization);
    
    const customerId = req.body.remita.remitaDetails.data.data.customerId;
    const mandateRef = req.body.remita.remitaDetails.disbursementDetails.data.mandateReference;

    const raw = JSON.stringify({
      "authorisationCode": authorisationCode,
      "customerId": customerId,
      "mandateRef": mandateRef
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    const response = await fetch(`${baseUrl}remita/exapp/api/v1/send/api/loansvc/data/api/v2/payday/loan/payment/history`, requestOptions)
    
    if (!response) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
  
    res.status(200).json({
      message: "Mandate history api called successfully",
      data: result
    });
  } catch (error) {
    // Handle any errors that occur during the request
    res.status(500).json({ error: 'An error occurred' });
  }
});

// stop loan collection endpoint (Done)
router.post('/stop-loan-collection', async (req, res) => {
  // console.log("Request body", req.body)
  try {
    const d = new Date();
    const requestId = d.getTime();
    const randomnumber = Math.floor(Math.random() * 1101233);
    const authorisationCode = randomnumber;
    const dataToHash = apiKey + requestId + apiToken;
    const apiHash = crypto.createHash('sha512').update(dataToHash).digest('hex');
    
    const authorization = "remitaConsumerKey=" + apiKey + ", remitaConsumerToken=" + apiHash;
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Api_Key", apiKey);
    myHeaders.append("Merchant_id", merchantId);
    myHeaders.append("Request_id", requestId);
    myHeaders.append("Authorization", authorization);

    const customerId = req.body.remita.remitaDetails.data.data.customerId;
    const mandateRef = req.body.remita.remitaDetails.disbursementDetails.data.mandateReference;

    const raw = JSON.stringify({
      "authorisationCode": authorisationCode,
      "customerId": customerId,
      "mandateRef": mandateRef
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    const response = await fetch(`${baseUrl}remita/exapp/api/v1/send/api/loansvc/data/api/v2/payday/stop/loan`, requestOptions)
    
    if (!response) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
 
    res.status(200).json({
      message: "Stop loan collection api called successfully",
      data: result
    });
  } catch (error) {
    // Handle any errors that occur during the request
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router; // export the router