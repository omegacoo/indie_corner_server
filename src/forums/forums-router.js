const express = require('express');
const ForumsService = require('./forums-service');
const xss = require('xss');

const forumRouter = express.Router();

const serializeForums = forum => ({
    id: forum.id,
    title: xss(forum.title),
    blurb: xss(forum.blurb)
});

forumRouter
    .route('/forums')
    .get((req, res, next) => {
        ForumsService.getAllForums(
            req.app.get('db')
        )
            .then(forums => {
                res.json(forums.map(serializeForums))
            })
            .catch(next)
    })

module.exports = forumRouter;