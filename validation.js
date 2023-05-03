const Joi = require('joi');


//register validation 
const registerValidation = data => {
    const schema = Joi.object({
        name : Joi.string().min(6).required(),
        email : Joi.string().required().email(),
        password : Joi.string().min(6).required()
    })
    return schema.validate(data);

}

//loginValidation  
const loginValidation = data => {
    const schema = Joi.object({
        email : Joi.string().required().email(),
        password : Joi.string().min(6).required()
    })
    return schema.validate(data);

}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
