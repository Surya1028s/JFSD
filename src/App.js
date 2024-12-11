import './App.css';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import React, { Suspense, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import SignUp from './components/SignUp';
import LoadingSpinner from './components/LoadingSpinner'; // Spinner component
import EventDetails from './components/Events/EventDetails';
import AllEvents from './components/Events/AllEvents';
import Profile from './components/Profile/Profile';
import MyEvents from './components/Events/MyEvents';
import ViewClubs from './components/ViewClubs/ViewClubs'
import CategoryEvent from './components/Categories/CategoryEvent';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
// Lazy Loading Components
const Home = React.lazy(() => import('./components/Home'));
const Dashboard = React.lazy(() => import('./components/Dashboard/Dashboard'));

// Custom AdminRoute Component
function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem('role') === '1'; // Check if role is admin
  return isAdmin ? children : <Navigate to="/login" replace />;
}

// Main App Component
function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/dashboard');

  return (
    <div>
      {/* Conditionally render Navbar and Footer */}
      {!isAdminPath && <Navbar />}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          <Route path="/events/:eventname" element={<EventDetails/>} />
          <Route path="/events" element={<AllEvents />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/myevents" element={<MyEvents />} />
          <Route path="/clubs" element={<ViewClubs/>}/>
         
          <Route path="/about" element={<About/>}/>
          <Route path="/contact" element={<Contact />} />


          {/* Admin Routes */}
          <Route
            path="/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </Suspense>
      {!isAdminPath && <Footer />}
    </div>
  );
}

// App Wrapper with Router
export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
