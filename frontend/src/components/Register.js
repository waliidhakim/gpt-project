import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'

const Inscription = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Vérifiez si l'utilisateur est déjà connecté
        const userInfo = localStorage.getItem('user-info');
        if (userInfo) {
            navigate('/'); // Redirigez vers la page d'accueil si l'utilisateur est connecté
        }
    }, [navigate]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess(false);

        if (password !== passwordConfirm) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            const response = await fetch('http://localhost:81/api/v1/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, passwordConfirm })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue lors de l\'inscription.');
            }

            setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        } catch (error) {
            // Assurez-vous de stocker une chaîne de caractères, pas un objet
            setError(error.message || 'Une erreur est survenue.');
        }
    };

    return (
        <div className='myClass'>
        <form className='myClass' onSubmit={handleSubmit}>
        <h2>Inscription</h2>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nom" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" />
            <input type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} placeholder="Confirmer le mot de passe" />
            <button type="submit">S'inscrire</button>
            {error && <p>{error}</p>}
            {success && <p>Inscription réussie !</p>}
        </form>
        </div>
    );
};

export default Inscription;
