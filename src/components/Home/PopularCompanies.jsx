import React, { useEffect, useRef } from "react";

const companies = [
  { id: 1, title: "Microsoft", image: "/Microsoft.png" },
  { id: 2, title: "Amazon", image: "/Amazon.png" },
  { id: 3, title: "Google", image: "/Google.png" },
  { id: 4, title: "Netflix", image: "/Netflix.png" },
  { id: 5, title: "Meta", image: "/Meta.png" },
  { id: 6, title: "Slack", image: "/Slack.png" },
  { id: 7, title: "Oracle", image: "/Oracle.png" },
];

const Slideshow = () => {
  const slideRef = useRef(null);

  useEffect(() => {
    const slide = slideRef.current;
    let animationFrame;
    let position = 0;
    const speed = 0.5; // Adjust speed for smooth effect

    const slideImages = () => {
      if (slide) {
        position += speed;
        if (position >= slide.scrollWidth / 2) {
          position = 0;
        }
        slide.style.transform = `translateX(-${position}px)`;
        animationFrame = requestAnimationFrame(slideImages);
      }
    };

    slideImages(); // Start the animation

    return () => cancelAnimationFrame(animationFrame); // Cleanup
  }, []);

  return (
    <div className="slideshow-container">
      <div className="slides" ref={slideRef}>
        {companies.concat(companies).map((company, index) => (
          <div key={index} className="company-card">
            <img src={company.image} alt={company.title} className="company-logo" />
            <p className="company-name">{company.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
