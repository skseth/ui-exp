import server from '../../src/server';
import request from 'supertest';

afterEach((done) => {
  server.close();
  done();
});

describe('routes/lists', () => {
  it('should allow creating a list', async () => {
    const response = await request(server)
      .post('/lists')
      .send({ name: 'colors' });
    expect(response.status).toEqual(200);
  });
});
