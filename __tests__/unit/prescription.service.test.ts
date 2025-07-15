// __tests__/integration/user.test.ts
import request from 'supertest';
import express from 'express';
import userRoutes from '../../src/user/user.router';
import { db, users } from '../../src/Drizzle/db';
import { eq } from 'drizzle-orm';

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User API Integration Tests', () => {
  let createdUserId: number;
  let token: string;

  const sampleUser = {
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    password: 'Password123!',
    role: 'patient',
  };

  afterAll(async () => {
    if (createdUserId) {
      await db.delete(users).where(eq(users.userId, createdUserId));
    }
  });

  describe('POST /users/register', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/users/register').send(sampleUser);
      console.log('REGISTER RESPONSE:', res.status, res.body);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('userId');
      expect(res.body.email).toBe(sampleUser.email);

      createdUserId = res.body.userId;
    });
  });

  describe('POST /users/login', () => {
    it('should login and return a token', async () => {
      const res = await request(app).post('/users/login').send({
        email: sampleUser.email,
        password: sampleUser.password,
      });
      console.log('LOGIN RESPONSE:', res.status, res.body);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');

      token = res.body.token;
    });

    it('should fail login with wrong password', async () => {
      const res = await request(app).post('/users/login').send({
        email: sampleUser.email,
        password: 'WrongPassword',
      });
      console.log('WRONG LOGIN RESPONSE:', res.status, res.body);

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /users/:id', () => {
    it('should return the created user by ID', async () => {
      const res = await request(app).get(`/users/${createdUserId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('userId', createdUserId);
    });

    it('should return 404 for non-existing user', async () => {
      const res = await request(app).get('/users/999999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'User not found');
    });
  });

  describe('PUT /users/:id', () => {
    it('should update the user', async () => {
      const res = await request(app)
        .put(`/users/${createdUserId}`)
        .send({ firstName: 'UpdatedName' });

      expect(res.status).toBe(200);
      expect(res.body.firstName).toBe('UpdatedName');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete the user', async () => {
      const res = await request(app).delete(`/users/${createdUserId}`);
      expect(res.status).toBe(204);

      // Confirm deletion
      const getRes = await request(app).get(`/users/${createdUserId}`);
      expect(getRes.status).toBe(404);
    });
  });
});
