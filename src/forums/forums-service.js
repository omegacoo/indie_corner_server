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
    }
}

module.exports = ForumsService;