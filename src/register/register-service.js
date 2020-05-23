const RegisterService = {
    registerNewUser(knex, newUser){
        return knex
            .into('users')
            .insert(newUser)
    },
    checkIfUsernameOrEmailUsedAlready(knex, newUser){
        return knex
            .select('user_name', 'email')
            .from('users')
            .where('user_name', newUser.user_name)
            .orWhere('email', newUser.email)
    }
}

module.exports = RegisterService;