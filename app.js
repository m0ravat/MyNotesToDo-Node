const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userRouter = require('./Routes/userRoutes');
// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://m0ravat:Langdon1%4012@mynotestodo.heq52.mongodb.net/MyNotesToDo?retryWrites=true&w=majority";

mongoose.connect(dbURI)
  .then(result => app.listen(3000, () => console.log('Server is running on port 3000')))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');
app.use(express.json());
// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// routes
app.get('/', (req, res) => {
  res.render("index", {title: "Home Page"});
});

app.use(userRouter);
// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});


