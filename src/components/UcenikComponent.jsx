import React, {useState,useEffect} from 'react';
import {AppBar,Toolbar,Box,Link,Typography,Button} from "@mui/material";
import { useNavigate } from 'react-router-dom';


const Ucenik = () => {
    const navigate = useNavigate();


    //Log out handler
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
        console.log('Logged out');
    };

    return (
        <div>
           <AppBar position="static" style={{ backgroundColor: '#3f51b5' }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Welcome, Ucenik!
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

export default Ucenik;