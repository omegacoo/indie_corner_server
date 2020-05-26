const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');
const config = require('../src/config');

describe('Forums endpoints', () => {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    })

    after('disconnect from db', () => db.destroy());

    beforeEach('cleanup', () => db.raw('TRUNCATE forums RESTART IDENTITY CASCADE'));
    beforeEach('cleanup', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'));

    afterEach('cleanup', () => db.raw('TRUNCATE forums RESTART IDENTITY CASCADE'));
    afterEach('cleanup', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'));

    describe('GET /api/forums', () => {
        context('Given no forums', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/forums')
                    .expect(200, [])
            })
        })

        context('Given there are forums in the DB', () => {
            const testForums = helpers.makeForumsArray();

            beforeEach('insert forums', () => {
                return db
                    .into('forums')
                    .insert(testForums)
            })

            it('responds with 200 and all of the forums', () => {
                return supertest(app)
                    .get('/api/forums')
                    .expect(200, testForums)
            })
        })
    })

    describe('POST /api/forums', () => {
        const testForum = {
            title: 'Title one',
            blurb: 'This is the first test'
        };

        const testUser = helpers.makeTestUser();
        const user_name = testUser.user_name;

        const testToken = jwt.sign({ user_name }, process.env.JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: config.JWT_EXPIRY_SECONDS
        });

        const requiredFields = ['title', 'blurb'];

        requiredFields.forEach(field => {
            const postAttemptBody = {
                title: testForum.title,
                blurb: testForum.blurb
            };

            it(`responds with 400 error when '${field} is missing`, () => {
                delete postAttemptBody[field];

                return supertest(app)
                    .post('/api/forums')
                    .send(postAttemptBody)
                    .set('cookies', testToken)
                    .expect(400, { error: { message: `Missing '${field}' from request body` } })
            })
        })

        it(`responds with 401 error when 'token' is not valid`, () => {
            const badToken = testToken + 'abracadabra';

            return supertest(app)
                .post('/api/forums')
                .send(testForum)
                .set('cookies', badToken)
                .expect(401)
        })

        it(`responds with 201 when forum is created`, () => {
            return supertest(app)
                .post('/api/forums')
                .send(testForum)
                .set('cookies', testToken)
                .expect(201)
        })
    })

    describe.only(`DELETE /api/forums/remove_forum/:forum_id`, () => {
        const testUser = helpers.makeTestUser();

        const testForum = {
            id: 1,
            title: 'Test forum',
            blurb: 'Test blurb'
        };

        const testPost = {
            id: 1,
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

        beforeEach('insert post', () => {
            return db
                .into('posts')
                .insert(testPost)
        })

        it(`responds with 401 error when 'token' is not provided`, () => {
            return supertest(app)
                .delete('/api/posts/remove_post/123')
                .expect(401)
        })        

        it(`responds with 401 error when 'token' is not valid`, () => {
            const badToken = testToken + 'abracadabra';

            return supertest(app)
                .delete('/api/posts/remove_post/123')
                .set('cookies', badToken)
                .expect(401)
        })

        context(`Given forum doesn't exist`, () => {
            it(`responds with 404 error`, () => {
                return supertest(app)
                    .delete(`/api/forums/remove_forum/2`)
                    .set('cookies', testToken)
                    .expect(404)
            })
        })

        context(`Given the forum does exist`, () => {
            it(`responds with 200`, () => {
                const forum_id = 1;

                return supertest(app)
                    .delete(`/api/forums/remove_forum/${forum_id}`)
                    .set('cookies', testToken)
                    .expect(200)
            })
        })
    })
})