const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');
const config = require('../src/config');

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
            const testUser = helpers.makeTestUser();
            const testPosts = helpers.makePostsArray();

            beforeEach('insert forums', () => {
                return db
                    .into('forums')
                    .insert(testForums)
            })

            beforeEach('insert user', () => {
                return db
                    .into('users')
                    .insert(testUser)
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

    describe('POST /api/posts/:forum_id', () => {
        const testUser = helpers.makeTestUser();

        const testForum = {
            id: 1,
            title: 'Test forum',
            blurb: 'Test blurb'
        };

        const testPost = {
            user_id: 1,
            forum_id: testForum.id,
            time_submitted: 'now',
            content: 'This is the first test post, thanks!'
        };

        const user_name = testUser.user_name;

        const testToken = jwt.sign({ user_name }, process.env.JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: config.JWT_EXPIRY_SECONDS
        });

        beforeEach('insert user', () => {
            return db
                .into('users')
                .insert(testUser)
        })

        beforeEach('insert forum', () => {
            return db
                .into('forums')
                .insert(testForum)
        })

        context(`Give forum doesn't exist`, () => {
            it(`responds with 404 and 'Forum doesn't exist'`, () => {
                const forum_id = 123456;

                return supertest(app)
                    .post(`/api/posts/${forum_id}`)
                    .send(testPost)
                    .set('cookies', testToken)
                    .expect(404, { error: { message: `Forum doesn't exist` } })
            })
        })

        context(`Given forum does exist`, () => {
            const requiredFields = [
                'user_id', 
                'forum_id', 
                'time_submitted', 
                'content'
            ];

            requiredFields.forEach(field => {
                const postAttemptBody = {
                    user_id: testPost.user_id,
                    forum_id: testPost.forum_id,
                    time_submitted: testPost.time_submitted,
                    content: testPost.content
                };

                it(`responds with 400 error when '${field}' is missing`, () => {
                    const forum_id = 1;

                    delete postAttemptBody[field];

                    return supertest(app)
                        .post(`/api/posts/${forum_id}`)
                        .send(postAttemptBody)
                        .set('cookies', testToken)
                        .expect(400, { error: { message: `Missing '${field}' from request body` } })
                })
            })
        })
    })
})