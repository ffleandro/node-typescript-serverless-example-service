import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
axios.defaults.adapter = httpAdapter;

import supertest from 'supertest';
import nock from 'nock';
import { NextFunction, Request, Response } from 'express';

import createApp from '../../../src/server/app';
import dynamodb from '../../../src/dynamodb';
import { cognito } from '../../../src/middleware/cognito';
import AcronymRepository from '../../../src/repositories/acronym';

import {
  CREATE_ACRONYM_INVALID_REQUEST,
  CREATE_ACRONYM_REQUEST,
  CREATE_ACRONYM_RESPONSE,
  CREATE_EMPTY_VALIDATION_RESPONSE,
  CREATE_VALIDATION_RESPONSE,
  GET_ACRONYM_RESPONSE,
  LIST_ACRONYMS_RESPONSE,
  SEARCH_VALIDATION_RESPONSE,
  UPDATE_ACRONYM_INVALID_REQUEST,
  UPDATE_ACRONYM_REQUEST,
  UPDATE_ACRONYM_RESPONSE,
  UPDATE_VALIDATION_RESPONSE,
} from '../../__mocks__/acronym.mock';

import {
  COGNITO_POOL_KEYS_RESPONSE
} from '../../__mocks__/cognito.mock';

const repository = new AcronymRepository(dynamodb);

beforeAll(async () => {
  // Mock cognito pool keys fetch 
  nock('https://cognito-idp.us-east-1.amazonaws.com')
    .get('/us-east-1_random_id/.well-known/jwks.json')
    .reply(200, COGNITO_POOL_KEYS_RESPONSE)
    .persist();
});

beforeEach(async () => {
  // Mock cognito token validation
  // TODO actually generate keys and valid tokens to test the full authorization cycle
  jest.spyOn(cognito, 'protect').mockImplementation(
    () => async (req: Request, res: Response, next: NextFunction) => next());
});

describe('Integration: User can create an Acronym', () => {
  test('tests create an acronym successfully', async () => {
    const app = createApp();
    const id = CREATE_ACRONYM_REQUEST.acronym;

    const response = await supertest(app).post('/acronym')
      .send(CREATE_ACRONYM_REQUEST)
      .expect(201);
      
    expect(response.body.payload).toMatchObject(CREATE_ACRONYM_RESPONSE);
    const dbObject = await repository.getItemById(id);
    expect(dbObject).toMatchObject(CREATE_ACRONYM_RESPONSE);
  });

  test('tests conflict error when creating an acronym that already exists', async () => {
    const app = createApp();
    repository.createItem(CREATE_ACRONYM_REQUEST);

    await supertest(app).post('/acronym')
      .send(CREATE_ACRONYM_REQUEST)
      .expect(409);
  });

  test('tests validation error when creating an acronym with an invalid request', async () => {
    const app = createApp();
    
    const response = await supertest(app).post('/acronym')
      .send(CREATE_ACRONYM_INVALID_REQUEST)
      .expect(400);
      
    expect(response.body).toMatchObject(CREATE_VALIDATION_RESPONSE);
  });

  test('tests validation error when creating an acronym with an empty request', async () => {
    const app = createApp();
    
    const response = await supertest(app).post('/acronym')
      .send({ /* empty request body */ })
      .expect(400);
      
    expect(response.body).toMatchObject(CREATE_EMPTY_VALIDATION_RESPONSE);
  });
});

describe('Integration: User can read an Acronym', () => {
  test('tests reading an acronym successfully', async () => {
    const app = createApp();
    repository.createItem(CREATE_ACRONYM_REQUEST);
    const id = CREATE_ACRONYM_REQUEST.acronym;

    const response = await supertest(app).get(`/acronym/${id}`)
      .expect(200);
      
    expect(response.body.payload).toMatchObject(GET_ACRONYM_RESPONSE);
    const dbObject = await repository.getItemById(id);
    expect(dbObject).toMatchObject(GET_ACRONYM_RESPONSE);
  });

  test('tests not found error when reading an acronym that doesn\'t exist', async () => {
    const app = createApp();
    const id = CREATE_ACRONYM_REQUEST.acronym;
    
    await supertest(app).get(`/acronym/${id}`)
      .expect(404);
  });
});

