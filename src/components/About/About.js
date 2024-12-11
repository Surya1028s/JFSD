import React from "react";
import "./AboutUs.css";
import  useScrollAnimation  from "./UseScrollAnimation";

const About = () => {
    useScrollAnimation();

    return (
        <div className="about-us-container">
            <div className="about-us-header">
                <h1>About Us</h1>
                <p>Your trusted platform for managing extracurricular activities efficiently.</p>
            </div>
            <section className="about-us-section">
                <div className="about-us-card animate-on-scroll">
                    <h2><b>Our Aim</b></h2>
                    <p>
                        At <b>Studentiva</b>, our aim is to bridge the gap between students and extracurricular opportunities by providing a streamlined platform. 
                        We focus on making event management and participation simple, intuitive, and rewarding for everyone involved.
                    </p>
                </div>
                <div className="about-us-card animate-on-scroll">
                    <h2><b>Scope for Students</b></h2>
                    <p>
                        Studentiva provides an extensive array of opportunities for students to grow beyond academics. Whether it’s technical workshops, sports tournaments, cultural fests, or social outreach programs, 
                        we ensure students can find activities tailored to their interests and skills.
                    </p>
                    <p>
                        Students can: 
                        <ul>
                            <li>Register for events seamlessly.</li>
                            <li>Track their participation and performance.</li>
                            <li>Earn points and recognition for their involvement.</li>
                        </ul>
                    </p>
                </div>
                <div className="about-us-card animate-on-scroll">
                    <h2><b>Why Choose Studentiva?</b></h2>
                    <p>
                        Choosing <b>Studentiva</b> means choosing a platform designed with students and administrators in mind. 
                        Our platform is simple yet powerful, enabling smooth management and tracking of extracurricular activities.
                    </p>
                    <p>Key Benefits:</p>
                    <ul>
                        <li>Efficient event organization tools.</li>
                        <li>User-friendly interfaces for students and admins.</li>
                        <li>Comprehensive analytics to track student engagement.</li>
                    </ul>
                </div>
                <div className="about-us-card animate-on-scroll">
                    <h2><b>Contact Us</b></h2>
                    <p>
                        Have questions? Want to learn more about our services? Reach out to us!
                    </p>
                    <p>
                        <b>Email:</b> support@studentiva.com<br />
                        <b>Phone:</b> +1-800-STUDENTIVA<br />
                        <b>Address:</b> 123 Learning Lane, EduCity, Knowledge State, USA
                    </p>
                </div>
                <div className="about-us-card animate-on-scroll">
                    <h2><b>About Our Organization</b></h2>
                    <p>
                        <b>Studentiva</b> is managed by a dedicated team passionate about fostering student development. 
                        We believe that extracurricular activities play a critical role in shaping the leaders of tomorrow. 
                        Our organization is committed to creating a platform that empowers students to explore their interests and potential.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default About;
