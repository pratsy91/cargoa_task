import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import io from "socket.io-client";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Initialize Socket.IO client
const socket = io("http://localhost:3000", {
  transports: ["websocket"], // Prefer WebSocket for real-time data
});

const LogChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Event Frequency",
        data: [],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
    ],
  });

  useEffect(() => {
    socket.on("newLog", (log) => {
      console.log("Received new log:", log);

      setChartData((prevData) => {
        const newLabels = [
          ...prevData.labels,
          new Date(log.timestamp).toLocaleTimeString(),
        ];
        const newData = [...prevData.datasets[0].data, log.eventCount];

        return {
          labels: newLabels,
          datasets: [
            {
              ...prevData.datasets[0],
              data: newData,
            },
          ],
        };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Real-Time Event Log Chart</h2>
      <Line data={chartData} />
    </div>
  );
};

export default LogChart;
