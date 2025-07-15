import request from 'supertest';
import express from 'express';
import userRouter from '../../src/user/user.router';
import { db, users } from '../../src/Drizzle/db';
import { eq } from 'drizzle-orm';

// Setup Express app
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

  test('POST /users/register - register new user', async () => {
    const res = await request(app).post('/users/register').send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('userId');
    expect(res.body.email).toBe(testUser.email);
    createdUserId = res.body.userId;
  });

  test('POST /users/login - login existing user', async () => {
    // Register first
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

    const res = await request(app).put(`/users/${id}`).send({ phone: '0799999999' });

    expect(res.statusCode).toBe(200);
    expect(res.body.phone).toBe('0799999999');
  });

  test('DELETE /users/:id - delete user', async () => {
    const registerRes = await request(app).post('/users/register').send(testUser);
    const id = registerRes.body.userId;

    const res = await request(app).delete(`/users/${id}`);
    expect(res.statusCode).toBe(204);

    const check = await db.query.users.findFirst({ where: eq(users.userId, id) });
    expect(check).toBeUndefined();
  });
});
