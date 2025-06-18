import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import API_BASE_URL from "../config";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        mobile,
        password,
      });

      const { access_token, role } = res.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/salesman");
      }
    } catch (err) {
      alert(err.response?.data?.detail || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-pink-100">
      <Header />

      <div className="flex flex-col justify-center items-center px-4 py-10 space-y-6">
        <form
          onSubmit={handleSubmit}
          className="w-3/4 max-w-md bg-white p-6 rounded-lg shadow space-y-6"
        >
          
          <h2 className="text-xl font-bold text-center">Login</h2>

          <Input
            label="Phone Number"
            name="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <p className="text-center text-sm">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer underline"
              onClick={() => navigate("/")}
            >
              Signup here
            </span>
          </p>
        </form>

        <div className="pt-2">
          <Button type="submit" onClick={handleSubmit}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
