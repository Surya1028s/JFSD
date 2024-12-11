import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewClubs.css';

const ViewClubs = () => {
    const [clubs, setClubs] = useState([]);
    const [selectedClub, setSelectedClub] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = () => {
        axios.get('https://jfsdbackend-production-f368.up.railway.app/viewclubs')
            .then((response) => setClubs(response.data))
            .catch((error) => console.error('Error fetching clubs:', error));
    };

    const handleViewClub = (clubName) => {
        axios.get(`https://jfsdbackend-production-f368.up.railway.app/view-club?clubName=${clubName}`)
            .then((response) => {
                setSelectedClub(response.data);
                setShowOverlay(true);
            })
            .catch((error) => console.error('Error fetching club details:', error));
    };

    return (
        <div className="ViewClubs">
            <header className="ViewClubs-header">
                <h1>All Clubs</h1>
            </header>
            <div className="ViewClubs-body">
                {clubs.map((club, index) => (
                    <div className="ViewClubs-card" key={index}>
                        <img
                            className="ViewClubs-image"
                            src={`data:image/jpeg;base64,${club.image || ''}`}
                            alt={club.clubName}
                        />
                        <div className="ViewClubs-details">
                            <h2>{club.clubName}</h2>
                            <p>Coordinator: {club.coordinatorName}</p>
                        </div>
                        <button
                            className="ViewClubs-view-button"
                            style={{backgroundColor:'black'}}
                            onClick={() => handleViewClub(club.clubName)}
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
            {showOverlay && selectedClub && (
                <div className="ViewClubs-overlay">
                    <div className="ViewClubs-overlay-content">
                        <button
                            className="ViewClubs-overlay-close"
                            onClick={() => setShowOverlay(false)}
                        >
                            &times;
                        </button>
                        <img
                            className="ViewClubs-overlay-image"
                            src={`data:image/jpeg;base64,${selectedClub.image || ''}`}
                            alt={selectedClub.clubName}
                        />
                        <h2>{selectedClub.clubName}</h2>
                        <p><strong>Coordinator:</strong> {selectedClub.coordinatorName}</p>
                        <p><strong>Description:</strong> {selectedClub.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewClubs;