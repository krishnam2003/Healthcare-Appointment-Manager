import { UserRole, type UserRole as PrismaUserRole } from '../generated/prisma/client';
import { Router, type Router as ExpressRouter } from 'express';

import { authenticate, authorize } from '../auth/middleware';
import { idParamsSchema, validateRequest } from '../common/validation';
import { prisma } from '../config/prisma';
import { AvailabilityController } from './controller';
import { AvailabilityRepository } from './repository';
import { AvailabilityService } from './service';
import {
  availabilityListQuerySchema,
  createAvailabilitySchema,
  updateAvailabilitySchema,
} from './validation';

const availabilityRepository = new AvailabilityRepository(prisma);
const availabilityService = new AvailabilityService(availabilityRepository);
const availabilityController = new AvailabilityController(availabilityService);
const allRoles: PrismaUserRole[] = [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT];

export const doctorAvailabilityRouter: ExpressRouter = Router();
export const adminAvailabilityRouter: ExpressRouter = Router();

doctorAvailabilityRouter.use(authenticate(), authorize(...allRoles));
doctorAvailabilityRouter.get(
  '/:id/availability',
  validateRequest({ params: idParamsSchema, query: availabilityListQuerySchema }),
  availabilityController.list,
);

adminAvailabilityRouter.use(authenticate(), authorize(UserRole.ADMIN));
adminAvailabilityRouter.post(
  '/',
  validateRequest({ body: createAvailabilitySchema }),
  availabilityController.create,
);
adminAvailabilityRouter.patch(
  '/:id',
  validateRequest({ params: idParamsSchema, body: updateAvailabilitySchema }),
  availabilityController.update,
);
adminAvailabilityRouter.delete(
  '/:id',
  validateRequest({ params: idParamsSchema }),
  availabilityController.delete,
);
