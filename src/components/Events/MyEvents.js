import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './MyEvents.css';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('email'); // Assuming email is stored in localStorage

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const response = await axios.get('https://jfsdbackend-production-f368.up.railway.app/registered-events', {
          params: { email }
        });
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch registered events');
        toast.error('Error fetching registered events.');
      }
    };

    fetchRegisteredEvents();
  }, [email]);

  const viewEvent = (event) => {
    navigate(`/events/${event.eventName}`);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="my-events-container">
      <h2 className="my-events-heading">Registered Events</h2>
      <div className="my-events-cards-container">
        {events.map((event) => (
          <div className="my-event-card" key={event.eventName}>
            <div className="my-event-card-image">
              <img
                src={`data:image/jpeg;base64,${event.image}`}
                className="my-event-image-all"
                alt={event.eventName}
              />
            </div>
            <div className="my-event-card-details">
              <h3 className="my-event-name">{event.eventName}</h3>
              <p className="my-event-club">Organized by: {event.club?.clubName || 'N/A'}</p>
              <p className="my-event-description">{event.description}</p>
              <div className="my-event-time-venue">
                <div><FaCalendarAlt className="icon" /> {new Date(event.date).toLocaleDateString()} at {event.time}</div>
                <div><FaMapMarkerAlt className="icon" /> {event.venue}</div>
              </div>
              <button style={{backgroundColor:'black'}} className="my-view-event-button" onClick={() => viewEvent(event)}>
                View Event
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyEvents;
