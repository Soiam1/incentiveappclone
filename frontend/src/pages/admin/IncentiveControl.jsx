import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";
import Button from "../../components/ui/Button";
import { toLocalTime } from "../../utils/formatDate";

export default function IncentiveControl() {
  const [incentives, setIncentives] = useState([]);

  useEffect(() => {
    fetchIncentives();
  }, []);

  const fetchIncentives = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/incentives`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncentives(res.data);
    } catch (err) {
      console.error("Error loading incentives", err);
      alert("Could not load incentives.");
    }
  };

  const toggleVisibility = async (id, currentState) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE_URL}/api/incentives/${id}/visibility`,
        { is_visible: !currentState },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIncentives((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_visible: !currentState } : item
        )
      );
    } catch (err) {
      console.error("Error toggling visibility", err);
      alert("Could not update visibility.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4">🎯 Incentive Control Panel</h2>
      {incentives.length === 0 ? (
        <p className="text-gray-500">No incentives available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border text-sm">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-3 py-2">Barcode</th>
                <th className="px-3 py-2">Trait</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Timestamp</th>
                <th className="px-3 py-2">Visible</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {incentives.map((i) => (
                <tr key={i.id} className="border-t">
                  <td className="px-3 py-1">{i.barcode}</td>
                  <td className="px-3 py-1">{i.trait}</td>
                  <td className="px-3 py-1">₹{i.amount}</td>
                  <td className="px-3 py-1">{toLocalTime(i.timestamp).toLocaleString()}</td>
                  <td className="px-3 py-1">{i.is_visible ? "Yes" : "No"}</td>
                  <td className="px-3 py-1">
                    <Button
                      small
                      onClick={() => toggleVisibility(i.id, i.is_visible)}
                    >
                      {i.is_visible ? "Hide" : "Unhide"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
