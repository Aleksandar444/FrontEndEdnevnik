
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/LoginComponent";
import NastavnikComponent from './components/NastavnikComponent';
import AdminComponent from './components/AdminComponent';
import RoditeljComponent from "./components/RoditeljComponent";
import UcenikComponent from "./components/UcenikComponent";



function App() {
  
 

  return (
    <Router>
        <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/nastavnik" element={<NastavnikComponent />} >
                  <Route path=":teacherId" element={<NastavnikComponent />} /> 
                  <Route path="predmet/:predmetID" element={<NastavnikComponent />} />
                  <Route path="ucenik/:ucenikID" element={<NastavnikComponent />} />
                </Route>
                <Route path="/admin" element={<AdminComponent />} />
                <Route path="/roditelj" element={<RoditeljComponent />} />
                <Route path="/ucenik" element={<UcenikComponent />} />
            </Routes>
        </Router>
  );
}

export default App;
