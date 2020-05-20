const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const moment = require('moment-timezone');

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

    describe('GET /api/posts/:forumId', () => {
        context(`Given forum doesn't exist`, () => {
            it(`it responds with 404 and 'Forum doesn't exist'`, () => {
                const forumId = 123456;

                return supertest(app)
                    .get(`/api/posts/${forumId}`)
                    .expect(404, { error: { message: `Forum doesn't exist` }})
            })
        })

        context('Given no posts, but there is a forum', () => {
            const testForums = helpers.makeForumsArray();

            beforeEach('insert forums', () => {
                return db
                    .into('forums')
                    .insert(testForums)
            })

            it('responds with 200 and an empty list', () => {
                const forumId = 1;

                return supertest(app)
                    .get(`/api/posts/${forumId}`)
                    .expect(200, [])
            })
        })

        context('Given there are posts in the database', () => {
            const testForums = helpers.makeForumsArray();
            const testUsers = helpers.makeUserArray();
            const testPosts = helpers.makePostsArray();

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


            context('Given no posts match the current forum', () => {
                it('responds with 200 and an empty list', () => {
                    const forumId = 1;
    
                    return supertest(app)
                        .get(`/api/posts/${forumId}`)
                        .expect(200, [])
                })
            })

            context('Given posts match the current forum', () => {
                it('responds with 200 and the correct posts', () => {
                    const forumId = 2;
                    const expectedPost = [testPosts[1]];
                    
                    return supertest(app)
                        .get(`/api/posts/${forumId}`)
                        .expect(200, expectedPost)
                })
            })
        })
    })
})