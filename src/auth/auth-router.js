const express = require('express');
const AuthService = require('./auth-service');
const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authRouter = express.Router();
const jsonParser = express.json();

authRouter
    .post('/login', jsonParser, (req, res, next) => {
        const { user_name, password } = req.body;
        const loginUser = { user_name, password };

        for(const [key, value] of Object.entries(loginUser)){
            if(value == null){
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                });
            }
        }

        AuthService.getUserWithUserName(
            req.app.get('db'),
            loginUser.user_name
        )
            .then(dbUser => {
                if(!dbUser || !bcrypt.compareSync(loginUser.password, dbUser.password)){
                    return res.status(401).json({
                        error: {
                            message: `Incorrect user_name or password`
                        }
                    })
                };
                const user_name = dbUser.user_name;

                const token = jwt.sign({ user_name }, process.env.JWT_SECRET, {
                    algorithm: 'HS256',
                    expiresIn: config.JWT_EXPIRY_SECONDS
                });
                
                res.set('X-token', token);
                res.set('user_id', dbUser.id);
                res.send();
            })
            .catch(next)
    })

module.exports = authRouter;