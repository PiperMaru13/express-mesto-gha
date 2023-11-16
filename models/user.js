const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: ''
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: ''
  },
  avatar: {
    type: String,
    required: true,
    default: ''
  },
});
module.exports = mongoose.model('user', userSchema);
