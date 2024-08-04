import React from "react";
import "./About.css";
import { useEffect } from "react";
import Header from "./Header";
import Video from "./Video";
const About = ({ handleLogOut, cartItems, isLogged }) => {
  useEffect(() => {
    document.body.style.background = "#080710";
    return () => {
      document.body.style.background = ""; // Reset to default when unmounted
    };
  }, []);

  return (
    <>
      <Header
        amountCart={cartItems.length}
        isLogged={isLogged}
        handleLogOut={() => handleLogOut(null, false)}
      />
      <div className="about-container">
        <h1>About Us</h1>
        <div className="creators">
          <h2>Creators:</h2>
          <ul>
            <li>Sharon Gordon</li>
            <li>Rony Borsukovski</li>
          </ul>
        </div>

        <h2>About Us:</h2>
        <p>
          We are a team of passionate developers dedicated to creating the best
          shopping app experience. Our goal is to provide a seamless and
          efficient platform for users to manage their shopping needs.
        </p>

        <h2>Checkout more of our works:</h2>

        <Video />
      </div>
    </>
  );
};

export default About;
