const router = require('express').Router();
const User = require('../model/User')
const {registerValidation,loginValidation} = require('../validation')
const bcrypt = require('bcryptjs');
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


//change password
router.put('/users/:id/password', async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
  
    try {
      // Retrieve user from database
      const user = await User.findById(id);
  
      // Verify old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid old password' });
      }
  
      // Generate new hashed password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update user's password in the database
      user.password = hashedPassword;
      await user.save();
  
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;