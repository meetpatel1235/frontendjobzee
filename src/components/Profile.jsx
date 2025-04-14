import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { User, LogOut, Menu, X, ChevronDown } from "lucide-react"; // Added dropdown icon
import "./Navbar.css"; // Import CSS File

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // New state for mobile dropdown
  const [scrolled, setScrolled] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const [profilePic, setProfilePic] = useState(null);
  const navigateTo = useNavigate();
  const location = useLocation();

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when navigating to a new page
  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  // Fetch user profile picture
  useEffect(() => {
    if (isAuthorized && user?._id) {
      axios
        .get("https://mern-job-webapp-backend.onrender.com/api/v1/user/getuser", { withCredentials: true })
        .then((res) => setProfilePic(res.data?.user?.profilePic || null))
        .catch((error) => console.error("Profile Fetch Error:", error));
    }
  }, [isAuthorized, user]);

  const handleLogout = async () => {
    try {
      const response = await axios.get("https://mern-job-webapp-backend.onrender.com/api/v1/user/logout", { withCredentials: true });
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <>
      {/* Hide navbar on login/register pages */}
      {!["/login", "/register"].includes(location.pathname) && (
        <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
          <div className="navbar-container">
            {/* Logo */}
            <Link to="/" className="logo-container">
              <div className="logo"><span>JZ</span></div>
              <span className="logo-text">JobZee</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Navigation Links - Desktop */}
            <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
              <CustomNavLink to="/">Home</CustomNavLink>
              <CustomNavLink to="/job/getall">All Jobs</CustomNavLink>

              {/* Conditional Dropdown for Mobile Users */}
              <div className="dropdown">
                <button className="dropdown-toggle" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  {user?.role === "Employer" ? "Employer Menu" : "My Applications"} <ChevronDown size={18} />
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    {user?.role === "Employer" ? (
                      <>
                        <CustomNavLink to="/applications/me">Applicant's Applications</CustomNavLink>
                        <CustomNavLink to="/job/post">Post New Job</CustomNavLink>
                        <CustomNavLink to="/job/me">View Your Jobs</CustomNavLink>
                      </>
                    ) : (
                      <CustomNavLink to="/applications/me">My Applications</CustomNavLink>
                    )}
                  </div>
                )}
              </div>
            </nav>

            {/* User Actions */}
            <div className="user-actions">
              <Link to="/profile" className="profile-icon">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="nav-profile-pic" />
                ) : (
                  <User size={22} />
                )}
              </Link>

              <button className="logout-button" onClick={handleLogout}>
                <span>Logout</span>
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>
      )}
    </>
  );
};

// ✅ Custom NavLink Component
const CustomNavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`nav-link ${isActive ? "active" : ""}`}>
      {children}
      {isActive && <div className="active-indicator" />}
    </Link>
  );
};

export default Navbar;
