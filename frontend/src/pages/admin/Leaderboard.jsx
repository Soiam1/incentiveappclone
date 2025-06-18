import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";
import Button from "../../components/ui/Button";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState({
    day: [],
    week: [],
    month: [],
    streak: [],
  });

  const fetchLeaderboard = async () => {
    const token = localStorage.getItem("token");
    try {
      const [day, week, month, streak] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/leaderboard/day`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/api/leaderboard/week`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/api/leaderboard/month`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/api/leaderboard/streak`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setLeaderboard({
        day: day.data,
        week: week.data,
        month: month.data,
        streak: streak.data,
      });
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      alert("Error loading leaderboard data.");
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const renderTable = (title, data) => (
    <section className="border p-4 rounded shadow mb-6 bg-white">
      <h2 className="text-md font-bold mb-2 text-center">{title}</h2>
      {data.length === 0 ? (
        <p className="text-center text-gray-500">No entries yet.</p>
      ) : (
        <table className="w-full text-sm text-center">
          <thead>
            <tr className="border-b">
              <th className="py-1">Name</th>
              <th>Sales Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, idx) => (
              <tr key={`${entry.name}-${idx}`} className="border-b">
                <td className="py-1">{entry.name}</td>
                <td>₹{(entry.sales || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );

  return (
    <div className="p-4 relative">
      <div className="flex justify-center items-center mb-4 relative">
        <h1 className="text-lg font-bold text-center underline">Leaderboard Overview</h1>
        
      </div>
      {renderTable("Star of the Day", leaderboard.day)}
      {renderTable("Star of the Week", leaderboard.week)}
      {renderTable("Star of the Month", leaderboard.month)}
      {renderTable("Streak Breakers", leaderboard.streak)}
    </div>
  );
}
