const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');
const config = require('../src/config');

describe.only('Forums endpoints', () => {
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

        let requiredFields = ['title', 'blurb'];

        requiredFields.forEach(field => {
            const postAttemptBody = {
                title: testForum.title,
                blurb: testForum.blurb
            };

            it(`it responds with 400 error when '${field} is missing`, () => {
                delete postAttemptBody[field];

                return supertest(app)
                    .post('/api/forums')
                    .send(postAttemptBody)
                    .set('cookies', testToken)
                    .expect(400, { error: { message: `Missing '${field}' from request body` } })
            })
        })
    })
})