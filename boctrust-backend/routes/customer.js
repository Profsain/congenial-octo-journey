const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const CustomerModel = require('../models/Customer'); // Import customer model

// configure dotenv
dotenv.config();


// Set up Multer storage to define where to save the uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/filesUpload/'); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Rename the file with a unique name
  },
});

const upload = multer({
  storage: storage,
});

const multipleUpload = upload.fields([{ name: 'valididcard' }, { name: 'uploadpayslip' }, { name: 'signature' }, { name: 'photocapture' }, {name: 'employmentletter'}]);
// multer configuration end here


// Create a new customer
router.post('/customer', multipleUpload, async (req, res) => {
  if (req.files.valididcard) {
    req.body.valididcard = req.files.valididcard[0].filename;
  }
  if (req.files.uploadpayslip) {
    req.body.uploadpayslip = req.files.uploadpayslip[0].filename;
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
  return res.status(409).json({ error: 'User Already Exist. Please Login' });
  }

  // Encrypt user password
  req.body.password = await bcrypt.hash(req.body.password, 10);
  req.body.confirmpassword = await bcrypt.hash(req.body.confirmpassword, 10);
    
 
  try {
    const customer = await CustomerModel.create(req.body);
 
    res.status(201).json(customer);
    
  } catch (error) {
    res.status(400).json({ error: 'Unable to create customer' });
  }
});

// customer login
router.post('/login', async (req, res) => { 

   try {
        // get user input
        const { username, password } = req.body;
      
        // validate user input
        if (!(username && password)) {
            return res.status(400).json({ error: 'All input is required' });
        }

        // find customer by username
     const customer = await CustomerModel.findOne({ username });

        // validate if user exist in our database and create token
        if (customer && (bcrypt.compare(password, customer.password))) {
            // Create token
            const token = jwt.sign(
                { customer_id: customer._id, username },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '2h',
                }
            );

            // save customer token
            customer.token = token;

          // map customer to include image URLs
          const customerWithImages = {
            ...customer.toJSON(),
            photocaptureImg: `${baseUrl}/public/filesUpload/${customer.photocapture}`,
          };
            return res.status(200).json({ success: 'Login successful', customer: customerWithImages });
        }
        return res.status(400).json({ error: 'Invalid Credentials' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Read all customer
const baseUrl = process.env.BASE_URL;

router.get('/customers', async (req, res) => {
  try {
    const customer = await CustomerModel.find();
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
        signature: `${baseUrl}/public/filesUpload/${customer.signature}`,
        employmentletter: `${baseUrl}/public/filesUpload/${customer.employmentletter}`,
        photocaptureImg: `${baseUrl}/public/filesUpload/${customer.photocapture}`,
      };
    });


    // Return success response with users and image URLs
    return res.status(200).json({ customer: customerWithImages });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch customer' });
  }
});

// Read a customer by ID
router.get('/customer/:customerId', async (req, res) => {
  try {
    const customer = await CustomerModel.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch customer' });
  }
});

// Update a customer by ID
router.put('/customer/:customerId', async (req, res) => {
  try {
    const customer = await CustomerModel.findByIdAndUpdate(req.params.customerId, req.body, {
      new: true,
    });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update customer' });
  }
});

// update customer loan status
router.put('/customer/disbursestatus/:customerId', async (req, res) => {
  try {
    const customer = await CustomerModel
      .findByIdAndUpdate(req.params.customerId, { disbursementstatus: req.body.disbursementstatus }, {
        new: true,
      });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update customer' });
  }
});


// Delete a customer by ID
router.delete('/customer/:customerId', async (req, res) => {
  try {
    const customer = await CustomerModel.findByIdAndRemove(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete customer' });
  }
});

module.exports = router;
