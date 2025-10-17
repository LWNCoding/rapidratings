import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

export default function RatingChart({ ratings = [], currentRating }) {
  const safeRatings = Array.isArray(ratings)
    ? ratings.map((r) => Number(r)).filter((r) => !isNaN(r))
    : [];

  if (safeRatings.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-lg">
        No data yet
      </div>
    );
  }

  const data = {
    labels: safeRatings.map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: "Rapid Rating",
        data: safeRatings,
        borderColor: "#a855f7", // purple line
        borderWidth: 3,
        fill: true,
        backgroundColor: "rgba(168,85,247,0.15)", // soft purple glow
        pointRadius: 0,
        tension: 0.35,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (context) => `Rating: ${context.parsed.y}` },
      },
    },
    scales: {
      x: { display: false },
      y: {
        display: false,
        suggestedMin: Math.min(...safeRatings) - 20,
        suggestedMax: Math.max(...safeRatings) + 20,
      },
    },
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{ width: "800px", height: "400px", backgroundColor: "transparent" }}
    >
      <Line data={data} options={options} />
      <div
        className="absolute bottom-6 text-6xl drop-shadow-lg"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          color: "#a855f7",
          fontFamily: "'Segoe UI', sans-serif",
          fontWeight: "900",
          letterSpacing: "1px",
        }}
      >
        ᴜʟᴛɪᴍᴀᴛᴇ {currentRating ?? "—"}
      </div>
    </div>
  );
}
