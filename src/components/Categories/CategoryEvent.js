import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CategoryEvent.css";
import { useNavigate } from "react-router-dom";
const categories = [
    "Technical",
    "Sports",
    "Cultural",
    "Arts",
    "Health and Well-being",
    "Social Outreach",
];

const CategoryEvent = () => {
    const [selectedCategory, setSelectedCategory] = useState("Sports"); // Default to 'Sports'
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios
            .get(`https://jfsdbackend-production-f368.up.railway.app/category/${selectedCategory}`)
            .then((response) => {
                setEvents(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching events:", error);
                setLoading(false);
            });
    }, [selectedCategory]);
    const viewEvent = (event) => {
        navigate(`/events/${event.eventName}`);
      };
    

    return (
        <div className="category-events-container">
            <div className="categories">
                {categories.map((category) => (
                    <a 
                        key={category}
                        href="#"
                        className={`category-tag ${
                            category === selectedCategory ? "active" : ""
                        }`}
                        onClick={(e) => {
                            e.preventDefault();
                            setSelectedCategory(category);
                        }}
                    >
                        {category}
                    </a>
                ))}
            </div>
            {loading ? (
                <p className="loading-message">Loading events...</p>
            ) : events.length > 0 ? (
                <div className="events-grid">
                    {events.map((event) => (
                        <div className="event-card" key={event.eventName}>
                            <img
                                src={`data:image/jpeg;base64,${event.image}`}
                                alt={event.eventName}
                                className="event-image"
                            />
                            <div className="event-details">
                                <h3>{event.eventName}</h3>
                                <p>{event.description}</p>
                                <button style={{backgroundColor:'black'}} className="know-more-button" onClick={() => viewEvent(event)}>
                                    Know More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-events-container">
                    <p className="no-events-message">No Events Found for {selectedCategory}</p>
                </div>
            )}
        </div>
    );
};

export default CategoryEvent;
