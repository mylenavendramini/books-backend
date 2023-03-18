const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let bcrypt = require('bcrypt');

const UserSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 20,
    unique: [true, 'This login already exists!'],
  },
  email: {
    type: String,
    validate: {
      validator: function (email) {
        return new RegExp(
          '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$'
        ).test(email);
      },
    },
    unique: [true, 'This email already exists!'],
  },
  password: {
    type: String,
    // select to false to don't show password when we get users. when we need the password, we need to use the select() method to change the select to true (e.g login in user.controller)
    select: false,
  },
  permissions: {
    type: String,
    enum: ['USER', 'ADMIN'],
  },
  books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
});

UserSchema.methods.generatePassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

UserSchema.pre('save', async function () {
  this.password = await this.generatePassword(this.password);
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
