import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import logo from "../../assets/logo.png";
import { ScanBarcode } from 'lucide-react';
import Leaderboard from '../admin/Leaderboard';

export default function SalesmanLanding() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/salesman/stats', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => setStats(res.data))
      .catch(console.error);
  }, []);

  if (!stats) {
    return <p style={{ textAlign: "center", marginTop: "2rem", color: "#555" }}>Loading…</p>;
  }

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* ✅ Fixed Top Container */}
      <div style={{
        position: "sticky",
        top: 0,
        background: "#ffffff",
        zIndex: 1000,
        paddingBottom: "16px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
      }}>
        {/* Header */}
        <div style={{
          width: "100%",
          background: "#e60000",
          padding: "12px 0",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}>
          <img src={logo} alt="Logo" style={{ height: "40px" }} />
        </div>

        {/* Stats Summary */}
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "24px",
          margin: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
        }}>
          <div style={{ fontSize: "15px", color: "#333", marginBottom: "16px" }}>
            <p>Month Sales: <span style={{ color: "#000000", fontWeight: "bold" }}>₹{(stats.month_sales_amount ?? 0).toFixed(2)}</span></p>
            <p>Today's Sales: <span style={{ fontWeight: "bold" }}>₹{(stats.today_sales_amount ?? 0).toFixed(2)}</span></p>
            <p>Today's Incentive: <span style={{ color: "#28a745", fontWeight: "bold" }}>₹{(stats.today_incentive ?? 0).toFixed(2)}</span></p>
            <p>Wallet Balance: <span style={{ color: "#007bff", fontWeight: "bold" }}>₹{(stats.wallet_balance ?? 0).toFixed(2)}</span></p>
          </div>

          <div style={{ textAlign: "right" }}>
            <button
              onClick={() => navigate('/salesman/profile')}
              style={{
                background: "#e60000",
                color: "white",
                padding: "10px 20px",
                borderRadius: "999px",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              PROFILE
            </button>
          </div>
        </div>

        {/* New Sale Button */}
        <div style={{
          textAlign: "center",
          margin: "0 20px 10px 20px"
        }}>
          <button
            onClick={() => navigate('/salesman/sales')}
            style={{
              backgroundColor: "#e60000",
              color: "#fff",
              padding: "14px 24px",
              fontSize: "16px",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: "10px",
              boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
              border: "none",
              cursor: "pointer"
            }}
          >
            <ScanBarcode size={18} />
            <span>New Sale</span>
          </button>
        </div>
      </div>

      {/* ✅ Scrollable Leaderboard Section */}
      <div style={{
        padding: "20px",
        overflowY: "auto",
        maxHeight: "calc(100vh - 460px)"
      }}>
        <div style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
        }}>
          <Leaderboard data={stats.leaderboard || []} />
        </div>
      </div>
    </div>
  );
}
