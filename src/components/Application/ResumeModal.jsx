import React from "react";
const ResumeModal = ({ imageUrl, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-btn" onClick={onClose}>&times;</span>
        <img src={imageUrl} alt="Resume Preview" className="resume-preview" />
      </div>
    </div>
  );
};

export default ResumeModal;
