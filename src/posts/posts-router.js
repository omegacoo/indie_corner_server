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
    .route('/:forumId')
    .all((req, res, next) => {
        PostsService.getForumById(
            req.app.get('db'),
            req.params.forumId
        )
            .then(forum => {
                if(!forum){
                    return res.status(404).json({
                        error: { message: `Forum doesn't exist` }
                    })
                }
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        PostsService.getById(
            req.app.get('db'),
            req.params.forumId
        )
            .then(posts => {
                if(!posts){
                    return res.status(404).json({
                        error: { message: `Forum doesn't exist` }
                    })
                }
                res.json(posts.map(serializePost))
            })
            .catch(next)
    })

module.exports = postsRouter;