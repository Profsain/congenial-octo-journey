const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const multer = require("multer");
const CustomerModel = require("../models/Customer"); // Import customer model
const Loan = require("../models/Loan");

// configure dotenv
dotenv.config();

const password = process.env.EMAIL_PASSWORD;

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
  { name: "valididcard" },
  { name: "uploadpayslip" },
  { name: "uploadbankstatement" },
  { name: "signature" },
  { name: "photocapture" },
  { name: "employmentletter" },
]);
// multer configuration end here

// Create a new customer
router.post("/customer", multipleUpload, async (req, res) => {
  if (req.files.valididcard) {
    req.body.valididcard = req.files.valididcard[0].filename;
  }
  if (req.files.uploadpayslip) {
    req.body.uploadpayslip = req.files.uploadpayslip[0].filename;
  }
  if (req.files.uploadbankstatement) {
    req.body.uploadbankstatement = req.files.uploadbankstatement[0].filename;
  }
  if (req.files.signature) {
    req.body.signature = req.files.signature[0].filename;
  }
  if (req.files.photocapture) {
    req.body.photocapture = req.files.photocapture[0].filename;
  }
  if (req.files.employmentletter) {
    req.body.photocapture = req.files.employmentletter[0].filename;
  }

  // hash password
  // check if user already exist
  // Validate if user exist in our database
  const { email } = req.body;
  const oldUser = await CustomerModel.findOne({ email });

  if (oldUser) {
    return res.status(409).json({ error: "User Already Exist. Please Login" });
  }

  // Encrypt user password
  req.body.password = await bcrypt.hash(req.body.password, 10);
  req.body.confirmpassword = await bcrypt.hash(req.body.confirmpassword, 10);

  try {
    const customer = await CustomerModel.create(req.body);

    const loan = await Loan.create({
      customer: customer._id,
      loanproduct: req.body.loanproduct,
      loanamount: req.body.loanamount,
      monthlyrepayment: req.body.monthlyrepayment,
      buyoverloan: req.body.buyoverloan,
      numberofmonth: req.body.numberofmonth,
      loantotalrepayment: req.body.loantotalrepayment,
      loanpurpose: req.body.loanpurpose,
      otherpurpose: req.body.otherpurpose,
      deductions: req.body.deductions,
    });

    res.status(201).json({ customer, loan });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Unable to create customer" });
  }
});

// Read all customer
const baseUrl = process.env.BASE_URL;

router.get("/customers", async (req, res) => {
  try {
    const customer = await CustomerModel.find()
      .populate("employer")
      .sort({ createdAt: -1 });

    // exclude password and confirm password from customer
    customer.forEach((customer) => {
      customer.password = undefined;
      customer.confirmpassword = undefined;
    });

    // Map users to include image URLs
    const customerWithImages = customer.map((customer) => {
      return {
        ...customer.toJSON(),
        valididcard: `${baseUrl}/public/filesUpload/${customer.valididcard}`,
        uploadpayslip: `${baseUrl}/public/filesUpload/${customer.uploadpayslip}`,
        uploadbankstatement: `${baseUrl}/public/filesUpload/${customer.uploadbankstatement}`,
        signature: `${baseUrl}/public/filesUpload/${customer.signature}`,
        employmentletter: `${baseUrl}/public/filesUpload/${customer.employmentletter}`,
        photocaptureImg: `${baseUrl}/public/filesUpload/${customer.photocapture}`,
      };
    });

    // Return success response with users and image URLs
    return res.status(200).json({ customer: customerWithImages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to fetch customer" });
  }
});

// Get Customer and His Loan with KYC
router.get("/", async (req, res) => {
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

// update customer loan status
router.put("/customer/disbursestatus/:customerId", async (req, res) => {
  try {
    const customer = await CustomerModel.findByIdAndUpdate(
      req.params.customerId,
      { disbursementstatus: req.body.disbursementstatus },
      {
        new: true,
      }
    );
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Unable to update customer" });
  }
});

module.exports = router;
