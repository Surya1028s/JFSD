import React, { useState, useEffect } from "react";
import { TextField, Button, IconButton, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import "./AddEventOverlay.css";

const AddEventOverlay = ({ open, onClose, onEventAdded }) => {
  const [eventData, setEventData] = useState({
    eventName: "",
    coordinatorName: "",
    date: "",
    time: "",
    capacity: "",
    venue: "",
    description: "",
    category: "",
    clubName: "",
    image: null,
  });

  const [clubNames, setClubNames] = useState([]); // To store club names

  // List of categories
  const categories = [
    "Technical",
    "Sports",
    "Cultural",
    "Arts",
    "Health and Well-being",
    "Social Outreach",
  ];

  // Fetch club names when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:8080/names")
      .then((response) => {
        setClubNames(response.data);
      })
      .catch((error) => console.error("Error fetching club names:", error));
  }, []);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setEventData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleAddEvent = () => {
    const formData = new FormData();
    Object.entries(eventData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    axios
      .post("http://localhost:8080/addevent", formData)
      .then((response) => {
        onEventAdded(response.data);
        onClose();
      })
      .catch((error) => console.error("Error adding event:", error));
  };

  return (
    <div className="add-event-overlay">
      <div className="add-event-overlay-content">
        <IconButton className="close-icon" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <h2>Add New Event</h2>
        <div className="form-row">
          <TextField
            label="Event Name"
            name="eventName"
            variant="outlined"
            value={eventData.eventName}
            onChange={handleChange}
            fullWidth
            InputProps={{
              style: { fontSize: "0.9rem" }, // Smaller placeholder font size
            }}
          />
          <TextField
            label="Coordinator Name"
            name="coordinatorName"
            variant="outlined"
            value={eventData.coordinatorName}
            onChange={handleChange}
            fullWidth
            InputProps={{
              style: { fontSize: "0.9rem" },
            }}
          />
        </div>
        <div className="form-row">
          <TextField
            label="Date"
            name="date"
            variant="outlined"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={eventData.date}
            onChange={handleChange}
            fullWidth
            InputProps={{
              style: { fontSize: "0.9rem" },
            }}
          />
          <TextField
            label="Time"
            name="time"
            variant="outlined"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={eventData.time}
            onChange={handleChange}
            fullWidth
            InputProps={{
              style: { fontSize: "0.9rem" },
            }}
          />
        </div>
        <div className="form-row">
          <TextField
            label="Capacity"
            name="capacity"
            variant="outlined"
            type="number"
            value={eventData.capacity}
            onChange={handleChange}
            fullWidth
            InputProps={{
              style: { fontSize: "0.9rem" },
            }}
          />
          <TextField
            label="Venue"
            name="venue"
            variant="outlined"
            value={eventData.venue}
            onChange={handleChange}
            fullWidth
            InputProps={{
              style: { fontSize: "0.9rem" },
            }}
          />
        </div>
        <div className="form-row">
          <TextField
            select
            label="Category"
            name="category"
            variant="outlined"
            value={eventData.category}
            onChange={handleChange}
            fullWidth
            InputProps={{
              style: { fontSize: "0.9rem" },
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Club Name"
            name="clubName"
            variant="outlined"
            value={eventData.clubName}
            onChange={handleChange}
            fullWidth
            InputProps={{
              style: { fontSize: "0.9rem" },
            }}
          >
            {clubNames.map((club) => (
              <MenuItem key={club} value={club}>
                {club}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="form-row">
          <TextField
            label="Description"
            name="description"
            variant="outlined"
            multiline
            rows={3}
            value={eventData.description}
            onChange={handleChange}
            fullWidth
            InputProps={{
              style: { fontSize: "0.9rem" },
            }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="upload-button"
          />
        </div>
        <div className="form-actions">
          <Button variant="contained" color="primary" onClick={handleAddEvent}>
            Add Event
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddEventOverlay;
