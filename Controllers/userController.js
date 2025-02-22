const User = require('../Models/user');
const handleErrors = (err) => {
  let errors = { email: "", password: "" };
  if (err.code ==11000){
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


const signupGet = (req, res) => {
  res.render('signup', { title: 'Create a new user' });
}

const signupPost = async (req, res) => {
  const {email, password} = req.body;

  try{
    const user = await User.create({email, password});
    res.status(201).json(user);
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
  res.send("New login")
}

module.exports = {
  signupGet, 
  signupPost, 
  loginGet,
  loginPost
}
