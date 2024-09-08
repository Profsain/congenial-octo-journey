const express = require('express');
const router = express.Router();
const fetchAccessToken = require('../utils/nddAccessToken');

const BASE_URL = 'https://apitest.nibss-plc.com.ng/ndd/v2';

// Route to create a mandate direct debit
router.post('/createMandateDirectDebit', async (req, res) => {
  console.log("create mandate called")
  try {
    const accessToken = await fetchAccessToken();
    console.log("Token", accessToken);

    const formData = req.body; // Assuming form data is in req.body

    console.log("Request Headers:", {
  'Authorization': `Bearer ${accessToken}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
    });
    
    console.log("Data", formData);

    const response = await fetch(`${BASE_URL}/api/MandateRequest/CreateMandateDirectDebit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    });

    console.log("Response Status:", response.status);
    console.log("Response Status Text:", response.statusText);
    console.log("Response Headers:", response.headers);
    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch mandate details
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

module.exports = router;
