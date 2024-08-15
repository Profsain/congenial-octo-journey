const { default: axios } = require("axios");

const getCustomerAccountInfoByTrackingRef = async (trackinRef) => {
    const baseUrl = process.env.BANKONE_BASE_URL;
    const token = process.env.BANKONE_TOKEN;
    const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
  };

  const res = await fetch(
    `${baseUrl}/BankOneWebAPI/api/Account/GetAccountByTransactionTrackingRef/2?authToken=${token}&transactionTrackingRef=${trackinRef}`,
    options
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data);
  }

  return data;
};

const handleInterBankTransfer = async (transferRequestPayload) => {
  // Construct the URL for interbank transfer

  const baseUrl = process.env.BANKONE_BASE_URL;

  const apiUrl = `${baseUrl}/thirdpartyapiservice/apiservice/Transfer/InterBankTransfer`;

  try {
    const response = await axios.post(apiUrl, transferRequestPayload);
  
    return response.data
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation:",
      error?.message
    );
    throw error?.message || "Error"; // Optionally, rethrow the error if you want to handle it further up
  }
};

module.exports = {
  getCustomerAccountInfoByTrackingRef,
  handleInterBankTransfer,
};
