class ApiError extends Error {
    constructor(statusCode, message, data = null, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        if(data) this.errorData = data;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
  
module.exports = ApiError;