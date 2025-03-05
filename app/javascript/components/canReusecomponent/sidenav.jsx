import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import showAlert from "./Alert";
import CurrentUser from "./devise/CurrentUser";
import { PowerIcon } from "@heroicons/react/24/solid";
import { DocumentTextIcon, UserCircleIcon, HomeIcon } from "@heroicons/react/24/outline";

export default function Navbar({ isAuthenticated, onLogout, refreshCsrfToken }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUser = async () => {
        const userData = await CurrentUser();
        setUser(userData);
      };
      fetchUser();
      setIsOpen(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        {!(location.pathname === "/signup" || location.pathname === "/login") && (
          <Link to="/login" className="hover:bg-gray-200 p-2 rounded-md">Login</Link>
        )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Small Screen Toggle Button (Fixed at Top-Left) */}
      {isSmallScreen && (
        <button onClick={() => setIsOpen(!isOpen)} 
          className=" absolute ml-3 p-2 text-2xl text-black bg-white rounded-md w-10 h-10 flex items-center justify-center z-50">
          {isOpen ? <span>&#10006;</span> : <span>&#9776;</span>}
        </button>
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen flex flex-col bg-white shadow-lg transition-all duration-300 
        ${ isSmallScreen ? `fixed top-0 left-0 z-40 ${isOpen ? "w-64" : "w-0"} overflow-hidden` : isOpen ? "w-64" : "w-16"}`} >

        {/* Big Screen Toggle Button (Inside Sidebar) */}
        {!isSmallScreen && (
          <button onClick={() => setIsOpen(!isOpen)} 
            className="p-2 text-2xl text-black bg-white rounded-md w-10 h-10 flex items-center ml-2 justify-center transition-all duration-300  my-3">
            {isOpen ? <span>&#10006;</span> : <span>&#9776;</span>}
          </button>
        )}

        <nav className="flex flex-col gap-4 p-2">
        {isSmallScreen && (<span className="mb-10"></span>)}
          <Link to="/" className="flex items-center text-black hover:bg-gray-200 p-2 rounded-md transition">
            <HomeIcon className="h-5 w-5 text-black" />
            {isOpen && <span className="ml-3">Article App</span>}
          </Link>
          <Link to="/profile" className="flex items-center text-black hover:bg-gray-200 p-2 rounded-md transition">
            <UserCircleIcon className="h-5 w-5 text-black" />
            {isOpen && <span className="ml-3">{user ? `${user.first_name} ${user.last_name}` : "Guest"}</span>}
          </Link>
          <Link to="/post" className="flex items-center text-black hover:bg-gray-200 p-2 rounded-md transition">
            <DocumentTextIcon className="h-5 w-5 text-black" />
            {isOpen && <span className="ml-3">Post</span>}
          </Link>
          <button onClick={handleLogout} className="flex items-center text-black hover:bg-gray-200 p-2 rounded-md transition text-left">
            <PowerIcon className="h-5 w-5 text-black" />
            {isOpen && <span className="ml-3">Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${!isSmallScreen ? (isOpen ? "ml-64" : "ml-16") : "" }`}>
        {/* Page content goes here */}
      </div>
    </div>
  );
}
