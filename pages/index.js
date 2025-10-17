import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the chart so it only loads client-side
const RatingChart = dynamic(() => import("../components/RatingChart"), { ssr: false });

export default function Home() {
  const [ratings, setRatings] = useState([]);
  const [currentRating, setCurrentRating] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);

      // Get player stats
      const statsRes = await fetch("https://api.chess.com/pub/player/incessantlyinsouciant/stats");
      if (!statsRes.ok) throw new Error("Stats fetch failed");
      const statsData = await statsRes.json();
      setCurrentRating(statsData.chess_rapid?.last?.rating || "—");

      // Get archive list
      const archivesRes = await fetch("https://api.chess.com/pub/player/incessantlyinsouciant/games/archives");
      if (!archivesRes.ok) throw new Error("Archives fetch failed");
      const archivesData = await archivesRes.json();

      // Grab latest archive
      const latestArchive = archivesData.archives?.slice(-1)[0];
      if (!latestArchive) throw new Error("No archive found");

      // Fetch recent games
      const gamesRes = await fetch(latestArchive);
      if (!gamesRes.ok) throw new Error("Games fetch failed");
      const gamesData = await gamesRes.json();

      // Extract recent rapid game ratings
      const userGames = (gamesData.games || [])
        .filter((g) => g.time_class === "rapid")
        .map((g) => {
          const player =
            g.white.username?.toLowerCase() === "incessantlyinsouciant"
              ? g.white
              : g.black;
          return player?.rating;
        })
        .filter((r) => typeof r === "number")
        .slice(-20);

      setRatings(userGames);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load data from Chess.com");
      setRatings([]);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-transparent text-white">
      <div className="w-[600px] h-[300px] flex items-center justify-center">
        {error ? (
          <div className="text-red-400">{error}</div>
        ) : ratings.length > 0 ? (
          <RatingChart ratings={ratings} />
        ) : (
          <div className="text-gray-400">Loading...</div>
        )}
      </div>
      <div className="mt-4 text-3xl font-bold text-white drop-shadow-lg">
        Rapid: {currentRating ?? "—"}
      </div>
    </div>
  );
}
