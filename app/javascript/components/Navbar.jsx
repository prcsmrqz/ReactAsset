import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import showAlert from "./Alert";
import CurrentUser from "./devise/CurrentUser";
import { DocumentTextIcon, UserCircleIcon, HomeIcon, ArrowLeftStartOnRectangleIcon, UserIcon, BellIcon, BookmarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { DocumentTextIcon as DocumentTextIconSolid, HomeIcon as HomeIconSolid, BellIcon as BellIconSolid, UserIcon as UserSolid, UserGroupIcon as UserGroupIconSolid, BookmarkIcon as BookMmrkIconSolid  } from "@heroicons/react/24/solid";


export default function Navbar({ isAuthenticated, onLogout, refreshCsrfToken }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUser = async () => {
        const userData = await CurrentUser();
        setUser(userData);
      };
      fetchUser();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-dropdown")) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen flex flex-col justify-between bg-white border-r border-gray-300 transition-all duration-300 
        ${isSmallScreen ? "w-16" : "w-64"}`}>

        <nav className="flex flex-col gap-4 p-2 mt-12 flex-1">
        <div className="flex items-center border border-gray-300 rounded-2xl p-4 focus-within:ring-2 focus-within:ring-blue-400 dark:border-neutral-600">
      <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-neutral-200" />
      <input
        type="search"
        id="search"
        className="w-full bg-transparent px-3 py-1 text-base text-gray-700 outline-none dark:text-neutral-200 dark:placeholder:text-neutral-400"
        placeholder="Type query"
        aria-label="Search"
      />
    </div>
          <Link to="/home" className={`flex items-center p-2 transition w-full hover:bg-gray-200 hover:rounded-2xl ${location.pathname === "/" ? "font-bold" : "text-black"}`}>
            {location.pathname === "/home" ? ( <HomeIconSolid className="h-5 w-5" /> ) : ( <HomeIcon className="h-5 w-5" /> )}
            {!isSmallScreen && <span className="ml-3">Home</span>}
          </Link>
          
          <Link to="/post" className={`flex items-center p-2 transition w-full hover:bg-gray-200 hover:rounded-2xl ${location.pathname === "/post" ? "font-bold" : "text-black"}`}>
          {location.pathname === "/post" ? ( <DocumentTextIconSolid className="h-5 w-5" /> ) : ( <DocumentTextIcon className="h-5 w-5" /> )}
            {!isSmallScreen && <span className="ml-3">Post</span>}
          </Link>

          <Link to="/readinglist" className={`flex items-center p-2 transition w-full hover:bg-gray-200 hover:rounded-2xl ${location.pathname === "/readinglist" ? "font-bold" : "text-black"}`}>
          {location.pathname === "/readinglist" ? ( <BookMmrkIconSolid className="h-5 w-5" /> ) : ( <BookmarkIcon className="h-5 w-5" /> )}
            {!isSmallScreen && <span className="ml-3">Reading List</span>}
          </Link>

          <Link to="/notification" className={`flex items-center p-2 transition w-full hover:bg-gray-200 hover:rounded-2xl ${location.pathname === "/notification" ? "font-bold" : "text-black"}`}>
          {location.pathname === "/notification" ? ( <BellIconSolid className="h-5 w-5" /> ) : ( <BellIcon className="h-5 w-5" /> )}
            {!isSmallScreen && <span className="ml-3">Notification</span>}
          </Link>

          <Link to="/profile" className={`flex items-center p-2 transition w-full hover:bg-gray-200 hover:rounded-2xl ${location.pathname === "/profile" ? "font-bold" : "text-black"}`}>
          {location.pathname === "/profile" ? ( <UserSolid className="h-5 w-5" /> ) : ( <UserIcon className="h-5 w-5" /> )}
            {!isSmallScreen && <span className="ml-3">Profile</span>}
          </Link>
        </nav>

        {/* Profile Section at Bottom */}
        <div className="relative p-2 profile-dropdown">
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center w-full text-black hover:bg-gray-200 p-2 rounded-md transition">
            <UserCircleIcon className="h-10 w-10 text-black rounded-full border border-gray-400" />
            {!isSmallScreen && (
              <div className="ml-3 text-left">
                <p className="text-sm font-semibold">{user ? user.first_name + " " + user.last_name : "Guest"}</p>
              </div>
            )}
          </button>
          
          {isProfileOpen && (
            <div className="absolute bottom-14 left-5 min-w-[200px] w-[90%] max-w-[250px] bg-white border border-gray-300 rounded-md mb-2 shadow-lg p-2">
              <button className="w-full text-left text-black hover:bg-gray-200 p-2 rounded-md">
                Add an existing account
              </button>
              <button  onClick={handleLogout} className="w-full flex items-center text-left text-black hover:bg-gray-200 p-2 rounded-md" >
                <ArrowLeftStartOnRectangleIcon className="h-5 w-5 mr-2" /> Log out
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${isSmallScreen ? "ml-16" : "ml-64"}`}>
        {/* Page content goes here */}
      </div>
      
    </div>
  );
}
