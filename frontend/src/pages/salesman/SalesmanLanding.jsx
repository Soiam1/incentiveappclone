import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import RedBackground from '../../components/ui/RedBackground';
import Header from '../../components/ui/Header';
import api from '../../lib/api';
import Leaderboard from '../admin/Leaderboard';
import { ScanBarcode } from 'lucide-react';

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

  if (!stats) return <p className="text-center mt-10 text-gray-700">Loading…</p>;

  return (
    <RedBackground className="min-h-screen bg-pink-100 px-4 py-6 space-y-6">
      <Header />

      {/* Summary and Profile button inside a single Card */}
      <Card className="px-6 py-4 space-y-3 text-sm text-gray-800">
        <div>
          <p>Month Sales: <span className="font-semibold text-red-600">₹{(stats.month_sales_amount ?? 0).toFixed(2)}</span></p>
          <p>Today's Sales: <span className="font-semibold">₹{(stats.today_sales_amount ?? 0).toFixed(2)}</span></p>
          <p>Today's Incentive: <span className="font-semibold text-green-600">₹{(stats.today_incentive ?? 0).toFixed(2)}</span></p>
          <p>Wallet Balance: <span className="font-semibold text-blue-600">₹{(stats.wallet_balance ?? 0).toFixed(2)}</span></p>
        </div>
        
        <div className="flex justify-end pt-2">
          <Button
            onClick={() => navigate('/salesman/profile')}
            className="text-white bg-red-600 px-4 py-2 rounded-full center text-sm"
          >
            PROFILE
            
          </Button>
        </div>
      </Card>
      <h2 className="text-xl font-bold text-center mb-2"></h2>
       <div className="border-t border-gray-300 my-2" /> 
      <div>
        
        <button
          onClick={() => navigate('/salesman/sales')}
          className="w-full bg-red-600 text-white py-3  px-10 rounded-full center flex items-center justify-center gap-3 text-base"
        >
          <ScanBarcode className="w-5 h-5" />
          <span>New Sale</span>
        </button>
        <div className="border-t border-gray-300 my-2" />
      </div>
      
      {/* Leaderboard Section */}
      <Card className="bg-white px-4 py-5">
        
        <Leaderboard data={stats.leaderboard || []} />
      </Card>
    </RedBackground>
  );
}
