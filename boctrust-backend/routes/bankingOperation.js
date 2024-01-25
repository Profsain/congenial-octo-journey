const express = require("express");
const router = express.Router();

// add token to environment variable
const token = process.env.BANKONE_TOKEN;
const baseUrl = "https://api.mybankone.com";

// Create customer account endpoint
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
            AccountOfficerCode: '100',
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
    console.log(result);
    res.status(200).json({
      message: "Account created successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error BankOne Account creation' });
  }
});

// create customer and account endpoint
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

// backone balance enquiry endpoint
router.get("/balanceEnquiry/:accountNumber", (req, res) => {
  const { accountNumber } = req.params; // Get the account number from the URL parameters

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
      res.json(data); // Send the response to the client
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' }); // Handle errors and send a response to the client
    });
});

// get customer by id endpoint
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
      res.status(500).json({ error: 'Internal Server Error' }); // Handle errors and send a response to the client
    });
});

// get all commercial bank
router.get("/getAllCommercialBank", (req, res) => {
    const options = {method: 'GET', headers: {accept: 'application/json'}};

    fetch(`${baseUrl}/ThirdPartyAPIService/APIService/BillsPayment/GetCommercialBanks/${token}`, options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
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

// get loan by account number
router.get("/getLoanByAccount/:accountNumber", (req, res) => {
  const { customerId } = req.params; // Get the id number from the URL parameters

  // Construct the URL with the provided customer id number
  const apiUrl = `${baseUrl}/BankOneWebAPI/api/Loan/GetLoansByCustomerId/2?authToken=${token}&institutionCode=0118&CustomerId=${customerId}`;

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

// get loan repayment schedule
router.get("/getLoanRepaymentSchedule/:loanAccountNumber", async (req, res) => {
  console.log("repayment shedule", req.params)
  try {
    const { loanAccountNumber } = req.params; // Get the loan account number from the URL parameters

    // Construct the URL with the provided loan account number
    const apiUrl = `${baseUrl}/BankOneWebAPI/api/Loan/GetLoanRepaymentSchedule/2?authToken=${token}&loanAccountNumber=${loanAccountNumber}`;

    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // Handle the data as needed
    res.json(data); // Send the response to the client
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' }); // Handle errors and send a response to the client
  }
});

// get total loan repayment
// complete loan repayment

// loan account balance
router.get("/loanAccountBalance/:customerId", (req, res) => {
  const { customerId } = req.params; // Get the customer ID from the URL parameters

  // Construct the URL with the provided customer ID
  const apiUrl = `${baseUrl}/BankOneWebAPI/api/LoanAccount/LoanAccountBalance2/2?authToken=${token}&customerIDInString=${customerId}`;

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

// loan account statement
router.get("/loanAccountStatement/:loanAccountNumber/:fromDate/:toDate/:institutionCode", (req, res) => {
  const { loanAccountNumber, fromDate, toDate, institutionCode } = req.params; // Get parameters from the URL

  // Construct the URL with the provided parameters
  const apiUrl = `${baseUrl}/LoanAccount/LoanAccountStatement/2?authToken=${token}&loanAccountNumber=${loanAccountNumber}&fromDate=${fromDate}&toDate=${toDate}&institutionCode=${institutionCode}`;

  const options = {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'x-api-key': '12345'
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

// loan creation endpoint
router.post("/createLoan", (req, res) => {
   // get the loan creation request payload from the request body
  // Define the loan creation request payload here
  const loanRequestPayload = {
    TransactionTrackingRef: '12345',
    LoanProductCode: 300,
    CustomerID: 1234,
    LinkedAccountNumber: '0999999999',
    CollateralDetails: 'Car',
    CollateralType: 'Asset',
    ComputationMode: 0,
    Tenure: 90,
    Moratorium: 30,
    Amount: 200000,
    InterestRate: 5,
    PrincipalPaymentFrequency: 2,
    InterestPaymentFrequency: 2
  };

  const options = {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify(loanRequestPayload)
  };

  // Construct the URL for loan creation
  const apiUrl = `${baseUrl}/BankOneWebAPI/api/Loan/LoanApplication/LoanCreationApplication2/2?authToken=${token}`;

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

module.exports = router;