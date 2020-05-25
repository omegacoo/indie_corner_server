const express = require('express');
const PostsService = require('./posts-service');
const xss = require('xss');
const jwt = require('jsonwebtoken');

const postsRouter = express.Router();
const jsonParser = express.json();

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
    .post(jsonParser, (req, res, next) => {
        const { user_id, forum_id, time_submitted, content } = req.body;
        const newPost = { user_id, forum_id, time_submitted, content };
        const token = req.get('cookies');
        let ok = true;

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

        const requiredFields = [
            'user_id', 
            'forum_id', 
            'time_submitted', 
            'content'
        ];

        requiredFields.forEach(field => {
            if(!newPost[field] && ok){
                ok = false;

                return res.status(400).json({
                    error: {
                        message: `Missing '${field}' from request body`
                    }
                })
            }
        })

        if(ok){
            PostsService.addNewPost(
                req.app.get('db'),
                newPost
            )
                .then(() => {
                    res
                        .status(201)
                        .end()
                })
                .catch(next)
        }
    })

postsRouter
    .route('/remove_post/:post_id')
    .delete((req, res, next) => {        
        const post_id = req.params.post_id;
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

        if(!post_id){
            return res.status(400).json({
                error: {
                    message: `Missing 'post_id' in request body`
                }
            })
        }

        PostsService.getPostById(
            req.app.get('db'),
            req.params.post_id
        )
            .then(post => {
                if(!post){
                    return res.status(404).json({
                        error: { message: `Post doesn't exist` }
                    })
                }
                next()
            })
            .catch(next)
    })

module.exports = postsRouter;