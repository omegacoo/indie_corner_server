const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const config = require('../src/config');
const bcrypt = require('bcryptjs');

describe('Auth endpoints', () => {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });        
        app.set('db', db);
    });
    

    after('disconnect from DB', () => db.destroy());

    beforeEach('clean the table', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'));

    afterEach('cleanup', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'));

    describe('POST /api/auth/login', () => {
        const testUser = {
            user_name: 'test_one',
            password: 'password'
        };

        const testUserEncrypted = {
            user_name: 'test_one',
            password: bcrypt.hashSync('password', config.BCRYPT_VERSION),
            email: 'test@test.com'
        };

        beforeEach('insert users', () => {
            return db
                .into('users')
                .insert(testUserEncrypted)
        })

        const requireFields = ['user_name', 'password'];

        requireFields.forEach(field => {
            const loginAttemptBody = {
                user_name: testUser.user_name,
                password: testUser.password
            };

            it(`responds with 400 error when '${field}' is missing`, () => {
                delete loginAttemptBody[field];

                return supertest(app)
                    .post('/api/auth/login')
                    .send(loginAttemptBody)
                    .expect(400, { error: { message: `Missing '${field}' in request body` }})
            })
        })
    })
})