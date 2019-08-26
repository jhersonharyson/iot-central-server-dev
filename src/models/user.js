import { Schema as _Schema, model } from "mongoose";
import { genSalt, hash as _hash, compare } from "bcrypt";

import { SALT_WORK_FACTOR } from "../security/constants";

const Schema = _Schema;
const users = new Schema({
  email: { type: String, required: true, lowercase: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  createAt: {
    type: String,
    default: Date.now()
  }
});

users.pre("save", function(next) {
  let user = this;
  if (!user.isModified("password")) return next();

  genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    _hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

users.methods.comparePassword = function(
  candidatePassword,
  password,
  callback
) {
  compare(candidatePassword, password, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

export default model("user", users);
