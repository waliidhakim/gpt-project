import React, { useState,useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';


const Navbar = () => {
    const navigate = useNavigate();

    // const handleDropdownChange = (event) => {
    //     switch (event.target.value) {
    //         case 'login':
    //             navigate('/login');
    //             break;
    //         case 'logout':
    //             // Ici, vous pouvez gérer la déconnexion, par exemple, effacer le token, etc.
    //             console.log('User logged out!');
    //             break;
    //         case 'signup':
    //             navigate('/signup');
    //             break;
    //         case 'update-profile':
    //             navigate('/update-profile');
    //             break;
    //         default:
    //             break;
    //     }
    // };
    const handleLogout = async () => {
      try {
          // Remplacez avec l'URL de votre API de déconnexion
          const response = await fetch('http://localhost:81/api/v1/users/logout', {
              method: 'GET', // ou 'GET', selon votre API
              headers: {
                  'Content-Type': 'application/json',
              },
              // body: JSON.stringify(data), // si nécessaire
          });

          if (!response.ok) {
              throw new Error('Problème lors de la déconnexion');
          }

          // Traitez la réponse ici, par exemple en supprimant le token du local storage
          localStorage.removeItem('user-info'); // ou toute autre clé utilisée pour stocker les infos de l'utilisateur

          // Redirection vers la page de connexion ou mise à jour de l'état de l'application
          navigate('/login'); // Utilisez le chemin approprié pour votre page de connexion
      } catch (error) {
          console.error('Erreur lors de la déconnexion:', error);
      }
  };


    return (
        <nav style={{ display: 'flex', justifyContent: 'flex-start', width:'100%', background:'black', color:'white',}}>
        <div style={{width:'50%'}}>
        <ul style={{ listStyleType: 'none', display: 'flex', gap: '20px', textAlign:'left', }}>
        <li><a href="/" style={{ textDecoration: 'none', color:'white' }}> CuisineConnect</a></li>
          <li><a href="/recipe" style={{ textDecoration: 'none', color:'white' }}>Recette</a></li>
          <li><a href="/search" style={{ textDecoration: 'none', color:'white' }}>Recherche recette</a></li>
        </ul>
        </div>
        <div style={{width:'50%'}}>
        <ul style={{ listStyleType: 'none', display: 'flex', justifyContent:'flex-end', gap: '20px', paddingRight:'5%'}}>
        <li><a href="/profil" style={{ textDecoration: 'none', color:'white' }}>Mon Profil</a></li>
               <li><a onClick={handleLogout} style={{ textDecoration: 'none', color:'white' }}>Déconnexion</a></li>
            <li><a href="/login" style={{ textDecoration: 'none', color:'white' }}>Connexion</a></li>
          <li><a href="/register" style={{ textDecoration: 'none' , color:'white'}}>Inscription</a></li>
        </ul>
        </div>
      </nav>
    );
}

export default Navbar;