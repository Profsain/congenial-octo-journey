const updateSalaryHistory = async (customerId, data, remitaStatus="pending", loanStatus="pending", disbursementDetails={}) => {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  
     // update customer data with remita details
  const remitaData = {
    isRemitaCheck: true,
    remitaStatus: remitaStatus,
    loanStatus: loanStatus,
    remitaDetails: data,  
    disbursementDetails: disbursementDetails
  };
  
  const res = await fetch(
    `${apiUrl}/api/updatecustomer/remita/${customerId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(remitaData),
    }
  );
  const result = await res.json();

  return result;
}

export  default updateSalaryHistory;