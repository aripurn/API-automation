const { test, expect, request } = require('@playwright/test');
const Ajv = require('ajv');
const ajv = new Ajv();

// JSON Schemas
const userSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        email: { type: 'string' },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        avatar: { type: 'string' },
      },
      required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
    },
  },
  required: ['data'],
};

const postResponseSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    job: { type: 'string' },
    id: { type: 'string' },
    createdAt: { type: 'string' },
  },
  required: ['name', 'job', 'id', 'createdAt'],
};

const deleteResponseSchema = {
  type: 'object',
  properties: {},
};

const putResponseSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    job: { type: 'string' },
    updatedAt: { type: 'string' },
  },
  required: ['name', 'job', 'updatedAt'],
};

test.describe('API Automation Tests', () => {
  const baseURL = 'https://reqres.in/api';

  test('GET - Retrieve a user', async ({ request }) => {
    const response = await request.get(`${baseURL}/users/2`);
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    const validate = ajv.compile(userSchema);
    const valid = validate(responseBody);
    expect(valid).toBe(true);
  });

  test('POST - Create a user', async ({ request }) => {
    const response = await request.post(`${baseURL}/users`, {
      data: {
        name: 'John Doe',
        job: 'Software Engineer',
      },
    });
    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    const validate = ajv.compile(postResponseSchema);
    const valid = validate(responseBody);
    expect(valid).toBe(true);
  });

  test('DELETE - Delete a user', async ({ request }) => {
    const response = await request.delete(`${baseURL}/users/2`);
    expect(response.status()).toBe(204);

    const validate = ajv.compile(deleteResponseSchema);
    const valid = validate({});
    expect(valid).toBe(true);
  });

  test('PUT - Update a user', async ({ request }) => {
    const response = await request.put(`${baseURL}/users/2`, {
      data: {
        name: 'Jane Doe',
        job: 'Product Manager',
      },
    });
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    const validate = ajv.compile(putResponseSchema);
    const valid = validate(responseBody);
    expect(valid).toBe(true);
  });
});
