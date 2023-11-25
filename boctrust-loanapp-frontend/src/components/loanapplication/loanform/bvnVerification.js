const bvnVerification = () => {
  // Step 1: Redirect the customer to the IDP page
  const idpAuthorizeUrl = 'https://idsandbox.nibss-plc.com.ng/oxauth/authorize.htm';
  const clientId = '8e7cd2fe-35b5-4e25-9a98-0a555f1c23cd';
  const redirectUri = 'https://www.boctrustmfb.com/app/nibbs-login';

  const authorizeUrl = `${idpAuthorizeUrl}?scope=icad&acr_values=otp&response_type=code&redirect_uri=${redirectUri}&client_id=${clientId}`;

  // Redirect the user to the IDP authorization page
    window.location.href = authorizeUrl;

  // Step 2: After the customer is redirected back to your callback URL with a temporary code,
  // extract the code and exchange it for an access token
  const idpTokenUrl = 'https://idsandbox.nibss-plc.com.ng/oxauth/restv1/token';
  const clientSecret = 'R6EuiPa8sLsrdbNMVoxMadTOFlbuEXfdEOTabq82';
  const grantType = 'authorization_code';

  // Simulate receiving the temporary code (replace with the actual code received)
  const urlSearchParams = new URLSearchParams(window.location.search);
  console.log(urlSearchParams)
  const code = urlSearchParams.get('code');

  const exchangeCodeForToken = async () => {
    try {
      // Exchange the code for an access token
      if (!code) {
        throw new Error('Authorization code not found in the URL');
      }
      const tokenRequestBody = new URLSearchParams();
      tokenRequestBody.append('client_id', clientId);
      tokenRequestBody.append('client_secret', clientSecret);
      tokenRequestBody.append('code', code);
      tokenRequestBody.append('redirect_uri', redirectUri);
      tokenRequestBody.append('grant_type', grantType);

      const response = await fetch(idpTokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: tokenRequestBody,
      });

      if (!response.ok) {
        throw new Error(`Token request failed with status ${response.status}`);
      }

      const data = await response.json();
      const accessToken = data.access_token;
      console.log(`Access Token: ${accessToken}`);

      // Step 3: Use the access token to call the API endpoints
      const apiEndpoint = 'your-api-endpoint';

      const apiResponse = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!apiResponse.ok) {
        throw new Error(`API request failed with status ${apiResponse.status}`);
      }

      const apiData = await apiResponse.json();
      console.log('API Response:', apiData);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // Call the function to exchange the code for an access token
  exchangeCodeForToken();
}

export default bvnVerification;