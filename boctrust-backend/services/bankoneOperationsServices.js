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

    return response.data;
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation:",
      error?.message
    );
    throw error?.message || "Error"; // Optionally, rethrow the error if you want to handle it further up
  }
};

const getAccountProduct = async ({
  careertype,
  deductions,
  otheremployername,
}) => {
  // Construct the URL for interbank transfer

  const baseUrl = process.env.BANKONE_BASE_URL;
  const token = process.env.BANKONE_TOKEN;

  try {
    const customerAccountProductCode =
      careertype == "government employee" &&
      deductions == "ippis" &&
      !otheremployername
        ? 107
        : careertype !== "business owner" && otheremployername
        ? 200
        : 201;
    const response = await axios.get(
      `${baseUrl}/BankOneWebAPI/api/Product/GetByCode/2?authToken=${token}&productCode=${customerAccountProductCode}`
    );

    return response?.data;
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation:",
      error?.message
    );
    throw error?.message || "Error"; // Optionally, rethrow the error if you want to handle it further up
  }
};

const getLoanProduct = async ({
  careertype,
  deductions,
  otheremployername,
  loanproduct,
}) => {
  // Construct the URL for interbank transfer

  const baseUrl = process.env.BANKONE_BASE_URL;
  const token = process.env.BANKONE_TOKEN;

  // * IPPIS Loan: 306
  // * ROSCA Loan: 303
  // * Salary Loan: 301
  // * Term Loan: 305

  try {
    const customerAccountProductCode =
      careertype == "government employee" &&
      deductions == "ippis" &&
      !otheremployername
        ? 306
        : careertype !== "business owner" && otheremployername
        ? loanproduct
        : 305;

    const { data } = await axios.get(
      `${baseUrl}/BankOneWebAPI/api/Product/GetByCode/2?authToken=${token}&productCode=${customerAccountProductCode}`
    );

    return data;
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
  getAccountProduct,
  getLoanProduct,
};
