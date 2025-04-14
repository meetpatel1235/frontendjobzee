import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    country: "",
    city: "",
    location: "",
    salaryFrom: "",
    salaryTo: "",
    fixedSalary: "",
    salaryType: "default",
  });

  const [loading, setLoading] = useState(false); // ✅ Added loading state

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleJobPost = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Show spinner when posting job

    if (formData.salaryType === "Fixed Salary") {
      setFormData({ ...formData, salaryFrom: "", salaryTo: "" });
    } else if (formData.salaryType === "Ranged Salary") {
      setFormData({ ...formData, fixedSalary: "" });
    } else {
      setFormData({ ...formData, salaryFrom: "", salaryTo: "", fixedSalary: "" });
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/job/post",
        formData.salaryType === "Fixed Salary"
          ? { ...formData, salaryFrom: "", salaryTo: "" }
          : { ...formData, fixedSalary: "" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      setFormData({
        title: "",
        description: "",
        category: "",
        country: "",
        city: "",
        location: "",
        salaryFrom: "",
        salaryTo: "",
        fixedSalary: "",
        salaryType: "default",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); // ✅ Hide spinner after request completes
    }
  };

  return (
    <div className="job_post">
      <div className="container">
        <h1>Post New Job</h1>

        {/* ✅ Loading Spinner */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Posting job...</p>
          </div>
        )}

        <form onSubmit={handleJobPost}>
          <div className="wrapper">
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" required />
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select Category</option>
              <option value="Graphics & Design">Graphics & Design</option>
              <option value="React Js">React Js</option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="MERN Stack">MERN Stack</option>
              <option value="AI & ML">AI & ML</option>
            </select>
          </div>
          <div className="wrapper">
            <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" required />
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
          </div>
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />

          <div className="salary_wrapper">
            <select name="salaryType" value={formData.salaryType} onChange={handleChange}>
              <option value="default">Select Salary Type</option>
              <option value="Fixed Salary">Fixed Salary</option>
              <option value="Ranged Salary">Ranged Salary</option>
            </select>
            {formData.salaryType === "Fixed Salary" && (
              <input type="number" name="fixedSalary" value={formData.fixedSalary} onChange={handleChange} placeholder="Enter Fixed Salary" />
            )}
            {formData.salaryType === "Ranged Salary" && (
              <div className="ranged_salary">
                <input type="number" name="salaryFrom" value={formData.salaryFrom} onChange={handleChange} placeholder="Salary From" />
                <input type="number" name="salaryTo" value={formData.salaryTo} onChange={handleChange} placeholder="Salary To" />
              </div>
            )}
          </div>

          <textarea name="description" rows="5" value={formData.description} onChange={handleChange} placeholder="Job Description"></textarea>
          <button type="submit" disabled={loading}>Create Job</button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
