import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import showAlert from "./Alert";
import CurrentUser from "./devise/CurrentUser";

import { DocumentTextIcon, UserCircleIcon, HomeIcon, ArrowLeftStartOnRectangleIcon, UserIcon, BellIcon, BookmarkIcon, MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { DocumentTextIcon as DocumentTextIconSolid, HomeIcon as HomeIconSolid, BellIcon as BellIconSolid, UserIcon as UserSolid, UserGroupIcon as UserGroupIconSolid, BookmarkIcon as BookMarkIconSolid, PencilSquareIcon as PencilSquareIconSolid  } from "@heroicons/react/24/solid";


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
        <Link to="/" className="text-xl font-bold">Blog App</Link>
        <div className="flex gap-4">
          {!(location.pathname === "/signup" || location.pathname === "/login") && (
            <Link to="/login" className="hover:bg-gray-200 p-2 rounded-md">Login</Link>
          )}
        </div>
      </div>
    );
  }

  if (location.pathname === "/create" || location.pathname.startsWith("/edit/") || location.pathname.startsWith("/show/")) {
    return (
      
      <div className="w-full fixed top-0 left-0 bg-white border-b border-gray-300 text-black flex justify-between items-center p-4 z-50">
        <Link to="/home" className="text-xl font-bold">Blog App</Link>
        <div className="relative profile-dropdown">
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center w-full text-black rounded-md transition">
            <UserCircleIcon className="h-10 w-10 text-black rounded-full" />
            {!isSmallScreen && (
              <div className="ml-3 text-left">
                <p className="text-sm font-semibold">{user ? user.first_name + " " + user.last_name : "Guest"}</p>
              </div>
            )}
          </button>
          {isProfileOpen && (
           <div className="absolute top-full top-full right-0 -translate-x-[3%] min-w-[200px] w-[90%] max-w-[250px] bg-white border border-gray-300 rounded-md shadow-lg p-1">
            <Link to={`/profile/${user?.id}`} className="w-full flex items-center text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm">
              <UserIcon className="h-5 w-5 mr-2" />Profile
            </Link>
            <Link onClick={handleLogout} className="w-full flex items-center text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm">
              <BookmarkIcon className="h-5 w-5 mr-2" /> Reading List
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm">
              <ArrowLeftStartOnRectangleIcon className="h-5 w-5 mr-2" /> Log out
            </button>
          </div>
         
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
       
          <Link to="/home" className={`flex items-center p-2 transition w-full hover:bg-gray-200 hover:rounded-2xl ${location.pathname === "/" ? "font-bold" : "text-black"}`}>
            {location.pathname === "/home" ? ( <HomeIconSolid className="h-7 w-7" /> ) : ( <HomeIcon className="h-7 w-7" /> )}
            {!isSmallScreen && <span className="ml-3">Home</span>}
          </Link>
          <Link to="/post" className={`flex items-center p-2 transition w-full hover:bg-gray-200 hover:rounded-2xl ${location.pathname === "/post" ? "font-bold" : "text-black"}`}>
          {location.pathname === "/post" ? ( <DocumentTextIconSolid className="h-7 w-7" /> ) : ( <DocumentTextIcon className="h-7 w-7" /> )}
            {!isSmallScreen && <span className="ml-3">Post</span>}
          </Link>

          <Link to="/reading_list" className={`flex items-center p-2 transition w-full hover:bg-gray-200 hover:rounded-2xl ${location.pathname === "/reading_list" ? "font-bold" : "text-black"}`}>
          {location.pathname === "/reading_list" ? ( <BookMarkIconSolid className="h-7 w-7" /> ) : ( <BookmarkIcon className="h-7 w-7" /> )}
            {!isSmallScreen && <span className="ml-3">Reading List</span>}
          </Link>

          <Link to="/notification" className={`flex items-center p-2 transition w-full hover:bg-gray-200 hover:rounded-2xl ${location.pathname === "/notification" ? "font-bold" : "text-black" }`}>
            {location.pathname === "/notification" ? (
              <div className="relative">
                <BellIconSolid className="h-7 w-7" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[10px] text-center">
                  3
                </span>
              </div>
            ) : (
              <div className="relative">
                <BellIcon className="h-7 w-7" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                  3
                </span>
              </div>
            )}
            {!isSmallScreen && <span className="ml-3">Notification</span>}
          </Link>


          <Link to={`/profile/${user?.id}`} className={`flex items-center p-2 transition w-full hover:bg-gray-200 hover:rounded-2xl ${location.pathname === `/profile/${user?.id}` ? "font-bold" : "text-black"}`}>
          {location.pathname === `/profile/${user?.id}` ? ( <UserSolid className="h-7 w-7" /> ) : ( <UserIcon className="h-7 w-7" /> )}
            {!isSmallScreen && <span className="ml-3">Profile</span>}
          </Link>
          <Link to="/create" className="flex items-center p-2 transition w-full bg-black text-white rounded-3xl justify-center">
          {location.pathname === "/create" ? ( <PencilSquareIconSolid className="h-7 w-7" /> ) : ( <PencilSquareIcon className="h-7 w-7" /> )}
            {!isSmallScreen && <span className="ml-3">Create</span>}
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
