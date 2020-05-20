const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Posts endpoints', () => {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    })

    after('disconnect from db', () => db.destroy());

    beforeEach('cleanup', () => db.raw('TRUNCATE posts RESTART IDENTITY CASCADE'));
    beforeEach('cleanup', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'));
    beforeEach('cleanup', () => db.raw('TRUNCATE forums RESTART IDENTITY CASCADE'));

    afterEach('cleanup', () => db.raw('TRUNCATE posts RESTART IDENTITY CASCADE'));
    afterEach('cleanup', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'));
    afterEach('cleanup', () => db.raw('TRUNCATE forums RESTART IDENTITY CASCADE'));

    describe('GET /api/posts', () => {
        context('Given no posts', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/posts')
                    .expect(200, [])
            })
        })

        context('Given there are posts in the DB', () => {
            const testPosts = helpers.makePostsArray();
            const testUsers = helpers.makeUserArray();
            const testForums = helpers.makeForumsArray();

            beforeEach('insert forums', () => {
                return db
                    .into('forums')
                    .insert(testForums)
            })

            beforeEach('insert users', () => {
                return db
                    .into('users')
                    .insert(testUsers)
            })

            beforeEach('insert posts', () => {
                return db
                    .into('posts')
                    .insert(testPosts)
            })

            it('responds with 200 and all of the posts', () => {
                return supertest(app)
                    .get('/api/posts')
                    .expect(200, testPosts)
            })
        })
    })
})