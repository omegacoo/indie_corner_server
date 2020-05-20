const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

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

    afterEach('cleanup', () => db.raw('TRUNCATE forums RESTART IDENTITY CASCADE'));

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
})