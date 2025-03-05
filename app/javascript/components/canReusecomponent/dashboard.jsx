import React from "react";
import PropTypes from "prop-types";


function Home(props) {
  return (
    <>
    <div className="bg-white py-3 sm:py-10 justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-3 p-3 sm:p-5">
        
        {/* Left Side (Text Section) */}
        <div className="flex flex-col space-y-4 sm:space-y-6 p-3 sm:p-5">
          <h6 className="text-xl sm:text-2xl font-bold text-gray-800">
            YOUR GO-TO
          </h6>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-gray-800">
            CONNECT > SHARE > DISCOVER
          </h1>
          <p className="text-base sm:text-lg text-gray-600 text-justify">
            Stay in the loop with friends, family, and communities that matter to you.
            Explore a world of content, from trending posts and captivating stories to insightful discussions and engaging media.
          </p>
          <button className="border-2 border-red-500 text-black px-4 py-2 rounded-full hover:bg-red-500 hover:text-white w-max">
            Join the conversation today!
          </button>
        </div>

        {/* Right Side (Image Section) */}
        <div className="flex items-center justify-center p-3 sm:p-5">
          <img src="/assets/img/homepic.png" alt="Placeholder" className="w-full max-w-xs sm:max-w-md md:max-w-lg h-auto rounded-lg shadow-md"/>
        </div>
      </div>

      {/* Responsive Divider */}
      <hr className="border-t-2 border-gray-300 my-2 w-full mx-auto" />
    </div>
    <div className="bg-white py-3 sm:py-10 justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-3 p-3 sm:p-5">
        
        {/* Left Side (Text Section) */}
        <div className="flex flex-col space-y-4 sm:space-y-6 p-3 sm:p-5">
          <h6 className="text-xl sm:text-2xl font-bold text-gray-800">
            YOUR GO-TO
          </h6>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-gray-800">
            CONNECT > SHARE > DISCOVER
          </h1>
          <p className="text-base sm:text-lg text-gray-600 text-justify">
            Stay in the loop with friends, family, and communities that matter to you.
            Explore a world of content, from trending posts and captivating stories to insightful discussions and engaging media.
          </p>
          <button className="border-2 border-red-500 text-black px-4 py-2 rounded-full hover:bg-red-500 hover:text-white w-max">
            Join the conversation today!
          </button>
        </div>

        {/* Right Side (Image Section) */}
        <div className="flex items-center justify-center p-3 sm:p-5">
          <img src="/assets/img/homepic.png" alt="Placeholder" className="w-full max-w-xs sm:max-w-md md:max-w-lg h-auto rounded-lg shadow-md"/>
        </div>
      </div>

      {/* Responsive Divider */}
      <hr className="border-t-2 border-gray-300 my-2 w-full mx-auto" />
    </div>
    </>
  );
}

Home.propTypes = {
  greeting: PropTypes.string,
};

export default Home;
