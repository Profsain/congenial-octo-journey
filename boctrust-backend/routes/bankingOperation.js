const express = require("express");
const router = express.Router();

// add token to environment variable
const token = process.env.BANKONE_TOKEN;
const baseUrl = "https://api.mybankone.com";
const mfbcode = "100579"

// Create customer account endpoint (Done)
router.post("/createCustomerAccount", async (req, res) => {
  // destructure the request body
  const { _id, bvnnumber, firstname, lastname, email, phonenumber, dob, stateoforigin, houseaddress } = req.body;
  
  const options = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            TransactionTrackingRef: _id,
            AccountOpeningTrackingRef: _id,
            ProductCode: '101',
            CustomerID: _id,
            LastName: lastname,
            OtherNames: firstname,
            BVN: bvnnumber,
            PhoneNo: phonenumber,
            Gender: 0,
            PlaceOfBirth: stateoforigin,
            DateOfBirth: dob,
            Address: houseaddress,
            AccountOfficerCode: '001',
            Email: email,
            NotificationPreference: 3,
            TransactionPermission: '0',
            AccountTier: '1'
        })
  };

  try {
    const response = await fetch(`${baseUrl}/BankOneWebAPI/api/Account/CreateAccountQuick/2?authToken=${token}`, options);

    if (!response) {
      throw new Error(`HTTP error! BankOne Account creation failed. Status: ${response.status}`);
    }
    const result = await response.json();
    res.status(200).json({
      message: "Account created successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error BankOne Account creation' });
  }
});

// loan creation endpoint (verify)
router.post("/createLoan", async (req, res) => {
  // check req body
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body is empty. Try again' });
  }

  // get the loan creation request payload from the request body
  const { _id, salaryaccountnumber, disbursementaccountnumber, numberofmonth, loanamount } = req.body;

  const accountNumber = disbursementaccountnumber || salaryaccountnumber;
  const customerId = req.body.banking?.accountDetails?.Message.CustomerID;
  // convert number of month to number of days
  const tenure = Number(numberofmonth) * 30;
  // remove comma from loan amount
  const loanAmount = loanamount?.replace(/,/g, '');
  const interestRate = req.body?.interestRate || 5;
   
  // Define the loan creation request payload here
   const loanRequestPayload = {
    TransactionTrackingRef: _id,
    LoanProductCode: 300,
    CustomerID: customerId,
    LinkedAccountNumber: accountNumber,
    CollateralDetails: 'string',
    CollateralType: 'string',
    ComputationMode: 0,
    Tenure: tenure,
    Moratorium: 30,
    InterestAccrualCommencementDate: new Date().toISOString(),
    Amount: Number(loanAmount),
    InterestRate: interestRate,
    PrincipalPaymentFrequency: 2,
    InterestPaymentFrequency: 2,
    LoanFeeIDs: []
  };
  console.log("payloan", loanRequestPayload)
  const options = {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify(loanRequestPayload)
  };

  // Construct the URL for loan creation
  const apiUrl = `${baseUrl}/BankOneWebAPI/api/LoanApplication/LoanCreationApplication2/2?authToken=${token}`;

  try {
    const response = await fetch(apiUrl, options);

    if (!response) {
      throw new Error(`HTTP error! BankOne Loan creation failed. Status: ${response.status}`);
    }
    const result = await response.json();
    console.log("Result", result)
    res.status(200).json({
      message: "Loan created successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error BankOne Loan creation' });
  }
});

// create customer and account endpoint (Done)
router.post("/newCustomerAccount", (req, res) => {
  const options = {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      // Your request payload here
    })
  };

  fetch(`${baseUrl}/BankOneWebAPI/api/Account/CreateCustomerAndAccount/2?authToken=${token}`, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Handle the data as needed
      res.json(data); // Send the response to the client
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' }); // Handle errors and send a response to the client
    });
});

// bankone balance enquiry endpoint  (Done)
router.get("/balanceEnquiry/:accountNumber", (req, res) => {
  const { accountNumber } = req.params; // Get the account number from the URL parameters
  console.log("Account No", accountNumber)

  // Construct the URL with the provided account number
  const apiUrl = `${baseUrl}/BankOneWebAPI/api/Account/GetAccountByAccountNumber/2?authtoken=${token}&accountNumber=${accountNumber}&computewithdrawableBalance=false`;

  const options = {
    method: 'GET',
    headers: {
      'accept': 'application/json'
    }
  };

  fetch(apiUrl, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Handle the data as needed
      console.log("Data", data)
      res.json(data); // Send the response to the client

    })
    .catch(err => {
      console.error(err);
      res.status(500).json({  error: err.message  }); // Handle errors and send a response to the client
    });
});


// get customer by id endpoint (Done)
router.get("/getCustomerById/:customerId", (req, res) => {
  const { customerId } = req.params; // Get the customer ID from the URL parameters

  const options = {
    method: 'GET',
    headers: {
      'accept': 'application/json'
    }
  };

  // Construct the URL with the provided customer ID
  const apiUrl = `${baseUrl}/BankOneWebAPI/api/Customer/GetByCustomerID/2?authToken=${token}&CustomerID=${customerId}`;

  fetch(apiUrl, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Handle the data as needed
      res.json(data); // Send the response to the client
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.message  }); // Handle errors and send a response to the client
    });
});

