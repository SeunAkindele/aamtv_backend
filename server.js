const mongoose = require('mongoose');

const dotenv= require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(() => console.log('DB connection successful'));

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`aamtv app running on port ${port}...`);
});

/*
 
    5198 9940 4513 9214
    11/27
    759

 */