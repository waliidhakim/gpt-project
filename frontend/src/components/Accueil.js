import React from "react";
import { useEffect,useContext } from "react";
import { UserContext } from './Login';
import './style.css';

const Accueil = () =>{
    
    
    useEffect(() => {
        const userInfo = localStorage.getItem('user-info');
        console.log(userInfo);
      }, []);
    return (
        <><div className="myClass">
            <h1>Bienvenue à CuisineConnect</h1>
        </div>
        <div className="myClass">
                <h2>Découvrez nos applications innovantes pour la cuisine et la gastronomie</h2>
                <p>
                    "CuisineConnect" est une startup spécialisée dans le développement d'applications web innovantes
                    liées à la cuisine et à la gastronomie. Nous combinons des technologies de pointe en
                    intelligence artificielle pour vous offrir une expérience culinaire unique.
                </p>
                <p>
                    Notre application phare permet une recherche intelligente de recettes de cuisine et
                    propose des recommandations personnalisées en fonction de vos goûts et besoins. Explorez
                    des fonctionnalités avancées et améliorez votre expérience culinaire avec l'intelligence artificielle.
                </p>
            </div >
            <div className="myClass"> 
                <p>© 2024 CuisineConnect. Tous droits réservés.</p>
            </div></>

    )
}


export default Accueil;
