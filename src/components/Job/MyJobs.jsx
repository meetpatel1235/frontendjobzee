import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Added loading state
  const [editingMode, setEditingMode] = useState(null);
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/job/getmyjobs",
          { withCredentials: true }
        );
        setMyJobs(data.myJobs);
      } catch (error) {
        toast.error(error.response.data.message);
        setMyJobs([]);
      } finally {
        setLoading(false); // ✅ Hide spinner when request is complete
      }
    };
    fetchJobs();
  }, []);

  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/");
  }

  const handleEnableEdit = (jobId) => {
    setEditingMode(jobId);
  };

  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    await axios
      .put(`http://localhost:4000/api/v1/job/update/${jobId}`, updatedJob, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setEditingMode(null);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleDeleteJob = async (jobId) => {
    await axios
      .delete(`http://localhost:4000/api/v1/job/delete/${jobId}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [field]: value } : job
      )
    );
  };

  return (
    <div className="jobListings">
      <div className="wrapper">
        <h1>Your Posted Jobs</h1>

        {/* ✅ Loading Spinner */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading jobs...</p>
          </div>
        ) : myJobs.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Country</th>
                <th>City</th>
                <th>Category</th>
                <th>Salary</th>
                <th>Description</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myJobs.map((job) => (
                <tr key={job._id}>
                  <td>
                    <input
                      type="text"
                      disabled={editingMode !== job._id}
                      value={job.title}
                      onChange={(e) =>
                        handleInputChange(job._id, "title", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      disabled={editingMode !== job._id}
                      value={job.country}
                      onChange={(e) =>
                        handleInputChange(job._id, "country", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      disabled={editingMode !== job._id}
                      value={job.city}
                      onChange={(e) =>
                        handleInputChange(job._id, "city", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={job.category}
                      onChange={(e) =>
                        handleInputChange(job._id, "category", e.target.value)
                      }
                      disabled={editingMode !== job._id}
                    >
                      <option value="Graphics & Design">Graphics & Design</option>
                      <option value="Mobile App Development">Mobile App Development</option>
                      <option value="Frontend Web Development">Frontend Web Development</option>
                      <option value="MERN Stack Development">MERN STACK Development</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      disabled={editingMode !== job._id}
                      value={job.fixedSalary || job.salaryFrom || ""}
                      onChange={(e) =>
                        handleInputChange(job._id, "salary", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <textarea
                      rows={3}
                      disabled={editingMode !== job._id}
                      value={job.description}
                      onChange={(e) =>
                        handleInputChange(job._id, "description", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <textarea
                      rows={3}
                      disabled={editingMode !== job._id}
                      value={job.location}
                      onChange={(e) =>
                        handleInputChange(job._id, "location", e.target.value)
                      }
                    />
                  </td>
                  <td className="button-group">
                    {editingMode === job._id ? (
                      <>
                        <button
                          onClick={() => handleUpdateJob(job._id)}
                          className="confirm-btn"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={handleDisableEdit}
                          className="modify-btn"
                        >
                          <RxCross2 />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEnableEdit(job._id)}
                        className="modify-btn"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="remove-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No jobs posted yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
