const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userRouter = require('./Routes/userRoutes');
const projectRouter = require('./Routes/projectRoutes');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const path = require('path');


const app = express();


const dbURI = process.env.DB_LINK;
const {requireAuth, checkUser, checkProject} = require('./Middleware/authMiddleware');
mongoose.connect(dbURI)
  .then(result => {
    const port = process.env.PORT || 3000;  // Use environment variable or fallback to 3000 for local development
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  })
  .catch(err => console.log(err));


  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'Views'));
  
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
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
app.get('/*', checkUser);
app.get('/', (req, res) => {
  res.render("index", {title: "Home Page"});
});


app.use(userRouter);
app.use('/project', requireAuth, projectRouter);
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});


