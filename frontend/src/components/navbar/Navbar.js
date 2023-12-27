import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleDropdownChange = (event) => {
        switch (event.target.value) {
            case 'login':
                navigate('/login');
                break;
            case 'logout':
                // Ici, vous pouvez gérer la déconnexion, par exemple, effacer le token, etc.
                console.log('User logged out!');
                break;
            case 'signup':
                navigate('/signup');
                break;
            case 'update-profile':
                navigate('/update-profile');
                break;
            default:
                break;
        }
    };

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Accueil</Link>
                </li>
                <li>
                    <select onChange={handleDropdownChange}>
                        <option value="" disabled selected>Compte</option>
                        <option value="login">Se connecter</option>
                        <option value="logout">Se déconnecter</option>
                        <option value="signup">S'inscrire</option>
                        <option value="update-profile">Mettre à jour le profil</option>
                    </select>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;