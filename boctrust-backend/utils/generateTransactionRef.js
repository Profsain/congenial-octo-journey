const generateTransactionRef = () => {
  const timestamp = Date.now().toString(36).slice(2, 4); // Convert timestamp to base-36
  const random = Math.random().toString(36).slice(2, 4); // Generate random string
  return `${timestamp}${random}`;
};

module.exports = { generateTransactionRef };
