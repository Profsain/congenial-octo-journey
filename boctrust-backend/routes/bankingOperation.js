const express = require("express");
const Customer = require("../models/Customer");
const Loan = require("../models/Loan");
const { default: axios } = require("axios");
const router = express.Router();
const nodemailer = require("nodemailer");
const EmailTemplate = require("../utils/emailTemp");
const {
  getCustomerAccountInfoByTrackingRef,
  handleInterBankTransfer,
  getAccountProduct,
  getLoanProduct,
} = require("../services/bankoneOperationsServices");

// add token to environment variable
const token = process.env.BANKONE_TOKEN;
const baseUrl = process.env.BANKONE_BASE_URL;

const mfbcode = "100579";

// Create customer account endpoint (Done)
router.post("/createCustomerAccount", async (req, res) => {
  // destructure the request body
  const {
    _id,
    bvnnumber,
    firstname,
    lastname,
    email,
    phonenumber,
    dob,
    stateoforigin,
    houseaddress,
  } = req.body;

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      TransactionTrackingRef: _id,
      AccountOpeningTrackingRef: _id,
      ProductCode: "104",
      CustomerID: _id,
      LastName: lastname,
      OtherNames: firstname,
      BVN: bvnnumber,
      PhoneNo: phonenumber,
      Gender: 0,
      PlaceOfBirth: stateoforigin,
      DateOfBirth: dob,
      Address: houseaddress,
      AccountOfficerCode: "001",
      Email: email,
      NotificationPreference: 3,
      TransactionPermission: "0",
      AccountTier: "1",
    }),
  };

  try {
    const response = await fetch(
      `${baseUrl}/BankOneWebAPI/api/Account/CreateAccountQuick/2?authToken=${token}`,
      options
    );

    if (!response) {
      throw new Error(
        `HTTP error! BankOne Account creation failed. Status: ${response.status}`
      );
    }
    const result = await response.json();
    res.status(200).json({
      message: "Account created successfully",
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error BankOne Account creation" });
  }
});

// loan creation endpoint (verify)
router.post("/createLoan/:loanId", async (req, res) => {
  const { loanId } = req.params;

  if (!loanId)
    return res.status(400).json({ error: "Bad Request! No LoanId " });

  const loanAndCustomer = await Loan.findById(loanId).populate("customer");

  if (!loanAndCustomer)
    return res.status(404).json({ error: "Loan Does not Exist" });

  const loanProduct = await getLoanProduct({
    careertype: loanAndCustomer.customer.careertype,
    deductions: loanAndCustomer.deductions,
    otheremployername: loanAndCustomer.customer.otheremployername,
    loanproduct: 305,
  });

  // get the loan creation request payload from the request body
  const {
    _id,
    customer: { banking },
    numberofmonth,
    loanamount,
    collateralDetails,
    collateralType,
    computationMode,
    interestAccrualCommencementDate,
    principalPaymentFrequency,
    interestPaymentFrequency,
    moratorium,
  } = loanAndCustomer;

  // console.log(loanProductDetails, "loanProductDetails")

  const customerId = banking?.accountDetails?.CustomerID;

  const accountNumber = banking?.accountDetails?.AccountNumber;

  // convert number of month to number of days
  const tenure = Number(numberofmonth) * 30;

  // Define the loan creation request payload here
  const loanRequestPayload = {
    TransactionTrackingRef: _id,
    // LoanProductCode: loanProductDetails.ProductCode,
    LoanProductCode: loanProduct.ProductCode,
    CustomerID: customerId,
    LinkedAccountNumber: accountNumber,
    CollateralDetails: collateralDetails,
    CollateralType: collateralType,
    ComputationMode: computationMode,
    Tenure: tenure,
    Moratorium: moratorium,
    InterestAccrualCommencementDate: new Date(
      interestAccrualCommencementDate
    ).toISOString(),
    Amount: loanamount,
    InterestRate: loanProductDetails.InterestRate,
    PrincipalPaymentFrequency: principalPaymentFrequency,
    InterestPaymentFrequency: interestPaymentFrequency,
  };

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(loanRequestPayload),
  };

  // Construct the URL for loan creation
  const apiUrl = `${baseUrl}/BankOneWebAPI/api/LoanApplication/LoanCreationApplication2/2?authToken=${token}`;

  try {
    const response = await fetch(apiUrl, options);

    if (!response) {
      throw new Error(
        `HTTP error! BankOne Loan creation failed. Status: ${response.status}`
      );
    }
    const result = await response.json();

    if (!result.IsSuccessful) {
      return res.status(400).json({ error: result.Message });
    }

    // Send an email with the password reset link
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "boctrustebusiness@gmail.com",
        pass: password,
      },
    });

    const mailOptions = {
      from: "Boctrust MFB Ltd",
      to: loanAndCustomer.customer?.email,
      subject: "Your Loan Has Been Booked for Disbursement",
      html: EmailTemplate(),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Failed to send Email" });
      }

      res.status(201).json({
        message: "Loan created successfully and Email Sent",
        data: result,
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error BankOne Loan creation" });
  }
});

