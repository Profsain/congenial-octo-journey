import apiClient from "../../../../lib/axios";

const updateSalaryHistory = async (
  customerId,
  data,
  remitaStatus = "pending",
  loanStatus = "pending",
  disbursementDetails = {}
) => {
  const apiUrl = import.meta.env.VITE_BASE_URL;

  // update customer data with remita details
  const remitaData = {
    isRemitaCheck: true,
    remitaStatus: remitaStatus,
    loanStatus: loanStatus,
    remitaDetails: data,
    disbursementDetails: disbursementDetails,
  };

  await apiClient.put(`/updatecustomer/remita/${customerId}`, remitaData);
};

export default updateSalaryHistory;
