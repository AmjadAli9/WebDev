import React, { useState, useEffect } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { format, subDays } from "date-fns";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const today = new Date();

  const [profile, setProfile] = useState(null);
  const [activity, setActivity] = useState([]);

  // Load user and activity
  useEffect(() => {
    const loadProfile = () => {
      const loggedUser = JSON.parse(localStorage.getItem("webdevhub_user"));
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const savedActivity = JSON.parse(localStorage.getItem("userActivity"));

      if (!loggedUser) {
        navigate("/loading");
        return;
      }

      // Merge with users array if exists
      const currentUser =
        users.find((u) => u.email === loggedUser.email) || loggedUser;
      setProfile({ ...currentUser });

      // Load activity
      if (savedActivity) {
        setActivity(savedActivity);
      } else {
        const defaultActivity = Array.from({ length: 90 }, (_, i) => ({
          date: format(subDays(today, i), "yyyy-MM-dd"),
          count: 0,
        })).reverse();
        setActivity(defaultActivity);
      }
    };

    loadProfile();
  }, [navigate, today]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Profile picture upload
  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfile((prev) => {
          const updated = { ...prev, profilePic: imageData };
          saveProfile(updated, activity);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a JPEG or PNG image.");
    }
  };

  // Save profile and activity
  const saveProfile = (updatedProfile, updatedActivity) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.some((u) => u.email === updatedProfile.email)
      ? users.map((u) =>
          u.email === updatedProfile.email ? updatedProfile : u
        )
      : [...users, updatedProfile];

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("webdevhub_user", JSON.stringify(updatedProfile));
    localStorage.setItem("userActivity", JSON.stringify(updatedActivity));

    setProfile(updatedProfile); // refresh UI immediately
    alert("Profile saved successfully!");
  };

  const handleSave = () => {
    saveProfile(profile, activity);
  };

  // Toggle activity clicks
  const handleActivityClick = (value) => {
    if (!value) return;
    const updated = activity.map((day) =>
      day.date === value.date ? { ...day, count: day.count ? 0 : 1 } : day
    );
    setActivity(updated);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("webdevhub_user");
    localStorage.removeItem("isLoggedIn");
    navigate("/loading");
  };

  if (!profile) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-pic">
          {profile.profilePic ? (
            <img src={profile.profilePic} alt="Profile" />
          ) : (
            <div className="placeholder-pic">+</div>
          )}
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleProfilePicUpload}
          />
        </div>
        <div className="profile-info">
          <h1>{profile.displayName || "New User"}</h1>
          <p>{profile.headline || "No headline yet"}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Heatmap Section */}
      <div className="heatmap-section">
        <h2>Activity Calendar</h2>
        <p className="note">Green squares indicate daily site activity.</p>
        <CalendarHeatmap
          startDate={subDays(today, 89)}
          endDate={today}
          values={activity}
          classForValue={(value) => {
            if (!value) return "color-empty";
            return value.count ? "color-filled" : "color-empty";
          }}
          onClick={handleActivityClick}
        />
      </div>

      {/* Editable Profile Form */}
      <div className="form-section">
        <h2>Basic Info</h2>
        <div className="form-grid">
          <label>Display Name</label>
          <input
            name="displayName"
            value={profile.displayName || ""}
            onChange={handleChange}
          />

          <label>Profile Headline</label>
          <input
            name="headline"
            value={profile.headline || ""}
            onChange={handleChange}
          />

          <label>Gender</label>
          <select
            name="gender"
            value={profile.gender || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <label>State</label>
          <input
            name="state"
            value={profile.state || ""}
            onChange={handleChange}
          />

          <label>City</label>
          <input
            name="city"
            value={profile.city || ""}
            onChange={handleChange}
          />

          <label>Short Bio</label>
          <textarea
            name="bio"
            value={profile.bio || ""}
            onChange={handleChange}
          ></textarea>
        </div>

        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}