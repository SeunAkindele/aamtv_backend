const mongoose = require('mongoose');

const dotenv= require('dotenv');

// A global handler for catching all exception
process.on('uncaughtException', err => {
    console.log('Unhandled Exception! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

console.log('Environment:', process.env.NODE_ENV);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(() => console.log('DB connection successful'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`aamtv app running on port ${port}...`);
});

// A global handler for handling all promises rejection
process.on('unhandledRejection', err => {
    console.log('Unhandled Rejection! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});