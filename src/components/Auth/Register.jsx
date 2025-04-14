import React, { useContext, useState } from "react";
import { FaUser, FaPencilAlt } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const { isAuthorized, setIsAuthorized } = useContext(Context);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:4000/api/v1/user/register";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("role", role);
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("password", password);

    let imageUrl = "";
    if (profilePic) {
      const imageForm = new FormData();
      imageForm.append("file", profilePic);
      imageForm.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLIENT_NAME}/image/upload`,
        imageForm
      );

      if (cloudinaryResponse.data.secure_url) {
        imageUrl = cloudinaryResponse.data.secure_url;
      }
    }

    if (imageUrl) {
      formData.append("profilePic", imageUrl);
    }

    const API_URL = "http://localhost:4000/api/v1/user/register";
    
    console.log("Registering user with API URL:", API_URL);
    console.log("Form Data:", Object.fromEntries(formData));

    const { data } = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    toast.success(data.message);
    setIsAuthorized(true);
  } catch (error) {
    toast.error(error.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};

  if (isAuthorized) {
    return <Navigate to="/" />;
  }

  return (
    <section className="authPage">
      <div className="auth-container">
        <h2 className="auth-title">Join Us</h2>
        <p className="auth-subtitle">Create your account</p>

        <div className="profile-upload-container">
          <label htmlFor="profilePic" className="file-upload-label">Upload Profile Picture</label>
          <input type="file" id="profilePic" accept="image/*" onChange={handleImageChange} className="file-upload-input" />
          {preview && <img src={preview} alt="Profile Preview" className="profile-preview" />}
        </div>

        <div className="role-selection">
          <label>Select Role:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="role"
                value="Admin"
                onChange={(e) => setRole(e.target.value)}
              />
              Admin
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="Employer"
                onChange={(e) => setRole(e.target.value)}
              />
              Employer
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="Job Seeker"
                onChange={(e) => setRole(e.target.value)}
              />
              Job Seeker
            </label>
          </div>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="inputGroup">
            <FaUser className="inputIcon" />
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="inputGroup">
            <MdOutlineMailOutline className="inputIcon" />
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="inputGroup">
            <FaPencilAlt className="inputIcon" />
            <input type="number" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="inputGroup">
            <RiLock2Fill className="inputIcon" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="auth-link">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </section>
  );
};

export default Register;
