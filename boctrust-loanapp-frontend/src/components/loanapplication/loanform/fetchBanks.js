const fetchAllBanks = async (setBanks) => {
    const apiUrl = import.meta.env.VITE_BASE_URL;
    const response = await fetch(`${apiUrl}/api/bankone/getAllCommercialBank`);
    const data = await response.json();
    setBanks(data);
};
  
export default fetchAllBanks;