/* eslint-disable no-undef */
const request = require('supertest');
const { app } = require('../src/app');

afterEach(async (done) => {
  done();
});

describe('User Endpoints', () => {
  it('should fetch all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    // At the moment of writing this test, there are 50 users in users.json
    // If users.json changes, you should change this number accordingly before testing
    expect(res.body.length).toBe(50);
  });
  it('should fetch a specific user', async () => {
    const res = await request(app).get('/api/users/326400e6-af2f-49cb-bf14-d509369b4594');
    expect(res.status).toBe(200);
    const user = {
      id: '326400e6-af2f-49cb-bf14-d509369b4594',
      username: 'ticklishmouse938',
      password: 'w84pgm2beGr8',
      picture: {
        large: 'https://randomuser.me/api/portraits/men/22.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/22.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/22.jpg',
      },
      firstName: 'Storm',
      lastName: 'Larsen',
      gender: 'male',
      dayOfBirth: 798143323080,
      createdAt: 1240925059938,
      nationality: 'DK',
      cell: '78051503',
      location: {
        city: 'Fredeikssund',
        country: 'Denmark',
      },
    };
    // If this user were to be updated, so should this test
    expect(res.body).toEqual(user);
  });
  it('should fetch all matches for a specific user', async () => {
    const res = await request(app).get('/api/users/326400e6-af2f-49cb-bf14-d509369b4594/matches');
    expect(res.status).toBe(200);
    // At the moment of writing this test, this user has 16 matches
    // If matches.json changes, you should change this number accordingly before testing
    expect(res.body.length).toBe(16);
  });
  it('should fetch all messages for a specific user', async () => {
    const res = await request(app).get('/api/users/326400e6-af2f-49cb-bf14-d509369b4594/messages');
    expect(res.status).toBe(200);
    // At the moment of writing this test, this user has 35 messages
    // If messages.json changes, you should change this number accordingly before testing
    expect(res.body.length).toBe(35);
  });
  it('should create a new user', async () => {
    const user = {
      username: 'joskeVermeulen',
      password: 'kjhzihi,ul',
      picture: {
        large: 'https://randomuser.me/api/portraits/men/22.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/22.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/22.jpg',
      },
      firstName: 'Joske',
      lastName: 'Vermeulen',
      gender: 'male',
      dayOfBirth: 548154878460,
      nationality: 'BE',
      cell: '26489486',
      location: {
        city: 'Vichte',
        country: 'België',
      },
    };
    const res = await request(app).post('/api/users').send(user);
    expect(res.status).toBe(201);
    // Check if the previously tested 50 users are now 51 users
    const users = await request(app).get('/api/users');
    expect(users.body.length).toBe(51);
  });
  it('should update a specific user ', async () => {
    const user = {
      username: 'VermaelenJozef',
      lastName: 'Vermaelen',
    };
    const res = await request(app).put('/api/users/326400e6-af2f-49cb-bf14-d509369b4594').send(user);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('VermaelenJozef');
    expect(res.body.lastName).toBe('Vermaelen');
    // Check if the previously tested 51 users still are 51 users
    const users = await request(app).get('/api/users');
    expect(users.body.length).toBe(51);
  });
  it('should delete a specific user', async () => {
    const res = await request(app).delete('/api/users/326400e6-af2f-49cb-bf14-d509369b4594');
    expect(res.status).toBe(204);
    // Check if the previously tested 51 users are 50 users again
    const users = await request(app).get('/api/users');
    expect(users.body.length).toBe(50);
  });
});
