import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import API_BASE_URL from "../config";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    outlet: "",
    verticle: "",
    password: "",
  });

  const [outlets, setOutlets] = useState([]);
  const [verticles, setVerticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [outletRes, verticleRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/public/public/outlets`),
          axios.get(`${API_BASE_URL}/api/public/public/verticles`),
        ]);
        setOutlets(outletRes.data);
        setVerticles(verticleRes.data);
      } catch (err) {
        console.error("Error loading dropdowns", err);
        alert("Failed to load outlet or verticle list.");
      }
    };
    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/auth/signup`, formData);
      alert("Signup successful! Please wait for admin approval.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      alert(err.response?.data?.detail || "Signup failed.");
    }
  };

  return (
    <div className="min-h-screen bg-pink-100">
      <Header />
      <div className="flex flex-col justify-center items-center px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-3/4 max-w-md bg-white p-6 rounded-lg shadow space-y-10 mb-6"
        >
          
          <h2 className="text-xl font-bold text-center">Create Your Account</h2>
          

          {[
            { label: "Full Name", name: "name" },
            { label: "Mobile", name: "mobile" },
            { label: "Password", name: "password", type: "password" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-3/4 border border-gray-300 px-3 py-2 rounded text-sm"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1">Select Outlet</label>
            <select
              name="outlet"
              value={formData.outlet}
              onChange={handleChange}
              required
              className="w-1/4 border border-gray-300 px-3 py-2 rounded text-sm"
            >
              <option value="">-- Select an outlet --</option>
              {outlets.map((o) => (
                <option key={o.id} value={o.name}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Select Verticle</label>
            <select
              name="verticle"
              value={formData.verticle}
              onChange={handleChange}
              required
              className="w-1/4 border border-gray-300 px-3 py-2 rounded text-sm"
            >
              <option value="">-- Select a verticle --</option>
              {verticles.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

         
        </form>
        <h2 className="text-xl font-bold text-center"></h2>
        {/* Submit button moved outside */}
        <div className="py-30 px-20 w-60 max-w-md center">
          <button type="submit" full onClick={handleSubmit}>
            Sign Up
          </button>
        </div>
        <p className="text-center text-sm mt-3">
            Already a member?{" "}
            <span
              className="text-blue-600 cursor-pointer underline"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
            </p> 
          
      </div>
    </div>
  );
}
