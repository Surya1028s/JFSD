import React, { useState, useEffect } from 'react';
import '../components/Home.css';
import image from '../assets/images/Designer.png';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Show the welcome container sooner, after 3.5 seconds
    const timer1 = setTimeout(() => {
      setShowWelcome(true);
    }, 3500);

    // Show the image slightly later, after 4 seconds
    const timer2 = setTimeout(() => {
      setShowImage(true);
    }, 4000);

    // Fetch events from the API
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:8080/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data.slice(0,4));
      } catch (err) {
        setError(err.message);
      }
    };

    // Fetch clubs from the API
    const fetchClubs = async () => {
      try {
        const response = await fetch('http://localhost:8080/viewclubs');
        if (!response.ok) {
          throw new Error('Failed to fetch clubs');
        }
        const data = await response.json();
        setClubs(data.slice(0, 3)); // Fetch only the first three clubs
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEvents();
    fetchClubs();

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);
  const viewEvent = (event) => {
    navigate(`/events/${event.eventName}`);
};

  return (
    <div className="App-body">
      <div className="intro-page">
       
        
          
      </div>

      <div className="events-section">
        <h2 style={{color:'black'}}>Upcoming Events</h2>
        {error && <p className="error">{error}</p>}
        <div className="events-container">
          {events.map((event) => (
            <div className="event-card" key={event.id}>
              <img
                src={`data:image/jpeg;base64,${event.image}` || '../assets/images/default-event.png'}
                alt={event.name}
                className="event-image"
              />
              <div className="event-details">
                <h3>{event.name}</h3>
                <p>Organized by: {event.club?.clubName || 'N/A'}</p>
                <p>{event.description}</p>
                <p>
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </p>
                <button 
                  className="view-event-button"
                  onClick={() => viewEvent(event)}
                  style={{backgroundColor:'black'}}
                  
                >
                  View Event
                </button>
              </div>
            </div>
          ))}
          
        </div>
        
        <a href="/events" className="view-all-clubs" style={{backgroundColor:'black'}}>View All Events</a>
      </div>
          
      <div className="clubs-section">
        <h2 style={{color:'black'}}>Check Our Clubs</h2>
        <div className="clubs-container">
          {clubs.map((club) => (
            <div className="club-card" key={club.clubName}>
              <img
                src={`data:image/jpeg;base64,${club.image}` || '../assets/images/default-club.png'}
                alt={club.clubName}
                className="club-image"
              />
              <div className="club-details">
                <h3>{club.clubName}</h3>
                <p>Coordinator: {club.coordinatorName}</p>
                <p>{club.description}</p>
                <button className="view-club-button" style={{backgroundColor:'black'}}>View Club</button>
              </div>
            </div>
          ))}
        </div>
        <a href="/clubs" className="view-all-clubs" style={{backgroundColor:'black'}}>View All Clubs</a>
      </div>
    </div>
  );
};

export default Home;
