const AppError = require("../utils/appError");

const handleDuplicateFieldsDB = err => {
    let value = err.keyValue.title || 'Value'
    const message = `${value} already exist, please use another value`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    if(err.errors.title.properties.message){
        const message = `Invalid input data: ${err.errors.title.properties.message}`;
        return new AppError(message, 400);
    }
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    if(err.isOperational) {
        // checking if error is operational before sending error message to the client

        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        // logging the error for developer to see
        console.error('ERROR 🔺', err);

        // programming or third party or unknown error message customized for client
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }
    
}

// 4 parameters will make express see the middleware function as an error middleware

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if(process.env.NODE_ENV === 'production') {
        let error = err;

        if(error.code === 11000) error = handleDuplicateFieldsDB(error);
        if(error.name === 'ValidationError') error = handleValidationErrorDB(error);
        
        sendErrorProd(error, res);
    }
};