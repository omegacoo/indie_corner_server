const BlogsService = {
    getAllBlogs(knex){
        return knex
            .select('*')
            .from('blogs')
    }
};

module.exports = BlogsService;