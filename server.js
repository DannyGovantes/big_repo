const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './.env' });

const database = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('CONNECTED TO DATABASE');
}).catch((error) => {
    console.log('ERROR WITH DATA BASE',error);
});

const server = app.listen(process.env.PORT, () => {
    console.log('CONNECTED TO SERVER');
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
});