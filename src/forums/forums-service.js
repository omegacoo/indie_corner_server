const ForumsService = {
    getAllForums(knex){
        return knex
            .select('*')
            .from('forums')
    },
    addNewForum(knex, newForum){
        return knex
            .into('forums')
            .insert(newForum)
    },
    getForumById(knex, id){
        return knex
            .from('forums')
            .select('*')
            .where('id', id)
            .first()
    },
    removeForumById(knex, id){
        return knex
            .from('forums')
            .select('*')
            .where('id', id)
            .del()
    },
    removePostsOfForum(knex, id){
        return knex
            .from('posts')
            .select('*')
            .where('forum_id', id)
            .del()
    }
}

module.exports = ForumsService;