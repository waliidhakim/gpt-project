import React, { useState } from 'react';
import './style.css'

const RechercheIntelligente = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [responseContent, setResponseContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const userInfoJSON = localStorage.getItem('user-info');
    if (!userInfoJSON) {
        setError("Aucun utilisateur connecté.");
        setIsLoading(false);
        return;
    }
    const userInfo = JSON.parse(userInfoJSON);
    const token = userInfo.token; // Assurez-vous que le token est stocké sous cette clé dans l'objet


        if (!token) {
            setError("Aucun token trouvé.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:81/api/v1/gpt/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    // Ajoutez d'autres en-têtes si nécessaire
                },
                body: JSON.stringify({ userSearchTerm: searchTerm })
            });

            if (!response.ok) {
                throw new Error('La requête a échoué');
            }

            const data = await response.json();
            setResponseContent(data.content);
        } catch (err) {
            setError(err.message);
        }

        setIsLoading(false);
    };

    return (
        <div className='myClass'>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    placeholder="Propose moi la recette d'un plat à base de..."
                />
                <button type="submit">Rechercher</button>
            </form>

            {isLoading && <p>Chargement...</p>}
            {error && <p>Erreur: {error}</p>}
            {responseContent && <div><p>Réponse: {responseContent}</p></div>}
        </div>
    );
};

export default RechercheIntelligente;
