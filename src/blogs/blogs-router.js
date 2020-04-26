const express = require('express');
const BlogsService = require('./blogs.service');

const blogsRouter = express.Router();

blogsRouter
    .route('/')
    .get((req, res, next) => {
        BlogsService.getAllBlogs(
            req.app.get('db')
        )
            .then(blogs => {
                res.json(blogs);
            })
            .catch(next)
    })

module.exports = blogsRouter;