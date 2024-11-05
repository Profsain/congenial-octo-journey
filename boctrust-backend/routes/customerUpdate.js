const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer"); // Import customer model
const multer = require("multer");
const path = require("path");
const Loan = require("../models/Loan");

const baseUrl = process.env.BASE_URL;

// Set up Multer storage to define where to save the uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/filesUpload/"); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Rename the file with a unique name
  },
});

const upload = multer({
  storage: storage,
});

const multipleUpload = upload.fields([
  { name: "dbSearchReport" },
  { name: "deductSearchReport" },
  { name: "bureauSearchReport" },
  { name: "uploadPaySlip" },
]);
// multer configuration end here

// Update the creditDbSearch field
router.put("/creditDbSearch/:customerId", multipleUpload, async (req, res) => {
  if (req.files?.dbSearchReport) {
    req.body.dbSearchReport = `${baseUrl}/public/filesUpload/${req.files.dbSearchReport[0].filename}`;
  }

  try {
    const customerId = req.params.customerId;
    const updates = req.body;

    const updateObject = Object.keys(updates).reduce((acc, key) => {
      acc[`creditCheck.creditDbSearch.${key}`] = updates[key];
      return acc;
    }, {});

    // send the updated data in the request body
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      {
        $set: updateObject,
        $currentDate: { "creditCheck.creditDbSearch.updatedAt": true },
      },
      { new: true }
    );

    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update creditDbSearch" });
  }
});

// Update the deductcheck field
router.put("/deductcheck/:customerId", multipleUpload, async (req, res) => {
  if (req.files?.deductSearchReport) {
    req.body.deductSearchReport = `${baseUrl}/public/filesUpload/${req.files.deductSearchReport[0].filename}`;
  }

  try {
    const customerId = req.params.customerId;

    const updates = req.body;

    const updateObject = Object.keys(updates).reduce((acc, key) => {
      acc[`creditCheck.deductCheck.${key}`] = updates[key];
      return acc;
    }, {});

    // send the updated data in the request body
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      {
        $set: updateObject,
        $currentDate: { "creditCheck.deductCheck.updatedAt": true },
      },
      { new: true }
    );

    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update deductcheck" });
  }
});

// Update the creditBureauSearch field
router.put(
  "/creditBureauSearch/:customerId",
  multipleUpload,
  async (req, res) => {
    try {
      const customerId = req.params.customerId;

      const updates = req.body;

      // send the updated data in the request body
      const customer = await Customer.findByIdAndUpdate(
        customerId,
        {
          $push: {
            "creditCheck.creditBureauSearch": updates,
          },
        },
        { new: true }
      );

      res.json(customer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update creditBureauSearch" });
    }
  }
);
// Update the creditBureauSearch field
router.put(
  "/creditBureauSearch/:customerId/fileupload",
  multipleUpload,
  async (req, res) => {
    try {
      const customerId = req.params.customerId;

      const { bureauName, reportType, reportReason } = req.body;

      if (req.files?.bureauSearchReport) {
        req.body.bureauSearchReport = `${baseUrl}/public/filesUpload/${req.files.bureauSearchReport[0].filename}`;
      } else {
        return res.status(400).json({
          error: "Please Upload A file",
        });
      }

      // Find the document
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).send("Customer not found");
      }

      // Find the specific element in the array
      const creditBureauSearch = customer.creditCheck.creditBureauSearch;

      const element = creditBureauSearch.find(
        (item) =>
          item.bureauName === bureauName &&
          item.reportType === reportType &&
          item.reportReason === reportReason
      );

      if (!element) {
        return res.status(400).json({
          error:
            "No Bureau Search History. Please Provide Report for Search Carried Out",
        });
      }

      // Update the specific element
      element.bureauSearchReport = req.body.bureauSearchReport;

      // Save the document
      await customer.save();

      res.json(customer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update creditBureauSearch" });
    }
  }
);

// Update the paySlipAnalysis field
router.put("/paySlipAnalysis/:customerId", multipleUpload, async (req, res) => {
  console.log("req.body-payslip", req.body);
  try {
    const customerId = req.params.customerId;
    if (req.files?.uploadPaySlip) {
      req.body.uploadPaySlip = `${baseUrl}/public/filesUpload/${req.files.uploadPaySlip[0].filename}`;
    }
    if (req.body?.extraLenders) {
      req.body.extraLenders = JSON.parse(req.body.extraLenders);
    }

    const updates = req.body;

    const updateObject = Object.keys(updates).reduce((acc, key) => {
      acc[`creditCheck.paySlipAnalysis.${key}`] = updates[key];
      return acc;
    }, {});

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      {
        $set: updateObject,
        $currentDate: { "creditCheck.paySlipAnalysis.updatedAt": true },
      },
      { new: true }
    );
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update paySlipAnalysis" });
  }
});

