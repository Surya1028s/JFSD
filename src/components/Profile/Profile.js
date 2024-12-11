import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Avatar } from '@mui/material'; // MUI Avatar for default profile image
import { FaEdit } from 'react-icons/fa'; // Import Pencil Icon for edit functionality
import './Profile.css';
import banner from '../../assets/images/banner.webp'; // Import profile banner image
const Profile = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [viewPasswordMode, setViewPasswordMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
    profileImage: ''
  });

  useEffect(() => {
    const storedProfileData = {
      firstName: localStorage.getItem('name')?.split(' ')[0] || '',
      lastName: localStorage.getItem('lastname'),
      email: localStorage.getItem('email') || '',
      role: localStorage.getItem('role') || '',
      password: localStorage.getItem('password') || '',
      profileImage: localStorage.getItem('profileimage') || ''
    };
    setProfileData(storedProfileData);
  }, []);

  const handlePasswordView = () => {
    if (enteredPassword === profileData.password) {
      setPasswordVisible(true);
      setViewPasswordMode(false); // Hide input box after password is correct
    } else {
      toast.error('Incorrect password. Try again.');
    }
  };

  const handleViewPasswordButton = () => {
    setViewPasswordMode(true); // Show the password input box
  };

  const handleEditProfile = () => {
    toast.info('Profile edit feature is under development!');
    // You can add actual profile editing logic here
  };

  return (
    <div className="profile-container">
      <div className="profile-banner">
        <img
          src={banner} // Adjusted the size to 860x300 to avoid losing quality
          alt="Profile Banner"
          className="profile-banner-image"
        />
      </div>
      <div className="profile-card">
        <div className="profile-image-container">
          {profileData.profileImage ? (
            <img
              src={`data:image/jpeg;base64,${profileData.profileImage}`}
              alt="Profile"
              className="profile-image"
            />
          ) : (
            <Avatar sx={{ width: 150, height: 150 }} /> // MUI default avatar if no image exists
          )}
        </div>
        <FaEdit className="edit-profile-icon" onClick={handleEditProfile} />
        <div className="profile-info">
          <h3>{profileData.firstName} {profileData.lastName}</h3>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Role:</strong> {profileData.role === '0' ? 'Student' : 'Admin'}</p>

          {/* Password Section */}
          <div className="password-section">
            <p><strong>Password:</strong> {passwordVisible ? profileData.password : '••••••••'}</p>
            {!passwordVisible && !viewPasswordMode && (
              <button className="view-password-button" onClick={handleViewPasswordButton}>
                View Password
              </button>
            )}
            {viewPasswordMode && (
              <div className="password-input">
                <input
                  type="password"
                  placeholder="Enter password to view"
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                />
                <button onClick={handlePasswordView}>Submit</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
