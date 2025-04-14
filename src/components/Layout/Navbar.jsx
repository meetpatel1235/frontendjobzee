import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { User, LogOut, Menu, X } from "lucide-react"; // Added icons for menu toggle
import "./Navbar.css"; // Import CSS File

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const [profilePic, setProfilePic] = useState(null);
  const navigateTo = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing pages
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Fetch user profile picture
  useEffect(() => {
    if (isAuthorized && user?._id) {
      axios
        .get("http://localhost:4000/api/v1/user/getuser", { withCredentials: true })
        .then((res) => {
          setProfilePic(res.data?.user?.profilePic || null);
        })
        .catch((error) => {
          console.error("Profile Fetch Error:", error);
        });
    }
  }, [isAuthorized, user]);

   // Logout Function
   const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/user/logout", { withCredentials: true });
      toast.success(response.data.message);
      setIsAuthorized(false);
      toast.success("Logged out successfully!");
      
      // Redirect to login page after logout
      setTimeout(() => navigateTo("/login"), 500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to log out!");
    }
  };
  

  return (
    <>
      {/* ✅ Hide navbar on login/register pages */}
      {!["/login", "/register"].includes(location.pathname) && (
        <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
          <div className="navbar-container">
            {/* Logo */}
            <Link to="/" className="logo-container">
              <div className="logo">
                <span>JZ</span>
              </div>
              <span className="logo-text">JobZee</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Navigation Links - Hidden on mobile unless menu is open */}
            <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
              <CustomNavLink to="/">Home</CustomNavLink>
              <CustomNavLink to="/job/getall">All Jobs</CustomNavLink>

              {/* Show employer or job seeker menu */}
              {user?.role === "Employer" ? (
                <>
                  <CustomNavLink to="/applications/me">Applicant's Applications</CustomNavLink>
                  <CustomNavLink to="/job/post">Post New Job</CustomNavLink>
                  <CustomNavLink to="/job/me">View Your Jobs</CustomNavLink>
                </>
              ) : (
                <CustomNavLink to="/applications/me">My Applications</CustomNavLink>
              )}
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
