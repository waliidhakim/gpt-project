const User = require('./../models/user');
const createError = require("http-errors");
const errorHandler= require('./../utils/errorHandler');

const getUsers = async (req,res) => {

    console.log('TRYING TO FETCH USERS');
    try {
      const users = await User.find();
      res.status(200).json({
        status : "success",
        count : users.length,
        data : {
            users
        }
      });
      console.log('FETCHED USERS');
    } catch (err) {
      console.error('ERROR FETCHING USERS');
      console.error(err.message);
      res.status(500).json({ message: 'Erreur lors du chargement des utilisateurs' });
    }

}

const createOneUser = async (req, res, next) => {
    console.log("create one user endpoint");
    const {
        name,
        email,
        password,
        passwordConfirm,
        role,
    } = req.body
    try {
        const user = await User.create({
            name: name,
            email: email,
            password: password,
            passwordConfirm: passwordConfirm,
            role: role || "user",
        })

        // await user.save()
        user.password = undefined;
        res.status(201).json({
            status: 'success',
            data: {
                user: user,
            },
        })
    } catch (error) {
        console.log('Error Type : ', error.name)

        const validationErrors = errorHandler(error);
            return res.status(400).json({
                status: 'fail',
                message: {
                    errors: validationErrors,
                },
        })
    }
}

const getOneUser = async (req, res, next) => {
    const { id } = req.params

    console.log('get one user endpoint')
    try {
        const user = await User.findById(id)

        if (!user) {
            return next(createError(404))
        }

        res.status(200).json({
            status: 'success',
            data: {
                user: user,
            },
        })
    } catch (err) {
        console.error('ERROR FETCHING USER');
        console.error(err.message);
        res.status(500).json({ message: "Erreur lors du chargement de l'utilisateur" });
      }
}

const deleteOneUser = async (req,res,next) =>{
    const { id } = req.params;
    console.log('delete one user endpoint');

    try {
        const deletedUser = await User.findByIdAndDelete(id)
        console.log(deletedUser);

        if (!deletedUser) {
            return res.status(404).json({
                status: 'fail',
                message: 'Aucun utilisateur avec cet ID trouvé',
            })
        }

        res.status(200).json({
            status: 'success',
            message: 'Utilisateur supprimé avec succès',
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erreur lors de la suppression  de l'utilisateur" });
    }
}

const updateOne = async (req, res, next) => {
    const { id } = req.params

    console.log("update user endpoint");
    // const { name, email, password, passwordConfirm } = req.body
    try {

        //only update what we authorize tu update
        const extractedObject = {
            name: req.body.name
        };
        const updatedUser = await User.updateOne(
            { _id: id },
            { $set: extractedObject },
            {
                new: true,
                runValidators: true,
            }
        )

        return res.status(201).json({
            status: 'success',
            data: {
                user: updatedUser,
            },
        })
    }
    catch (error) {
        console.log('Error Type : ', error.name)
        // console.log('Error : ', error)
        const validationErrors = errorHandler(error);
            return res.status(400).json({
                status: 'fail',
                message: {
                    errors: validationErrors,
                },
        })
    }

}




module.exports = {
    getUsers,
    createOneUser,
    getOneUser,
    deleteOneUser,
    updateOne
}