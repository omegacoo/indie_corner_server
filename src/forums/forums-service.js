const ForumsService = {
    getAllForums(knex){
        return knex
            .select('*')
            .from('forums')
            // here is where you add something like '.orderBy()' to filter returns
    }
}

module.exports = ForumsService;