require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3000

mongoose.connect(process.env.CONNECT_URI, () => {
    console.log('Connected to database');
});

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute)

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});