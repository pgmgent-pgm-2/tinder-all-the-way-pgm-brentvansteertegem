const request = require('supertest');
const { app } = require('../src/app');

afterEach(async (done) => {
  done();
});

describe('User Endpoints', () => {
  it('should fetch all users', async () => {
    const res = await request(app).get('/api/users');
  });
});
