import { useEffect, useState } from "react";
import RatingChart from "../components/RatingChart";

export default function Home() {
  const [ratings, setRatings] = useState([]);
  const [currentRating, setCurrentRating] = useState(null);

  const fetchData = async () => {
    try {
      const statsRes = await fetch("https://api.chess.com/pub/player/incessantlyinsouciant/stats");
      const statsData = await statsRes.json();
      setCurrentRating(statsData.chess_rapid?.last?.rating || "—");

      const archivesRes = await fetch("https://api.chess.com/pub/player/incessantlyinsouciant/games/archives");
      const archivesData = await archivesRes.json();
      const latestArchive = archivesData.archives.pop();

      const gamesRes = await fetch(latestArchive);
      const gamesData = await gamesRes.json();

      const userGames = gamesData.games
        .filter(g => g.time_class === "rapid")
        .map(g => {
          const player =
            g.white.username.toLowerCase() === "incessantlyinsouciant"
              ? g.white
              : g.black;
          return player.rating;
        })
        .slice(-20);

      setRatings(userGames);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!ratings.length) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-transparent">
      <div className="w-[600px] h-[300px]">
        <RatingChart ratings={ratings} />
      </div>
      <div className="mt-4 text-3xl font-bold text-white drop-shadow-lg">
        Rapid: {currentRating}
      </div>
    </div>
  );
}
