import request from 'supertest';
import express from 'express';
import authRoutes from '../../src/auth/auth.router';
import { db, users } from '../../src/Drizzle/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Integration Tests', () => {
  const testEmail = 'testuser@example.com';
  const testPassword = 'password123';

  beforeEach(async () => {
    await db.delete(users).where(eq(users.email, testEmail));
  });

  afterAll(async () => {
    await db.delete(users).where(eq(users.email, testEmail));
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/auth/register').send({
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        password: testPassword,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('userId');
      expect(response.body.email).toBe(testEmail);
    });

    it('should not allow duplicate email', async () => {
      await request(app).post('/auth/register').send({
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        password: testPassword,
      });

      const response = await request(app).post('/auth/register').send({
        firstName: 'Duplicate',
        lastName: 'User',
        email: testEmail,
        password: 'anotherpass',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email already in use');
    });

    it('should fail if required fields are missing', async () => {
      const response = await request(app).post('/auth/register').send({
        email: testEmail,
      });

      expect([400, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('error');
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app).post('/auth/register').send({
        firstName: 'Test',
        lastName: 'User',
        email: 'invalid-email',
        password: testPassword,
      });

      expect([400, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      await db.insert(users).values({
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        password: hashedPassword,
      });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app).post('/auth/login').send({
        email: testEmail,
        password: testPassword,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(testEmail);
    });

    it('should fail login with wrong password', async () => {
      const response = await request(app).post('/auth/login').send({
        email: testEmail,
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid email or password');
    });

    it('should fail login with non-existing email', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'whatever',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid email or password');
    });

    it('should fail login with missing password', async () => {
      const response = await request(app).post('/auth/login').send({
        email: testEmail,
      });

      expect([400, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('error');
    });

    it('should fail login with invalid email format', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'not-an-email',
        password: testPassword,
      });

      expect([400, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('error');
    });
  });
});
