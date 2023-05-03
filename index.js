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
const postRoute = require('./routes/posts');
const userRoute = require('./routes/user');


//middleware
app.use(express.json());

app.use('/api/account',authRoute);
app.use('/api/posts',postRoute);
app.use('/api/users',userRoute);

app.get('/', async (req, res) => {
    res.send('Welcome to my app')
});



app.listen(3000,()=> console.log('Server up and running'))