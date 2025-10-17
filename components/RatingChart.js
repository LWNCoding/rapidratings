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

// Register necessary chart components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

export default function RatingChart({ ratings = [], currentRating }) {
  // Ensure ratings is always a clean numeric array
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
    maintainAspectRatio: false,
  };

  return (
    <div className="relative w-full h-full">
      <Line data={data} options={options} />
      {/* Centered rating text below the line */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-5xl font-bold text-purple-400 drop-shadow-lg">
        {currentRating ?? "—"}
      </div>
    </div>
  );
}
