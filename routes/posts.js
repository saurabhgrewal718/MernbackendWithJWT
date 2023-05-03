const router = require('express').Router();
const verify = require('./verifyToken');
const User = require('../model/User')


router.get('/',verify, async (req,res)=>{
    // res.json({
    //     posts:{
    //         title:"Sensitive Information",
    //         decription:"let's say this data need to be protedced"
    //     } 
    // })
    console.log(req.myuser);
    const myuserData = await User.findById(req.myuser)
    res.send("Post is written by : " + myuserData.name);
})

module.exports = router