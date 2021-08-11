import request from 'supertest';

import { app } from '../../app';

it('has a route listening on /info for get requests', async () => {
  const response = await request(app).get('/info');

  expect(response.status).not.toEqual(404);
});

it(
  'returns a 200 with an ok, author, frontend, language, sources, and answers',
  async () => {
    const response = await request(app)
      .get('/info')
      .expect(200);

    expect(response.body.ok).toEqual(true);

    expect(response.body.author).toHaveProperty('email');
    expect(response.body.author).toHaveProperty('name');
    
    expect(response.body.frontend).toHaveProperty('url');

    expect(response.body.language).toBeDefined();

    expect(response.body.sources).toBeDefined();

    expect(Object.keys(response.body.answers).length).toEqual(3);
    expect(response.body.answers).toHaveProperty('1');
    expect(response.body.answers).toHaveProperty('2');
    expect(response.body.answers).toHaveProperty('3');
  },
);
