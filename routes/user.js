const router = require('express').Router();
const verify = require('./verifyToken');
const User = require('../model/User')
const crypto = require('crypto');

const generateSecretKey = () => {
    return crypto.randomBytes(64).toString('hex');
  };
  
const secretKey = generateSecretKey();


router.get('/getallusers',verify, async (req,res)=>{
    console.log(req.myuser);
    const allusers = await User.find();
    if(!allusers) return res.status(400).send("Users not found")
    res.send(allusers);
})


router.get('/curentUser',verify, async (req,res)=>{
    const myuserData = await User.findById(req.myuser)
    if(!myuserData) return res.status(400).send("Cannot find the User")
    res.send(myuserData);
})

router.put('/curentUser/:id',verify, async (req,res)=>{
    const myuserData = await User.findById(req.myuser)
    if(!myuserData) return res.status(400).send("Cannot find the User")
    res.send(myuserData);
})

// router.put('/update/:id', async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { name, email } = req.body;
  
//       // Find the user by ID and update the fields
//       const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true });
  
//       res.status(200).json(updatedUser);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });

router.put('/update/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).send('User not found');
  
      // Update user details with the new data
      user.name = req.body.name;
      user.email = req.body.email;
  
      // Encrypt the user data before saving it to the database
      const cipher = crypto.createCipher('aes-256-cbc', secretKey);
      let encryptedUser = cipher.update(JSON.stringify(user), 'utf8', 'hex');
      encryptedUser += cipher.final('hex');
  
      // Save the encrypted user data to the database
      await user.save();
  
      res.status(200).send({ message: 'User details updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });


  router.get('/getUser/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).send('User not found');
  
      // Decrypt the user data before sending it to the client
      const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
      let decryptedUser = decipher.update(JSON.stringify(user), 'hex', 'utf8');
      decryptedUser += decipher.final('utf8');
  
      res.status(200).send(JSON.parse(decryptedUser));
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
  

module.exports = router