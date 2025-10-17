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
      {
        label: "Rapid Rating",
        data: safeRatings,
        borderColor: "#a855f7", // purple line
        borderWidth: 3,
        fill: true,
        backgroundColor: "rgba(168,85,247,0.12)", // soft purple glow
        pointRadius: 0,
        tension: 0.35,
      },
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
        enabled: false, // disable tooltips
      },
      annotation: {
        annotations: {
          ratingLabel: {
            type: "label",
            xValue: lastIndex,
            yValue: lastValue,
            backgroundColor: "transparent",
            content: [`${lastValue}`],
            color: "#a855f7",
            font: {
              size: 22,
              weight: "bold",
            },
          },
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
          callback: (value) => `${value}`, // prevents commas
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
      className="relative"
      style={{ width: "900px", height: "400px", backgroundColor: "transparent" }}
    >
      <Line data={data} options={options} />
    </div>
  );
}
