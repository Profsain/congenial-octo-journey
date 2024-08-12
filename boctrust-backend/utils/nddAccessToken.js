const querystring = require('querystring'); 

async function fetchAccessToken() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const baseUrl = process.env.NIBSS_BASE_URL;

  // Define the URL of the API endpoint
  const url = `${baseUrl}/reset`;

  // Define the request payload
  const requestBody = {
    client_id: clientId,
    scope: `${clientId}/.default`,
    client_secret: clientSecret,
    grant_type: 'client_credentials'
  };

  try {
    // Make the API request using fetch
    const response = await fetch(url, {
      method: 'POST', // HTTP method to be used for the request
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Specify the content type
      },
      body: querystring.stringify(requestBody) // Convert the requestBody object to a URL-encoded string
    });

    // Check if the response was successful
    if (response.ok) {
      // Parse the JSON response body
      const data = await response.json();
      console.log('Access token:', data.access_token);
      return data.access_token; // Return the access token
    } else {
      // Handle errors if the response was not successful
      const errorData = await response.json();
      console.error('Error:', errorData);
      throw new Error(`Error: ${errorData.error_description}`);
    }
  } catch (error) {
    // Handle network or other errors
    console.error('Fetch error:', error);
    throw error;
  }
}

module.exports = fetchAccessToken;
