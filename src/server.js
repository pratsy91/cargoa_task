require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");

connectDB();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Create a Socket.IO instance with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // Frontend domain (React app)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Function to generate random event logs
const generateRandomLog = () => {
  const eventTypes = ["Error", "Warning", "Info", "Debug"];
  const randomEventType =
    eventTypes[Math.floor(Math.random() * eventTypes.length)];
  const randomEventCount = Math.floor(Math.random() * 10) + 1; // Random event count between 1 and 10
  const timestamp = new Date().toISOString(); // Current timestamp

  return {
    eventType: randomEventType,
    timestamp,
    eventCount: randomEventCount,
  };
};

// Emit random logs every 5 seconds
setInterval(() => {
  const newLog = generateRandomLog();
  console.log("Emitting new log:", newLog);
  io.emit("newLog", newLog); // Emit the new log to all connected clients
}, 5000); // 5 seconds interval

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
