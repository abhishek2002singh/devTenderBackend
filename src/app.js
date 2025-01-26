const express = require('express');

const app = express();
const dbConnect = require('./config/database');
const cookieParser = require('cookie-parser')

const dotenv = require('dotenv');

const port = process.env.PORT || 7777
const path = require('path')

const _dirname = path.resolve();

const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:5173', 
    credentials:true,            //access-control-allow-credentials:true
  
}
app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())


//routes
const authRouth = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');


app.use('/' ,authRouth)
app.use('/' ,profileRouter)
app.use('/' ,requestRouter)
app.use('/',userRouter)





dbConnect().then(() => {
    console.log('Connection successful');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
}).catch(err => {
    console.error('Database connection failed:', err);
});


//yadavajjet05(user)  cHuG5KUCLr0ynu2G(password)


 