import { UserService } from '../../src/user/user.service';
import { db, users } from '../../src/Drizzle/db';
import { eq } from 'drizzle-orm';


jest.mock('../../src/Drizzle/db', () => {
  // Mock builder to simulate chainable query builder methods
  const mockBuilder = () => ({
    values: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue(['mocked_return']),
  });

  return {
    db: {
      select: jest.fn().mockReturnThis(),
      from: jest.fn(),
      query: {
        users: {
          findFirst: jest.fn(),
        },
      },
      insert: jest.fn().mockImplementation(() => mockBuilder()),
      update: jest.fn().mockImplementation(() => mockBuilder()),
      delete: jest.fn().mockImplementation(() => mockBuilder()),
    },
    users: {}, 
    eq: jest.requireActual('drizzle-orm').eq,
  };
});

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const mockUsers = [{ userId: 1, email: 'test@example.com' }];
      // Mock select().from() chain
      (db.select as jest.Mock).mockReturnValue({ from: jest.fn().mockResolvedValue(mockUsers) });

      const result = await UserService.getAll();

      expect(result).toEqual(mockUsers);
      expect(db.select).toHaveBeenCalled();
      expect(db.select().from).toHaveBeenCalledWith(users);
    });
  });

  describe('getById', () => {
    it('should return a user by id', async () => {
      const mockUser = { userId: 1, email: 'test@example.com' };
      (db.query.users.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.getById(1);

      expect(result).toEqual(mockUser);
      expect(db.query.users.findFirst).toHaveBeenCalledWith({ where: eq(users.userId, 1) });
    });
  });

  describe('getByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser = { userId: 1, email: 'test@example.com' };
      (db.query.users.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.getByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(db.query.users.findFirst).toHaveBeenCalledWith({ where: eq(users.email, 'test@example.com') });
    });
  });

  describe('create', () => {
    it('should create a new user and return it', async () => {
      const newUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'new@example.com',
        password: 'hashedpassword',
      };
      const createdUser = [{ userId: 2, ...newUser }];

      // Mock insert builder chain
      const insertBuilder = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue(createdUser),
      };
      (db.insert as jest.Mock).mockReturnValue(insertBuilder);

      const result = await UserService.create(newUser);

      expect(result).toEqual(createdUser);
      expect(db.insert).toHaveBeenCalledWith(users);
      expect(insertBuilder.values).toHaveBeenCalledWith(newUser);
      expect(insertBuilder.returning).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const updatedUser = [{ userId: 1, email: 'updated@example.com' }];

      // Mock update builder chain
      const updateBuilder = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue(updatedUser),
      };
      (db.update as jest.Mock).mockReturnValue(updateBuilder);

      const result = await UserService.update(1, { email: 'updated@example.com' });

      expect(result).toEqual(updatedUser);
      expect(db.update).toHaveBeenCalledWith(users);
      expect(updateBuilder.set).toHaveBeenCalledWith({ email: 'updated@example.com' });
      expect(updateBuilder.where).toHaveBeenCalledWith(eq(users.userId, 1));
      expect(updateBuilder.returning).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      // Mock delete builder chain
      const deleteBuilder = {
        where: jest.fn().mockReturnThis(),
      };
      
      (db.delete as jest.Mock).mockReturnValue(deleteBuilder);

      await UserService.delete(1);

      expect(db.delete).toHaveBeenCalledWith(users);
      expect(deleteBuilder.where).toHaveBeenCalledWith(eq(users.userId, 1));
    });
  });
});
