const request = require('supertest');
const { app, server } = require('../app'); // Import the app and server instance
const { connectTestDB, disconnectTestDB } = require('../testDatabase'); // Import the test database connection
const User = require('../models/user');
const speakeasy = require('speakeasy');

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await User.deleteMany({}); // Clean up test data
  await disconnectTestDB();
  server.close(); // Close the server after tests
});

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        businessName: 'Test Business',
        businessPhoneNumber: '1234567890',
        streetAddress: '123 Test St',
        city: 'Test City',
        state: 'TS',
        postalCode: '12345',
        country: 'Test Country',
      });
    console.log('Register response:', res.body); // Add detailed logging
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should log in an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    console.log('Login response:', res.body); // Add detailed logging
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should request a password reset', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({
        email: 'test@example.com',
      });
    console.log('Forgot password response:', res.body); // Add detailed logging
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('qrCodeUrl');
    
    // Log the TOTP secret for test verification
    const user = await User.findOne({ email: 'test@example.com' });
    console.log(`Test TOTP Secret: ${user.totpSecret}`);
  });

  it('should verify the reset token and reset the password', async () => {
    const user = await User.findOne({ email: 'test@example.com' });
    const token = speakeasy.totp({
      secret: user.totpSecret,
      encoding: 'base32'
    });

    const res = await request(app)
      .post('/api/auth/verify-reset-token')
      .send({
        email: 'test@example.com',
        token: token,
        newPassword: 'newpassword123',
      });
    console.log('Verify reset token response:', res.body); // Add detailed logging
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Password reset successfully');
  });
});
