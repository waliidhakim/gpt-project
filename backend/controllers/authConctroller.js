
const User = require('./../models/user');
const errorHandler = require('./../utils/errorHandler');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const {promisify} = require('util');


const Email = require("./../utils/email");

const signToken = user => {
    return jwt.sign({id : user._id, role:user.role}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN
    })
};

const createSendToken = (user,statusCode,res) =>{
    const token = signToken(user);

    res.status(statusCode).json({
        status : 'success',
        token,
        data : {
            user
        }
    })
}


const signup = async(req,res,next)=>{

    console.log("signup endpoint accessed");
    try{

        if((await User.findOne({ email: req.body.email })) ) 
            {
                // return next(createError(409,`l'utilisateur existe déjà`));
                return res.status(409).json({
                    status: 'fail',
                    message: {
                        error: "Un utilisateur avec cette adresse email existe déjà",
                    },
                })
            }

        // console.log("signup endpoint accessed");
        const newUser = await User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            passwordConfirm : req.body.passwordConfirm
        });
      
        
        const url = 'httpp://www.google.com';
        await new Email(newUser, url).sendWelcome();
        
        newUser.password=undefined;
        createSendToken(newUser,201,res);

        
    }
    catch(error){
        console.log("Error Type : ", error.name);
        console.log("Error : ", error);
        const validationErrors = errorHandler(error);
            return res.status(400).json({
                status: 'fail',
                message: {
                    errors: validationErrors,
                },
        })
    }
    
};


const login = async(req,res,next)=>{

    try {
        console.log("login endpoint");
        const {email,password} = req.body;

        
    
        //1 check if email and password exist
        if(!email || !password){
            return res.status(400).json({
                status: 'fail',
                message: {
                    error: "Veillez saisir une adresse email et un mot de passe",
                },
            })
        }

        //2 check if user exists and password is correct
        const user = await User.findOne({email : email }).select('+password');
        // console.log(await user.correctPassword("dd","dd"));
        // console.log("type of user : ",typeof user);

        //await user.correctPassword(password,user.password);

        if(!user){
            //401 is unauthorized
             return res.status(401).json({
                status: 'fail',
                message: {
                    error: "Adresse email inconnue. Veuillez créer un compte",
                },
            })
        }

        

        const isPasswordCorrect = await user.correctPassword(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: 'fail',
                message: {
                    error: "Mot de passe incorrecte",
                },
            })
        }
        user.password = undefined;
        createSendToken(user,200,res);
    }
    catch(error)
    {
        console.log("Error Type : ", error.name);
        console.log("Error : ", error);
        const validationErrors = errorHandler(error);
            return res.status(400).json({
                status: 'fail',
                message: {
                    errors: validationErrors,
                },
        })
    }
    
};


//a tester 
const logout = (req, res) => {
    // Clear the JWT token from the cookie
    console.log("logout function !");
    res.clearCookie('jwt');
    res.status(200).json({ status: 'success' });
  };



const protect = async (req,res,next) =>{
    try {
        console.log("protect middleware");
        let token;
        //1 getting the token a check if it exists (chheck in the headers)
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        //console.log("the token is :", token);
        if(!token){
            // return next(createError( 401 ,'You are not logged in ! please log in to get access'));

            return res.status(401).json({
                status: 'fail',
                message: {
                    error: "Vous n'êtes plus connecté ! Veuillez vous connecter pour accéder à cette page",
                },
            })
        }

        // 2 thee verification step 
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
        // console.log("decoded is :",decoded);


        //3check if user still exists (dans le cas ou le token est valide mais que le user n'existe plus)
        const currentUser = await User.findById(decoded.id);
        //console.log("the freshUser : ", currentUser )
        if(!currentUser){
            // return next(createError(401, 'The user belonging to the token no longer exists'));

            return res.status(401).json({
                status: 'fail',
                message: {
                    error: "L'utilisateur possédant ce token n'existe plus.",
                },
            })
        }


        //gtant access to the protected route (on le stoque dans la http response important !! )
        req.user = currentUser;
        req.token = token;
        next();
    } catch (error) {
        return next(createError(500,`something went wrong : ${error}`));
    }
    
};

const restrictTo = (...roles) =>{

    console.log("restrictTo middleware");
    return (req,res,next) =>{

        //console.log("restrict middleware", `roles : ${roles}`, `current user is : ${req.user}`);


        if(!roles.includes(req.user.role)){
            
            //return next(createError(403, 'You do not have permission to perform this action !!'));

            return res.status(403).json({
                status: 'fail',
                message: {
                    error: "Vous ne disposez pas de droits suffisants pour effectuer cette action",
                },
            })
        }
        next();
    }
}


module.exports = {
    signup,
    login,
    logout,
    protect,
    restrictTo
}