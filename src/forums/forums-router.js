const express = require('express');
const ForumsService = require('./forums-service');
const xss = require('xss');
const jwt = require('jsonwebtoken');

const forumRouter = express.Router();
const jsonParser = express.json();

const serializeForum = forum => ({
    id: forum.id,
    title: xss(forum.title),
    blurb: xss(forum.blurb)
});

forumRouter
    .route('/')
    .get((req, res, next) => {
        ForumsService.getAllForums(
            req.app.get('db')
        )
            .then(forums => {
                res.json(forums.map(serializeForum))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { title, blurb } = req.body;
        const newForum = { title, blurb };
        const token = req.get('cookies');

        if(!token){
            return res.status(401).end();
        }

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET)
        } catch(e) {
            if(e instanceof jwt.JsonWebTokenError){
                return res.status(401).end();
            }
            return res.status(400).end();
        }

        if(!newForum.title){
            return res.status(400).json({
                error: {
                    message: `Missing 'title' from request body`
                }
            })
        }

        if(!newForum.blurb){
            return res.status(400).json({
                error: {
                    message: `Missing 'blurb' from request body`
                }
            })
        }

        ForumsService.addNewForum(
            req.app.get('db'),
            newForum
        )
            .then(() => {
                res
                    .status(201)
                    .end()
            })
            .catch(next)
    })

module.exports = forumRouter;