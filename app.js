const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userRouter = require('./Routes/userRoutes');
const projectRouter = require('./Routes/projectRoutes');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const path = require('path');
const { createServer } = require('node:http');
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('projectUpdated', (data) => {
        // Broadcast to everyone *except* the one who made the update
        socket.broadcast.emit('projectUpdated', data);
    });
    socket.on('projectDeleted', (data) => {
        // Broadcast to all *except* the one who deleted
        socket.broadcast.emit('projectDeleted', data);
    });

    
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
const dbURI = process.env.DB_LINK;
const {requireAuth, checkUser, checkProject} = require('./Middleware/authMiddleware');
mongoose.connect(dbURI)
  .then(() => {
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })





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


