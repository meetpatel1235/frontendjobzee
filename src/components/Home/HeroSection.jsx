import React from "react";
import { FaBuilding, FaSuitcase, FaUsers, FaUserPlus } from "react-icons/fa";

const HeroSection = () => {
  const details = [
    { id: 1, title: "1,23,441", subTitle: "Live Jobs", icon: <FaSuitcase className="icon" /> },
    { id: 2, title: "91,220", subTitle: "Companies", icon: <FaBuilding className="icon" /> },
    { id: 3, title: "2,34,200", subTitle: "Job Seekers", icon: <FaUsers className="icon" /> },
    { id: 4, title: "1,03,761", subTitle: "Employers", icon: <FaUserPlus className="icon" /> },
  ];

  return (
    <section className="heroSection">
      <div className="container">
        <div className="title">
          <h1>
            <span className="gradient-text">Find Your Dream Job</span> <br />
            That Matches Your Skills & Aspirations
          </h1>
          <p>
            Explore thousands of job opportunities tailored for you. Connect
            with top employers, apply seamlessly, and take the next step in
            your career journey. <span className="highlight-text">Your dream job awaits!</span>
          </p>
        </div>
        <div className="image">
          <img src="/boy.png" alt="hero" />
        </div>
      </div>

      <div className="details">
        {details.map(({ id, title, subTitle, icon }) => (
          <div className="card" key={id}>
            <div className="icon">{icon}</div>
            <div className="content">
              <p className="count">{title}</p>
              <p className="label">{subTitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
