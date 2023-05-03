const router = require('express').Router();
const User = require('../model/User')
const {registerValidation,loginValidation} = require('../validation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

router.post('/signup', async (req,res)=>{
    const result = registerValidation(req.body);
    //validate before we make a user
    if(result.error) return res.status(400).send(result.error.details[0].message);


    //check if email exist
    const emailExist = await User.findOne({email:req.body.email}) 
    if(emailExist) return res.status(400).send('Email already exists');

    //hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.password,salt)

    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPass,
    })
    try {
        const saveUser = await user.save();
        res.send({user:user._id});
    } catch (error) {
        res.status(400).send(err);
    }
})


//login
router.post('/signin', async (req,res)=>{
    const result = loginValidation(req.body);
    //validate before we make a user
    if(result.error) return res.status(400).send(result.error.details[0].message);


    //check if email exist
    const myuser = await User.findOne({email:req.body.email}) 
    if(!myuser) return res.status(400).send('Email dont Exist');

    //unhash the password
    const validPass = await bcrypt.compare(req.body.password,myuser.password)
    if(!validPass) return res.status(400).send('Incorrect password');

    const token = jwt.sign({_id:myuser._id},process.env.TOKEN_SECRET)

    res.header('token',token).send(token);
})

module.exports = router;