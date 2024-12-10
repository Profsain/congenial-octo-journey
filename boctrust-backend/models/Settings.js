// Create a schema for settings
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteTitle: String,
    address: String,
    phoneNumber1: String,
    phoneNumber2: String,
    email: String,
    footerText: String,
    copyrightText: String,
    mailType: String,
    fromEmail: String,
    fromName: String,
    smtpName: String,
    smtpPort: Number,
    smtpUsername: String,
    smtpPassword: String,
<<<<<<< HEAD
    minimumLoanAmount: Number
=======
    // top update here
    topUpEligibilityMonths: { type: Number, default: 6 },
>>>>>>> new-topup
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
// export settings model
module.exports = Settings;