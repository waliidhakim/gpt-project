import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactDOM } from 'react';
import { ToastContainer } from 'react-toastify';


import Navbar from './components/navbar/Navbar';
import Accueil from './components/Accueil';
import Login from './components/Login';
import Register from './components/Register';
import Recipe from './components/Recipe';
import MonProfil from './components/Profile';
import RechercheIntelligente from './components/Research';

function App() {

  return (
 
  
        <div>
           <Router>
           <Navbar />
            <Routes>
              <Route path="/" element={<Accueil />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            <Route path="/recipe" element={<Recipe />} />
            <Route path="/profil" element={<MonProfil />} />
            <Route path="/search" element={<RechercheIntelligente />} />
            </Routes>
          </Router>
        </div>
  
  );
}

export default App;
