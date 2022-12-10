const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Server Error";

  //MongoDB Invalid ID Error
  if (err.name === "CastError") {
    const message = `Resource Not Found : ${err.path}`;
    err = new ErrorHandler(message, 404);
  }
  //Mongoose Duplicate key error
  if (err.code === 11000) {
    const message = "Email already registered";
    err = new ErrorHandler(message, 400);
  }
  //Wrong JWT Token
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is Invalid,Try again!";
    err = new ErrorHandler(message, 400);
  }
  //Expire JWT Token
  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token has Expired,Try again!";
    err = new ErrorHandler(message, 400);
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
