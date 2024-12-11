import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Clubs.css';

const Clubs = () => {
    const [clubsData, setClubsData] = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedClub, setSelectedClub] = useState(null);
    const [showAddClubOverlay, setShowAddClubOverlay] = useState(false);
    const [newClub, setNewClub] = useState({ clubName: '', coordinatorName: '', description: '', image: null });

    useEffect(() => {
        fetchClubs();
    }, []);
    const handleAddClub = () => {
        const formData = new FormData();
        formData.append('clubname', newClub.clubName);
        formData.append('coordinatorname', newClub.coordinatorName);
        formData.append('description', newClub.description);
        if (newClub.image instanceof File) {
            formData.append('image', newClub.image);
        }

        axios.post('http://localhost:8080/addclub', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(() => {
                fetchClubs();
                setShowAddClubOverlay(false);
                setNewClub({ clubName: '', coordinatorName: '', description: '', image: null });
            })
            .catch((error) => console.log('Error adding club:', error));
    };

    const handleNewClubInputChange = (e) => {
        const { name, value } = e.target;
        setNewClub({ ...newClub, [name]: value });
    };

    const handleNewClubImageChange = (e) => {
        setNewClub({ ...newClub, image: e.target.files[0] });
    };


    const fetchClubs = () => {
        axios.get('http://localhost:8080/viewclubs')
            .then((response) => setClubsData(response.data))
            .catch((error) => console.log('Error fetching clubs:', error));
    };

    const handleViewClub = (clubName) => {
        axios.get(`http://localhost:8080/view-club?clubName=${clubName}`)
            .then((response) => {
                setSelectedClub(response.data);
                setShowOverlay(true);
            })
            .catch((error) => console.log('Error fetching club details:', error));
    };

    const handleEditClub = () => {
        setEditMode(true);
    };

    const handleEditingClub = () => {
        const updatedClub = {
            coordinatorname: selectedClub.coordinatorName,
            description: selectedClub.description,
        };
    
        const formData = new FormData();
        formData.append('clubname', selectedClub.clubName); // Send clubName as the primary key
        formData.append('coordinatorname', updatedClub.coordinatorname);
        formData.append('description', updatedClub.description);
        if (selectedClub.image instanceof File) {
            formData.append('image', selectedClub.image);
        }
    
        axios.post('http://localhost:8080/editclub', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(() => {
                fetchClubs();
                setEditMode(false);
                setShowOverlay(false);
                setSelectedClub(null);
            })
            .catch((error) => console.log('Error saving club updates:', error));
    };
    
    const handleSaveClub = () => {
        const updatedClub = { ...selectedClub };

        const formData = new FormData();
        formData.append('clubname', updatedClub.clubName);
        formData.append('coordinatorname', updatedClub.coordinatorName);
        formData.append('description', updatedClub.description);
        if (updatedClub.image instanceof File) {
            formData.append('image', updatedClub.image);
        }

        axios.post('http://localhost:8080/addclub', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(() => {
                fetchClubs();
                setEditMode(false);
                setShowOverlay(false);
                setSelectedClub(null);
            })
            .catch((error) => console.log('Error updating club:', error));
    };

    const handleDeleteClub = () => {
        console.log('Delete logic for:', selectedClub.clubName);
        setShowOverlay(false);
        setSelectedClub(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedClub({ ...selectedClub, [name]: value });
    };

    const handleImageChange = (e) => {
        setSelectedClub({ ...selectedClub, image: e.target.files[0] });
    };

    return (
        <div className="Clubs">
            <div className="Clubs-header">
                <div className="Clubs-title">
                    <p>All Clubs ({clubsData.length})</p>
                </div>
                <button className="add-club-button" onClick={() => setShowAddClubOverlay(true)}>
                    Add Club
                </button>
                <p>Explore Our Clubs!</p>
            </div>
            <div className="Clubs-body">
                {clubsData.map((club, index) => (
                    <div
                        className="Clubs-card"
                        key={index}
                        style={{ animationDelay: `${index * 0.2}s` }}
                    >
                        <div className="Clubs-image">
                            <img
                                className="Clubs-image-container"
                                src={`data:image/jpeg;base64,${club.image || ''}`}
                                alt={club.clubName}
                            />
                        </div>
                        <div className="Clubs-description">
                            <div className="Club-name">
                                <p>{club.clubName}</p>
                            </div>
                            <div className="Club-coordinator">
                                <p>Coordinator: {club.coordinatorName}</p>
                            </div>
                            <div className="Club-description-body">
                                <p>{club.description}</p>
                            </div>
                        </div>
                        <button
                            className="view-club-button"
                            onClick={() => handleViewClub(club.clubName)}
                        >
                            View Club
                        </button>
                    </div>
                ))}
            </div>
            {showOverlay && (
                <div className="ClubOverlay">
                    <div className="ClubOverlay-content">
                        <div className="ClubOverlay-header">
                            {!editMode && (
                                <button onClick={handleEditClub} title="Edit">
                                    <i className="fas fa-pencil-alt"></i>
                                </button>
                            )}
                            {editMode && (
                                <button onClick={handleEditingClub} title="Save">
                                    <i className="fas fa-save"></i>
                                </button>
                            )}
                            <button onClick={handleDeleteClub} title="Delete">
                                <i className="fas fa-trash"></i>
                            </button>
                            <button onClick={() => setShowOverlay(false)} title="Close">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="ClubOverlay-body">
                            <label>
                                Club Name:
                                <input
                                    type="text"
                                    name="clubName"
                                    value={selectedClub.clubName}
                                    onChange={handleInputChange}
                                    readOnly={!editMode}
                                />
                            </label>
                            <label>
                                Coordinator Name:
                                <input
                                    type="text"
                                    name="coordinatorName"
                                    value={selectedClub.coordinatorName}
                                    onChange={handleInputChange}
                                    readOnly={!editMode}
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    name="description"
                                    value={selectedClub.description}
                                    onChange={handleInputChange}
                                    readOnly={!editMode}
                                />
                            </label>
                            <label>
                                Image:
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={!editMode}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            )}
            {showAddClubOverlay && (
                <div className="AddClubOverlay">
                    <div className="AddClubOverlay-content">
                        <div className="AddClubOverlay-header">
                            <button onClick={() => setShowAddClubOverlay(false)} title="Close">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="AddClubOverlay-body">
                            <label>
                                Club Name:
                                <input
                                    type="text"
                                    name="clubName"
                                    value={newClub.clubName}
                                    onChange={handleNewClubInputChange}
                                    required="true"
                                />
                            </label>
                            <label>
                                Coordinator Name:
                                <input
                                    type="text"
                                    name="coordinatorName"
                                    value={newClub.coordinatorName}
                                    onChange={handleNewClubInputChange}
                                    required="true"
                                />
                            </label>
                            <label></label>
                            <label>
                                Description:
                                <textarea
                                    name="description"
                                    value={newClub.description}
                                    onChange={handleNewClubInputChange}
                                    required="true"
                                />
                            </label>
                            <label>
                                Image:
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleNewClubImageChange}
                                />
                            </label>
                            <button className="save-club-button" onClick={handleAddClub}>
                                Save Club
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clubs;
