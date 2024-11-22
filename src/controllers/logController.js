const { addLog, queryLogs } = require("../services/logService");

exports.createLog = async (req, res) => {
  try {
    const { error } = logSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const log = await addLog(req.body);
    // Broadcast the log to all clients
    io.emit("newLog", log);
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    // Destructure query parameters for filtering and pagination
    const {
      eventType,
      sourceAppId,
      startTimestamp,
      endTimestamp,
      page = 1, // Default to page 1 if not provided
      limit = 10, // Default to limit 10 per page if not provided
    } = req.query;

    // Build the filters object based on query parameters
    const filters = {};

    if (eventType) filters.eventType = eventType;
    if (sourceAppId) filters.sourceAppId = sourceAppId;
    if (startTimestamp && endTimestamp) {
      filters.timestamp = {
        $gte: new Date(startTimestamp),
        $lte: new Date(endTimestamp),
      };
    }

    // Pagination options
    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit), // Calculate skip based on page
      sort: { timestamp: -1 }, // Sort by timestamp in descending order
    };

    // Query the logs from the database with filters and pagination
    const logs = await queryLogs(filters, options);

    // Get total count of logs for pagination info
    const totalLogs = await Log.countDocuments(filters);

    res.json({
      success: true,
      data: logs,
      totalLogs,
      totalPages: Math.ceil(totalLogs / options.limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
