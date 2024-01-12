import React, { useState, useEffect } from 'react';

const MonProfil = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userInfoJSON = localStorage.getItem('user-info');
        if (userInfoJSON) {
            const userInfo = JSON.parse(userInfoJSON);
            if (userInfo.data && userInfo.data.user) {
                setUser(userInfo.data.user);
            } else {
                setError("Informations utilisateur non disponibles dans la structure attendue");
            }
        } else {
            setError("Informations utilisateur non disponibles");
        }
        setIsLoading(false);
    }, []);
console.log(userInfo)
console.log(userData)
    if (isLoading) {
        return <p>Chargement des données utilisateur...</p>;
    }

    if (error) {
        return <p>Erreur : {error}</p>;
    }

    return (
        <div>
        {user ? (
            <div>
                <h2>Mon Profil</h2>
                <p>Role : {user.role}</p>
                <p>Nom : {user.name}</p>
                <p>Email : {user.email}</p>
                {/* Autres informations de l'utilisateur */}
            </div>
        ) : (
            <p>Aucune information utilisateur à afficher.</p>
        )}
    </div>
    );
};

export default MonProfil;
