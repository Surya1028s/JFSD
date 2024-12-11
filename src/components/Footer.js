import React, { useRef, useEffect } from 'react';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa'; // Import Font Awesome icons
import './footer.css';

function Footer() {
    const linksRef = useRef([]);
    const supportRef = useRef(null);

    useEffect(() => {
        linksRef.current.forEach((link) => {
            link.addEventListener('mouseenter', () => {
                link.style.transition = 'transform 0.2s';
                link.style.transform = 'translateY(-3px)';
            });
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0)';
            });
        });

        if (supportRef.current) {
            supportRef.current.addEventListener('mouseenter', () => {
                supportRef.current.style.transform = 'scale(1.05)';
            });
            supportRef.current.addEventListener('mouseleave', () => {
                supportRef.current.style.transform = 'scale(1)';
            });
        }
    }, []);

    return (
        <footer className="footer" style={{backgroundColor:'black'}}>
            <div className="footer-content">
                
                <div className="footer-logo">
                    <img src="logo.png" alt="Logo" className="logo" />
                    <p className="copyright">© 2024 Surya . All rights reserved.</p>
                </div>

                {/* Navigation Links */}
                <div className="footer-links">
                    {['Home', 'Events', 'Clubs', 'Contact'].map((text, index) => (
                        <a
                            href={`${text.toLowerCase()}`}
                            key={text}
                            ref={(el) => (linksRef.current[index] = el)}
                        >
                            {text}
                        </a>
                    ))}
                </div>

                {/* Social Media Links with Icons */}
                <div className="footer-social">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="social-icon" /> Instagram
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FaTwitter className="social-icon" /> Twitter
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebook className="social-icon" /> Facebook
                    </a>
                </div>

                {/* Support Section */}
                <div className="footer-support">
                    <p ref={supportRef} style={{color:'white'}}>Contact Us for Support</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
