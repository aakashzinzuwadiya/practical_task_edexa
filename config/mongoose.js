const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const DB_NAME = 'tip_manager';
const DB_URL = `mongodb://localhost:27017/${DB_NAME}?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false`;

mongoose.connect(DB_URL, { useNewUrlParser: true })
.then(() => {
    console.log('Database connected...', DB_URL);    
})
.catch(error => {
    console.error('Connection error...', error);
});

