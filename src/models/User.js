const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', function (next) {
  console.log('starting pre');
  const user = this;
  console.log(JSON.stringify(user));
  if (!user.isModified('password')) {
    console.log('Not Modified');
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.log('Error generatingn salt');
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        console.log('Error Salting password');
        return next(err);
      }
      console.log(hash);
      // console.log('sdkhjfaks');
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line consistent-return
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      if (!isMatch) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return reject(false);
      }
      resolve(true);
    });
  });
};

mongoose.model('User', userSchema);
