const mongoose = require('mongoose');
const {isInteger, isBoolean} = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const cardSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please enter a title"],
    unique: true,
    minlength: [6, "Minimum length is 6 characters"],
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, "Please enter a description"],
  },
  priority: {
    required: [true, "Please assign a priority value"],
    type: Number,
    min: [1, "Priority must be at least 1"],
    max: [3, "Priority must be at most 3"],
    validate: [isInteger, "Please enter a valid integer"]
  },
  done: {
    required: true,
    type: Boolean,
    validate: [isBoolean, "Boolean value wasn't correctly assigned"]
  }
});

projectSchema.post('save', function(doc, next){
  console.log("Card was saved to db, ", doc);
  next();
})


const Project = mongoose.model('Card', cardSchema);
module.exports = Card;