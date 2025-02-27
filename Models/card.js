const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const cardSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please enter a title"],
    minlength: [6, "Minimum length is 6 characters"],
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
    validate: [Number.isInteger, "Please enter a valid integer"]
  },
  done: {
    required: true,
    type: Boolean,
  },
  parentProject: { type: mongoose.Types.ObjectId, ref: 'Project', required: true }
  
});

cardSchema.post('save', function(doc, next){
  console.log("Card was saved to db, ", doc);
  next();
})


const Card = mongoose.model('Card', cardSchema);
module.exports = Card;