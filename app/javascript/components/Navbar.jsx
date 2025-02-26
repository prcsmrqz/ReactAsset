import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ isAuthenticated, onLogout, refreshCsrfToken }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.delete("/users/sign_out", { withCredentials: true });
  
      delete axios.defaults.headers.common["X-CSRF-Token"]; // Remove old token
      await refreshCsrfToken(); // ✅ Get a fresh CSRF token
  
      onLogout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };
  
  return (
    <nav className="bg-[#f691ad] text-black shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <Link to="/">Article App</Link>
        </h1>
        <ul className="flex space-x-6">
          {!isAuthenticated ? (
            <li>
              <Link to="/login" className="text-gray-600 hover:text-black transition">
                Login
              </Link>
            </li>
          ) : (
            <>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/post">Post</Link></li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;