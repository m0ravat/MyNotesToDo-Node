const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const projectSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please enter a title"],
    unique: true,
    minlength: [6, "Minimum length is 6 characters"],
    maxlength: [30, "Maximum length is 30"],
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, "Please enter a description"],
    maxlength: [100, "Maximum length is 100 characters"],
  },
  cards: [{ type: mongoose.Types.ObjectId, ref: 'Card' }]

});

projectSchema.post('save', function(doc, next){
  console.log("Project was saved to db, ", doc);
  next();
})


const Project = mongoose.model('Project', projectSchema);
module.exports = Project;