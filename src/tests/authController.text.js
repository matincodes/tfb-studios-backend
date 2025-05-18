// tests/authController.test.js
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/database.js';

describe('Auth Routes', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany(); // Clean DB before test
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      fullName: 'Test User',
      email: 'testuser@example.com',
      password: 'Password123!',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe('testuser@example.com');
  });

  it('should not allow duplicate registration', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      fullName: 'Test User',
      email: 'testuser@example.com',
      password: 'Password123!',
    });

    expect(res.statusCode).toBe(409);
  });

  it('should login successfully with correct credentials', async () => {
    const res = await request(app).post('/api/auth/signin').send({
      email: 'testuser@example.com',
      password: 'Password123!',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe('testuser@example.com');
  });
});
