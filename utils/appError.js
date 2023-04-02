class AppError extends Error {
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        // this will help us to use the AppError class to send only operational error message to client and not programming or an unknown error
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;