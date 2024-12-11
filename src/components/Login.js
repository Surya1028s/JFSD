    import React, { useState } from 'react';
    import axios from 'axios';
    import './styles.css';
    import { toast, ToastContainer } from 'react-toastify'; 
    import 'react-toastify/dist/ReactToastify.css'; 

    export default function Login() {
        // State for email, password, and password visibility
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [showPassword, setShowPassword] = useState(false);

        function handleLogin() {
            axios.post("http://localhost:8080/login", {
                email,
                password,
            }).then((res) => {
                console.log(res.data);
                const { role, email, firstname, name, image } = res.data;
                if (res.data.role === 0 || res.data.role === 1) {
                    localStorage.setItem('email', res.data.email);
                    localStorage.setItem('role', res.data.role);
                    localStorage.setItem('name', res.data.firstname || res.data.name);
                    localStorage.setItem('lastname', res.data.lastname);
                    localStorage.setItem("profileimage", res.data.image);
                    toast.success('Logged in Successfully!'); // Show success toast
                    setTimeout(() => {
                        if (role === 1) {
                            // Admin role: Redirect to dashboard
                            window.location.href = '/dashboard';
                        } else {
                            // Non-admin role: Redirect to home
                            window.location.href = '/';
                        }
                    }, 1000);
                } else {
                    // Invalid role or credentials
                    toast.error('Invalid Credentials');
                }
            }).catch((error) => {
                console.error("There was an error logging in!", error);
                toast.error('An error occurred, please try again'); // Handle unexpected errors
            });
        }

        return (
            <div className="loginpage">
                <div className="login-container">
                    <p className="login-text">Login</p>
                    <div className="login-input-class">
                        <input 
                            className="login-input" 
                            name="email" 
                            type="text" 
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input 
                            className="login-input" 
                            name="password" 
                            type={showPassword ? "text" : "password"} // Toggle password visibility
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="show-password">
                            <input 
                                type="checkbox" 
                                id="showPassword" 
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)} 
                            />
                            <label htmlFor="showPassword">Show Password</label>
                        </div>
                        
                        <p className="forgot-password"><a href="/forgot-password">Forgot Password?</a></p>
                        <button onClick={handleLogin} className="login-button" type="submit">Login</button>
                        <p>Don't have an account? <a href="/signup" className="login-signup">Sign Up Here!</a></p>
                        
                    </div>
                </div>
                <ToastContainer 
                    position="top-right" 
                    autoClose={5000} 
                    hideProgressBar={false} 
                    closeOnClick 
                    pauseOnFocusLoss 
                    draggable 
                    pauseOnHover 
                />
            </div>
        );
    }