describe('Integration: User can update an Acronym', () => {
  test('tests update an acronym successfully', async () => {
    const app = createApp();
    repository.createItem(CREATE_ACRONYM_REQUEST);
    const id = CREATE_ACRONYM_REQUEST.acronym;

    const response = await supertest(app).put(`/acronym/${id}`)
      .set({ 'Authorization': 'Bearer random-fake-token' })
      .send(UPDATE_ACRONYM_REQUEST)
      .expect(200);
      
    expect(response.body.payload).toMatchObject(UPDATE_ACRONYM_RESPONSE);
    const dbObject = await repository.getItemById(id);
    expect(dbObject).toMatchObject(UPDATE_ACRONYM_RESPONSE);
  });

  test('tests not found error when updating an acronym that doesn\'t exist', async () => {
    const app = createApp();
    const id = CREATE_ACRONYM_REQUEST.acronym;
    
    await supertest(app).put(`/acronym/${id}`)
      .set({ 'Authorization': 'Bearer random-fake-token' })
      .send(UPDATE_ACRONYM_REQUEST)
      .expect(404);
  });

  test('tests validation error when updating an acronym with an invalid request', async () => {
    const app = createApp();
    repository.createItem(CREATE_ACRONYM_REQUEST);
    const id = CREATE_ACRONYM_REQUEST.acronym;
    
    const response = await supertest(app).put(`/acronym/${id}`)
      .set({ 'Authorization': 'Bearer random-fake-token' })
      .send(UPDATE_ACRONYM_INVALID_REQUEST)
      .expect(400);
      
    expect(response.body).toMatchObject(UPDATE_VALIDATION_RESPONSE);
  });
});

describe('Integration: User can delete an Acronym', () => {
  test('tests deleting an acronym successfully', async () => {
    const app = createApp();
    repository.createItem(CREATE_ACRONYM_REQUEST);
    const id = CREATE_ACRONYM_REQUEST.acronym;

    const response = await supertest(app).delete(`/acronym/${id}`)
      .set({ 'Authorization': 'Bearer random-fake-token' })
      .expect(204);
      
    expect(response.body.payload).toBeUndefined();
    const dbObject = await repository.getItemById(id);
    expect(dbObject).toBeUndefined();
  });

  test('tests not found error when deleting an acronym that doesn\'t exist', async () => {
    const app = createApp();
    const id = CREATE_ACRONYM_REQUEST.acronym;
    
    await supertest(app).delete(`/acronym/${id}`)
      .set({ 'Authorization': 'Bearer random-fake-token' })
      .expect(404);
  });
});

describe('Integration: User can serch Acronyms', () => {
  beforeEach(() => 
    LIST_ACRONYMS_RESPONSE.forEach(acronym => repository.createItem(acronym)));
  
  test('tests fetching the first acronym page successfully', async () => {
    const app = createApp();
        
    const response = await supertest(app).get('/acronym')
      .expect(200);
      
    expect(response.body.payload).toMatchObject(LIST_ACRONYMS_RESPONSE.slice(0, 10));
  });

  test('tests fetching an acronym page successfully', async () => {
    const app = createApp();
    
    const response = await supertest(app).get('/acronym?from=5&limit=2')
      .expect(200);
      
    expect(response.body.payload).toMatchObject(LIST_ACRONYMS_RESPONSE.slice(10, 12));
  });

  test('tests fetching the last acronym page successfully', async () => {
    const app = createApp();
    
    const response = await supertest(app).get('/acronym?from=7&limit=2')
      .expect(200);
      
    expect(response.body.payload).toHaveLength(1);
    expect(response.body.payload).toMatchObject(LIST_ACRONYMS_RESPONSE.slice(14, 15));
  });

  test('tests searching an acronym with invalid query parameters', async () => {
    const app = createApp();
        
    const response = await supertest(app).get('/acronym?fake=value&another_fake=another_value')
      .expect(400);
      
    expect(response.body).toMatchObject(SEARCH_VALIDATION_RESPONSE);
  });
});
