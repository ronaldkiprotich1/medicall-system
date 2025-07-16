import request from 'supertest';
import express from 'express';
import userRouter from '../../src/user/user.router';
import { db, users } from '../../src/Drizzle/db';
import { eq } from 'drizzle-orm';

const app = express();
app.use(express.json());
app.use('/users', userRouter);

describe('User Integration Tests', () => {
  const testUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    contactPhone: '0711111111',
    address: 'Test Lane 123',
    role: 'user',
  };

  let createdUserId: number;
  let token: string;

  beforeEach(async () => {
    await db.delete(users).where(eq(users.email, testUser.email));
  });

  // ✅ Positive Tests

  test('POST /users/register - register new user', async () => {
    const res = await request(app).post('/users/register').send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('userId');
    expect(res.body.email).toBe(testUser.email);
    createdUserId = res.body.userId;
  });

  test('POST /users/login - login existing user', async () => {
    await request(app).post('/users/register').send(testUser);

    const res = await request(app).post('/users/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  test('GET /users - get all users', async () => {
    await request(app).post('/users/register').send(testUser);

    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /users/:id - get user by ID', async () => {
    const registerRes = await request(app).post('/users/register').send(testUser);
    const id = registerRes.body.userId;

    const res = await request(app).get(`/users/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(testUser.email);
  });

  test('PUT /users/:id - update user', async () => {
    const registerRes = await request(app).post('/users/register').send(testUser);
    const id = registerRes.body.userId;

    const res = await request(app).put(`/users/${id}`).send({ contactPhone: '0799999999' });
    expect(res.statusCode).toBe(200);
    expect(res.body.contactPhone).toBe('0799999999');
  });

  test('DELETE /users/:id - delete user', async () => {
    const registerRes = await request(app).post('/users/register').send(testUser);
    const id = registerRes.body.userId;

    const res = await request(app).delete(`/users/${id}`);
    expect(res.statusCode).toBe(204);

    const check = await db.query.users.findFirst({ where: eq(users.userId, id) });
    expect(check).toBeUndefined();
  });

  // ❌ Negative Tests

  test('POST /users/register - should fail with missing required fields', async () => {
    const res = await request(app).post('/users/register').send({ email: 'test@no.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /users/register - should fail with invalid email format', async () => {
    const res = await request(app).post('/users/register').send({
      ...testUser,
      email: 'invalid-email',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /users/login - wrong password should fail', async () => {
    await request(app).post('/users/register').send(testUser);

    const res = await request(app).post('/users/login').send({
      email: testUser.email,
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /users/login - non-existent user should fail', async () => {
    const res = await request(app).post('/users/login').send({
      email: 'nonexistent@example.com',
      password: 'irrelevant',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /users/:id - should return 404 for non-existent ID', async () => {
    const res = await request(app).get('/users/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /users/:id - should return 400 or 404 for invalid ID format', async () => {
    const res = await request(app).get('/users/not-a-number');
    expect([400, 404]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('error');
  });

  test('PUT /users/:id - should return 404 for non-existent user', async () => {
    const res = await request(app).put('/users/999999').send({ address: 'New Street' });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('DELETE /users/:id - should return 404 for non-existent user', async () => {
    const res = await request(app).delete('/users/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('DELETE /users/:id - should return 400 or 404 for invalid ID format', async () => {
    const res = await request(app).delete('/users/invalid-id');
    expect([400, 404]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('error');
  });
});
