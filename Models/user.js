const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum length is 6 characters"]
  },
  username : {
    type: String,
    required: [true, "Please enter a username"],
    unique: true,
    lowercase: true
  },
  projects: [{ type: mongoose.Types.ObjectId, ref: 'Project' }]

});

userSchema.post('save', function(doc, next){
  console.log("User was saved to db, ", doc);
  next();
})

userSchema.pre('save', async function(next){
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  next();
})

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({email});
  if (user){
    const auth = await bcrypt.compare(password, user.password);
    if (auth){
      return user
    }
    throw Error('Incorrect password');
  }
  throw Error('Incorrect email')
}

const User = mongoose.model('User', userSchema);
module.exports = User;