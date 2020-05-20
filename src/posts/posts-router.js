const express = require('express');
const PostsService = require('./posts-service');
const xss = require('xss');

const postsRouter = express.Router();

const serializePost = post => ({
    id: post.id,
    user_id: post.user_id,
    forum_id: post.forum_id,
    time_submitted: post.time_submitted,
    content: xss(post.content)
});

postsRouter
    .route('/')
    .get((req, res, next) => {
        PostsService.getAllPosts(
            req.app.get('db')
        )
            .then(posts => {
                res.json(posts.map(serializePost))
            })
            .catch(next)
    })

module.exports = postsRouter;