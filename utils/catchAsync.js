module.exports = fn => {
    // express gives all anonymous or arrow function the req, res, and next parameters
    return (req, res, next) => {
        // the catch method that is available on all promises will automatically pass the err parameter into the next as an argument, which in turn will jump to the error middleware on app.js
        fn(req, res, next).catch(next);
    };
};