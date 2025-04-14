import React, { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const { isAuthorized, setIsAuthorized } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = "https://backend-b8mw.onrender.com";

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password || !role) {
    toast.error("Please fill all fields.");
    return;
  }

  setLoading(true);
  try {
    const response = await axiosInstance.post("/user/login", {
      email,
      password,
      role,
    });

    toast.success("Login successful!");
    localStorage.setItem("token", response.data.token);
    setIsAuthorized(true);

    // Fetch user to confirm login success
    await axiosInstance.get("/user/getuser");

    navigate("/");
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed!");
  } finally {
    setLoading(false);
  }
};

  if (isAuthorized) return <Navigate to="/" />;

  // ... (Forgot Password JSX remains the same, keep it below the login form)

  return (
    <section className="authPage">
      <div className="auth-container">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to continue</p>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="role-selection">
            <label>Select Role:</label>
            <div className="radio-group">
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

          <div className="inputGroup">
            <MdOutlineMailOutline className="inputIcon" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="inputGroup">
            <RiLock2Fill className="inputIcon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <div className="spinner"></div> : "Login"}
          </button>
        </form>

        <p className="auth-link">
          <span className="forgot-password" onClick={() => setIsForgotPasswordOpen(true)}>
            Forgot Password?
          </span>
        </p>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register Now</Link>
        </p>
      </div>

      {/* Forgot Password Modal remains unchanged */}
    </section>
  );
};

export default Login;
