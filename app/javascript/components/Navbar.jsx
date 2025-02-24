import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-[#f691ad] text-black shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          <Link to="/">Social Media App</Link>
        </h1>

        <ul className="flex space-x-6">
          <li>
            <Link to="/home" className="text-gray-600 hover:text-black transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="text-gray-600 hover:text-black transition">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/post" className="text-gray-600 hover:text-black transition">
              Post
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
