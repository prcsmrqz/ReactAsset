import React from "react";

const Registration = () => {
  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Create an Account
        </h3>

        <form className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-white"> First Name </label>
              <input type="text" placeholder="First Name" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"/>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-white"> Last Name </label>
              <input type="text" placeholder="Last Name" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white"> Email </label>
            <input type="email" placeholder="Email" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"/>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-white"> Password </label>
              <input type="password" placeholder="Password" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"/>
              <p className="text-xs text-red-500 mt-1">Please choose a strong password.</p>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-white"> Confirm Password </label>
              <input type="password" placeholder="Confirm Password" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"/>
            </div>
          </div>

          <button  type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 dark:bg-blue-700 dark:hover:bg-blue-900">
            Register Account
          </button>

          <div className="text-center mt-4">
            <a href="#" className="text-sm text-blue-500 hover:underline"> Forgot Password? </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