// create customer and account endpoint (Done)
router.post("/newCustomerAccount/:customerId", async (req, res) => {
  const { customerId } = req.params;


  try {
    const customer = await Customer.findById(customerId);
    const loan = await Loan.findOne({ customer: customer?._id });

    if (!customer)
      return res.status(500).json({ error: "No Customer with provided ID" });

    const accountProduct = await getAccountProduct({
      careertype: customer.careertype,
      deductions: loan.deductions,
      otheremployername: customer.otheremployername,
    });

  

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        TransactionTrackingRef: customer._id,

        AccountOpeningTrackingRef: customer._id,

        ProductCode: accountProduct.ProductCode,

        LastName: customer.firstname,

        OtherNames: customer.lastname,

        BVN: customer.bvnnumber,

        PhoneNo: customer.phonenumber,

        PlaceOfBirth: customer.stateoforigin,

        DateOfBirth: customer.dob,

        Address: customer.houseaddress,

        NextOfKinPhoneNo: customer.nkinphonenumber,

        NextOfKinName: `${customer.nkinfirstname} ${customer.nkinlastname}`,

        HasSufficientInfoOnAccountInfo: true,

        Email: customer.email,

        Gender: customer.gender || "male",

        AccountOfficerCode: "52",

        NotificationPreference: "3",

        TransactionPermission: "0",

        AccountTier: 1
      }),
    };

    console.log(options, "options")

    const response = await fetch(
      `${baseUrl}/BankOneWebAPI/api/Account/CreateCustomerAndAccount/2?authToken=${token}`,
      options
    );

    const newAccSuccessData = await response.json();
    console.log(newAccSuccessData, "newAccSuccessData");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    if (!newAccSuccessData.IsSuccessful) {
      return res.status(400).json({ error: newAccSuccessData.Message });
    }

    console.log(
      newAccSuccessData?.TransactionTrackingRef,
      "newAccSuccessData?.TransactionTrackingRef"
    );

    const accountInfo = await getCustomerAccountInfoByTrackingRef(
      newAccSuccessData?.TransactionTrackingRef || customer._id
    );

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customer._id,
      {
        "banking.accountDetails": {
          AccessLevel: accountInfo.AccessLevel,
          AccountNumber: accountInfo.AccountNumber,
          AccountStatus: accountInfo.AccountStatus,
          AccountType: accountInfo.AccountType,
          CustomerID: accountInfo.CustomerID,
          CustomerName: accountInfo.CustomerName,
          AccountTier: accountInfo.AccountTier,
          DateCreated: accountInfo.DateCreated,
          AccountProductCode: accountProduct.ProductCode,
        },
        "banking.isAccountCreated": true,
      },
      {
        new: true,
      }
    );

    res.json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

// bankone balance enquiry endpoint  (Done)
router.get("/balanceEnquiry/:accountNumber", (req, res) => {
  const { accountNumber } = req.params; // Get the account number from the URL parameters

  // Construct the URL with the provided account number
  const apiUrl = `${baseUrl}/BankOneWebAPI/api/Account/GetAccountByAccountNumber/2?authtoken=${token}&accountNumber=${accountNumber}&computewithdrawableBalance=false`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  fetch(apiUrl, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the data as needed

      res.json(data); // Send the response to the client
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message }); // Handle errors and send a response to the client
    });
});

// get customer by id endpoint (Done)
router.get("/getCustomerById/:customerId", (req, res) => {
  const { customerId } = req.params; // Get the customer ID from the URL parameters

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  // Construct the URL with the provided customer ID
  const apiUrl = `${baseUrl}/BankOneWebAPI/api/Customer/GetByCustomerID/2?authToken=${token}&CustomerID=${customerId}`;

  fetch(apiUrl, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the data as needed
      res.json(data); // Send the response to the client
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message }); // Handle errors and send a response to the client
    });
});

//  Return list of all the account a customer has

