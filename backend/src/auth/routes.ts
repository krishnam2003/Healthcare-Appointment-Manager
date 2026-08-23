import { Router, type Router as ExpressRouter } from 'express';

import { prisma } from '../config/prisma';
import { validateRequest } from '../common/validation';
import { AuthController } from './controller';
import { authenticate } from './middleware';
import { AuthRepository } from './repository';
import { AuthService } from './service';
import { loginSchema, logoutSchema, refreshTokenSchema, registerSchema } from './validation';

const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

export const authRouter: ExpressRouter = Router();

authRouter.post('/register', validateRequest({ body: registerSchema }), authController.register);
authRouter.post('/login', validateRequest({ body: loginSchema }), authController.login);
authRouter.post('/refresh', validateRequest({ body: refreshTokenSchema }), authController.refresh);
authRouter.post('/logout', validateRequest({ body: logoutSchema }), authController.logout);
authRouter.get('/me', authenticate(), authController.me);
