const User = require('../Models/user');


const signupGet = (req, res) => {
  res.render('signup', { title: 'Create a new user' });
}

const signupPost = (req, res) => {
  res.send("New signup");
}

const loginGet = (req, res) => {
  res.render('login', {title: "Login Page"});
}

const loginPost = (req, res) => {
  res.send("New login")
}

module.exports = {
  signupGet, 
  signupPost, 
  loginGet,
  loginPost
}
