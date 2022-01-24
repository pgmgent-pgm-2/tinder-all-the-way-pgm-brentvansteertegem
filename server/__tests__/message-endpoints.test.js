/* eslint-disable no-undef */
const request = require('supertest');
const { app } = require('../src/app');

afterEach(async (done) => {
  done();
});

describe('Message Endpoints', () => {
  it('should fetch all messages', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.status).toBe(200);
    // At the moment of writing this test, there are 1028 messages in messages.json
    // If messages.json changes, you should change this number accordingly before testing
    expect(res.body.length).toBe(1028);
  });
  it('should fetch a specific message', async () => {
    const res = await request(app).get('/api/messages/4319759f-1b77-4c01-becc-3534cb5933d0');
    expect(res.status).toBe(200);
    // At the moment of writing this test, this message says 'Ik ben super blij jouw kennis te ontdekken :)'
    // If this message were to be updated, so should this test
    expect(res.body.message).toBe('Ik ben super blij jouw kennis te ontdekken :)');
  });
  it('should create a new message between two specific users', async () => {
    const message = {
      senderId: '679e8f13-f384-43a1-bef0-40059e5657f2',
      receiverId: '326400e6-af2f-49cb-bf14-d509369b4594',
      message: 'Dit is een message om de endpoints te testen.',
    };
    const res = await request(app).post('/api/messages').send(message);
    expect(res.status).toBe(201);
    // Check if the previously tested 1028 messages are now 1029 messages
    const messages = await request(app).get('/api/messages');
    expect(messages.body.length).toBe(1029);
  });
  it('should update a specific message ', async () => {
    const message = {
      message: 'Dit is de test voor een update van een message.',
    };
    const res = await request(app).put('/api/messages/d645f245-1b12-49d6-abdc-c437f9b594ec').send(message);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Dit is de test voor een update van een message.');
    // Check if the previously tested 1029 messages still are 1029 messages
    const messages = await request(app).get('/api/messages');
    expect(messages.body.length).toBe(1029);
  });
  it('should delete a specific message', async () => {
    const res = await request(app).delete('/api/messages/d645f245-1b12-49d6-abdc-c437f9b594ec');
    expect(res.status).toBe(204);
    // Check if the previously tested 1029 messages are 1028 messages again
    const messages = await request(app).get('/api/messages');
    expect(messages.body.length).toBe(1028);
  });
});
