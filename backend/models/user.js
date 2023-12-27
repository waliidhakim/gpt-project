const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


let Schema = mongoose.Schema;

let userSchema = new Schema({
    name : {
        type : String,
        required : [true, "Veuillez saisir un nom"]
    },
    email : {
        type : String,
        required : [true, 'Veuillez saisir une adresse mail'],
        unique : [true, "Il existe déjà un utilisateur avec cette adresse email"],
        lowercase : true,
        validate : {
            validator : validator.isEmail,
            message : "Veulliez saisir une adresse mail correcte"
        }
    },
    password : {
        type : String,
        required : [true, 'Veuillez saisir un mot de passe'],
        minlength : [6, 'Le mot de passe doit contenir au minimum 6 caractères'],
        select : false
    },
    passwordConfirm : {
        type : String,
        required : [true, 'Veuillez confirmer votre mot de passe'],
        validate : {
            validator : function(el) {
                return el === this.password;
            },
            message : "Les deux mots de passe sont différents"
        },
        select : false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    passwordChangedAt : {
        type : Date,
    },
});


userSchema.pre('save', async function (next) {
    //only runs if the password is modified
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined; // we actually don't need to store this field, we only use it to verify if the passwords are the same
    next();
})

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

module.exports = mongoose.model('User', userSchema );