const User = require('../Models/user');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
  let errors = { email: "", password: "" };
  if (err.code === 11000){
    errors.email = "That email is already registered on our database";
  }
  console.log(err.message, err.code);
  console.log("Validation errors:", err.errors);  // Log the full error object to inspect it


  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      console.log(properties); // Log the properties of each error
      errors[properties.path] = properties.message; // Update the error message for each field
    });
  }

  return errors;
};

const maxAge1 = 3*24*60*60; //3 days in seconds
const createToken = (id) =>{
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn : maxAge1 });
}

const signupGet = (req, res) => {
  res.render('signup', { title: 'Create a new user' });
}

const signupPost = async (req, res) => {
  const {email, password} = req.body;

  try{
    const user = await User.create({email, password});
    const token = createToken(user._id);
    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge1 * 1000 });
    res.status(201).json({user: user._id});
  }
  catch(err){
    const errors = handleErrors(err);
    res.status(400).json({errors});
  }
}

const loginGet = (req, res) => {
  res.render('login', {title: "Login Page"});
}

const loginPost =  async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  res.send('user login');
}

module.exports = {
  signupGet, 
  signupPost, 
  loginGet,
  loginPost
}
