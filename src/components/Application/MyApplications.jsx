import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2, X, FileText, Mail, Phone, MapPin, FileText as CoverLetterIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
      return;
    }

    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const url =
          user && user.role === "Employer"
            ? "http://localhost:4000/api/v1/application/employer/getall"
            : "http://localhost:4000/api/v1/application/jobseeker/getall";

        const res = await axios.get(url, { withCredentials: true });
        setApplications(res.data.applications);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching applications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [isAuthorized, user, navigateTo]);

  const deleteApplication = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/application/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Application deleted successfully!");
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete application");
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    // Re-enable body scrolling
    document.body.style.overflow = "auto";
  };

  return (
    <section className="applications-section">
      <div className="applications-container">
        <div className="applications-header">
          <h1 className="applications-title">
            {user?.role === "Job Seeker" ? "My Applications" : "Applications Management"}
          </h1>
          <p className="applications-subtitle">
            {user?.role === "Job Seeker" 
              ? "Track and manage your job applications" 
              : "Review applications from job seekers"}
          </p>
        </div>

        {isLoading ? (
          <div className="applications-loading">
            <div className="loading-spinner"></div>
            <p>Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="applications-empty">
            <FileText size={48} className="empty-icon" />
            <h4>No Applications Found</h4>
            <p>
              {user?.role === "Job Seeker" 
                ? "You haven't applied to any jobs yet." 
                : "No one has applied to your job postings yet."}
            </p>
          </div>
        ) : (
          <div className="applications-grid">
            {applications.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
                deleteApplication={deleteApplication}
                openModal={openModal}
                isEmployer={user?.role === "Employer"}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Resume Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div 
            className="resume-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="resume-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="resume-modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
              <div className="resume-modal-body">
                <img src={resumeImageUrl} alt="Resume Preview" className="resume-modal-image" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const ApplicationCard = ({ application, deleteApplication, openModal, isEmployer }) => {
  return (
    <motion.div 
      className="application-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="application-header">
        <h3 className="application-name">{application.name}</h3>
        <div className="application-tag">
          {isEmployer ? "Applicant" : "Application"}
        </div>
      </div>
      
      <div className="application-content">
        <div className="application-info-item">
          <Mail size={16} className="info-icon" />
          <p>{application.email}</p>
        </div>
        
        <div className="application-info-item">
          <Phone size={16} className="info-icon" />
          <p>{application.phone}</p>
        </div>
        
        <div className="application-info-item">
          <MapPin size={16} className="info-icon" />
          <p>{application.address}</p>
        </div>
        
        <div className="application-cover-letter">
          <div className="cover-letter-header">
            <CoverLetterIcon size={16} className="info-icon" />
            <h4>Cover Letter</h4>
          </div>
          <p className="cover-letter-content">{application.coverLetter}</p>
        </div>
      </div>

      <div className="application-actions">
        <button 
          className="application-action-button view-resume"
          onClick={() => openModal(application.resume.url)}
        >
          <Eye size={16} />
          <span>View Resume</span>
        </button>

        {!isEmployer && (
          <button 
            className="application-action-button delete-application"
            onClick={() => deleteApplication(application._id)}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default MyApplications;
