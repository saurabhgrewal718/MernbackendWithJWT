const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

//connecting to db
mongoose.connect(process.env.DB)
.then( ()=>
   console.log("Connected to mongo Successful")
)

//importing the routes 
const authRoute = require('./routes/auth');

//middleware
app.use(express.json());

app.use('/api/user',authRoute);


app.listen(3000,()=> console.log('Server up and running'))