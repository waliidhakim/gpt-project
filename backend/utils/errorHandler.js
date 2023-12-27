

const errorHandler = (error) =>{

    let validationErrors = {}

    switch (error.name)
    {
        case 'ValidationError' :
            for (const field in error.errors) {
                console.log(field, typeof field);
                const errorMessage = error.errors[field].message
                validationErrors[field] = errorMessage
            }
            break;
        
        case 'CastError' :
            validationErrors["user_id"] = "Id non conforme (caractères manquants)";
            break;
        
        default :
            validationErrors["Unknown"] = "Erreur Inconnue. Veuillez réessayer";
        
    }   



    if (error.code === 11000)
    {   

        validationErrors["email"] = 'Cette adresse email est déjà utilisée';
    }
    
    
    
    return validationErrors;
};



module.exports = errorHandler;