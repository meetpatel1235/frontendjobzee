import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";
import {
  FaMapMarkerAlt,
  FaBuilding,
  FaGlobe,
  FaCity,
  FaMoneyBillWave,
} from "react-icons/fa";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Added loading state
  const navigateTo = useNavigate();
  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/login");
      return;
    }

    axios
      .get(`http://localhost:4000/api/v1/job/${id}`, { withCredentials: true })
      .then((res) => setJob(res.data.job))
      .catch(() => navigateTo("/notfound"))
      .finally(() => setLoading(false)); // ✅ Hide spinner when request is complete
  }, [id, isAuthorized, navigateTo]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (!job) return <p className="loading-text">Job not found.</p>;

  return (
    <section className="job-container">
      <div className="job-wrapper">
        {/* Job Title */}
        <h2 className="job-heading">{job.title}</h2>

        {/* Job Information Section */}
        <div className="job-details">
          <div className="job-info-item">
            <FaBuilding className="job-icon" />
            <span>
              <strong>Category:</strong> {job.category}
            </span>
          </div>
          <div className="job-info-item">
            <FaGlobe className="job-icon" />
            <span>
              <strong>Country:</strong> {job.country}
            </span>
          </div>
          <div className="job-info-item">
            <FaCity className="job-icon" />
            <span>
              <strong>City:</strong> {job.city}
            </span>
          </div>
          <div className="job-info-item">
            <FaMapMarkerAlt className="job-icon" />
            <span>
              <strong>Location:</strong> {job.location}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="job-description">
          <h3 className="job-desc-title">Description</h3>
          <p className="job-desc-text">{job.description}</p>
        </div>

        {/* Job Meta Info */}
        <div className="job-meta">
          <p>
            <strong>Job Posted On:</strong>{" "}
            {new Date(job.jobPostedOn).toLocaleDateString()}
          </p>
          <p>
            <FaMoneyBillWave className="job-icon" />
            <strong> Salary:</strong>
            {job.fixedSalary
              ? ` ${job.fixedSalary}`
              : ` ${job.salaryFrom} - ${job.salaryTo}`}
          </p>
        </div>

        {/* Apply Now Button */}
        {user?.role !== "Employer" && (
          <Link to={`/application/${job._id}`} className="job-apply-btn">
            Apply Now
          </Link>
        )}
      </div>
    </section>
  );
};

export default JobDetails;
