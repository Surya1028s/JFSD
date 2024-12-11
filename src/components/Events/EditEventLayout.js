import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditEventLayout.css';

function EditEventLayout({ event, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    eventName: '',
    coordinatorName: '',
    date: '',
    time: '',
    capacity: 0,
    venue: '',
    description: '',
    category: '',
    clubName: '',
    image: null,
  });

  useEffect(() => {
    if (event) {
      setFormData({
        eventName: event.eventName,
        coordinatorName: event.coordinatorName,
        date: event.date,
        time: event.time,
        capacity: event.capacity,
        venue: event.venue,
        description: event.description,
        category: event.category,
        clubName: event.clubName,
        image: null,
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    axios
      .post('http://localhost:8080/update-event', formDataToSend)
      .then((response) => {
        onUpdate(response.data); // Notify parent about the update
        onClose(); // Close the modal after updating
      })
      .catch((error) => {
        console.error('Error updating event:', error);
      });
  };

  if (!event) return null;

  return (
    <div className="edit-event-overlay">
      <div className="edit-event-container">
        <button className="close-edit-button" onClick={onClose}>
          X
        </button>
        <h2>Edit Event</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="input-row">
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              placeholder="Event Name"
            />
            <input
              type="text"
              name="coordinatorName"
              value={formData.coordinatorName}
              onChange={handleChange}
              placeholder="Coordinator Name"
            />
          </div>
          <div className="input-row">
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="Date"
            />
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder="Time"
            />
          </div>
          <div className="input-row">
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Capacity"
            />
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="Venue"
            />
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
          ></textarea>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
          />
          <input
            type="text"
            name="clubName"
            value={formData.clubName}
            onChange={handleChange}
            placeholder="Club Name"
          />
          <input type="file" name="image" onChange={handleImageChange} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="submit">Update Event</button>
            <button type="button" className="close-button" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEventLayout;
