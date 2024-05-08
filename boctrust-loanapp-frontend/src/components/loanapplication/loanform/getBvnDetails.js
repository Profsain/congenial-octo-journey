// apiService.js

const clientId = '8e7cd2fe-35b5-4e25-9a98-0a555f1c23cd'; // New Client ID
const clientSecret = 'R6EuiPa8sLsrdbNMVoxMadTOFlbuEXfdEOTabq82'; // New Secret
const accessTokenUrl = 'https://id.nibss-plc.com.ng/oxauth/restv1/token';
const endpoint = 'https://api.nibss-plc.com.ng/bvnconsent/v1/getPartialDetailsWithBvn';

const getAccessToken = async () => {
  try {
    const response = await fetch(accessTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    throw new Error('Failed to get access token');
  }
};

export const getPartialDetailsWithBvn = async (bvn) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${endpoint}?bvn=${bvn}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
      console.log(error)
    throw new Error('Failed to fetch partial details with BVN');
  }
};
