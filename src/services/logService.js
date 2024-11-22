const Log = require("../models/logModel");

const addLog = async (logData) => {
  const latestLog = await Log.findOne().sort({ _id: -1 });
  const previousHash = latestLog ? latestLog.currentHash : "0"; // Default to "0" if no logs exist

  const newLog = {
    ...logData,
    previousHash,
    currentHash: calculateHash({ ...logData, previousHash }), // Calculate the current hash
  };

  const log = new Log(newLog);
  await log.save();
  return log;
};

// Function to query logs with filters and pagination options
const queryLogs = async (filters, options) => {
  return await Log.find(filters)
    .skip(options.skip)
    .limit(options.limit)
    .sort(options.sort);
};

module.exports = { addLog, queryLogs };
