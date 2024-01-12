import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Vérifiez si l'utilisateur est déjà connecté
        const userInfo = localStorage.getItem('user-info');
        if (userInfo) {
            navigate('/'); // Redirigez vers la page d'accueil si l'utilisateur est connecté
        }
    }, [navigate]);
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:81/api/v1/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Échec de la connexion');
            }

            const data = await response.json();
            // Stockez le token et/ou les autres données de l'utilisateur comme vous le souhaitez
            localStorage.setItem('user-info', JSON.stringify(data));

            // Redirection vers une autre page après la connexion réussie
            navigate('/'); // Changez '/accueil' par le chemin de votre page d'accueil
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className='myClass'>
            <h2>Connexion</h2>
            {error && <p>Erreur : {error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email :</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Mot de passe :</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
};

export default Login;
