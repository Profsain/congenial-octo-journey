const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings'); // import settings model

// get all settings endpoint
router.get('/settings', async (req, res) => {
    try {
        // get all settings
        const settings = await Settings.findOne();
        console.log("AAAAAAA", settings);
        // return success response
        return res.status(200).json({ settings });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


// Update settings
router.put('/settings', async (req, res) => {
    try {
        const updatedSettings = req.body;
        const settings = await Settings.findOneAndUpdate({}, updatedSettings, { new: true, upsert: true });
        res.json(settings);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


<<<<<<< HEAD
// Update settings
router.post('/settings/minimumLoanAmount', async (req, res) => {
    console.log("Request Body:", req.body);
    try {
        const allSettings = await Settings.find();

        if (allSettings.length === 0) {
            // Create a new settings document if none exists
            const newSettings = new Settings({ minimumLoanAmount: req.body.minLoanAmount });
            await newSettings.save();
            return res.json({ message: "New settings created", settings: newSettings });
        }

        // Update the existing settings
        const updatedSettings = await Settings.findOneAndUpdate(
            {},
            { minimumLoanAmount: req.body.minLoanAmount },
            { new: true } // Return the updated document
        );
        res.json({ message: "Settings updated", settings: updatedSettings });
    } catch (err) {
        console.error("Error:", err);
        res.status(400).json({ message: err.message });
    }
});



=======
// Update top-up eligibility months here
router.put("/set-month", async (req, res) => {
    const { topUpEligibilityMonths } = req.body;
    const settings = await Settings.findOneAndUpdate({}, { topUpEligibilityMonths }, { new: true });
    res.json(settings);
});

>>>>>>> new-topup
module.exports = router;