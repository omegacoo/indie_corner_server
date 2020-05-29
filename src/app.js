require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');

const forumsRouter = require('./forums/forums-router');
const postsRouter = require('./posts/posts-router');
const authRouter = require('./auth/auth-router');
const registerRouter = require('./register/register-router');

const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

const corsOptions = {
    // origin: ['http://localhost:3000', 'https://indie-corner-client.now.sh'],
    exposedHeaders: ['X-token', 'user_id']
};

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors(corsOptions));

app.use('/api/forums', forumsRouter);
app.use('/api/posts', postsRouter);
app.use('/api/auth', authRouter);
app.use('/api/register', registerRouter);

app.use('/', (req, res) => {
    res.send('Nothing found.');
})

app.use(function errorHandler(error, req, res, next){
    let response;
    if(NODE_ENV === 'production'){
        response = { error: { message: 'server error' } };
    } else {
        console.error(error);
        response = { message: error.message, error }
    };
    res.status(500).json(response);
});

module.exports = app;