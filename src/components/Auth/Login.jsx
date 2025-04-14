import React, { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const { isAuthorized, setIsAuthorized } = useContext(Context);
  const [loading, setLoading] = useState(false);

  // Forgot Password States
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const BASE_URL = "http://localhost:4000"; // Change to your production URL if needed

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password || !role) {
      toast.error("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/user/login`,
        { email, password, role },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success("Login successful!");
      localStorage.setItem("token", response.data.token);
      setIsAuthorized(true);

      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/api/v1/user/send-otp`, { email });
      toast.success("OTP sent to your email.");
      setOtpSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/api/v1/user/verify-otp`, { email, otp });
      toast.success("OTP verified successfully.");
      setOtpVerified(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP.");
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/api/v1/user/update-password`, {
        email,
        newPassword,
      });
      toast.success("Password updated successfully.");
      closeForgotPassword();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password.");
    }
  };

  const closeForgotPassword = () => {
    setIsForgotPasswordOpen(false);
    setOtp("");
    setNewPassword("");
    setOtpSent(false);
    setOtpVerified(false);
  };

  if (isAuthorized) return <Navigate to="/" />;

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

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="forgot-password-modal">
          <div className="modal-content">
            <h3>Forgot Password</h3>
            {!otpSent ? (
              <>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleSendOtp}>Send OTP</button>
              </>
            ) : !otpVerified ? (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button onClick={handleVerifyOtp}>Verify OTP</button>
              </>
            ) : (
              <>
                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={handleUpdatePassword}>Update Password</button>
              </>
            )}
            <button className="close-btn" onClick={closeForgotPassword}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Login;
