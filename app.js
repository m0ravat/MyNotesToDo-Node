const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userRouter = require('./Routes/userRoutes');
const projectRouter = require('./Routes/projectRoutes');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const dbURI = "mongodb+srv://m0ravat:Langdon1%4012@mynotestodo.heq52.mongodb.net/MyNotesToDo?retryWrites=true&w=majority";
const {requireAuth, checkUser} = require('./Middleware/authMiddleware');
mongoose.connect(dbURI)
  .then(result => app.listen(3000, () => console.log('Server is running on port 3000')))
  .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.use(express.json());

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get("/set-cookies", (req,res) =>{
  //JS Simple way of setting cookies
  //res.setHeader("Set-Cookie", "newUser=true");
  res.cookie("newUser", false); //lasts for whole session until browser link closed/changes by default
  res.cookie("isEmployee1", true, {maxAge: 10000}); //number is how long cookie will last in milliseconds
  res.cookie("isEmployee2", false, {maxAge: 10000, secure: true}); //only comes on secure page like https
  res.cookie("isEmployee3", false, {maxAge: 10000, httpOnly: true}); //only comes on http - cant access through console document.cookie


  
  res.send("you got the cookies");
})

app.get("/read-cookies", (req,res) =>{
  const cookies = req.cookies;
  console.log(cookies.newUser); //will get httpOnly cookies but not secure
  res.json(cookies); 
})

// routes
app.get('*', checkUser);
app.get('/', (req, res) => {
  res.render("index", {title: "Home Page"});
});

app.use(userRouter);
app.use('/project', requireAuth, projectRouter);
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});


