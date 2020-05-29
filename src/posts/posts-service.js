const PostsService = {
    getById(knex, id){
        return knex
            .select(['posts.*', 'users.user_name'])
            .from('posts')
            .leftJoin('users', 'users.id', 'posts.user_id')
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
    },
    removePostById(knex, id){
        return knex
            .from('posts')
            .select('*')
            .where('id', id)
            .del()
    }
}

module.exports = PostsService;