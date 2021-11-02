const express = require('express');

require('./config/mongoose');
require("dotenv").config();

const app = express();
const PORT = 7002;

const users = require('./server/modules/users/usercontroller');
const tips = require('./server/modules/tips/tipcontroller');


// Middlewares
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to Tips Mangement');
});

// Routes
app.use('/users', users);
app.use('/tip', tips);



app.listen(PORT, () => {
    console.log(`Server started on PORT:${PORT} ...`);
});
