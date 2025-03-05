import React from 'react'
import { useNavigate, Link } from "react-router-dom";
export default function RightNavbar() {
    return (
      <>
        <div className="fixed top-0 right-0 h-full w-1/5 p-4 border-l border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
          <h3 className="font-bold mb-2">Who to follow</h3>
  
          <div className="flex items-center gap-3 p-2">
            {/* Clickable row (excluding Follow button) */}
            <Link to="/profile" className="flex items-center gap-3 flex-1 p-2 rounded-md">
              {/* Small Image */}
              <div className="w-10 h-10 flex-shrink-0">
                <img className="rounded-full w-full h-full object-cover" src="/assets/img/image.png" alt="Profile" />
              </div>
  
              {/* Name & Bio */}
              <div className="flex-1">
                <span className="block text-sm font-bold text-gray-900 dark:text-white">
                  Tari Ibaba
                </span>
                <p className="text-gray-500 text-xs line-clamp-2 overflow-hidden">
                  Thinker + Creator. Sharing news, thoughts, and info on technology, design, and creativity.
                </p>
              </div>
            </Link>
  
            {/* Follow Button (placed outside the Link) */}
            <button className="px-3 py-1 border border-gray-400 rounded-full text-sm font-medium text-black" onClick={() => console.log("follow click")}>
              Follow
            </button>
          </div>
          <button className="text-gray-500 text-sm">See more suggestions...</button>
        </div>
      </>
    );
  }
  
