import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'

const Recipe = () => {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newRecipe, setNewRecipe] = useState({
        title: '',
        description: '',
        image: '',
        ingredients: [],
        steps: [],
        rating: 0
    });

    // Fonction pour charger les recettes
    const fetchRecipes = async () => {
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
            const response = await fetch('http://localhost:81/api/v1/recipes', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Quelque chose a mal tourné!');
            }

            const data = await response.json();
            if (data.recipes && Array.isArray(data.recipes)) {
                setRecipes(data.recipes);
            } else {
                throw new Error("Les données de recettes ne sont pas sous forme de tableau");
            }
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
    };

    // Utiliser useEffect pour charger les recettes au démarrage du composant
    useEffect(() => {
        fetchRecipes();
    }, []);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRecipe({ ...newRecipe, [name]: value });
    };
    const handleIngredientChange = (index, value) => {
        const updatedIngredients = [...newRecipe.ingredients];
        updatedIngredients[index] = value;
        setNewRecipe({ ...newRecipe, ingredients: updatedIngredients });
    };

    const handleStepChange = (index, value) => {
        const updatedSteps = [...newRecipe.steps];
        updatedSteps[index] = value;
        setNewRecipe({ ...newRecipe, steps: updatedSteps });
    };

    const addIngredientField = () => {
        setNewRecipe({ ...newRecipe, ingredients: [...newRecipe.ingredients, ''] });
    };

    const addStepField = () => {
        setNewRecipe({ ...newRecipe, steps: [...newRecipe.steps, ''] });
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const userInfoJSON = localStorage.getItem('user-info');
            if (!userInfoJSON) {
                throw new Error("Aucun utilisateur connecté.");
            }
            const userInfo = JSON.parse(userInfoJSON);
            const token = userInfo.token;
            
            const response = await fetch('http://localhost:81/api/v1/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newRecipe)
            });

            const addedRecipe = await response.json();
            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout de la recette');
            }

            if (addedRecipe && typeof addedRecipe === 'object') {
                // Assurez-vous que la structure de addedRecipe est celle d'une recette unique
                setRecipes(currentRecipes => [...currentRecipes, addedRecipe]);
            } else {
                throw new Error("Format de réponse inattendu");
            }
        } catch (error) {
            setError(error.message);
        }

        setIsLoading(false);
    };

    console.log("Recipes:", recipes);
    console.log("Ingredients:", newRecipe.ingredients);
    console.log("Steps:", newRecipe.steps);
    
    // Affichage des recettes ou des messages d'erreur/chargement
    return (
        <div className='myClass'>
            {/* Formulaire d'ajout de recette */}
            <form className='myForm' onSubmit={handleFormSubmit}>
                <input type="text" name="title" placeholder="Nom du plat" value={newRecipe.title} onChange={handleInputChange} />
                <input type="text" name="description" placeholder="Description" value={newRecipe.description} onChange={handleInputChange} />
                <input type="url" name="image" placeholder="URL de l'image" value={newRecipe.image} onChange={handleInputChange} />
                {/* Ajouter des champs pour les ingrédients, les étapes, et la note si nécessaire */}
                <div className='myContent'>
                    <h3>Ingrédients</h3>
                    {newRecipe.ingredients.map((ingredient, index) => (
                        <input
                            key={index}
                            type="text"
                            value={ingredient}
                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                            placeholder={`Ingrédient ${index + 1}`}
                        />
                    ))}
                    <button type="button" onClick={addIngredientField}>Ajouter un ingrédient</button>
                </div>

                {/* Champs dynamiques pour les étapes */}
                <div className='myContent'>
                    <h3 >Étapes</h3>
                    {newRecipe.steps.map((step, index) => (
                        <input
                            key={index}
                            type="text"
                            value={step}
                            onChange={(e) => handleStepChange(index, e.target.value)}
                            placeholder={`Étape ${index + 1}`}
                        />
                    ))}
                    <button type="button" onClick={addStepField}>Ajouter une étape</button>
                </div>
                <div className='myConfirm'>
                <button className='myButton' type="submit">Ajouter la recette</button>
                </div>
            </form>
        {isLoading && <p>Chargement...</p>}
        {error && <p>Erreur: {error}</p>}
        <ul>
            {recipes.map(recipe => (
                <div className='myContent' key={recipe._id}>
                    <h2>{recipe.title}</h2>
                    <p>{recipe.description}</p>
                    <img src={recipe.image} alt={recipe.title} />
                    <h3>Ingrédients</h3>
                    <ul>
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                    <h3>Étapes</h3>
                    <ol>
                        {recipe.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                    <p>Note : {recipe.rating}</p>
                    {/* Autres informations de la recette */}
                </div>
            ))}
        </ul>
    </div>
);
};


export default Recipe;