// get all commercial bank
router.get("/getAllCommercialBank", async(req, res) => {
    const options = {method: 'GET', headers: {accept: 'application/json'}};

    try {
      const response = await fetch(`${baseUrl}/ThirdPartyAPIService/APIService/BillsPayment/GetCommercialBanks/${token}`, options);
      if (!response) {
        throw new Error(`HTTP error! BankOne get all banks failed. Status: ${response.status}`);
      }
      const result = await response.json();
      res.status(200).json({
        message: "All banks fetched successfully",
        data: result
      });

    } catch (error) {
      throw new Error(`HTTP error! BankOne get all banks failed. Status: ${response.status}`)
    }
});

// interbank transfer endpoint
router.post("/interbankTransfer", (req, res) => {
  // Define the interbank transfer request payload here
  const transferRequestPayload = {
    Amount: '5000',
    PayerAccountNumber: '1100037557',
    Payer: 'Sylvestre Rice',
    ReceiverAccountNumber: '2100036200',
    ReceiverBankCode: '076',
    Narration: 'Trf to Jason Bourne',
    TransactionReference: 'TF24107924',
    Token: 'c175cfbe-e036-487b-9cc5-d8dfd21999ad'
  };

  const options = {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify(transferRequestPayload)
  };

  // Construct the URL for interbank transfer
  const apiUrl = `${baseUrl}/thirdpartyapiservice/apiservice/Transfer/InterBankTransfer`;

  fetch(apiUrl, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Handle the data as needed
      res.json(data); // Send the response to the client
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' }); // Handle errors and send a response to the client
    });
});

// intra bank transfer endpoint (Boctrust)

// get loan by account number (Done)
router.get("/getLoanByAccount/:accountNumber", (req, res) => {
  const { accountNumber } = req.params; // Get the id number from the URL parameters

  // Construct the URL with the provided customer id number
  const apiUrl = `${baseUrl}/BankOneWebAPI/api/Loan/GetLoansByCustomerId/2?authToken=${token}&institutionCode=0118&CustomerId=${accountNumber}`;

  const options = {
    method: 'GET',
    headers: {
      'accept': 'application/json'
    }
  };

  fetch(apiUrl, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Handle the data as needed
      res.json(data); // Send the response to the client
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' }); // Handle errors and send a response to the client
    });
});

// get loan repayment schedule (Verify)
router.get("/getLoanRepaymentSchedule/:loanAccountNumber", async (req, res) => {
  const { loanAccountNumber } = req.params; // Get the loan account number from the URL parameters
  console.log("repayment schedule", loanAccountNumber)
  try {

    // Construct the URL with the provided loan account number
    const apiUrl = `${baseUrl}/BankOneWebAPI/api/loan/GetLoanRepaymentSchedule/2?authToken=${token}&loanAccountNumber=${loanAccountNumber}`;

    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    const response = await fetch(apiUrl, options);

    if (!response) {
      throw new Error(`HTTP error! BankOne Loan repayment schedule failed. Status: ${response.status}`);
    }

    const data = await response.json();

    res.json(data); // Send the response to the client

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message }); // Handle errors and send a response to the client
  }
});

// get total loan repayment
// complete loan repayment

// loan account balance (verify!)
router.get("/loanAccountBalance/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params; // Get the customer ID from the URL parameters

    // Construct the URL with the provided customer ID
    const apiUrl = `${baseUrl}/BankOneWebAPI/api/LoanAccount/LoanAccountBalance2/2?authToken=${token}&customerIDInString=${customerId}`;

    const options = {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    };

    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      throw new Error(`HTTP error! BankOne Loan account Balance failed. Status: ${response.status}`);
    }

    const data = await response.json();

    // Handle the data as needed
    console.log("Loan Account Balance", data);
    res.json(data); // Send the response to the client
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' }); // Handle errors and send a response to the client
  }
});

// loan account statement (Done)
// http://52.168.85.231/BankOneWebAPI/api/LoanAccount/LoanAccountStatement/2?authtoken=6bcc4b69-e1a1-415d-bab8-0bfd3eb01b5f&accountNumber=00830013021008172&fromDate=2023-07-09&toDate=2023-09-09&numberOfItems=5

router.get("/loanAccountStatement/:loanAccountNumber/:fromDate/:toDate/:institutionCode", async (req, res) => {

  try {
    const { loanAccountNumber, fromDate, toDate, institutionCode } = req.params; // Get parameters from the URL
    console.log("Statement params", loanAccountNumber, fromDate, toDate, institutionCode);

    // Construct the URL with the provided parameters
    const apiUrl = `${baseUrl}/BankOneWebAPI/api/LoanAccount/LoanAccountStatement/2?authToken=${token}&accountNumber=${loanAccountNumber}&fromDate=${fromDate}&toDate=${toDate}&institutionCode=${institutionCode}`;

    const options = {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-api-key': 'd7cb51d9-aab4-46f9-a45f-f7d8ca886695'
      }
    };

    const response = await fetch(apiUrl, options);

    if (!response) {
      console.log("server error")
      throw new Error(response);
    }

    // Check content-type header to ensure the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Unexpected response format. Expected JSON.');
    }

    const data = await response.json();

    res.json(data); // Send the response to the client
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err }); // Handle errors and send a response to the client
  }
});

module.exports = router;