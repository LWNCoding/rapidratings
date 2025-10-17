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

export default function RatingChart({ ratings }) {
  // ✅ Guarantee ratings is always a clean numeric array
  const safeRatings = Array.isArray(ratings)
    ? ratings.map((r) => Number(r)).filter((r) => !isNaN(r))
    : [];

  // Show placeholder if there's no usable data yet
  if (safeRatings.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-lg">
        No data yet
      </div>
    );
  }

  // Prepare data for Chart.js
  const data = {
    labels: safeRatings.map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: "Rapid Rating",
        data: safeRatings,
        borderColor: "#81b64c",
        borderWidth: 3,
        fill: true,
        backgroundColor: "rgba(129,182,76,0.15)",
        pointRadius: 0,
        tension: 0.3,
      },
    ],
  };

  // Chart display options
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Rating: ${context.parsed.y}`,
        },
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
    <div className="w-full h-full">
      <Line data={data} options={options} />
    </div>
  );
}
