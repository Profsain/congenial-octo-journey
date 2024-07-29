const express = require('express');
const router = express.Router();
const fetchAccessToken = require('../utils/nddAccessToken');

const BASE_URL = 'https://apitest.nibss-plc.com.ng/ndd/v2';

// Route to create a mandate direct debit
app.post('/createMandateDirectDebit', async (req, res) => {
  try {
    const accessToken = await fetchAccessToken();
    const formData = new URLSearchParams(req.body); // Assuming form data is in req.body

    const response = await fetch(`${BASE_URL}/api/MandateRequest/CreateMandateDirectDebit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
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

// Route to fetch mandate details
app.post('/fetchMandateDetails', async (req, res) => {
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
