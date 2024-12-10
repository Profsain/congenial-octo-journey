const Settings = require("../models/Settings");
const Customer = require("../models/Customer");

const updateTopUpEligibility = async () => {
    try {
        const settings = await Settings.findOne();
        if (!settings) {
            console.error("Settings not found");
            return;
        }

        const monthsThreshold = settings.topUpEligibilityMonths;

        const updatedCustomers = await Customer.updateMany(
            { "topUpLoanEligibility.monthsSinceLastLoan": { $gte: monthsThreshold } },
            { $set: { "topUpLoanEligibility.isEligible": true } }
        );

        console.log(`${updatedCustomers.modifiedCount} customers' top-up eligibility updated.`);
    } catch (error) {
        console.error("Error updating top-up eligibility:", error.message);
    }
};

module.exports = updateTopUpEligibility;
