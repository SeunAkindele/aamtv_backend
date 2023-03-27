const dotenv= require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

/*
    api for detecting country

    fetch('https://api.ipregistry.co/?key=tryout')
    .then(function (response) {
        return response.json();
    })
    .then(function (payload) {
        console.log(payload.location.country.name + ', ' + payload.location.city);
    });

*/