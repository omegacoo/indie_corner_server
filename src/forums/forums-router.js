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

forumRouter
    .route('/remove_forum/:forum_id')
    .delete((req, res, next) => {
        const forum_id = req.params.forum_id;
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

        if(!forum_id){
            return res.status(400).json({
                error: {
                    message: `Missing 'forum_id' in request body`
                }
            })
        }

        ForumsService.getForumById(
            req.app.get('db'),
            forum_id
        )
            .then(forum => {
                if(!forum){
                    return res.status(404).json({
                        error: {
                            message: `Forum doesn't exist`
                        }
                    })
                } else {
                    ForumsService.removeForumById(
                        req.app.get('db'),
                        forum_id
                    )
                        .then(response => {
                            ForumsService.removePostsOfForum(
                                req.app.get('db'),
                                forum_id
                            )
                                .then(response => {
                                    res.status(200).end()
                                })
                        })
                }
                next()
            })
            .catch(next)
    })

module.exports = forumRouter;