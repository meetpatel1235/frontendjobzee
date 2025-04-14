import React from "react";
import { FaUserPlus } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Create an Account",
      description: "Sign up to access thousands of job opportunities and connect with top employers.",
      icon: <FaUserPlus className="icon" />,
    },
    {
      id: 2,
      title: "Find or Post Jobs",
      description: "Search for your ideal job or post listings to find the best candidates.",
      icon: <MdFindInPage className="icon" />,
    },
    {
      id: 3,
      title: "Apply or Recruit",
      description: "Apply for jobs seamlessly or hire qualified professionals for your company.",
      icon: <IoMdSend className="icon" />,
    },
  ];

  return (
    <section className="howitworks">
      <div className="container">
        <h3>How <span className="highlight">JobZee</span> Works</h3>
        <div className="steps">
          {steps.map(({ id, title, description, icon }) => (
            <div className="card" key={id}>
              <div className="icon-container">{icon}</div>
              <h4>{title}</h4>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
