import request from 'supertest';

import { app } from '../../app';

it('has a route listening on /ping for get requests', async () => {
  const response = await request(app).get('/ping');

  expect(response.status).not.toEqual(404);
});

it('returns a 200 with an ok and message "pong"', async () => {
  const response = await request(app)
    .get('/ping')
    .expect(200);

  expect(response.body.ok).toEqual(true);
  expect(response.body.msg).toEqual('pong');
});
