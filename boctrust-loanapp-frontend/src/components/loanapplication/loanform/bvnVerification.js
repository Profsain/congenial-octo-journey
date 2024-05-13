/* eslint-disable no-undef */
const bvnVerification = () => {
  // Step 1: Redirect the customer to the IDP page
  const idpAuthorizeUrl = 'https://id.nibss-plc.com.ng/oxauth/restv1/authorize';

  // const clientId = '0a8580c1-7254-4774-8b63-048092e8e1b3';
  // const clientSecret = 'h9JqBpVYmx14D1oGtdbFmIBza70ft0BM7GgwlYfS'
  
  const clientId = '0a8580c1-7254-4774-8b63-048092e8e1b3';
  const redirectUri = 'https://www.boctrustmfb.com/app/nibbs-login';

  const authorizeUrl = `${idpAuthorizeUrl}?scope=icad&acr_values=otp&response_type=code&redirect_uri=${redirectUri}&client_id=${clientId}`;

  // Redirect the user to the IDP authorization page
    window.location.href = authorizeUrl;

}
export default bvnVerification;