router.get("/getCustomerAccountsByBankoneId/:customerId", async (req, res) => {
  const { customerId } = req.params;
  try {
    const response = await axios.get(
      `${baseUrl}/BankOneWebAPI/api/Account/GetAccountsByCustomerId/2?customerId=${customerId}&authToken=${token}`
    );

    return res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/accountNameEnquiry", async (req, res) => {
  const { bankCode, accountNumber } = req.body;
  try {
    const response = await axios.post(
      `${baseUrl}/thirdpartyapiservice/apiservice/Transfer/NameEnquiry`,

      {
        AccountNumber: accountNumber,

        BankCode: bankCode,

        Token: token,
      }
    );

    return res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getUserTransactions/:accountNumber", async (req, res) => {
  const { accountNumber } = req.params;
  const { fromDate, toDate, numberOfItems } = req.query;
  const url = `${baseUrl}/BankOneWebAPI/api/Account/GetTransactions/2?authtoken=${token}&accountNumber=${accountNumber}`;
  if (fromDate) {
    url + `?fromDate=${fromDate}`;
    toDate && url + `&toDate=${toDate}`;
    numberOfItems && url + `&numberOfItems=${numberOfItems}`;
  } else {
    url + `?numberOfItems=${numberOfItems}`;
  }

  try {
    const response = await axios.get(url);

    return res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// interbank transfer endpoint
router.post("/interbankTransfer/:customerId", async (req, res) => {
  const { customerId } = req.params;
  const { amount, debitAccount, notes, creditAccountName } = req.body;

  if (!amount || !debitAccount || !notes || !creditAccountName) {
    return res.status(400).json({ message: "Missing Details" });
  }

  const customer = await Customer.findById(customerId);

  if (!customer) return res.status(404).json({ message: "Customer not found" });

  // Define the interbank transfer request payload here
  const transferRequestPayload = {
    Amount: amount * 100,
    PayerAccountNumber: debitAccount,
    Payer: customer?.banking?.accountDetails?.CustomerName,
    ReceiverAccountNumber: customer?.disbursementaccountnumber,
    ReceiverBankCode: customer.bankcode,
    ReceiverName: creditAccountName,
    Narration: notes,
    TransactionReference: `TF${
      customer?.banking?.accountDetails?.CustomerID
    }-${new Date().getMilliseconds()}`,
    Token: token,
  };
  handleInterBankTransfer(transferRequestPayload)
    .then((data) => {
      // Handle the data as needed
      res.json(data); // Send the response to the client
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" }); // Handle errors and send a response to the client
    });
});

// intra bank transfer endpoint (Boctrust)

// get loan by account number (Done)
router.get("/getLoanByAccount/:accountNumber", (req, res) => {
  const { accountNumber } = req.params; // Get the id number from the URL parameters

  // Construct the URL with the provided customer id number
  const apiUrl = `${baseUrl}/BankOneWebAPI/api/Loan/GetLoansByCustomerId/2?authToken=${token}&institutionCode=0118&CustomerId=${accountNumber}`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  fetch(apiUrl, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the data as needed
      res.json(data); // Send the response to the client
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" }); // Handle errors and send a response to the client
    });
});

// get loan repayment schedule (Verify)
router.get("/getLoanRepaymentSchedule/:loanAccountNumber", async (req, res) => {
  const { loanAccountNumber } = req.params; // Get the loan account number from the URL parameters
  console.log("repayment schedule", loanAccountNumber);
  try {
    // Construct the URL with the provided loan account number
    const apiUrl = `${baseUrl}/BankOneWebAPI/api/loan/GetLoanRepaymentSchedule/2?authToken=${token}&loanAccountNumber=${loanAccountNumber}`;

    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };

    const response = await fetch(apiUrl, options);

    if (!response) {
      throw new Error(
        `HTTP error! BankOne Loan repayment schedule failed. Status: ${response.status}`
      );
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
      method: "GET",
      headers: {
        accept: "application/json",
      },
    };

    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      throw new Error(
        `HTTP error! BankOne Loan account Balance failed. Status: ${response.status}`
      );
    }

    const data = await response.json();

    // Handle the data as needed
    console.log("Loan Account Balance", data);
    res.json(data); // Send the response to the client
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" }); // Handle errors and send a response to the client
  }
});

// loan account statement (Done)
// http://52.168.85.231/BankOneWebAPI/api/LoanAccount/LoanAccountStatement/2?authtoken=6bcc4b69-e1a1-415d-bab8-0bfd3eb01b5f&accountNumber=00830013021008172&fromDate=2023-07-09&toDate=2023-09-09&numberOfItems=5

router.get(
  "/loanAccountStatement/:loanAccountNumber/:fromDate/:toDate/:institutionCode",
  async (req, res) => {
    try {
      const { loanAccountNumber, fromDate, toDate, institutionCode } =
        req.params; // Get parameters from the URL
      console.log(
        "Statement params",
        loanAccountNumber,
        fromDate,
        toDate,
        institutionCode
      );

      // Construct the URL with the provided parameters
      const apiUrl = `${baseUrl}/BankOneWebAPI/api/LoanAccount/LoanAccountStatement/2?authToken=${token}&accountNumber=${loanAccountNumber}&fromDate=${fromDate}&toDate=${toDate}&institutionCode=${institutionCode}`;

      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-key": "d7cb51d9-aab4-46f9-a45f-f7d8ca886695",
        },
      };

      const response = await fetch(apiUrl, options);

      if (!response) {
        console.log("server error");
        throw new Error(response);
      }

      // Check content-type header to ensure the response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Unexpected response format. Expected JSON.");
      }

      const data = await response.json();

      res.json(data); // Send the response to the client
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err }); // Handle errors and send a response to the client
    }
  }
);

router.get("/commercialbanks", async (req, res) => {
  try {
    // Construct the URL with the provided parameters
    const apiUrl = `${baseUrl}/ThirdPartyAPIService/APIService/BillsPayment/GetCommercialBanks/${token}`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    };

    const response = await fetch(apiUrl, options);

    if (!response) {
      console.log("server error");
      throw new Error(response);
    }

    // Check content-type header to ensure the response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Unexpected response format. Expected JSON.");
    }

    const data = await response.json();

    res.json(data); // Send the response to the client
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err }); // Handle errors and send a response to the client
  }
});

module.exports = router;
