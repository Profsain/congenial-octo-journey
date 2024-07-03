const express = require('express');
const router = express.Router();

router.post('/getAccessToken', async (req, res) => {
  const idpTokenUrl = 'https://idsandbox.nibss-plc.com.ng/oxauth/restv1/token';
  const clientSecret = 'R6EuiPa8sLsrdbNMVoxMadTOFlbuEXfdEOTabq82';
  const grantType = 'authorization_code';
  const clientId = '8e7cd2fe-35b5-4e25-9a98-0a555f1c23cd';
  const redirectUri = 'https://www.boctrustmfb.com/app/nibbs-login';

  try {
    const tokenRequestBody = new URLSearchParams();
    tokenRequestBody.append('client_id', clientId);
    tokenRequestBody.append('client_secret', clientSecret);
    tokenRequestBody.append('code', req.body.code);
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
    res.json(data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;