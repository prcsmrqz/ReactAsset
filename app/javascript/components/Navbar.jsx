import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import showAlert from "./Alert";
import CurrentUser from "./devise/CurrentUser";
import { PowerIcon} from '@heroicons/react/24/solid';
import { DocumentTextIcon, UserCircleIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function Navbar({ isAuthenticated, onLogout, refreshCsrfToken }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Initially closed

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUser = async () => {
        const userData = await CurrentUser();
        setUser(userData);
      };
      fetchUser();
      setIsOpen(false); // Close sidebar when user logs in
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    const result = await showAlert("Logout Account", "Are you sure you want to logout to your account?", "warning", "logout");
    if (!result.isConfirmed) return;
    try {
      await axios.delete("/users/sign_out");
      delete axios.defaults.headers.common["X-CSRF-Token"];
      await refreshCsrfToken();
      onLogout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full bg-white border-b border-gray-300 text-black flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold">Article App</Link>
        <div className="flex gap-4">
          <Link to="/login" className="hover:bg-gray-200 p-2 rounded-md">Login</Link>
          <Link to="/signup" className="hover:bg-gray-200 p-2 rounded-md">Sign Up</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className={`${isOpen ? "w-64" : "w-16"} bg-white border-r border-gray-300 transition-all duration-300 flex flex-col h-screen`}>
        <div className={`flex items-center ${isOpen ? "p-4" : "pl-5"} h-16`}>
          <button onClick={() => setIsOpen(!isOpen)} className="text-black text-2xl">
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
        <nav className={`flex flex-col gap-4 p-2 ${isOpen ? "" : "justify-center items-center"}`}>
          <Link to="/" className="flex items-center text-black hover:bg-gray-200 p-2 rounded-md transition">
            <span className="text-xl w-6 text-center"><HomeIcon className="h-5 w-5 text-black"/></span>
            {isOpen && <span className="ml-3">Article App</span>}
          </Link>
          <Link to="/profile" className="flex items-center text-black hover:bg-gray-200 p-2 rounded-md transition">
            <span className="text-xl w-6 text-center"><UserCircleIcon className="h-5 w-5 text-black"/></span>
            {isOpen && <span className="ml-3">{user ? `${user.first_name} ${user.last_name}` : "Guest"}</span>}
          </Link>
          <Link to="/post" className="flex items-center text-black hover:bg-gray-200  p-2 rounded-md transition">
            <span className="text-xl w-6 text-center"><DocumentTextIcon className="h-5 w-5 text-black"/></span>
            {isOpen && <span className="ml-3">Post</span>}
          </Link>
          <button onClick={handleLogout} className="flex items-center text-black hover:bg-gray-200 p-2 rounded-md transition text-left">
            <span className="text-xl w-6 text-center"><PowerIcon className="h-5 w-5 text-black"/></span>
            {isOpen && <span className="ml-3">Logout</span>}
          </button>
        </nav>

      </div>
    </div>

  );
}
