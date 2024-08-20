//all objects of appError will inherit from the built in error class
class appError extends Error {
  constructor(message, statusCode) {
    //super() calls the parent class's cosntructor
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    //the following line ensures that this class and its constructor doesnt get included in the error stack
    Error.captureStackTrace(this, this.constuctor);
  }
}

module.exports = appError;
