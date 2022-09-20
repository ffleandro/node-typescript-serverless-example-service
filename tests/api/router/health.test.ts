import nock from 'nock';
import supertest from 'supertest';
import createApp from '../../../src/server/app';
import { COGNITO_POOL_KEYS_RESPONSE } from '../../__mocks__/cognito.mock';

beforeAll(async () => {
  // Mock cognito pool keys fetch 
  nock('https://cognito-idp.us-east-1.amazonaws.com')
    .get('/us-east-1_random_id/.well-known/jwks.json')
    .reply(200, COGNITO_POOL_KEYS_RESPONSE)
    .persist();
});

describe('User can validate the health of the service', () => {
  test('tests checking the health successfully', async () => {
    const app = createApp();
    
    const response = await supertest(app).get('/health')
      .expect(200);
      
    expect(response.body.payload).toMatchObject({ status: 'OK' });
  });
});
