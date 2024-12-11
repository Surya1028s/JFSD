  import * as React from 'react';
  import PropTypes from 'prop-types';
  import { useNavigate } from 'react-router-dom';
  import Box from '@mui/material/Box';
  import Typography from '@mui/material/Typography';
  import { createTheme } from '@mui/material/styles';
  import DashboardIcon from '@mui/icons-material/Dashboard';
  import GroupIcon from '@mui/icons-material/Group';
  import EventIcon from '@mui/icons-material/Event';
  import GroupsIcon from '@mui/icons-material/Groups';
  import AssignmentIcon from '@mui/icons-material/Assignment';
  import { AppProvider } from '@toolpad/core/AppProvider';
  import { DashboardLayout } from '@toolpad/core/DashboardLayout';
  import { useDemoRouter } from '@toolpad/core/internal';
  import Events from '../Events/Events';
  import Students from '../StudentTable/Students';
  import Clubs from '../Clubs/Clubs';
 import Registrations from '../Registrations/Registrations';
import ViewDashboard from './ViewDashboard';

  const NAVIGATION = [
    {
      segment: 'dashboard',
      title: 'Dashboard',
      icon: <DashboardIcon />,
    },
    {
      segment: 'students',
      title: 'Students',
      icon: <GroupIcon />,
    },
    {
      segment: 'events',
      title: 'Events',
      icon: <EventIcon />,
    },
    {
      segment: 'clubs',
      title: 'Clubs',
      icon: <GroupsIcon />,
    },
    {
      segment: 'registrations',
      title: 'Registrations',
      icon: <AssignmentIcon />,
    },
  ];

  const demoTheme = createTheme({
    cssVariables: {
      colorSchemeSelector: 'data-toolpad-color-scheme',
    },  
    colorSchemes: { light: true, dark: true },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 600,
        lg: 1200,
        xl: 1536,
      },
    },
  });

  function DemoPageContent({ pathname }) {
    if (pathname === '/events') {
      return <Events />
    } 
    if (pathname === '/students') {
      return <Students />
    }
    if (pathname === '/clubs') {
      return <Clubs />;
    } 
    if(pathname==='/registrations'){
      return <Registrations />;
    }
    if(pathname==='/dashboard'){
      return <ViewDashboard/>
    }
    return (
      <Box
        sx={{
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography>Dashboard content for {pathname}</Typography>
      </Box>
    );
  }

  DemoPageContent.propTypes = {
    pathname: PropTypes.string.isRequired,
  };

  function Dashboard(props) {
    const { window } = props;
    const navigate = useNavigate();

    // Check user role in localStorage
    React.useEffect(() => {
      const role = localStorage.getItem('role');
      if (role !== '1') {
        navigate('/login'); // Redirect to login if role is not 1
      }
    }, [navigate]);

    // Fetch user details from localStorage
    const [session, setSession] = React.useState({
      user: {
        name: localStorage.getItem('name'), // Default name, replace if available in localStorage
        email: localStorage.getItem('email'),
        image: localStorage.getItem('profileimage')
        ? `data:image/jpeg;base64,${localStorage.getItem('profileimage')}`
        : 'https://avatars.githubusercontent.com/u/19550456',
      },
    });

    // Handle authentication and logout
    const authentication = React.useMemo(() => ({
      signIn: () => {
        setSession({
          user: {
            name: localStorage.getItem('name'),
            email: localStorage.getItem('email') || 'bharatkashyap@outlook.com',
            image: localStorage.getItem('profileimage')
            ? `data:image/jpeg;base64,${localStorage.getItem('profileimage')}`
            : 'https://avatars.githubusercontent.com/u/19550456',
          },
        });
      },
      signOut: () => {
        localStorage.clear();
        navigate('/login'); // Redirect to login after sign out
      },
    }), [navigate]);

    const router = useDemoRouter('/dashboard');
    const demoWindow = window !== undefined ? window() : undefined;

    return (
      <AppProvider
        session={session}
        authentication={authentication}
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        window={demoWindow}
      >
        <DashboardLayout>
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
      </AppProvider>
    );
  }

  Dashboard.propTypes = {
    window: PropTypes.func,
  };

  export default Dashboard;
