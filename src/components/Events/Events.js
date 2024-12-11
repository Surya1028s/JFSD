import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Events.css';
import CircularProgress from '@mui/material/CircularProgress';
import { Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AccessTime, LocationOn, Event, Category,Delete } from '@mui/icons-material';
import AddEventOverlay from './AddEventOverlay';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [editEventOpen, setEditEventOpen] = useState(false); // State for the edit overlay
  const [editEventData, setEditEventData] = useState({}); // State for edited event data
  const [viewStudentsOpen, setViewStudentsOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [fetchingStudents, setFetchingStudents] = useState(false);



  useEffect(() => {
    setLoading(true);
    axios
      .get('https://jfsdbackend-production-f368.up.railway.app/events')
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error fetching events:', error);
        setLoading(false);
      });
  }, []);
  const totalEvents = events.length;
  const activeEvents = Math.floor(totalEvents / 2); // Example logic for active events


  const handleMenuOpen = (event, eventDetails) => {
    setMenuAnchorEl(event.currentTarget);
    setActiveEvent(eventDetails);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setActiveEvent(null);
  };

  const handleShowEventDetails = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseEventDetails = () => {
    setSelectedEvent(null);
  };

  const handleEditEvent = () => {
    setEditEventData(activeEvent); // Populate the edit form with current event data
    setEditEventOpen(true); // Open the edit overlay
    handleMenuClose();
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEditEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeleteEvent = () => {
    setDeleteConfirmationOpen(true); // Open Delete Confirmation Modal
    handleMenuClose();
  };

  const handleDeleteConfirmation = (confirm) => {
    if (confirm && eventToDelete) {
      axios
        .delete(`https://jfsdbackend-production-f368.up.railway.app/delete-event?eventName=${eventToDelete.eventName}`)
        .then(() => {
          setEvents((prevEvents) => prevEvents.filter((event) => event.eventName !== eventToDelete.eventName));
        })
        .catch((error) => console.error('Error deleting event:', error));
    }
    setDeleteConfirmationOpen(false);
  };
  const handleSaveEditedEvent = (e) => {
    e.preventDefault();  // Prevent form submission
  
    // Proceed with axios request
    const formData = new FormData();
    
    formData.append('eventName', editEventData.eventName);
    formData.append('coordinatorName', editEventData.coordinatorName);
    formData.append('date', editEventData.date);
    formData.append('time', editEventData.time);
    formData.append('capacity', editEventData.capacity);
    formData.append('venue', editEventData.venue);
    formData.append('description', editEventData.description);
    formData.append('category', editEventData.category);
    formData.append('clubName', editEventData.clubName);
    
    if (editEventData.image) {
      formData.append('image', editEventData.image);
    }
  
    axios
      .post('https://jfsdbackend-production-f368.up.railway.app/update-event', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        // Update the event in the state
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.eventName === editEventData.eventName ? response.data : event
          )
        );
        setEditEventOpen(false); // Close the modal after saving
      })
      .catch((error) => {
        console.error('Error updating event:', error);
      });
  };
  useEffect(() => {
  if (fetchingStudents) {
    console.log("Fetching students...");
  } else {
    console.log("Students:", students);  // Log fetched students
  }
}, [fetchingStudents, students]);

  const handleViewStudents = (event) => {
    setSelectedEvent(event);
    setFetchingStudents(true);

    axios
      .get('https://jfsdbackend-production-f368.up.railway.app/students-by-event', {
        params: { eventName: event.eventName },
      })
      .then((response) => {
        setStudents(response.data);
        setViewStudentsOpen(true);
        setFetchingStudents(false);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        setFetchingStudents(false);
      });
  };

  const handleUnregisterStudent = (email) => {
    axios
      .delete(`https://jfsdbackend-production-f368.up.railway.app/unregister`, {
        params: { email, eventname: selectedEvent.eventName },
      })
      .then(() => {
        setStudents((prev) => prev.filter((student) => student.email !== email));
      })
      .catch((error) => {
        console.error('Error unregistering student:', error);
      });
  };

  const handleCloseViewStudents = () => {
    setViewStudentsOpen(false);
    setStudents([]);
  };



  const formatTime = (timeString) => {
    return timeString;
  };

  if (loading) {
    return (
      <div className="events-loading">
        <CircularProgress color="primary" size={60} />
      </div>
    );
  }

  return (
    <div className="events-page">
      <AddEventOverlay
        open={addEventOpen}
        onClose={() => setAddEventOpen(false)}
        onEventAdded={(newEvent) => setEvents((prev) => [...prev, newEvent])}
      />
      <h1 className="events-heading">All Events</h1>
      <div className="events-stats">
        <div className="events-stat-box">
          <p>Total Events</p>
          <h3>{totalEvents}</h3>
        </div>
        <div className="events-stat-box">
          <p>Active Events</p>
          <h3>{activeEvents}</h3>
        </div>
      </div>
      <button
  className="add-event-button"
  onClick={() => setAddEventOpen(true)}
>
  Add Event
</button>
      <div className="events-container">
        {events.length > 0 ? (
          events.map((event) => (
            <div className="event-card" key={event.eventName}>
              <MoreVertIcon
                className="event-options-icon"
                onClick={(e) => handleMenuOpen(e, event)}
              />
                <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              className="event-menu"
            >
              <MenuItem onClick={handleEditEvent}> Edit Event </MenuItem>
              <MenuItem onClick={() => {
                setEventToDelete(event);
                handleDeleteEvent();
              }}> Delete Event </MenuItem>
            </Menu>
              <img
                src={`data:image/jpeg;base64,${event.image}`}
                alt={event.eventName}
                className="event-image"
              />
              
              <h3 className="event-name-event">{event.eventName}</h3>
              <h2 className='event-description'>{event.description}</h2>
              <button
                className="know-more-button"
                onClick={() => handleShowEventDetails(event)}
              >
                Know More
              </button>
              <button className="view-students-button" onClick={() => handleViewStudents(event)}>
              View Registered Students
            </button>
              {deleteConfirmationOpen && (
        <div className="delete-confirmation-overlay">
          <div className="delete-confirmation-modal">
            <p>Are you sure you want to delete this event?</p>
            <button onClick={() => handleDeleteConfirmation(true)}>Yes</button>
            <button onClick={() => handleDeleteConfirmation(false)}>No</button>
          </div>
        </div>
      )}  
            </div>
          ))
        ) : (
          <p className="no-events">No events available</p>
        )}
      </div>
      {viewStudentsOpen && (
        <div className="viewStudents-overlay">
          <div className="viewStudents-container">
            <button className="viewStudents-close-button" onClick={handleCloseViewStudents}>
              ×
            </button>
            <h2>Registered Students</h2>
            {fetchingStudents ? (
              <p>Loading...</p>
            ) : students.length > 0 ? (
              <ul className="viewStudents-list">
                {students.map((student) => (
                  <li key={student.email} className="viewStudents-item">
                    <img
                      src={`data:image/jpeg;base64,${student.image}` || '/assets/default-profile.png'}
                      alt={student.name}
                      className="viewStudents-image"
                    />
                    <div className="viewStudents-info">
                      <p>{student.firstname} {student.lastname}</p>
                      <p>{student.email}</p>
                    </div>
                    <Delete
                      className="viewStudents-unregister-icon"
                      onClick={() => handleUnregisterStudent(student.email)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No students registered for this event.</p>
            )}
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="event-details-overlay">
          <div className="event-details-container">
            <button className="close-details-button" onClick={handleCloseEventDetails}>
              Close
            </button>
            <div className="event-details">
              <h2>{selectedEvent.eventName}</h2>
              <div className="event-image-container">
                <img
                  src={`data:image/jpeg;base64,${selectedEvent.image}`}
                  alt={selectedEvent.eventName}
                  className="event-details-image"
                />
              </div>
              <div className="event-details-body">
                <div className="event-details-row">
                  <div className="event-details-col">
                    <div className="event-detail">
                      <Event className="event-icon" />
                      <span><strong>Coordinator:</strong> {selectedEvent.coordinatorName}</span>
                    </div>
                    <div className="event-detail">
                      <AccessTime className="event-icon" />
                      <span><strong>Time:</strong> {formatTime(selectedEvent.time)}</span>
                    </div>
                    <div className="event-detail">
                      <Category className="event-icon" />
                      <span><strong>Category:</strong> {selectedEvent.category}</span>
                    </div>
                  </div>
                  <div className="event-details-col">
                    <div className="event-detail">
                      <LocationOn className="event-icon" />
                      <span><strong>Venue:</strong> {selectedEvent.venue}</span>
                    </div>
                    <div className="event-detail">
                      <span><strong>Description:</strong> {selectedEvent.description}</span>
                    </div>
                    <div className="event-club">
                      <span><strong>Organised By:</strong> {selectedEvent.club.clubName}</span>
                    </div>

                    <div className="event-ticking-clock">
                      <p>Event Time:</p>
                      <div className="clock-animation">{selectedEvent.time}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
       {editEventOpen && (
        <div className="edit-event-overlay">
          <div className="edit-event-container">
            <div className="edit-event-header">
              <h2>Edit Event</h2>
              <button className="edit-event-close-button" onClick={() => setEditEventOpen(false)}>
                ×
              </button>
            </div>
            <form className="edit-event-form">
              <div className="edit-event-row">
                <div className="edit-event-column">
                  <label>Event Name</label>
                  <input
                    type="text"
                    name="eventName"
                    value={editEventData.eventName || ''}
                    onChange={handleEventChange}
                  />
                </div>
                <div className="edit-event-column">
                  <label>Coordinator Name</label>
                  <input
                    type="text"
                    name="coordinatorName"
                    value={editEventData.coordinatorName || ''}
                    onChange={handleEventChange}
                  />
                </div>
              </div>
              <div className="edit-event-row">
                <div className="edit-event-column">
                  <label>Time</label>
                  <input
                    type="text"
                    name="time"
                    value={editEventData.time || ''}
                    onChange={handleEventChange}
                  />
                </div>
                <div className="edit-event-column">
                  <label>Venue</label>
                  <input
                    type="text"
                    name="venue"
                    value={editEventData.venue || ''}
                    onChange={handleEventChange}
                  />
                </div>
              </div>
              <div className="edit-event-row">
                <div className="edit-event-column">
                  <label>Category</label>
                  <input
                    type="text"
                    name="category"
                    value={editEventData.category || ''}
                    onChange={handleEventChange}
                  />
                </div>
                <div className="edit-event-column">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={editEventData.description || ''}
                    onChange={handleEventChange}
                  />
                </div>
              </div>
              <div className="edit-event-row">
  <div className="edit-event-column">
    <label>Event Image</label>
    <input
      type="file"
      name="image"
      onChange={(e) => setEditEventData({ ...editEventData, image: e.target.files[0] })}
    />
  </div>
</div>

              <button type="submit" className="edit-event-button" onClick={handleSaveEditedEvent}>Save Changes</button>
            </form>
          </div>
           
        </div>
      )}
    </div>
  );
}

export default Events;
