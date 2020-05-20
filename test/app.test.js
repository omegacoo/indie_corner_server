const app = require('../src/app');

describe('App', () => {
    it('GET / responds with 200 containing "Nothing found."', () => {
        return supertest(app)
            .get('/')
            .expect(200, 'Nothing found.');
    });
});