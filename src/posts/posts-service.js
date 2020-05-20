const PostsService = {
    getAllPosts(knex){
        return knex
            .select('*')
            .from('posts')
            // here is where you add something like '.orderBy()' to filter returns
    }
}

module.exports = PostsService;