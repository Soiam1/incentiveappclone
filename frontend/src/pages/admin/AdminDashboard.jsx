import React, { useState } from "react";

// ✅ Layout components
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Navbar"; // Ensure this is styled full-width top nav
import Card from "@/components/ui/Card";

// ✅ Admin modules
import OutletManager from "./OutletManager";
import PendingSalesmen from "./PendingSalesmen";
import UserManager from "./UserManager";
import BaseUpload from "./BaseUpload";
import ProductManager from "./ProductManager";
import SalesUpload from "./SalesUpload";
import ClaimDashboard from "./ClaimDashboard";
import IncentiveControl from "./IncentiveControl";
import Streaks from "./Streaks";
import Leaderboard from "./Leaderboard";
import TraitsConfig from "./TraitsConfig";
import SetupPanel from "./SetupPanel";
import logo from "../../assets/logo.png";
const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);

  const renderSection = () => {
    switch (activeSection) {
      case "outlets": return <OutletManager key={refreshKey} />;
      case "pending": return <PendingSalesmen key={refreshKey} />;
      case "users": return <UserManager key={refreshKey} />;
      case "upload": return <BaseUpload key={refreshKey} />;
      case "products": return <ProductManager key={refreshKey} />;
      case "sales": return <SalesUpload key={refreshKey} />;
      case "claims": return <ClaimDashboard key={refreshKey} />;
      case "incentives": return <IncentiveControl key={refreshKey} />;
      case "streaks": return <Streaks key={refreshKey} />;
      case "leaderboard": return <Leaderboard key={refreshKey} />;
      case "traits": return <TraitsConfig key={refreshKey} />;
      case "setup": return <SetupPanel key={refreshKey} />;
      
      default:
        return <div className="text-xl font-semibold">Welcome to Admin Dashboard</div>;
    }
  };

  return (
    <div className="p-4 bg-pink-100 min-h-screen">
          <div className="app-header p-4">
            <img src={logo} alt="Logo" style={{ height: "40px" }} />
          </div>

      {/* Body: Sidebar + Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="bg-white shadow-md w-60 shrink-0 overflow-y-auto">
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="w-full max-w-6xl mx-auto">
            <Card title={activeSection.toUpperCase()}>
              {renderSection()}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
