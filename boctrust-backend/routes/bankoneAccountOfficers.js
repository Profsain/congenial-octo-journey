const express = require("express");
const { default: axios } = require("axios");
const router = express.Router();

// add token to environment variable
const token = process.env.BANKONE_TOKEN;
const mfbcode = "100579";

// Add a request interceptor
const axiosInstance = axios.create({
  baseURL: "https://api.mybankone.com",
});

// Update a user
router.get("/", async (req, res) => {
  try {
    const res = await axiosInstance.get(
      `/BankOneWebAPI/api/AccountOfficer/Get/2?authToken=${token}&mfbCode=${mfbcode}`
    );

    return res.status(200).json(res.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}); // update user logic ends here

module.exports = router; // export router
