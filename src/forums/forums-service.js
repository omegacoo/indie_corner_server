const ForumsService = {
    getAllForums(knex){
        return knex
            .select('*')
            .from('forums')
            // here is where you add something like '.orderBy()' to filter returns
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
            .from('posts')
            .select('*')
            .where('forum_id', id)
            .del()
    }
}

module.exports = ForumsService;