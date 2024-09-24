import React from 'react';
import {AppBar,Toolbar,Typography,Box,Button,Menu,MenuItem,Link} from '@mui/material';
import { useNavigate } from 'react-router-dom';
const Roditelj = () => {

    const navigate = useNavigate();

    //Log out handler
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
        console.log('Logged out');
    };
    return (
        <div >
        <AppBar position="static" style={{ backgroundColor: '#3f51b5' }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Welcome, Roditelj!
                </Typography>

                <Box display="flex" alignItems="center" justifyContent="flex-end" width="30%">
                    <Button color="inherit" component={Link} to="" style={{ marginRight: '10px' }}>
                        Students
                    </Button>

                    <Button color="inherit" component={Link} to="" style={{ marginRight: '10px' }}>
                        Profile
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleLogout}
                        style={{ backgroundColor: '#f44336', color: '#fff' }}
                    >
                        Log Out
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    </div>
    );
}

export default Roditelj;