import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaSearch } from "react-icons/fa";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortSalary, setSortSalary] = useState("");
  const [loading, setLoading] = useState(true);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:4000/api/v1/job/getall", {
          withCredentials: true,
        });
        setJobs(data.jobs || []);
        setFilteredJobs(data.jobs || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (!isAuthorized) {
    navigateTo("/");
  }

  // 🔍 Handle Search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterJobs(e.target.value, locationFilter, sortSalary);
  };

  // 📍 Handle Location Filter
  const handleLocationChange = (e) => {
    setLocationFilter(e.target.value);
    filterJobs(searchTerm, e.target.value, sortSalary);
  };

  // 💰 Handle Salary Sorting
  const handleSortSalary = (e) => {
    setSortSalary(e.target.value);
    filterJobs(searchTerm, locationFilter, e.target.value);
  };

  // 🛠 Filtering Logic
  const filterJobs = (search, location, sort) => {
    let updatedJobs = jobs;
  
    if (search) {
      updatedJobs = updatedJobs.filter((job) =>
        job.title.toLowerCase().includes(search.toLowerCase())
      );
    }
  
    if (location) {
      updatedJobs = updatedJobs.filter((job) =>
        job.country.toLowerCase().includes(location.toLowerCase())
      );
    }
  
    if (sort) {
      updatedJobs.sort((a, b) => {
        const salaryA = a.fixedSalary || ((a.salaryFrom + a.salaryTo) / 2) || 0;
        const salaryB = b.fixedSalary || ((b.salaryFrom + b.salaryTo) / 2) || 0;
        return sort === "high" ? salaryB - salaryA : salaryA - salaryB;
      });
    }
  
    setFilteredJobs(updatedJobs);
  };

  return (
    <section className="jobs">
      <div className="container">
        <h1>Find Your Dream Job</h1>

        {/* 🔍 Search & Filters */}
        <div className="filters">
          <div className="search-box">
            <FaSearch className="icon" />
            <input
              type="text"
              placeholder="Search Job Title..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <select onChange={handleLocationChange}>
            <option value="">Filter by Location</option>
            <option value="USA">USA</option>
            <option value="India">India</option>
            <option value="Germany">Germany</option>
            <option value="Canada">Canada</option>
          </select>

          <select onChange={handleSortSalary}>
            <option value="">Sort by Salary</option>
            <option value="high">High to Low</option>
            <option value="low">Low to High</option>
          </select>
        </div>

        {/* 🏢 Job Listings */}
        <div className="banner">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading jobs...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div className="card" key={job._id}>
                <p>{job.title}</p>
                <p><FaBriefcase className="icon" /> {job.category}</p>
                <p><FaMapMarkerAlt className="icon" /> {job.country}</p>

                {/* ✅ Updated Salary Display (Matches JobDetails.jsx) */}
                <p>
                {job.currency === "INR" ? <FaRupeeSign className="icon" /> : <FaMoneyBillWave className="icon" />}
                  <strong> Salary:</strong> 
                  {job.fixedSalary
                    ? ` $${job.fixedSalary}`
                    : job.salaryFrom && job.salaryTo
                    ? ` $${job.salaryFrom} - $${job.salaryTo}`
                    : " Salary Not Provided"}
                </p>

                <Link to={`/job/${job._id}`}>Job Details</Link>
              </div>
            ))
          ) : (
            <p className="no-jobs">No jobs available at the moment.</p>
          )}
        </div>

        {/* ⭐ Recommended Jobs */}
        {!loading && (
          <>
            <h2 className="recommended-title">Recommended Jobs</h2>
            <div className="recommended-jobs">
              {jobs.slice(0, 3).map((job) => (
                <div className="recommended-card" key={job._id}>
                  <h3>{job.title}</h3>
                  <p>{job.category}</p>
                  <p>{job.country}</p>
                  <Link to={`/job/${job._id}`}>Apply Now</Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Jobs;
