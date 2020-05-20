const express = require('express');
const ForumsService = require('./forums-service');
const xss = require('xss');

const forumRouter = express.Router();

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

module.exports = forumRouter;