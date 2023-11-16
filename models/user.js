const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'example'
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'test'
  },
  avatar: {
    type: String,
    required: true,
    default: 'image.jpg'
  },
});
module.exports = mongoose.model('user', userSchema);
