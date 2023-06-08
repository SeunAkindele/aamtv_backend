const fs = require('fs');
const mongoose = require('mongoose');
const dotenv= require('dotenv');
const Country = require('./models/countryModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(() => console.log('DB connection successful'));

const countries = JSON.parse(fs.readFileSync(`${__dirname}/country.json`, 'utf-8'));

const importData = async () => {
    try {
        await Country.create(countries);
        console.log('Data successfully loaded!');
        process.exit();
    } catch(err) {
        console.log(err);
    }
}

const deleteData = async () => {
    try {
        await Country.deleteMany();
        console.log('Data successfuly deleted');
        process.exit();
    } catch(err) {
        console.log(err);
    }
}

if(process.argv[2] === '--import') {
    importData();
} else if(process.argv[2] === '--delete') {
    deleteData();
}