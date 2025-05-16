const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const path = require('path');
const { createServer } = require('node:http');
const { Server } = require("socket.io");
const mongoose = require('mongoose');

const userRouter = require('./Routes/userRoutes');
const projectRouter = require('./Routes/projectRoutes');
const cookiesRouter = require('./config/cookies');
const setupSockets = require('./config/socket');
const { requireAuth, checkUser } = require('./Middleware/authMiddleware');

const app = express();
const server = createServer(app);
const io = new Server(server);

setupSockets(io);
app.set('io', io);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

const dbURI = process.env.DB_LINK;
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

// Use cookie routes
app.use(cookiesRouter);

// Routes with auth and middleware
app.get('/*', checkUser);
app.get('/', (req, res) => {
  res.render("index", { title: "Home Page" });
});

app.use(userRouter);
app.use('/project', requireAuth, projectRouter);

// 404 fallback
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});



