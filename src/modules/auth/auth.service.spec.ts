import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userRepository: any;

  beforeEach(async () => {
    // Create mocks
    const mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('test-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return a token', async () => {
      // Mock data
      const registerDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      
      const savedUser = {
        id: '123',
        ...registerDto,
        password: 'hashed-password',
      };

      // Mock repository methods
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue(savedUser);
      userRepository.save.mockResolvedValue(savedUser);
      
      // Mock bcrypt
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      // Call the service method
      const result = await service.register(registerDto);

      // Assertions
      expect(userRepository.findOne).toHaveBeenCalledWith({ 
        where: { email: registerDto.email } 
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...registerDto,
        password: 'hashed-password',
      });
      expect(userRepository.save).toHaveBeenCalledWith(savedUser);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: savedUser.id, email: savedUser.email });
      expect(result).toEqual({ accessToken: 'test-token' });
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      // Mock existing user
      userRepository.findOne.mockResolvedValue({ id: '123', email: registerDto.email });

      // Assertions
      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ 
        where: { email: registerDto.email } 
      });
    });
  });

  describe('login', () => {
    it('should login a user and return a token', async () => {
      // Mock data
      const loginDto = {
        email: 'john@example.com',
        password: 'password123',
      };
      
      const existingUser = {
        id: '123',
        email: loginDto.email,
        password: 'hashed-password',
      };

      // Mock repository methods
      userRepository.findOne.mockResolvedValue(existingUser);
      
      // Mock bcrypt
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Call the service method
      const result = await service.login(loginDto);

      // Assertions
      expect(userRepository.findOne).toHaveBeenCalledWith({ 
        where: { email: loginDto.email } 
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, existingUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: existingUser.id, email: existingUser.email });
      expect(result).toEqual({ accessToken: 'test-token' });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      // Mock no user found
      userRepository.findOne.mockResolvedValue(null);

      // Assertions
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ 
        where: { email: loginDto.email } 
      });
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginDto = {
        email: 'john@example.com',
        password: 'password123',
      };
      
      const existingUser = {
        id: '123',
        email: loginDto.email,
        password: 'hashed-password',
      };

      // Mock repository methods
      userRepository.findOne.mockResolvedValue(existingUser);
      
      // Mock bcrypt - password doesn't match
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Assertions
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ 
        where: { email: loginDto.email } 
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, existingUser.password);
    });
  });
}); 