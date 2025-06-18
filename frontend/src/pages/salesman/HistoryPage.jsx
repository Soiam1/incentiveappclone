import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { toLocalTime } from '../../utils/formatDate';
import Button from '../../components/ui/Button';
import logo from '../../assets/logo.png';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/claim/summary', {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => {
        setHistory(res.data.history || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 bg-pink-50 min-h-screen">
      <div className="app-header flex justify-between items-center mb-4">
        <img src={logo} alt="Logo" style={{ height: "40px" }} />
        
      </div>
      <Button className="bg-red-500 text-white" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      <h2 className="text-xl font-bold mb-4 underline">All Withdrawal History</h2>

      {history.length === 0 ? (
        <p className="text-gray-500">No withdrawal history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-2 border-b">Amount</th>
                <th className="text-left p-2 border-b">Status</th>
                <th className="text-left p-2 border-b">Date</th>
                <th className="text-left p-2 border-b">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">₹{item.amount}</td>
                  <td className="p-2">{item.status.toUpperCase()}</td>
                  <td className="p-2 text-xs text-gray-600">
                    {toLocalTime(item.timestamp).toLocaleString()}
                  </td>
                  <td className="p-2 text-xs text-red-600">
                    {item.remarks || "-"}
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
