/* eslint-disable no-undef */
const bvnVerification = () => {
  // Step 1: Redirect the customer to the IDP page
  const idpAuthorizeUrl = 'https://id.nibss-plc.com.ng/oxauth/restv1/authorize';

  // const clientId = '0a8580c1-7254-4774-8b63-048092e8e1b3';
  // const clientSecret = 'R6EuiPa8sLsrdbNMVoxMadTOFlbuEXfdEOTabq82'
  
  const clientId = '8e7cd2fe-35b5-4e25-9a98-0a555f1c23cd';
  const redirectUri = 'https://www.boctrustmfb.com/app/nibbs-login';

  const authorizeUrl = `${idpAuthorizeUrl}?scope=icad&acr_values=otp&response_type=code&redirect_uri=${redirectUri}&client_id=${clientId}`;

  // Redirect the user to the IDP authorization page
    window.location.href = authorizeUrl;

}
export default bvnVerification;