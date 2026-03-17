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

  /*describe('POST /login', () => {
    it('should login a user and return a token', async () => {
      const user = {};
      const token = 'mockedToken';

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token,
        message: 'Connexion réussie',
      });
    });
  });*/
});
