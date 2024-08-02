
const express = require('express');
const multer = require('multer');
const path = require('path');
const JobApplication = require('../models/JobApplication');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// apply for a job
router.post('/apply', upload.single('resume'), async (req, res) => {
  const { name, email, phone, coverLetter, vacancy } = req.body;
  const resume = req.file;

  if (!resume) {
    return res.status(400).send('Resume is required');
  }

  try {
    const newApplication = new JobApplication({
      name,
      email,
      phone,
      coverLetter,
      resumePath: resume.path,
      vacancy: JSON.parse(vacancy),
    });

    await newApplication.save();
    res.status(201).send('Application submitted successfully!');
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).send('There was an error submitting the application');
  }
});

module.exports = router;
