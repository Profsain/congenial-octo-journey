// This file contains a utility function that fetches the access token from the NIBSS API
const dotenv = require('dotenv');

// Configure dotenv
dotenv.config();

// Utility function to fetch the access token
const fetchAccessToken = async () => {
  // Your NIBSS credentials
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const baseUrl = process.env.NIBSS_BASE_URL;
  const apiKey = process.env.NIBSS_API_KEY;
  console.log("Fetching access token..");

  try {
    // Prepare the body data as JSON
    const bodyData = {
      client_id: clientId,
      scope: `${clientId}/.default`,
      client_secret: clientSecret,
      // api_key: apiKey,
      grant_type: 'client_credentials'
    };

    console.log("Body Data:", JSON.stringify(bodyData));

    // Fetch the access token
    const response = await fetch(`${baseUrl}/v2/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(bodyData) // Convert the body data to a JSON string
    });

    if (!response.ok) {
      const responseBody = await response.text(); // Retrieve response body for debugging
      console.log(responseBody);
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Token Data:", data);
    return data.access_token;
  } catch (error) {
    console.error("Error fetching access token: ", error);
  }
};

// Export function
module.exports = fetchAccessToken;
