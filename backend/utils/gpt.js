const { all } = require('../routes/goalsRoutes');
const Conversation = require('./../models/conversation');
const Recipe = require('./../models/recipe');
const {OpenAI} = require("openai");

const openai = new OpenAI({
    apiKey : process.env.OPEN_AI_SECRET_KEY
  });



const searchRecipe =  async (req, res) => {
    try{
        console.log("search recipe endpoint");
        const searchTerm = req.body.userSearchTerm;
        // const ingredientTerms = req.query.ingredients ? req.query.ingredients.split(',').map(ing => ing.trim().toLowerCase()) : [];
        const allRecipeTitles = await Recipe.find({}).select({"title" :1, "_id" : 0});

        const formatedRecipeTitles = allRecipeTitles.map(item => item.title).join(',')

    

    

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'system',
                content: `Tu es un chef cuisinier étoilé au guide Michelin, tu as 15 ans d'expérience dans le métier 
                            et tu as remporté plusieurs concours culinaires internationales. Tu es aussi expert 
                            pour proposer des plats qui répondent exactement aux exigences des clients.`

            }, {
                role: 'user',
                content: `En te basant sur cette liste de plats : ${formatedRecipeTitles} 
                            quel plat correspondrait le plus à cette recherche : ${searchTerm}. Si il y'a plusieurs 
                            plats qui correspodent à cette recherche cite en 2 ou 3 maximum.`
            }],
            max_tokens: 1000,
            temperature: 0,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

        return res.status(200).json(
            {   
                message : "success",
                content : response.choices[0].message.content
                
            })
    }
    catch(error)
    {
        console.log("error search : ", error);
        res.status(500).json(
            {   
                message : "Erreur lors de la récupération du résultat de la recherche",

            })
    }
    ;
};


const findComplexity = async(req,res)=>{
    try{
        const {prompt} = req.body;
        const response = await openai.chat.completions.create({
            model : 'gpt-3.5-turbo',
            messages: [{role : 'system', content : prompt}],
            max_tokens : 64,
            temperature : 0,
            top_p : 1.0,
            frequency_penalty : 0.0,
            presence_penalty : 0.0,
            stop : ["\n"]
                    
        });
        return res.status(200).json({
            message : 'success',
            data : response
        });
    }catch(error)
    {   console.log(error);
        return res.status(400).json({
            success : false,
            error : error.response ? error.response.data : "Issue with the server"
        })
    }

}



const chatBot = async (req, res) => {
    try {
        const { prompt } = req.body;
        const sessionId = req.token; 

        console.log("req.token :", req.token);
        let conversation = await Conversation.findOne({ sessionId: sessionId });
        console.log(conversation);

        if (!conversation) {
            const systemMessage = {
                role : "system",
                content : `Tu es un chef cuisinier étoilé au guide Michelin, tu as 15 ans d'expérience dans le métier 
                            et tu as remporté plusieurs concours culinaires internationales. Tu dois discuter avec des
                            utilisateurs d'un site de recettes de cuisine plus au moins connaisseurs dans le domaine.
                            A cet instant précis la conversation vient de commencer avec l'utilisateur donc tu 
                            n'as aucun souvenir d'avoir discuté avec lui, donc ne vas pas inventer des choses qui ne se sont
                            pas passé.`
            }
            // Si la session n'existe pas, créez-en une nouvelle
            conversation = new Conversation({ sessionId: sessionId, messages: [systemMessage] });
        }
        
        
        // Préparez les messages pour l'API, y compris les messages historiques
        const messages = conversation.messages.map(({ role, content }) => ({ role, content })).concat([
            {
                role: "user",
                content: prompt
            }
        ]);
        
        console.log(messages);
        
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.5,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        
        
        
        // console.log("massages :", response );
      
        conversation.messages.push({
            role: "assistant",
            content: response.choices[0].message.content
        });
        await conversation.save();

        return res.status(200).json({
            message: 'success',
            data: conversation.messages
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "fail",
            error: error.message
        });
    }
};


const getAccompaniments = async (req, res) => {
    try {
        
        console.log("get Accompaniments endpoint");

        console.log("the recipe in the res : ", res.recipe);

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'system',
                content: `Tu es un chef cuisinier étoilé au guide Michelin, tu as 15 ans d'expérience dans le métier 
                            et tu as remporté plusieurs concours culinaires internationales. Tu es aussi expert 
                            pour ce qui est de proposer des accompagnements pour des plats ou des recettes. 
                            ces accompagnement peuvent être du vin, des desserts ou des fromages. Tu sais aussi très bien
                            expliquer pourquoi les accompagnements que tu proposes sont pertinents.`

            }, {
                role: 'user',
                content: `Quel accompagnement tu me conseilles pour ce plats : ${res.recipe} `
            }],
            max_tokens: 1000,
            temperature: 0,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

    
        const lastMessage = response.choices[0].message.content;

        return res.status(200).json({
            message: 'success',
            suggestions: lastMessage
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error: error.response ? error.response.data : "Problème avec le serveur"
        });
    }
};


const getShoppingList = async (req, res) => {
    try {
        
        console.log("get shopping list");

        console.log("the recipe in the res : ", res.recipe);

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'system',
                content: `Tu es un chef cuisinier étoilé au guide Michelin, tu as 15 ans d'expérience dans le métier 
                            et tu as remporté plusieurs concours culinaires internationales. Tu es aussi expert 
                            pour ce qui est de proposer des listes de courses détaillées pour toutes sortes de plats et des recettes. 
                            Tu sais aussi recommender des ingrédients plus ou moins chers afin de s'adapter au budget de chacun.`

            }, {
                role: 'user',
                content: `Quelles sont les courses dont j'aurais besoi pour réliser cette recette : ${res.recipe.title} `
            }],
            max_tokens: 1000,
            temperature: 0,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

    
        const lastMessage = response.choices[0].message.content;

        return res.status(200).json({
            message: 'success',
            suggestions: lastMessage
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error: error.response ? error.response.data : "Problème avec le serveur"
        });
    }
};


module.exports = {
    findComplexity,
    chatBot,
    getAccompaniments,
    getShoppingList,
    searchRecipe
}