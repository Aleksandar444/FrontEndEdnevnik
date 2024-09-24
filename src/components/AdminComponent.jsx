import React from 'react';
import {AppBar,Toolbar,Typography,Box,Button,Menu,MenuItem,Link} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NastavnikComponent from './NastavnikComponent' ;

const Admin = () => {
    const navigate = useNavigate();


    

    //Log out handler
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
        console.log('Logged out');
    };
    return (
        <div >
           
            {<NastavnikComponent></NastavnikComponent>}
        </div>
    );
}

export default Admin;