require('dotenv').config();
// Your NIBSS credentials
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const BASE_URL = process.env.NIBSS_BASE_URL;

// Utility function to fetch the access token
const fetchAccessToken = async () => {
  const response = await fetch(`${BASE_URL}/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      scope: `${CLIENT_ID}/.default`,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });

  if (!response.ok) {
    console.log(response)
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();

  return data.access_token;
};

// export function
module.exports = fetchAccessToken;
