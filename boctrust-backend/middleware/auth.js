const jwt = require("jsonwebtoken");
const User = require("../models/AdminUser");
const Customer = require("../models/Customer");

const authenticateToken = async (req, res, next) => {
  try {
    // Get token from request header
    const token = req.headers.authorization.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    // Get user from database
    let user = await User.findOne({
      _id: decoded.user_id,
      username: decoded.username,
    });

    // Check if user exist
    if (!user) {
      user = await Customer.findOne({
        _id: decoded.user_id,
        username: decoded.username,
      });
    }

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

const authenticateStaffToken = async (req, res, next) => {
  try {
    // Get token from request header
    const token = req.headers.authorization.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    // Get user from database
    let user = await User.findOne({
      _id: decoded.user_id,
      username: decoded.username,
    });

    // Check if user exist

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

const authenticateCustomerToken = async (req, res, next) => {
  try {
    // Get token from request header
    const token = req.headers.authorization.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    // Get user from database
    let user = await Customer.findOne({
      _id: decoded.user_id,
      username: decoded.username,
    });

    // Check if user exist

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};





module.exports = {
  authenticateToken,
  authenticateCustomerToken,
  authenticateStaffToken,
}; // export middleware
