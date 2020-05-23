const express = require('express');
const bcrypt = require('bcryptjs');
const config = require('../config');

const RegisterService = require('./register-service');

const registerRouter = express.Router();
const jsonParser = express.json();

registerRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        let { user_name, password, email } = req.body;
        let plainTextPassword = password;
        password ? password = bcrypt.hashSync(password, config.BCRYPT_VERSION) : password = null;
        const newUser = { user_name, password, email };

        const requiredFields = ['user_name', 'password', 'email'];

        // Make sure each field was sent
        if(!newUser[requiredFields[0]] || !newUser[requiredFields[1]] || !newUser[requiredFields[2]]){
            res.status(400).json({ 
                error: { 
                    message: `Missing a required field` 
                } 
            })
            return;
        }

        // Make sure 'user_name' is at least 3 characters long
        if(newUser.user_name.length < 3){
            res.status(400).json({
                error: {
                    message: `'user_name' must be at least 3 characters`
                }
            })
            return;
        }

        // Make sure 'password' is at least 8 characters long
        if(plainTextPassword.length < 8){
            res.status(400).json({
                error: {
                    message: `'password' must be at least 8 characters`
                }
            })
            return;
        }

        // Makse sure the 'email' is formatted correctly
        if(!isValidEmail(newUser.email)){
            res.status(400).json({
                error: {
                    message: `'email' must be formatted correctly`
                }
            })
            return;
        }

        RegisterService.checkIfUsernameOrEmailUsedAlready(
            req.app.get('db'),
            newUser
        )
            .then(response => {
                if(response.length > 0){
                    res.status(400).json({
                        error: {
                            message: `Username or email is already in use`
                        }
                    })
                    return;
                }
                RegisterService.registerNewUser(
                    req.app.get('db'),
                    newUser
                )
                    .then(regRes => {
                        res.status(200).json({
                            message: `User successfully created!`
                        })
                    })
            })
            .catch(next)
    })

module.exports = registerRouter;

// It is entirely possible, maybe even likely, that this regex will return false negatives
// We always need to keep up with the most current version of this to mitigate that problem
function isValidEmail(email){
	return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/.test(email);
};