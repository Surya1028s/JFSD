import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; // Importing Bar chart from Chart.js
import { Pie } from 'react-chartjs-2'; // Importing Pie chart from Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './ViewDashboard.css'; // Import CSS for the styles

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ViewDashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({});
  const [averageData, setAverageData] = useState({ averageRegistrations: 0, averageUnregistrations: 0 }); // Default values
  const [studentsData, setStudentsData] = useState([]);
  const [registeredCounts, setRegisteredCounts] = useState({ registered: 0, unregistered: 0 });

  // Fetch total students
  useEffect(() => {
    axios.get('https://jfsdbackend-production-f368.up.railway.app/viewall')
      .then((response) => {
        setTotalStudents(response.data.length);
        setStudentsData(response.data); // Store student data for later use
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
      });
  }, []);

  // Fetch total events and students registered per event
  useEffect(() => {
    axios.get('https://jfsdbackend-production-f368.up.railway.app/events')
      .then((response) => {
        setTotalEvents(response.data.length);
        setEvents(response.data);

        // Fetch registrations per event
        const eventNames = response.data.map(event => event.eventName);
        const registrationPromises = eventNames.map(eventName =>
          axios.get(`https://jfsdbackend-production-f368.up.railway.app/students-by-event?eventName=${eventName}`).then(res => res.data.length)
        );

        // When all registration data is fetched, update the chart
        Promise.all(registrationPromises).then((registrations) => {
          const chartData = {
            labels: eventNames,
            datasets: [{
              label: 'Registrations',
              data: registrations,
              backgroundColor: '#2196F3', // Color for bars
            }],
          };
          setChartData(chartData);
          setLoading(false); // Stop loading spinner once data is fetched
        });
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  }, []);

  // Fetch registered/unregistered events per student
  useEffect(() => {
    if (studentsData.length > 0) {
      const studentPromises = studentsData.map(student => 
        axios.get(`https://jfsdbackend-production-f368.up.railway.app/registered-events?email=${student.email}`).then(res => res.data)
      );
      
      // Fetch registered events for each student
      Promise.all(studentPromises).then((eventsByStudent) => {
        let registeredCount = 0;
        let unregisteredCount = 0;

        studentsData.forEach((student, index) => {
          const studentEvents = eventsByStudent[index];
          if (studentEvents.length > 0) {
            registeredCount++;
          } else {
            unregisteredCount++;
          }
        });

        setRegisteredCounts({ registered: registeredCount, unregistered: unregisteredCount });

        // Calculate average number of registrations and unregistrations
        const averageRegistrations = totalStudents > 0 ? registeredCount / totalStudents : 0; // Avoid division by zero
        const averageUnregistrations = totalStudents > 0 ? unregisteredCount / totalStudents : 0; // Avoid division by zero
        setAverageData({
          averageRegistrations,
          averageUnregistrations,
        });
      });
    }
  }, [studentsData, totalStudents]);

  return (
    <div className="dashboard-container">
      {/* Banner */}
      <div className="banner">
        <h1 className="banner-text">Welcome to Studentiva</h1>
      </div>

      {/* Statistics Containers */}
      <div className="stats-container">
        <div className="stats-box students-box">
          <h2>Total Students</h2>
          <p>{totalStudents}</p>
        </div>
        <div className="stats-box events-box">
          <h2>Total Events</h2>
          <p>{totalEvents}</p>
        </div>
      </div>

      {/* Scrollable Container for Event Graphs */}
      <div className="chart-container">
        {loading ? (
          <div className="spinner">
            <div className="spinner-circle"></div>
          </div>
        ) : (
          <Bar data={chartData} options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Registrations per Event',
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => `Registrations: ${tooltipItem.raw}`,
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                },
              },
            },
            animation: {
              onComplete: () => {
                setTimeout(() => {
                  document.querySelectorAll('.chartjs-render-monitor canvas').forEach(canvas => {
                    canvas.style.transition = 'transform 1s ease-out';
                    canvas.style.transform = 'translateY(0)';
                  });
                }, 1000); // Delay the animation
              },
            },
          }} />
        )}
      </div>

      {/* Average Registered vs Unregistered Students */}
      <div className="average-container">
        <h2>Average Number of Registered vs Unregistered Students</h2>
        <div className="pie-chart-container">
          <Pie
            data={{
              labels: ['Registered Students', 'Unregistered Students'],
              datasets: [{
                data: [registeredCounts.registered, registeredCounts.unregistered],
                backgroundColor: ['#4caf50', '#f44336'],
              }],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }}
          />
        </div>
        <div className="average-stats">
          <p>Average Registered: {averageData.averageRegistrations.toFixed(2)}</p>
          <p>Average Unregistered: {averageData.averageUnregistrations.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewDashboard;
