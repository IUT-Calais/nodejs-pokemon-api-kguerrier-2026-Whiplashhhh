import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

describe('User API', () => {
  describe('GET /users', () => {
    it('should fetch all Users', async () => {
      const mockUsers = [
        {
          id: 1,
          email: "1@mail.com",
          password: "encryptedpassword"
        },
        {
          id: 2,
          email: "2@mail.com",
          password: "encryptedpassword"
        }
      ];

      prismaMock.user.findMany.mockResolvedValue(mockUsers);

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });

    it('should return 500 when fetching users fails', async () => {
      prismaMock.user.findMany.mockRejectedValue(new Error('DB error'));

      const response = await request(app).get('/users');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'An error occured :/' });
    });
  })

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const createdUser = {
        id: 3,
        email: "3@mail.com",
        password: "encryptedpassword"
      };

      //vérif du mail
      prismaMock.user.findUnique.mockResolvedValueOnce(null)

      prismaMock.user.create.mockResolvedValue(createdUser)

      const response = await request(app)
          .post('/users')
          .send({
            email: "3@mail.com",
            password: "encryptedpassword"
          });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdUser);
    });

    it('should return 400 when email is missing', async () => {
      const response = await request(app).post('/users').send({
        password: 'encryptedpassword',
      });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Mail or password is missing :/');
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app).post('/users').send({
        email: '3@mail.com',
      });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Mail or password is missing :/');
    });

    it('should return 400 when email is already taken', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 1,
        email: '1@mail.com',
        password: 'encryptedpassword',
      });

      const response = await request(app).post('/users').send({
        email: '1@mail.com',
        password: 'encryptedpassword',
      });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Email "1@mail.com" is already taken :/');
    });

    it('should return 400 when password is too short', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await request(app).post('/users').send({
        email: 'short@mail.com',
        password: '12345',
      });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Password should be at least 6 character long');
    });

    it('should return 500 when findUnique fails', async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error('DB error'));

      const response = await request(app).post('/users').send({
        email: '3@mail.com',
        password: 'encryptedpassword',
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'An error occured :/' });
    });

    it('should return 500 when create fails', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockRejectedValue(new Error('DB error'));

      const response = await request(app).post('/users').send({
        email: '3@mail.com',
        password: 'encryptedpassword',
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'An error occured :/' });
    });
  });

  describe('POST /users/login', () => {
    it('should login a user and return a token', async () => {
      const mockUser = {
        id: 3,
        email: '3@mail.com',
        password: 'encryptedpassword',
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const token = 'mockedToken';
      const response = await request(app)
          .post('/users/login')
          .send({
            email: '3@mail.com',
            password: 'truePassword',
          })

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Connexion successfull !',
        token: token,
        user: {
          id: 3,
          email: '3@mail.com',
        },
      });
    });

    it('should return 401 if user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
          .post('/users/login')
          .send({
            email: 'unknown@mail.com',
            password: 'truePassword',
          });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'This user does not exist' });
    });
  });

  it('should return 401 if password is incorrect', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 3,
      email: '3@mail.com',
      password: 'encryptedpassword',
    });

    const response = await request(app)
        .post('/users/login')
        .send({
          email: '3@mail.com',
          password: 'wrongPassword',
        });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Incorrect password' });
  });

  it('should return 500 when login fails with error', async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error('DB error'));

    const response = await request(app)
        .post('/users/login')
        .send({
          email: '3@mail.com',
          password: 'truePassword',
        });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'An error occured :/' });
  });
});
