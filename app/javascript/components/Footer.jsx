import React from "react";

const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-6 w-full">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} Blog App. All rights reserved.</p>
            <div className="flex space-x-4 mt-3 md:mt-0">
              <a href="#" className="hover:text-gray-400">Privacy Policy</a>
              <a href="#" className="hover:text-gray-400">Terms of Service</a>
              <a href="#" className="hover:text-gray-400">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  

export default Footer;
