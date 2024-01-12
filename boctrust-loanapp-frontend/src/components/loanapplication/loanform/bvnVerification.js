/* eslint-disable no-undef */
const bvnVerification = () => {
  // Step 1: Redirect the customer to the IDP page
  const idpAuthorizeUrl = 'https://idsandbox.nibss-plc.com.ng/oxauth/authorize.htm';
  const clientId = '8e7cd2fe-35b5-4e25-9a98-0a555f1c23cd';
  const redirectUri = 'https://www.boctrustmfb.com/app/nibbs-login';

  const authorizeUrl = `${idpAuthorizeUrl}?scope=icad&acr_values=otp&response_type=code&redirect_uri=${redirectUri}&client_id=${clientId}`;

  // Redirect the user to the IDP authorization page
    window.location.href = authorizeUrl;

}

export default bvnVerification;