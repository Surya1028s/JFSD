import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    complaint: "",
    file: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object
    const data = new FormData();
    data.append("email", formData.email);
    data.append("name", formData.name);
    data.append("complaint", formData.complaint);
    if (formData.file) {
      data.append("file", formData.file);
    }

    try {
      setIsSubmitting(true);

      // POST request
      const response = await fetch("https://jfsdbackend-production-f368.up.railway.app/addcomplaint", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        toast.success("Your complaint has been submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setFormData({
          email: "",
          name: "",
          complaint: "",
          file: null,
        });
      } else {
        toast.error("Failed to submit the complaint. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("An error occurred while submitting your complaint.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <h1 className="contact-heading">Contact Us</h1>
      <p className="contact-subheading">We are at your service</p>
      <div className="contact-content">
        {/* Toast Container */}
        <ToastContainer />

        {/* Left Form */}
        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="complaint">Complaint</label>
            <textarea
              name="complaint"
              id="complaint"
              placeholder="Describe your issue or complaint"
              value={formData.complaint}
              onChange={handleChange}
              required
            ></textarea>

            <label htmlFor="file">Upload File (Optional)</label>
            <input
              type="file"
              name="file"
              id="file"
              onChange={handleChange}
            />

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Right Map */}
        <div className="contact-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.6644981422487!2d80.62035802487615!3d16.441857079355156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f0a2a073957d%3A0xe79d66babc83e470!2sK%20L%20UNIVERSITY%2C%20Vaddeswaram%2C%20Andhra%20Pradesh%20522303!5e0!3m2!1sen!2sin!4v1731948418437!5m2!1sen!2sin"
            width="400"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
