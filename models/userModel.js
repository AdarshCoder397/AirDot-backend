const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your Name"],
    maxLength: [25, "Name cannot be more than 25 characters"],
    minLength: [4, "Name should have more than 5 Characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter your Password"],
    minLength: [5, "Password should be more than 5 Characters"],
    maxLength: [30, "Password cannot exceed 30 Characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
//Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  result = await bcrypt.compare(enteredPassword, this.password)
  if(result){
    return await bcrypt.compare(enteredPassword, this.password);
  }else{
    return false
  }
};

//JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
};

// Generating reset password token
userSchema.methods.getResetPasswordToken = function () {
  //Token Gen
  const resetToken = crypto.randomBytes(20).toString("hex");
  // const tokenCrypto = crypto.createHash('sha256').update(token).digest("hex")
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    this.resetPasswordExpire = Date.now() + 15*60*1000
    return resetToken
};

module.exports = mongoose.model("User", userSchema);
