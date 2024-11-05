import apiClient from "../../../../lib/axios";

const stopLoanFunc = async (loanId) => {
  const stopLoanStatus = "stopped";

  await apiClient
    .put(`/updatecustomer/remita/${loanId}/stoploan`, {
      stopLoanStatus,
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error updating loan status:", error.message);
    });
};

export default stopLoanFunc;
