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

  const lastIndex = safeRatings.length - 1;
  const lastValue = safeRatings[lastIndex];

  const data = {
    labels: safeRatings.map((_, i) => `#${i + 1}`),
    datasets: [
      // main purple line
      {
        label: "Rapid Rating",
        data: safeRatings,
        borderColor: "#a855f7",
        borderWidth: 3,
        fill: true,
        backgroundColor: "rgba(168,85,247,0.12)",
        pointRadius: 0,
        tension: 0.35,
      },
      // highlight dot for current rating
      {
        label: "Current",
        data: safeRatings.map((r, i) => (i === lastIndex ? r : null)),
        borderColor: "#a855f7",
        backgroundColor: "#a855f7",
        pointRadius: 8,
        pointHoverRadius: 8,
        showLine: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) =>
            context.parsed.y ? `Rating: ${context.parsed.y}` : "",
        },
      },
    },
    scales: {
      x: { display: false },
      y: {
        display: true,
        ticks: {
          color: "rgba(255,255,255,0.25)",
          font: { size: 14 },
          stepSize: 50,
        },
        grid: {
          color: "rgba(255,255,255,0.08)",
          lineWidth: 1,
        },
        suggestedMin: Math.floor(Math.min(...safeRatings) / 50) * 50 - 50,
        suggestedMax: Math.ceil(Math.max(...safeRatings) / 50) * 50 + 50,
      },
    },
    animation: false,
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: "900px", height: "400px", backgroundColor: "transparent" }}
    >
      <Line data={data} options={options} />
      {/* rating label next to current point */}
      <div
        className="absolute text-4xl font-bold drop-shadow-lg"
        style={{
          color: "#a855f7",
          fontFamily: "'Segoe UI', sans-serif",
          transform: "translate(-50%, -50%)",
          left: "75%", // roughly aligns near right side where latest point is
          top: "40%",  // adjust vertical alignment
          pointerEvents: "none",
        }}
      >
        ᴜʟᴛɪᴍᴀᴛᴇ {lastValue ?? currentRating ?? "—"}
      </div>
    </div>
  );
}
