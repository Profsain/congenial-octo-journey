const express = require('express');
const router = express.Router();
const fetchAccessToken = require('../utils/nddAccessToken');

const BASE_URL = 'https://apitest.nibss-plc.com.ng/mandate/v1';

// Route to create a mandate direct debit
app.post('/createMandate', async (req, res) => {
  try {
    const accessToken = await fetchAccessToken();
    const formData = req.body; 

    const response = await fetch(`${BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: formData
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    // store mandate data to database
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
