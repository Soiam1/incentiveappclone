import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../lib/api';
import { toLocalTime } from "../../utils/formatDate";
import logo from "../../assets/logo.png";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/salesman/me')
      .then(res => setProfile(res.data))
      .catch(console.error);

    api.get('/api/claim/summary', {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setSummary(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleWithdraw = async () => {
    if (!summary?.wallet_balance || summary.wallet_balance <= 0) {
      alert("No available balance to withdraw.");
      return;
    }

    try {
      await api.post("/api/claim", {
        amount: summary.wallet_balance,
        remarks: "Salesman withdrawal request"
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      alert("Withdrawal request submitted!");
      window.location.reload();
    } catch (err) {
      alert("Error submitting withdrawal request.");
      console.error(err);
    }
  };

  if (!profile || loading) return <p>Loading…</p>;

  return (
    <div className="p-4 bg-pink-100 min-h-screen">
      <div className="app-header p-4">
        <img src={logo} alt="Logo" style={{ height: "40px" }} />
      </div>

      <div className="mt-6 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gray-300 mb-4" />
        <Card className="p-4 w-full max-w-xs">
          <p><strong>Salesman ID:</strong> {profile.id}</p>
          <p><strong>Name:</strong>       {profile.name}</p>
          <p><strong>Outlet:</strong>     {profile.outlet}</p>
          <p><strong>Verticle:</strong>   {profile.verticle}</p>
        </Card>
      </div>

      <div className="mt-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm bg-white text-red-600 border border-red-600 px-2 py-2 rounded-full"
        >
          ← Back
        </button>
      </div>

      <div className="border-t border-gray-300 my-2" />
      <div className="mt-6 flex flex-col items-center">
        <Card className="p-4 w-full max-w-xs">
          <h2 className="text-lg font-bold mb-2 underline">Wallet Summary</h2>
          <p>Total Incentive: ₹{summary.total_incentive.toFixed(2)}</p>
          <p>Total Withdrawn: ₹{summary.total_withdrawn.toFixed(2)}</p>
          <p>Wallet Balance: ₹{summary.wallet_balance.toFixed(2)}</p>
          {summary.pending_claim && (
            <p className="text-yellow-600 font-semibold">
              Pending Withdrawal: ₹{summary.pending_claim.amount} (⏳ Pending)
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <Button className="bg-green-600 text-white text-sm px-3 py-1 rounded-full" onClick={handleWithdraw}>
              Withdraw Wallet
            </Button>
            <Button className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full" onClick={() => setShowHistory(true)}>
              View History
            </Button>
          </div>
        </Card>
      </div>

      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow w-[90%] max-w-md max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b bg-white sticky top-0 z-10">
              <h3 className="text-lg font-bold">Withdrawal History</h3>
            </div>

            {/* Scrollable Table Section */}
            <div className="overflow-y-auto px-4 py-2 flex-1">
              {summary.history.length === 0 ? (
                <p className="text-sm text-gray-500">No withdrawal history yet.</p>
              ) : (
                <table className="w-full text-sm border border-gray-300">
                  <thead className="bg-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="text-left p-2 border-b">Amount</th>
                      <th className="text-left p-2 border-b">Status</th>
                      <th className="text-left p-2 border-b">Date</th>
                      <th className="text-left p-2 border-b">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.history.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">₹{item.amount}</td>
                        <td className="p-2">{item.status.toUpperCase()}</td>
                        <td className="p-2 text-xs text-gray-600">
                          {toLocalTime(item.timestamp).toLocaleDateString()}
                        </td>
                        <td className="p-2 text-xs text-red-600">
                          {item.remarks || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer Button */}
            <div className="p-4 border-t bg-white sticky bottom-0 z-10">
              <Button className="bg-gray-600 text-white w-full" onClick={() => setShowHistory(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
