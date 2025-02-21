import React from "react";
import PropTypes from "prop-types";

function Home(props) {
  return <div>Greeting: {props.greeting} hihihi</div>;
}

Home.propTypes = {
  greeting: PropTypes.string,
};

export default Home; 
