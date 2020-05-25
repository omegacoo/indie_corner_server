const PostsService = {
    getById(knex, id){
        return knex
            .from('posts')
            .select('*')
            .where('forum_id', id)
    },
    getForumById(knex, id){
        return knex
            .from('forums')
            .select('*')
            .where('id', id)
            .first()
    },
    addNewPost(knex, newPost){
        return knex
            .into('posts')
            .insert(newPost)
    },
    getPostById(knex, id){
        return knex
            .from('posts')
            .select('*')
            .where('id', id)
            .first()
    }
}

module.exports = PostsService;