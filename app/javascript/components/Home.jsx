import React from "react";
import PropTypes from "prop-types";


function Home(props) {
  return (
    <>
    <div className="bg-white py-20">
      <div className="grid grid-cols-2 gap-4 p-10">
        {/* Text section */}
        <div className="flex flex-col space-y-2 p-5">
          <h6 className="text-2xl font-bold text-gray-800 mb-0">YOUR GO-TO</h6>
          <h1 className="text-7xl font-bold text-gray-800 mb-5">CONNECT > SHARE > DISCOVER </h1>
          <p style={{ marginBottom: '10px', textAlign: 'justify' }} className="text-lg text-gray-600 ">
            Stay in the loop with friends, family, and communities that matter to you.
            Explore a world of content, from trending posts and captivating stories to insightful discussions and engaging media.
          </p>
          <button className="border-2 border-red-500 text-black px-4 py-2 rounded-full hover:bg-red-500 hover:text-white w-max">
            Join the conversation today!
          </button>
        </div>

        {/* Image section */}
        <div className="flex items-center justify-center p-5">
          <img
            src="/assets/img/homepic.png"
            alt="Placeholder"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        
        <hr className="col-span-2 border-t-2 border-gray-300 my-10" />
      </div>
    </div>

  </>
  );
}

Home.propTypes = {
  greeting: PropTypes.string,
};

export default Home;