// Update the paySlipAnalysis field
router.put("/activate-buyover/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const customerValid = await Customer.findOne({ _id: customerId });
    if (customerValid.buyoverloan != "yes") {
      return res
        .status(400)
        .json({ error: "Customer Did not request for a BuyOver Loan" });
    }

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { buyoverloanactivated: true },
      { new: true }
    );
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update paySlipAnalysis" });
  }
});

// Update the decisionSummary field
router.put("/decisionSummary/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const updates = req.body;
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { "creditCheck.decisionSummary": updates },
      { new: true }
    );
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update decisionSummary" });
  }
});

// Update the assign to credit analyst
router.put("/assignto/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const updates = req.body;

    const updateObject = Object.keys(updates).reduce((acc, key) => {
      acc[`creditCheck.assignment.${key}`] = updates[key];
      return acc;
    }, {});

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      {
        $set: updateObject,
        $currentDate: { "creditCheck.assignment.updatedAt": true },
      },
      { new: true }
    );
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: "Failed to Assign Customer" });
  }
});

// Update the Approved Customer Loan by Credit Officer
router.put("/approve/co/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const updates = req.body;

    const updateObject = Object.keys(updates).reduce((acc, key) => {
      acc[`creditCheck.decisionSummary.${key}`] = updates[key];
      return acc;
    }, {});

    // Update the Approval Status
    updateObject["creditCheck.decisionSummary.creditOfficerApprovalStatus"] =
      "approved";

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      {
        $set: updateObject,
        $currentDate: {
          "creditCheck.decisionSummary.creditOfficerApprovedAt": true,
        },
      },
      { new: true }
    );
    res.json(customer);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed Credit Officer Approval" });
  }
});

// Update the Approved Customer Loan by Head of Credit
router.put("/approve/hoc/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const updateObject = {};

    //Update the Approval Status
    updateObject["creditCheck.decisionSummary.headOfCreditApprovalStatus"] =
      "approved";

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      {
        $set: updateObject,
      },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ error: "Customer Not Found" });
    }

    // Update the Loan Status
    await Loan.findOneAndUpdate(
      {
        customer: customer._id,
      },
      {
        loanstatus: "with coo",
      }
    );

    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: "Failed to Head of Credit Approval" });
  }
});

// Update the Approved Customer Loan by Chief Operations Officer
router.put("/approve/coo/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const updateObject = {};

    //Update the Approval Status
    updateObject["creditCheck.decisionSummary.cooApprovalStatus"] = "approved";

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      {
        $set: updateObject,
      },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ error: "Customer Not Found" });
    }

    // Update the Loan Status
    await Loan.findOneAndUpdate(
      {
        customer: customer._id,
      },
      {
        loanstatus: "unbooked",
      }
    );

    res.json(customer);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to Approve by COO" });
  }
});

// update kyc details
router.put("/kyc/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const updates = req.body;
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { kyc: updates },
      { new: true }
    );
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to update kyc details" });
  }
});

// update bankone account details
router.put("/banking/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const updates = req.body;
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { banking: updates },
      { new: true }
    );
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to update account details" });
  }
});

// update remita account details
router.put("/remita/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const updates = req.body;

    // Prepare the update object to set only the desired fields
    const updateObject = {};

    if (updates.hasOwnProperty("isRemitaCheck")) {
      updateObject["remita.isRemitaCheck"] = updates.isRemitaCheck;
    }

    if (updates.hasOwnProperty("remitaStatus")) {
      updateObject["remita.remitaStatus"] = updates.remitaStatus;
    }
    if (updates.hasOwnProperty("loanStatus")) {
      updateObject["remita.loanStatus"] = updates.loanStatus;
    }

    if (updates.hasOwnProperty("remitaDetails")) {
      updateObject["remita.remitaDetails"] = updates.remitaDetails;
    }

    if (updates.hasOwnProperty("disbursementDetails")) {
      updateObject["remita.disbursementDetails"] = updates.disbursementDetails;
    }

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { $set: updateObject },
      { new: true }
    );
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to update account details" });
  }
});

// update remita stop loan status
router.put("/remita/:customerId/stoploan", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const stopLoanStatus = req.body.stopLoanStatus;

    // Find the customer by customerId and update the loanstatus
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { "remita.stopLoanStatus": stopLoanStatus },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to update loanstatus" });
  }
});

module.exports = router;
