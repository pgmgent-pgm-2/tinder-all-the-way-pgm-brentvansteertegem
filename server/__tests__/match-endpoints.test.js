/* eslint-disable no-undef */
const request = require('supertest');
const { app } = require('../src/app');

afterEach(async (done) => {
  done();
});

describe('Match Endpoints', () => {
  it('should fetch all matches', async () => {
    const res = await request(app).get('/api/matches');
    expect(res.status).toBe(200);
    // At the moment of writing this test, there are 570 matches in matches.json
    // If matches.json changes, you should change this number accordingly before testing
    expect(res.body.length).toBe(570);
  });
  it('should fetch a specific match', async () => {
    const res = await request(app).get('/api/matches/326400e6-af2f-49cb-bf14-d509369b4594/eace7a49-5798-4adf-9467-a9594057ee6f');
    expect(res.status).toBe(200);
    // At the moment of writing this test, this rating is 'dislike'
    // If this match were to be updated, so should this test
    expect(res.body.rating).toBe('dislike');
  });
  it('should fetch all matches for a specific user', async () => {
    const res = await request(app).get('/api/users/326400e6-af2f-49cb-bf14-d509369b4594/matches');
    expect(res.status).toBe(200);
    // At the moment of writing this test, this user has 16 matches
    // If this number were to change, so should the number in this test
    expect(res.body.length).toBe(16);
  });
  it('should create a new match between two specific users', async () => {
    const match = {
      userId: '679e8f13-f384-43a1-bef0-40059e5657f2',
      friendId: '326400e6-af2f-49cb-bf14-d509369b4594',
      rating: 'like',
    };
    const res = await request(app).post('/api/matches').send(match);
    expect(res.status).toBe(201);
    // Check if the previously tested 570 matches are now 571 matches
    const matches = await request(app).get('/api/matches');
    expect(matches.body.length).toBe(571);
  });
  it('should update a match between two specific users', async () => {
    const match = {
      rating: 'dislike',
    };
    // eslint-disable-next-line max-len
    const res = await request(app).put('/api/matches/679e8f13-f384-43a1-bef0-40059e5657f2/326400e6-af2f-49cb-bf14-d509369b4594').send(match);
    expect(res.status).toBe(200);
    expect(res.body.rating).toBe('dislike');
    // Check if the previously tested 571 matches still are 571 matches
    const matches = await request(app).get('/api/matches');
    expect(matches.body.length).toBe(571);
  });
  it('should delete a match between two specific users', async () => {
    // eslint-disable-next-line max-len
    const res = await request(app).delete('/api/matches/679e8f13-f384-43a1-bef0-40059e5657f2/326400e6-af2f-49cb-bf14-d509369b4594');
    expect(res.status).toBe(204);
    // Check if the previously tested 571 matches are 570 matches again
    const matches = await request(app).get('/api/matches');
    expect(matches.body.length).toBe(570);
  });
});
