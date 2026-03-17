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
    })
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
          .set('Authorization', 'Bearer mockedToken')
          .send({
            email: "3@mail.com",
            password: "encryptedpassword"
          });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdUser);
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
});
