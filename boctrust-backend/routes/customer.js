const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const CustomerModel = require("../models/Customer"); // Import customer model
const Customer = require("../models/Customer");

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

    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: "Unable to create customer" });
  }
});

// customer login
router.post("/login", async (req, res) => {
  try {
    // get user input
    const { username, password } = req.body;

    // validate user input
    if (!(username && password)) {
      return res.status(400).json({ error: "All input is required" });
    }

    // find customer by username
    const customer = await CustomerModel.findOne({ username });

    // validate if user exist in our database and create token
    if (customer && bcrypt.compare(password, customer.password)) {
      // Create token
      const token = jwt.sign(
        { customer_id: customer._id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save customer token
      customer.token = token;

      // map customer to include image URLs
      const customerWithImages = {
        ...customer.toJSON(),
        photocaptureImg: `${baseUrl}/public/filesUpload/${customer.photocapture}`,
      };
      return res
        .status(200)
        .json({ success: "Login successful", customer: customerWithImages });
    }
    return res.status(400).json({ error: "Invalid Credentials" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Read all customer
const baseUrl = process.env.BASE_URL;

router.get("/customers", async (req, res) => {
  try {
    const customer = await CustomerModel.find().sort({ createdAt: -1 });

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
    res.status(500).json({ error: "Unable to fetch customer" });
  }
});

// Read a customer by ID
router.get("/customer/:customerId", async (req, res) => {
  try {
    let customer = await CustomerModel.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    customer = {
      ...customer.toJSON(),
      valididcard: `${baseUrl}/public/filesUpload/${customer.valididcard}`,
      uploadpayslip: `${baseUrl}/public/filesUpload/${customer.uploadpayslip}`,
      uploadbankstatement: `${baseUrl}/public/filesUpload/${customer.uploadbankstatement}`,
      signature: `${baseUrl}/public/filesUpload/${customer.signature}`,
      employmentletter: `${baseUrl}/public/filesUpload/${customer.employmentletter}`,
      photocaptureImg: `${baseUrl}/public/filesUpload/${customer.photocapture}`,
    };
    console.log(customer, "customer");
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch customer" });
  }
});

// Update a customer by ID
router.put("/customer/:customerId", async (req, res) => {
  try {
    const customer = await CustomerModel.findByIdAndUpdate(
      req.params.customerId,
      req.body,
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

// Delete a customer by ID
router.delete("/customer/:customerId", async (req, res) => {
  try {
    const customer = await CustomerModel.findByIdAndRemove(
      req.params.customerId
    );
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete customer" });
  }
});

// forget password logic
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the database
    const user = await Customer.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.token = resetToken;
    await user.save();

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
      from: "ebusiness@boctrustmfb.com",
      to: email,
      subject: "Boctrust MFB Password Reset",
      text: `Click the following link to reset your password: https://boctrustmfb.com/reset-password/${resetToken}`,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Failed to send reset email" });
      }

      res.status(200).json({ message: "Reset email sent successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Reset Password Endpoint
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    console.log("customer", token, newPassword);

    // Find the user with the provided token
    const customer = await Customer.findOne({ token });
    console.log("Find customer", customer);
    if (!customer) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the token
    customer.password = hashedPassword;
    customer.token = null; // Clear the token
    await customer.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// add new loan operations
// Endpoint to add a new loan to the allLoans array of a customer
router.post("/:customerId/new-loans", async (req, res) => {
  const { customerId } = req.params;
  const newLoan = req.body; // Assuming the loan object is sent in the request body

  try {
    // Find the customer by ID
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Add the new loan to the allLoans array
    customer.allLoans.push(newLoan);

    // Save the updated customer document
    await customer.save();

    res.status(201).json({ message: "Loan added successfully", loan: newLoan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to fetch all loans for a customer
router.get("/:customerId/all-loans", async (req, res) => {
  const { customerId } = req.params;

  try {
    // Find the customer by ID
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Return the allLoans array
    res.status(200).json(customer.allLoans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to update a loan object in the allLoans array
router.put("/:customerId/loans/:loanId", async (req, res) => {
  const { customerId, loanId } = req.params;
  const loanUpdates = req.body;

  try {
    // Find the customer by ID
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Find the loan by ID within the allLoans array
    const loanIndex = customer.allLoans.findIndex(
      (loan) => loan._id.toString() === loanId
    );

    if (loanIndex === -1) {
      return res.status(404).json({ error: "Loan not found" });
    }

    // Update the loan properties
    customer.allLoans[loanIndex] = {
      ...customer.allLoans[loanIndex].toObject(), // Convert Mongoose document to plain object
      ...loanUpdates, // Merge updates
    };

    // Save the updated customer document
    await customer.save();

    res.status(200).json({
      message: "Loan updated successfully",
      loan: customer.allLoans[loanIndex],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
