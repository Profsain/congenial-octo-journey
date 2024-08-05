import axios from "axios";

const fetchAllBanks = async (setBanks) => {
    const apiUrl = import.meta.env.VITE_BASE_URL;
    const res = await axios.get(`${apiUrl}/api/bankone/commercialbanks`);
    setBanks(res.data);
};
  
export default fetchAllBanks;