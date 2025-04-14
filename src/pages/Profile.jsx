import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, isAuthorized } = useContext(Context);
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState({ name: "", phone: "", email: "", role: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => {
      setAnimateCard(true);
    }, 100);

    if (isAuthorized && user) {
      axios.get("http://localhost:4000/api/v1/user/getuser", { withCredentials: true })
        .then((res) => {
          const userData = res.data.user;
          setProfile(userData);
          setEditProfile({
            name: userData.name,
            phone: userData.phone,
            email: userData.email,
            role: userData.role
          });
          if (userData.profilePic) {
            setProfilePic(userData.profilePic);
          }
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "Failed to fetch profile");
        });
    }
  }, [user, isAuthorized]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProfile({ ...editProfile, [name]: value });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const updateData = {
        name: editProfile.name,
        phone: editProfile.phone,
        email: editProfile.email,
      };
  
      const res = axios.post("http://localhost:4000/api/v1/profile", updateData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
  
      toast.success("Profile updated successfully");
      setProfile(res.data.profile);
      setIsEditing(false);
    } catch (error) {
      console.error("Update Profile Error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axios.post("http://localhost:4000/api/v1/user/upload-profile", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfilePic(res.data.profilePic);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to upload profile picture.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to current profile values
    if (profile) {
      setEditProfile({
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        role: profile.role
      });
    }
  };

  return (
    <section className="profile-page">
      <div className={`profile-container ${animateCard ? 'animate-in' : ''}`}>
        <div className="profile-header">
          <div className="profile-pic-section">
            <div className="profile-pic-container">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="profile-picture" />
              ) : (
                <div className="profile-picture no-image">
                  <span>{profile?.name?.charAt(0) || "U"}</span>
                </div>
              )}
              <div className="upload-overlay">
                <label htmlFor="profile-upload" className="upload-label">
                  <span className="upload-icon">+</span>
                </label>
                <input 
                  id="profile-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleProfilePicUpload} 
                  className="upload-input" 
                />
              </div>
            </div>
            <div className="profile-title">
              <h1>{profile?.name || "User"}</h1>
              <p className="profile-role">{profile?.role || "Member"}</p>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-card info-card">
            <h2>Profile Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{profile?.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone</span>
                <span className="info-value">{profile?.phone || "Not provided"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Role</span>
                <span className="info-value">{profile?.role}</span>
              </div>
            </div>
          </div>

          <div className="profile-card edit-card">
            <h2>{isEditing ? "Edit Profile" : "Profile Settings"}</h2>
            <div className="edit-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name" 
                  value={editProfile.name} 
                  onChange={handleEditChange} 
                  disabled={!isEditing} 
                  className={!isEditing ? 'disabled' : ''}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="text" 
                  id="phone"
                  name="phone" 
                  value={editProfile.phone} 
                  onChange={handleEditChange} 
                  disabled={!isEditing} 
                  className={!isEditing ? 'disabled' : ''}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  name="email" 
                  value={editProfile.email} 
                  onChange={handleEditChange} 
                  disabled={!isEditing} 
                  className={!isEditing ? 'disabled' : ''}
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <input 
                  type="text" 
                  id="role"
                  name="role" 
                  value={editProfile.role} 
                  onChange={handleEditChange} 
                  disabled={!isEditing} 
                  className={!isEditing ? 'disabled' : ''}
                />
              </div>

              <div className="button-group">
                {isEditing ? (
                  <>
                    <button className="save-btn" onClick={handleSaveProfile} disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button className="cancel-btn" onClick={handleCancel}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
