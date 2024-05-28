import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { from } from 'rxjs';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserDocument } from './users/models/user.scema';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should call authService.login and send user data in the response', async () => {
      const mockUser: UserDocument | any = {
        email: '',
        password: '',
        name: '',
        createdOn: undefined,
        modifiedOn: undefined,
        _id: ''
      }; // Replace with your mock user data
      const mockResponse: Response = {} as Response; // Replace with your mock response

      jest.spyOn(authService, 'login').mockReturnValue(from(Promise.resolve(mockUser)));

      const result = await authController.login(mockUser, mockResponse);

      expect(authService.login).toHaveBeenCalledWith(mockUser, mockResponse);
      expect(result).toBe(mockUser);
    });
  });
});
