import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './ALLEvents.css';

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://jfsdbackend-production-f368.up.railway.app/events');
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch events');
        toast.error('Error fetching events.');
      }
    };

    fetchEvents();
  }, []);

  const viewEvent = (event) => {
    navigate(`/events/${event.eventName}`);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="all-events-container">
      <h2 className="events-heading">All Events</h2>
      <div className="events-cards-container">
        {events.map((event) => (
          <div className="event-card">
            <div className="event-card-image">
              <img
                src={`data:image/jpeg;base64,${event.image}`} 
                className="event-image-all"
              />
            </div>
            <div className="event-card-details">
                <h3>{event.eventName}</h3>
              <p className="event-club">Organized by: {event.club?.clubName || 'N/A'}</p>
              <p className="event-description">{event.description}</p>
              <div className="event-time-venue">
                <div><FaCalendarAlt className="icon"  style={{color:'black'}}/> {new Date(event.date).toLocaleDateString()} at {event.time}</div>
                <div><FaMapMarkerAlt className="icon" style={{color:'black'}} /> {event.venue}</div>
              </div>
              <button style={{backgroundColor:'black'}} className="view-event-button" onClick={() => viewEvent(event)}>
                View Event
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllEvents;
