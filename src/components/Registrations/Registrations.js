import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

export default function RegistrationsTable() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data
    axios
      .get('https://jfsdbackend-production-f368.up.railway.app/all-registrations')
      .then((response) => {
        const sortedData = response.data.map((reg) => ({
          id: reg.id,
          studentName: `${reg.student.firstname} ${reg.student.lastname}`,
          studentEmail: reg.student.email,
          eventName: reg.event.eventName,
          category: reg.event.category,
          date: reg.event.date,
          time: reg.event.time,
          clubName: reg.event.club?.clubName || 'N/A',
          registrationDate: new Date(reg.registrationDate).toLocaleString(),
        }));
        setRows(sortedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching registrations:', error);
        setLoading(false);
      });
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    axios
      .delete(`https://jfsdbackend-production-f368.up.railway.app/unregister?email=${rows.find(row => row.id === id).studentEmail}&eventname=${rows.find(row => row.id === id).eventName}`)
      .then(() => {
        setRows(rows.filter((row) => row.id !== id));
        alert('Registration removed successfully!');
      })
      .catch((error) => {
        console.error('Error deleting registration:', error);
      });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'studentName', headerName: 'Student Name', width: 180, editable: true },
    { field: 'studentEmail', headerName: 'Student Email', width: 220 },
    { field: 'eventName', headerName: 'Event Name', width: 200, editable: true },
    { field: 'category', headerName: 'Category', width: 150, editable: true },
    { field: 'date', headerName: 'Event Date', width: 150, editable: true },
    { field: 'time', headerName: 'Event Time', width: 150, editable: true },
    { field: 'clubName', headerName: 'Club Name', width: 150 },
    { field: 'registrationDate', headerName: 'Registration Date', width: 200 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
          />,
        ];
      },
    },
  ];

  return (
    <div>
     <Box sx={{ display: 'flex', flexDirection: 'column' }}>
  <Typography variant="h4" sx={{ marginBottom: 2, marginTop: 10, marginLeft:5,color: 'darkblue' }}>
    Latest Registrations
  </Typography>
</Box>

    <Box sx={{ height: 600, width: '80%', overflowX: 'auto' }}>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
        />
      )}
    </Box>
    </div>
  );
}
