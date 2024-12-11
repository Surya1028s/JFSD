import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import './students.css';
import AddIcon from '@mui/icons-material/Add';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import VisibilityIcon from '@mui/icons-material/Visibility'; //
import {  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './registrationOverlay.css';

const  Students =()=> {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [theme, setTheme] = useState('light'); // Default theme
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const [newoverlayOpen, setnewOverlayOpen] = useState(false);
  const [selectedStudentEmail, setSelectedStudentEmail] = useState(null);
  const [registeredEventsOverlayOpen, setRegisteredEventsOverlayOpen] = useState(false); // Controls the overlay visibility

  const [newStudent, setNewStudent] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    image: null,
  });
  const newhandleOverlayClose = () => {
    setnewOverlayOpen(false);
    setStudentDetails(null);
  };


  const handleAddStudentClick = () => {
    setOverlayOpen(true);
  };

  const handleOverlayClose = () => {
    setOverlayOpen(false);
    setNewStudent({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      image: null,
    });
  };
  const handleViewClick = (id) => () => {
    axios
      .get(`https://jfsdbackend-production-f368.up.railway.app/profile`,{
        params: { email: id },
      })
      .then((response) => {
        setStudentDetails(response.data);
        setnewOverlayOpen(true);
      })
      .catch((error) => {
        console.error('Error fetching student profile:', error);
      });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };
  const handleSaveStudent = () => {
    const { firstname, lastname, email, password } = newStudent;

    if (!firstname || !lastname || !email || !password) {
      toast.error('Please fill in all required fields.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('email', email); // Used as the unique id
    formData.append('password', password);
    if (newStudent.image) {
      formData.append('image', newStudent.image);
    }

    axios
      .post('https://jfsdbackend-production-f368.up.railway.app/add', formData)
      .then((response) => {
        const newRow = { 
          id: response.data.email, // Ensure the id is unique and set to email
          ...response.data,
        };
        setRows((prevRows) => [...prevRows, newRow]);
        handleOverlayClose();
        toast.success('Student added successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        console.error('Error adding student:', error);
        toast.error('Error adding student.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };
  useEffect(() => {
    axios.get('https://jfsdbackend-production-f368.up.railway.app/viewall')
      .then(response => {
        setRows(response.data.map(student => ({
          id: student.email, // Use email as the unique id
          firstname: student.firstname,
          lastname: student.lastname,
          email: student.email,
          role: student.role,
          image: student.image || null,
        })));
      })
      .catch(error => console.error('Error fetching students:', error));
  }, []);
  

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: 'edit' } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: 'view' } });
    const student = rows.find((row) => row.id === id);
    
    axios
      .put('https://jfsdbackend-production-f368.up.railway.app/update', student)
      .then((response) => {
        console.log('Student updated:', response);
  
        // Update the rows state with the updated student
        setRows(prevRows =>
          prevRows.map((row) =>
            row.id === id ? { ...row, ...student } : row
          )
        );
      })
      .catch((error) => console.error('Error updating student:', error));
  };
  

  const handleDeleteClick = (id) => () => {
    axios
      .delete(`https://jfsdbackend-production-f368.up.railway.app/delete?email=${id}`)
      .then(() => {
        setRows(rows.filter((row) => row.id !== id));
      })
      .catch((error) => console.error('Error deleting student:', error));
  };
  const [registeredEvents, setRegisteredEvents] = useState([]);
const [eventsOverlayOpen, setEventsOverlayOpen] = useState(false);
const handleRegisteredEventsClick = (row) => {
  setSelectedStudentEmail(row.email); // Capture email of the selected student
  axios
    .get('https://jfsdbackend-production-f368.up.railway.app/registered-events', {
      params: { email: row.email },
    })
    .then((response) => {
      setRegisteredEvents(response.data);
      setRegisteredEventsOverlayOpen(true);
    })
    .catch((error) => {
      console.error('Error fetching registered events:', error);
      toast.error('Failed to fetch registered events.');
    });
};



const closeEventsOverlay = () => {
  setEventsOverlayOpen(false);
};


  const handleImageChange = (id, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedRows = rows.map((row) =>
        row.id === id ? { ...row, image: reader.result.split(',')[1] } : row
      );
      setRows(updatedRows);
    };
    reader.readAsDataURL(file);
  };

  const AddhandleImageChange = (e) => {
    const file = e.target.files[0];
    setNewStudent((prev) => ({ ...prev, image: file }));
  };

  const handleRemoveRegistration = (email, eventName) => {
    axios
      .delete('https://jfsdbackend-production-f368.up.railway.app/unregister', {
        params: { email, eventname: eventName },
      })
      .then(() => {
        setRegisteredEvents((prev) =>
          prev.filter((event) => event.eventName !== eventName)
        );
        toast.success('Registration removed successfully!');
      })
      .catch((error) => {
        console.error('Error removing registration:', error);
        toast.error('Failed to remove registration. Please try again.');
      });
  };
  

  const columns = [
    {
      field: 'image',
      headerName: 'Profile',
      width: 100,
      renderCell: (params) => (
        <div className="avatar-cell">
          <Avatar
            src={params.row.image ? `data:image/jpeg;base64,${params.row.image}` : null}
            alt={params.row.firstname}
          >
            {!params.row.image && params.row.firstname?.[0]?.toUpperCase()}
          </Avatar>
        </div>
      ),
      editable: true,
      renderEditCell: (params) => (
        <div className="avatar-cell">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(params.id, e.target.files[0])}
          />
        </div>
      ),

    },
    { field: 'firstname', headerName: 'First Name', width: 150, editable: true },
    { field: 'lastname', headerName: 'Last Name', width: 150, editable: true },
    { field: 'email', headerName: 'Email', width: 200, editable: false },
    { field: 'role', headerName: 'Role', width: 100, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 200,
      getActions: ({ id }) => {
        const isEditing = rowModesModel[id]?.mode === 'edit';
        return [
          isEditing ? (
            <IconButton color="primary" onClick={handleSaveClick(id)}>
              <SaveIcon />
            </IconButton>
          ) : (
            <IconButton color="secondary" onClick={handleEditClick(id)}>
              <EditIcon />
            </IconButton>
          ),
          <IconButton color="error" onClick={handleDeleteClick(id)}>
            <DeleteIcon />
          </IconButton>,
          <IconButton  onClick={handleViewClick(id)}>
          <VisibilityIcon />
        </IconButton>,
        ];
      },
    },
    {
      field: 'registeredEvents',
      headerName: 'Registered Events',
      width: 150,
      renderCell: (params) => (
        <IconButton onClick={() => handleRegisteredEventsClick(params.row)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];
  const RegistrationOverlay = ({ open, onClose, events, onRemove, email }) => {
  
    return (
      <div className="registration-overlay">
      <div className={`registration-overlay-content ${theme === 'dark' ? 'dark-theme' : ''}`}>
        <IconButton className="close-icon" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <h2>Registered Events</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Event Name</TableCell>
                <TableCell>Club Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.length > 0 ? (
                events.map((event) => (
                  <TableRow key={event.eventName}>
                    <TableCell>{event.eventName}</TableCell>
                    <TableCell>{event.club?.clubName}</TableCell>
                    <TableCell>{event.category}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>{event.time}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => onRemove(email, event.eventName)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No events registered yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
    
    );
  };
  
  
  return (
    <Box className={`students-page ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
       <ToastContainer />
       {registeredEventsOverlayOpen && (
  <RegistrationOverlay
    events={registeredEvents}
    onClose={() => setRegisteredEventsOverlayOpen(false)}
    onRemove={handleRemoveRegistration}
    email={selectedStudentEmail} // Pass the email to the overlay
  />
)}


      <h1 className="students-heading">Students List</h1>
      <div className="students-stats">
        <div className="students-stat-box">
          <p>Total Students</p>
          <h3>{rows.length}</h3>
        </div>
        <button className="add-student-button" onClick={handleAddStudentClick}>
          <AddIcon /> Add Student
        </button>
      </div>
      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} rowModesModel={rowModesModel} />
      </Box>
      {overlayOpen && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Add New Student</h2>
            <div className="form-row">
              <label>First Name</label>
              <input
                type="text"
                name="firstname"
                value={newStudent.firstname}
                onChange={handleInputChange}
              />
              <label>Last Name</label>
              <input
                type="text"
                name="lastname"
                value={newStudent.lastname}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={newStudent.email}
                onChange={handleInputChange}
              />
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={newStudent.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row">
              <label>Image</label>
              <input type="file" accept="image/*" onChange={AddhandleImageChange} />
            </div>
            <div className="form-actions">
              <button onClick={handleSaveStudent}>Save</button>
              <button onClick={handleOverlayClose}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {newoverlayOpen && studentDetails && (
        <div className="profile-overlay">
          <div className="profile-overlay-content">
            <div className="close-icon" onClick={newhandleOverlayClose}>X</div>
            <div className="profile-image-student">
              <Avatar
                src={studentDetails.image ? `data:image/jpeg;base64,${studentDetails.image}` : null}
                alt={studentDetails.firstname}
                sx={{ width: 150, height: 150 }}
              />
            </div>
            <div className="profile-details">
              <div className="profile-row">
                <span>First Name:</span>
                <span>{studentDetails.firstname}</span>
              </div>
              <div className="profile-row">
                <span>Last Name:</span>
                <span>{studentDetails.lastname}</span>
              </div>
              <div className="profile-row">
                <span>Email:</span>
                <span>{studentDetails.email}</span>
              </div>
              <div className="profile-row">
                <span>Role:</span>
                <span>{studentDetails.role}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
}

export default Students;
