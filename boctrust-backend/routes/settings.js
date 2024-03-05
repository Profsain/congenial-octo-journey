const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings'); // import settings model

// get all settings endpoint
router.get('/settings', async (req, res) => {
    try {
        // get all settings
        const settings = await Settings.find();
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

module.exports = router;