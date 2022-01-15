const request = require('supertest');
const { app } = require('../src/app');

afterEach(async (done) => {
  done();
});

describe('Match Endpoints', () => {
  it('should fetch all matches', async () => {
    const res = await request(app).get('/api/matches');
  });  
});
