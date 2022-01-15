const request = require('supertest');
const { app } = require('../src/app');

afterEach(async (done) => {
  done();
});

describe('Message Endpoints', () => {
  it('should fetch all messages', async () => {
    const res = await request(app).get('/api/messages');
  });
});
