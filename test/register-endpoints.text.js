const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const config = require('../src/config');
const bcrypt = require('bcryptjs');

describe('Register endpoints', () => {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db)
    })

    after('disconnect from DB', () => db.destroy())

    beforeEach('clean the user table', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'))

    afterEach('clean the user table', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'))

    describe('POST /api/register', () => {
        const testUser = {
            user_name: 'test_one',
            password: 'password',
            email: 'test@email.com'
        };

        const requiredFields = ['user_name', 'password', 'email'];

        requiredFields.forEach(field => {
            const registerAttemptBody = {
                user_name: testUser.user_name,
                password: testUser.password,
                email: testUser.email
            };

            it(`responds with 400 error when '${field}' is missing`, () => {
                delete registerAttemptBody[field];

                return supertest(app)
                    .post('/api/register')
                    .send(registerAttemptBody)
                    .expect(400, { error: { message: `Missing a required field` } })
            })
        })

        it(`responds with 400 error when 'user_name' is not at least 3 characters`, () => {
            const testUser = {
                user_name: 'ab',
                password: 'password',
                email: 'email@email.com'
            };

            return supertest(app)
                .post('/api/register')
                .send(testUser)
                .expect(400, { error: { message: `'user_name' must be at least 3 characters` } })
        })

        it(`responds with 400 error when 'password' is not at least 8 characters`, () => {
            const testUser = {
                user_name: 'test',
                password: 'hello',
                email: 'email@email.com'
            };

            return supertest(app)
                .post('/api/register')
                .send(testUser)
                .expect(400, { error: { message: `'password' must be at least 8 characters` } })
        })

        it(`responds with 400 error when 'email' is not the correct format`, () => {
            const testUser = {
                user_name: 'test',
                password: 'password',
                email: 'notARealEmail'
            }

            return supertest(app)
                .post('/api/register')
                .send(testUser)
                .expect(400, { error: { message: `'email' must be formatted correctly` } })
        })
    })
})